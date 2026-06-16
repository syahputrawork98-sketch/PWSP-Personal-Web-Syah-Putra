import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getPublicExperiences } from '../lib/api';
import EmptyState from '../components/EmptyState';
import { useFetch } from '../hooks/useFetch';
import ExperienceCard from '../components/experience/ExperienceCard';
import { getExperienceDisplayDate } from '../lib/dateUtils';
import { useLanguage } from '../context/LanguageContext';

import '../styles/experience.css';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4 } }
};

const Experience = () => {
  const { t } = useLanguage();

  const SECTIONS = [
    {
      key: 'IT_FREELANCE',
      title: t('experience.sections.IT_FREELANCE.title'),
      subtitle: t('experience.sections.IT_FREELANCE.subtitle'),
    },
    {
      key: 'FORMAL_WORK',
      title: t('experience.sections.FORMAL_WORK.title'),
      subtitle: t('experience.sections.FORMAL_WORK.subtitle'),
    },
    {
      key: 'GENERAL_FREELANCE',
      title: t('experience.sections.GENERAL_FREELANCE.title'),
      subtitle: t('experience.sections.GENERAL_FREELANCE.subtitle'),
    },
  ];

  const { data: response, loading, error } = useFetch(getPublicExperiences);
  const experiences = (Array.isArray(response)
    ? response
    : (response?.experiences || response?.data?.experiences)) || [];

  // Group by experienceKind, fallback to FORMAL_WORK
  const grouped = {};
  experiences.forEach(exp => {
    const kind = exp.experienceKind || 'FORMAL_WORK';
    if (!grouped[kind]) grouped[kind] = [];
    grouped[kind].push(exp);
  });

  // Only sections with at least one item
  const visibleSections = SECTIONS.filter(s => grouped[s.key] && grouped[s.key].length > 0);

  return (
    <section id="experience" className="section-padding">
      <div className="container">
        <motion.div 
          style={{ textAlign: 'center', marginBottom: 'var(--space-12)' }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-center" style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>
            {t('experience.title')}
          </h2>
          <div style={{ width: '60px', height: '4px', background: 'var(--primary-color)', margin: 'var(--space-4) auto', borderRadius: 'var(--radius-full)' }} />
          <p style={{ maxWidth: '750px', margin: '0 auto', opacity: 0.8, fontSize: '1.05rem', lineHeight: 1.6 }}>
            {t('experience.p1')}
            <Link to="/projects" style={{ color: 'var(--primary-color)', fontWeight: 600, textDecoration: 'underline' }}>
              {t('experience.portfolioLinkText')}
            </Link>
            {t('experience.p2')}
          </p>
        </motion.div>

        {loading && <p style={{ opacity: 0.6, fontSize: '1rem', textAlign: 'center' }}>{t('experience.loading')}</p>}

        {!loading && !error && experiences.length === 0 && (
          <EmptyState message={t('experience.empty')} />
        )}

        {!loading && !error && experiences.length > 0 && (
          <>
            {visibleSections.map((section, sIdx) => (
              <div key={section.key} style={{ marginBottom: sIdx < visibleSections.length - 1 ? 'var(--space-10, 2.5rem)' : 0 }}>
                {/* Section Header */}
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: sIdx * 0.1 }}
                  style={{ marginBottom: 'var(--space-4, 1rem)' }}
                >
                  <h3 style={{
                    fontSize: '1.15rem',
                    fontWeight: '700',
                    margin: 0,
                    marginBottom: '4px',
                    color: 'var(--text-color)',
                  }}>
                    {section.title}
                  </h3>
                  {section.subtitle && (
                    <p style={{
                      fontSize: '0.85rem',
                      opacity: 0.6,
                      margin: 0,
                    }}>
                      {section.subtitle}
                    </p>
                  )}
                  <div style={{
                    marginTop: '10px',
                    height: '2px',
                    width: '48px',
                    borderRadius: '2px',
                    backgroundColor: section.key === 'IT_FREELANCE'
                      ? '#6366f1'
                      : section.key === 'GENERAL_FREELANCE'
                        ? '#f59e0b'
                        : '#22c55e',
                  }} />
                </motion.div>

                {/* Experience Cards */}
                <motion.div
                  className="experience-list"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {grouped[section.key].map(exp => (
                    <ExperienceCard
                      key={exp.id}
                      exp={exp}
                      displayDate={getExperienceDisplayDate(exp)}
                      variants={itemVariants}
                    />
                  ))}
                </motion.div>
              </div>
            ))}
          </>
        )}
      </div>
    </section>
  );
};


export default Experience;
