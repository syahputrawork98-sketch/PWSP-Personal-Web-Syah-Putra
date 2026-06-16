import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';

const CredentialCard = ({ credential, onClick }) => {
  const { t } = useLanguage();

  const getCategoryLabel = (cat) => {
    switch (cat) {
      case 'Semua': return t('credentials.categories.all');
      case 'BNSP': return t('credentials.categories.bnsp');
      case 'IT & Digital': return t('credentials.categories.it');
      case 'Teknik & Manufaktur': return t('credentials.categories.mfg');
      case 'Konstruksi': return t('credentials.categories.construction');
      case 'Pengembangan Diri': return t('credentials.categories.selfDev');
      case 'Magang & Partisipasi': return t('credentials.categories.internship');
      case 'Dokumen Pendukung': return t('credentials.categories.supportDocs');
      default: return cat;
    }
  };
  return (
    <motion.div 
      className="card credential-card"
      onClick={onClick}
      style={{ cursor: 'pointer' }}
      whileHover={{ y: -5 }}
    >
      <div style={{ padding: 'var(--space-6)', flex: 1, display: 'flex', flexDirection: 'column', position: 'relative' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-2)' }}>
          <p className="credential-category" style={{ margin: 0 }}>{getCategoryLabel(credential.category)}</p>
          <div style={{ display: 'flex', gap: '4px' }}>
            {credential.featured && (
              <span style={{ fontSize: '0.65rem', background: 'var(--primary-color)', color: 'white', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>STAR</span>
            )}
            {credential.status === 'supporting' && (
              <span style={{ fontSize: '0.65rem', background: 'var(--surface-color)', border: '1px solid var(--border-color)', color: 'var(--text-secondary)', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>SUPPORTING</span>
            )}
            {credential.status === 'duplicate-review' && (
              <span style={{ fontSize: '0.65rem', background: '#FEE2E2', color: '#EF4444', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>REVIEW</span>
            )}
          </div>
        </div>
        
        <h3 className="credential-title" style={{ marginBottom: 'var(--space-4)', minHeight: '3rem' }}>{credential.title}</h3>
        
        <div 
          style={{ 
            width: '100%', 
            height: '160px', 
            marginBottom: 'var(--space-4)', 
            borderRadius: '8px',
            overflow: 'hidden',
            backgroundColor: 'var(--surface-color)',
            border: '1px solid var(--border-color)',
            position: 'relative'
          }}
        >
          {credential.thumbnailUrl ? (
            <img 
              src={credential.thumbnailUrl} 
              alt={credential.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={(e) => {
                // Fallback to placeholder if Google Drive thumbnail blocks or fails
                e.target.onerror = null; 
                e.target.src = 'https://placehold.co/600x400/1e293b/334155?text=Sertifikat';
              }}
            />
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.5 }}>
              <span>{t('credentials.noThumbnail')}</span>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-4)', opacity: 0.8, fontSize: '0.9rem' }}>
          <span className="credential-issuer">{credential.issuer}</span>
          {credential.date && (
            <>
              <span style={{ fontSize: '0.6rem' }}>•</span>
              <span className="credential-date">{credential.date}</span>
            </>
          )}
        </div>
        
        <div className="credential-skills">
          {credential.skills.slice(0, 3).map((skill, idx) => (
            <span key={idx} className="credential-skill-badge">{skill}</span>
          ))}
          {credential.skills.length > 3 && (
            <span className="credential-skill-badge">+{credential.skills.length - 3}</span>
          )}
        </div>

        <button 
          className="btn btn-secondary" 
          style={{ marginTop: 'var(--space-6)', width: '100%', fontSize: '0.85rem' }}
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
        >
          {t('credentials.viewCertificate')}
        </button>
      </div>
    </motion.div>
  );
};

export default CredentialCard;
