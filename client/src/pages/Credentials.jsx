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
