import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiMail, FiMapPin, FiPhone, FiGlobe } from 'react-icons/fi';
import { FaLinkedin, FaGithub, FaInstagram, FaWhatsapp } from 'react-icons/fa';
import { getPublicContact } from '../lib/api';
import EmptyState from '../components/EmptyState';
import { useFetch } from '../hooks/useFetch';
import { useLanguage } from '../context/LanguageContext';

import '../styles/contact.css';


const Contact = () => {
  const { t } = useLanguage();
  const { data, loading, error } = useFetch(getPublicContact);
  const contactData = data?.contact || data?.data?.contact || (data && !data.success && data.email ? data : null) || null;

  if (loading) {
    return (
      <section id="contact" className="section-padding flex-center" style={{ minHeight: '70vh' }}>
        <div className="container" style={{ maxWidth: '600px' }}>
          <p style={{ opacity: 0.6, fontSize: '1rem', textAlign: 'center' }}>{t('contact.loading')}</p>
        </div>
      </section>
    );
  }


  if (!contactData) {
    return (
      <section id="contact" className="section-padding flex-center" style={{ minHeight: '70vh' }}>
        <div className="container" style={{ maxWidth: '600px' }}>
          <h2 className="text-center">{t('contact.title')}</h2>
          <EmptyState message={t('contact.empty')} />
        </div>
      </section>
    );
  }

  const currentContact = contactData || {};

  const contactItems = [
    {
      id: 'email',
      icon: <FiMail />,
      label: t('contact.labels.email'),
      value: currentContact.email,
      url: currentContact.email ? `mailto:${currentContact.email}` : null
    },
    {
      id: 'phone',
      icon: <FiPhone />,
      label: t('contact.labels.whatsapp'),
      value: currentContact.whatsapp || currentContact.phone || (loading ? '...' : null),
      url: currentContact.whatsapp && typeof currentContact.whatsapp === 'string' 
        ? `https://wa.me/${currentContact.whatsapp.replace(/\D/g, '')}` 
        : null
    },
    {
      id: 'location',
      icon: <FiMapPin />,
      label: t('contact.labels.location'),
      value: currentContact.location,
      url: null
    },
    {
      id: 'website',
      icon: <FiGlobe />,
      label: t('contact.labels.website'),
      value: currentContact.website ? t('contact.values.website') : null,
      url: currentContact.website
    },
    {
      id: 'linkedin',
      icon: <FaLinkedin />,
      label: t('contact.labels.linkedin'),
      value: currentContact.linkedin ? t('contact.values.linkedin') : null,
      url: currentContact.linkedin
    },
    {
      id: 'github',
      icon: <FaGithub />,
      label: t('contact.labels.github'),
      value: currentContact.github ? t('contact.values.github') : null,
      url: currentContact.github
    },
    {
      id: 'instagram',
      icon: <FaInstagram />,
      label: t('contact.labels.instagram'),
      value: currentContact.instagram ? t('contact.values.instagram') : null,
      url: currentContact.instagram
    }
  ].filter(item => item.value);


  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5 } }
  };

  return (
    <section id="contact" className="section-padding flex-center" style={{ minHeight: '70vh' }}>
      <div className="container" style={{ maxWidth: '600px' }}>
        <motion.div 
          style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-center">{currentContact.title || t('contact.title')}</h2>
          <p style={{ fontSize: '1.1rem', opacity: 0.8 }}>{currentContact.description || t('contact.description')}</p>
          {loading && <p style={{ opacity: 0.6, marginTop: 'var(--space-2)' }}>{t('contact.loading')}</p>}
        </motion.div>

        {contactItems.length > 0 && (
          <motion.div 
            className="card" 
            style={{ padding: 'var(--space-6)' }}
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
              {contactItems.map((item) => (
                <motion.div 
                  key={item.id} 
                  className="contact-info-item"
                  style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}
                  variants={itemVariants}
                  whileHover={{ x: 5, transition: { duration: 0.2 } }}
                >
                  <div className="contact-icon-wrapper">
                    {item.icon}
                  </div>
                  <div>
                    <p style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', opacity: 0.6, marginBottom: '2px' }}>
                      {item.label}
                    </p>
                    {item.url ? (
                      <a 
                        href={item.url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="contact-link"
                      >
                        {item.value}
                      </a>
                    ) : (
                      <p style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{item.value}</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
        
        <motion.div 
          style={{ textAlign: 'center', marginTop: 'var(--space-8)' }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          viewport={{ once: true }}
        >
          <p style={{ fontSize: '0.9rem', opacity: 0.6 }}>
            {t('contact.footer')}
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;
