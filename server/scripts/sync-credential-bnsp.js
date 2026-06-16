/**
 * Targeted Sync Script for BNSP Credential
 * ID: bnsp-web-node-react
 * 
 * Safely updates or inserts the BNSP certification in the Neon database
 * without triggering a full seed (which deletes live data).
 * 
 * Usage:
 * - Dry Run (Default):
 *   node scripts/sync-credential-bnsp.js
 * 
 * - Apply changes:
 *   APPLY_CREDENTIAL_SYNC=true node scripts/sync-credential-bnsp.js
 */

const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const TARGET_ID = 'bnsp-web-node-react';

async function main() {
  const applySync = process.env.APPLY_CREDENTIAL_SYNC === 'true';
  const databaseUrl = process.env.DATABASE_URL || '';

  // Mask database URL for safety when logging
  let maskedUrl = 'Not defined';
  if (databaseUrl) {
    try {
      const parsed = new URL(databaseUrl);
      parsed.password = '******';
      maskedUrl = parsed.toString();
    } catch (e) {
      maskedUrl = databaseUrl.replace(/:([^:@]+)@/, ':******@');
    }
  }

  console.log('========================================================');
  console.log('⚠️  TARGETED CREDENTIAL SYNC: BNSP CERTIFICATE  ⚠️');
  console.log('========================================================');
  console.log(`Target Database URL : ${maskedUrl}`);
  console.log(`Sync Mode           : ${applySync ? 'APPLY (Write to Database)' : 'DRY RUN (Read-Only)'}`);
  console.log('--------------------------------------------------------');
  
  if (!applySync) {
    console.log('👉 Running in DRY RUN mode by default.');
    console.log('👉 To apply the changes to your database, run with:');
    console.log('   APPLY_CREDENTIAL_SYNC=true node scripts/sync-credential-bnsp.js\n');
  } else {
    console.log('🚨 WARNING: Database write is enabled. Changes will be saved.\n');
  }

  // 1. Read credentials.json
  const credentialsPath = path.join(__dirname, '../data/credentials.json');
  if (!fs.existsSync(credentialsPath)) {
    throw new Error(`Credentials file not found at: ${credentialsPath}`);
  }

  const fileData = JSON.parse(fs.readFileSync(credentialsPath, 'utf8'));
  const certificates = fileData.certificates || [];
  
  const bnspCert = certificates.find(cert => cert.id === TARGET_ID);
  if (!bnspCert) {
    throw new Error(`Credential with id "${TARGET_ID}" not found in credentials.json`);
  }

  // 2. Map JSON data to Prisma model
  const prismaData = {
    id: bnspCert.id,
    slug: bnspCert.id,
    type: 'CERTIFICATE',
    sourceType: 'DRAFT_FILE',
    title: bnspCert.title,
    officialTitle: bnspCert.officialTitle,
    category: bnspCert.category,
    subCategory: bnspCert.subCategory,
    issuer: bnspCert.issuer,
    issuerType: bnspCert.issuerType,
    certificateNumber: bnspCert.certificateNumber,
    participantName: bnspCert.participantName || 'Syah Putra Nugraha',
    issueDate: bnspCert.issueDate ? new Date(bnspCert.issueDate) : null,
    originalIssueDate: bnspCert.issueDate,
    startDate: bnspCert.startDate ? new Date(bnspCert.startDate) : null,
    originalStartDate: bnspCert.startDate,
    endDate: bnspCert.endDate ? new Date(bnspCert.endDate) : null,
    originalEndDate: bnspCert.endDate,
    duration: bnspCert.duration,
    status: 'PUBLISHED',
    grade: bnspCert.grade || bnspCert.status,
    level: bnspCert.level,
    skills: bnspCert.skills || [],
    relatedTech: bnspCert.relatedTechnologies || [],
    relatedDomains: bnspCert.relatedDomains || [],
    competencies: bnspCert.competencies || [],
    summary: bnspCert.summary || '',
    portfolioRelevance: bnspCert.portfolioRelevance || '',
    recruiterValue: bnspCert.recruiterValue,
    displayPriority: bnspCert.displayPriority || 3,
    featured: bnspCert.featured || false,
    showOnHomepage: bnspCert.showOnHomepage || false,
    showOnCertificatePage: bnspCert.showOnCertificatePage !== undefined ? bnspCert.showOnCertificatePage : true,
    driveUrl: bnspCert.driveUrl,
    fileName: bnspCert.fileName,
    language: bnspCert.language,
    notes: bnspCert.notes,
    verificationStatus: bnspCert.verificationStatus === 'verified' ? 'VERIFIED' : 'NEEDS_MANUAL_VERIFICATION'
  };

  console.log('📄 Mapped Data for BNSP Credential:');
  console.log(JSON.stringify(prismaData, null, 2));
  console.log('--------------------------------------------------------');

  // 3. Perform database operations if APPLY_CREDENTIAL_SYNC is true
  if (applySync) {
    console.log('💾 Connecting to Database...');
    const prisma = new PrismaClient();
    try {
      const result = await prisma.credential.upsert({
        where: { id: TARGET_ID },
        update: prismaData,
        create: prismaData
      });
      console.log('✅ Sync completed successfully!');
      console.log('Updated Record in Database:', {
        id: result.id,
        title: result.title,
        certificateNumber: result.certificateNumber,
        issueDate: result.issueDate,
        verificationStatus: result.verificationStatus,
        updatedAt: result.updatedAt
      });
    } catch (error) {
      console.error('❌ Failed to sync to the database:', error);
      throw error;
    } finally {
      await prisma.$disconnect();
    }
  } else {
    console.log('ℹ️ DRY RUN complete. No database writes were performed.');
  }
}

main().catch(err => {
  console.error('❌ Sync script terminated with error:', err.message);
  process.exit(1);
});
