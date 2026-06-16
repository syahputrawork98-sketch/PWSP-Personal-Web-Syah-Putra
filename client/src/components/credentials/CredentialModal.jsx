import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';

const CredentialModal = ({ isOpen, onClose, credential }) => {
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

  if (!credential) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          className="modal-overlay" 
          onClick={onClose}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 2000,
            padding: 'var(--space-4)',
            backdropFilter: 'blur(8px)'
          }}
        >
          <motion.div 
            className="modal-content card"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: '800px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: 'var(--space-8)',
              position: 'relative'
            }}
          >
            <button 
              className="modal-close"
              onClick={onClose}
              aria-label={t('credentials.modal.close')}
              style={{
                position: 'absolute',
                top: 'var(--space-4)',
                right: 'var(--space-4)',
                background: 'var(--surface-color)',
                border: '1px solid var(--border-color)',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                cursor: 'pointer',
                color: 'var(--text-primary)',
                zIndex: 10
              }}
            >
              &times;
            </button>

            <div style={{ marginBottom: 'var(--space-6)' }}>
              <p className="credential-category">{getCategoryLabel(credential.category)}</p>
              <h2 className="credential-title" style={{ fontSize: '1.75rem' }}>{credential.title}</h2>
              <p className="credential-issuer" style={{ fontSize: '1.1rem' }}>{credential.issuer} • {credential.date}</p>
            </div>

            {/* Google Drive Preview Section */}
            {credential.previewUrl ? (
              <div className="drive-preview-container">
                <iframe 
                  src={credential.previewUrl} 
                  className="drive-iframe" 
                  allow="autoplay"
                  title={`Preview ${credential.title}`}
                ></iframe>
              </div>
            ) : (
              <div className="drive-preview-container flex-center" style={{ background: 'rgba(var(--primary-color-rgb), 0.03)', flexDirection: 'column', gap: 'var(--space-2)' }}>
                <span style={{ fontSize: '2rem', opacity: 0.2 }}>📄</span>
                <p style={{ opacity: 0.5, fontSize: '0.9rem', fontWeight: 500 }}>{t('credentials.modal.noPreview')}</p>
              </div>
            )}

            <div style={{ marginBottom: 'var(--space-8)' }}>
              <h4 style={{ marginBottom: 'var(--space-2)', color: 'var(--text-primary)' }}>{t('credentials.modal.descTitle')}</h4>
              <p style={{ fontSize: '1rem', lineHeight: 1.7, opacity: 0.8 }}>{credential.summary || t('credentials.modal.noDesc')}</p>
            </div>

            <div className="modal-actions" style={{ display: 'flex', gap: 'var(--space-4)', marginTop: 'var(--space-4)' }}>
              {credential.viewUrl ? (
                <a 
                  href={credential.viewUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="btn btn-primary"
                  style={{ flex: 1, textAlign: 'center' }}
                >
                  {t('credentials.modal.openDrive')}
                </a>
              ) : (
                <div 
                  className="btn btn-secondary" 
                  style={{ flex: 1, textAlign: 'center', opacity: 0.5, cursor: 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                >
                  <span>🔒</span> {t('credentials.modal.noDriveLink')}
                </div>
              )}
              <button 
                onClick={onClose} 
                className="btn btn-secondary"
                style={{ flex: 1 }}
              >
                {t('credentials.modal.back')}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CredentialModal;
