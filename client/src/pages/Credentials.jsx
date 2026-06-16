import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useFetch } from '../hooks/useFetch';
import { getPublicCertifications } from '../lib/api';
import { credentialCategories } from '../data/credentialsData';
import CredentialCard from '../components/credentials/CredentialCard';
import CredentialModal from '../components/credentials/CredentialModal';
import EmptyState from '../components/EmptyState';
import { useLanguage } from '../context/LanguageContext';
import '../styles/credentials.css';

const Credentials = () => {
  const { t } = useLanguage();
  const { data: response, loading, error } = useFetch(getPublicCertifications);
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [selectedCredential, setSelectedCredential] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const getGoogleDriveUrls = (driveUrl) => {
    if (!driveUrl) return { previewUrl: '', viewUrl: '', thumbnailUrl: '' };
    const match = driveUrl.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (match && match[1]) {
      const fileId = match[1];
      return {
        previewUrl: `https://drive.google.com/file/d/${fileId}/preview`,
        viewUrl: `https://drive.google.com/file/d/${fileId}/view`,
        thumbnailUrl: `https://drive.google.com/thumbnail?id=${fileId}&sz=w600`
      };
    }
    return { previewUrl: '', viewUrl: driveUrl, thumbnailUrl: '' };
  };

  const rawCredentials = ((Array.isArray(response) ? response : (response?.certifications || response?.data?.certifications)) || []).map(item => {
    const driveUrls = getGoogleDriveUrls(item.driveUrl);
    return {
      ...item,
      date: item.originalIssueDate || (item.issueDate ? new Date(item.issueDate).getFullYear().toString() : ''),
      previewUrl: item.previewUrl || driveUrls.previewUrl,
      viewUrl: item.viewUrl || driveUrls.viewUrl,
      thumbnailUrl: item.imageUrl || driveUrls.thumbnailUrl || 'https://placehold.co/600x400/1e293b/334155?text=Sertifikat'
    };
  });

  const filteredCredentials = (activeCategory === "Semua"
    ? rawCredentials
    : rawCredentials.filter(item => item.category === activeCategory)
  ).sort((a, b) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return 0;
  });

  const featuredSpotlight = rawCredentials.find(c => c.id === 'bnsp-web-node-react') ||
                            rawCredentials.find(c => c.category === 'BNSP' && (c.title?.toLowerCase().includes('node') || c.title?.toLowerCase().includes('react') || c.title?.toLowerCase().includes('web'))) ||
                            rawCredentials.find(c => c.featured);

  const handleOpenModal = (credential) => {
    setSelectedCredential(credential);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedCredential(null), 300);
  };

  if (loading) {
    return (
      <section id="credentials" className="section-padding flex-center">
        <div className="container">
          <p style={{ opacity: 0.6, fontSize: '1rem', textAlign: 'center' }}>{t('credentials.loading')}</p>
        </div>
      </section>
    );
  }

  return (
    <section id="credentials" className="section-padding">
      <div className="container">
        <motion.div 
          style={{ textAlign: 'center', marginBottom: 'var(--space-12)' }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-center">{t('credentials.title')}</h2>
          <p style={{ maxWidth: '700px', margin: '0 auto', opacity: 0.8, fontSize: '1.1rem' }}>
            {t('credentials.description')}
          </p>
        </motion.div>

        {/* Credential Summary Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          style={{ marginBottom: 'var(--space-10)' }}
        >
          <h3 style={{ marginBottom: 'var(--space-2)', fontSize: '1.4rem', fontWeight: '700' }}>
            {t('credentials.summaryTitle')}
          </h3>
          <p style={{ opacity: 0.8, marginBottom: 'var(--space-6)', fontSize: '1rem', lineHeight: '1.5' }}>
            {t('credentials.summaryDescription')}
          </p>

          <div className="credential-summary-grid">
            <div className="credential-summary-card">
              <div className="credential-summary-number">
                {rawCredentials.length || 0}
              </div>
              <div className="credential-summary-label">
                {t('credentials.summary.totalCredentials')}
              </div>
            </div>
            <div className="credential-summary-card">
              <div className="credential-summary-number">
                {rawCredentials.filter(c => c.featured).length || 0}
              </div>
              <div className="credential-summary-label">
                {t('credentials.summary.featuredCredentials')}
              </div>
            </div>
            <div className="credential-summary-card">
              <div className="credential-summary-number">
                {rawCredentials.filter(c => c.category === 'BNSP').length || 0}
              </div>
              <div className="credential-summary-label">
                {t('credentials.summary.professionalCertification')}
              </div>
            </div>
            <div className="credential-summary-card">
              <div className="credential-summary-number">
                {rawCredentials.filter(c => c.category === 'IT & Digital').length || 0}
              </div>
              <div className="credential-summary-label">
                {t('credentials.summary.technicalTraining')}
              </div>
            </div>
          </div>
        </motion.div>


        {/* Featured Credential Spotlight */}
        {featuredSpotlight && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{ marginBottom: 'var(--space-12)' }}
          >
            <h3 style={{ marginBottom: 'var(--space-2)' }}>{t('credentials.featuredTitle')}</h3>
            <p style={{ opacity: 0.8, marginBottom: 'var(--space-6)', fontSize: '1rem' }}>
              {t('credentials.featuredDescription')}
            </p>
            
            <div className="featured-credential-panel">
              <div className="featured-credential-content">
                <div className="featured-image-wrapper" onClick={() => handleOpenModal(featuredSpotlight)}>
                  <img 
                    src={featuredSpotlight.thumbnailUrl} 
                    alt={featuredSpotlight.title || 'Featured'} 
                    className="featured-image"
                    onError={(e) => { e.target.src = 'https://placehold.co/600x400/1e293b/334155?text=Sertifikat'; }}
                  />
                </div>
                <div className="featured-credential-details">
                  <span className="featured-badge-tag">{t('credentials.featuredLabel')}</span>
                  <h4 className="featured-title-text">{featuredSpotlight.title || ''}</h4>
                  <div className="featured-issuer-text">{featuredSpotlight.issuer || ''}</div>
                  <div className="featured-date-text">{featuredSpotlight.date || ''}</div>
                  <p className="featured-summary-text">
                    {featuredSpotlight.summary || ''}
                  </p>
                  
                  {featuredSpotlight.skills && featuredSpotlight.skills.length > 0 && (
                    <div className="featured-credential-badges">
                      {featuredSpotlight.skills.map((skill, index) => (
                        <span key={index} className="featured-skill-tag">{skill}</span>
                      ))}
                    </div>
                  )}
                  
                  <button 
                    className="featured-action-btn"
                    onClick={() => handleOpenModal(featuredSpotlight)}
                  >
                    {t('credentials.viewCertificate')}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Full Stack Skill Mapping */}
        {rawCredentials.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="credential-skill-map"
          >
            <h3 style={{ marginBottom: 'var(--space-2)' }}>{t('credentials.skillsMapTitle')}</h3>
            <p style={{ opacity: 0.8, marginBottom: 'var(--space-6)', fontSize: '1.05rem' }}>
              {t('credentials.skillsMapDescription')}
            </p>
            
            <div className="credential-skill-map-grid">
              {[
                {
                  key: 'react',
                  label: t('credentials.skillsMap.react'),
                  keywords: ['react'],
                  desc: 'React.js, component architecture, state management, and interactive frontend development.'
                },
                {
                  key: 'node',
                  label: t('credentials.skillsMap.node'),
                  keywords: ['node'],
                  desc: 'Node.js runtime, asynchronous event-driven backend logic, and server configuration.'
                },
                {
                  key: 'api',
                  label: t('credentials.skillsMap.api'),
                  keywords: ['api', 'data integration', 'rest'],
                  desc: 'REST API design, data workflows, CRUD integration, and database connectivity.'
                },
                {
                  key: 'softwareEngineering',
                  label: t('credentials.skillsMap.softwareEngineering'),
                  keywords: ['software engineering', 'programming', 'javascript', 'git'],
                  desc: 'Core development logic, version control, reusability, and software architecture foundations.'
                },
                {
                  key: 'cloud',
                  label: t('credentials.skillsMap.cloud'),
                  keywords: ['cloud', 'azure'],
                  desc: 'Cloud deployment, computing resources configuration, and infrastructure awareness.'
                }
              ].map(skillItem => {
                const associatedCerts = rawCredentials.filter(c => 
                  c.skills && c.skills.some(skill => 
                    skillItem.keywords.some(kw => skill.toLowerCase().includes(kw.toLowerCase()))
                  )
                );
                
                return (
                  <div key={skillItem.key} className="credential-skill-map-item">
                    <div className="credential-skill-map-header">
                      <span>{skillItem.key === 'react' ? '⚛️' : skillItem.key === 'node' ? '🟢' : skillItem.key === 'api' ? '🔌' : skillItem.key === 'softwareEngineering' ? '💻' : '☁️'}</span>
                      {skillItem.label}
                    </div>
                    <p className="credential-skill-map-desc">{skillItem.desc}</p>
                    <div className="credential-skill-map-certificates">
                      {associatedCerts.length > 0 ? (
                        associatedCerts.slice(0, 3).map(cert => (
                          <span 
                            key={cert.id} 
                            className="credential-skill-map-cert-link"
                            onClick={() => handleOpenModal(cert)}
                          >
                            🔗 {cert.title?.split('—')?.[1] || cert.title?.split('–')?.[1] || cert.title}
                          </span>
                        ))
                      ) : (
                        <span style={{ fontSize: '0.8rem', opacity: 0.5, fontStyle: 'italic' }}>—</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Filter Categories */}
        <div className="filter-container">
          {credentialCategories.map(cat => (
            <button
              key={cat}
              className={`filter-btn ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {getCategoryLabel(cat)}
            </button>
          ))}
        </div>

        {/* Credentials Grid */}
        {filteredCredentials.length > 0 ? (
          <motion.div 
            className="credentials-grid"
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {filteredCredentials.map(item => (
              <CredentialCard 
                key={item.id} 
                credential={item} 
                onClick={() => handleOpenModal(item)}
              />
            ))}
          </motion.div>
        ) : (
          <EmptyState message={t('credentials.emptyCategory').replace('{category}', getCategoryLabel(activeCategory))} />
        )}

        <CredentialModal 
          isOpen={isModalOpen} 
          onClose={handleCloseModal} 
          credential={selectedCredential} 
        />
      </div>
    </section>
  );
};

export default Credentials;
