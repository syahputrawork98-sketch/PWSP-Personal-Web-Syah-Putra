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

const getLocalDisplayDate = (exp, locale) => {
  if (!exp) return '';
  if (exp.isLocal) return exp.displayDate || '';

  const formatDateLocal = (dateString, loc) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '';
      
      const jsLocale = loc === 'JA' ? 'ja-JP' : loc === 'ID' ? 'id-ID' : 'en-US';
      return date.toLocaleDateString(jsLocale, {
        month: 'short',
        year: 'numeric'
      });
    } catch (e) {
      return '';
    }
  };

  const start = formatDateLocal(exp.startDate, locale);
  
  let endText = '';
  if (exp.isCurrent) {
    endText = locale === 'ID' ? 'Sekarang' : locale === 'JA' ? '現在' : 'Present';
  } else {
    endText = formatDateLocal(exp.endDate, locale);
  }

  if (!start) return endText || '';
  return `${start} ${endText ? '– ' + endText : ''}`;
};

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
  const { locale, t } = useLanguage();

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

  const fetchExperiencesWithLocale = React.useCallback(() => {
    return getPublicExperiences(locale);
  }, [locale]);

  const { data: response, loading, error } = useFetch(fetchExperiencesWithLocale);
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
            {/* Experience Overview Summary Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              style={{ marginBottom: 'var(--space-12)' }}
            >
              <h3 style={{ marginBottom: 'var(--space-2)', fontSize: '1.4rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                {t('experience.overviewTitle')}
              </h3>
              <p style={{ opacity: 0.8, marginBottom: 'var(--space-6)', fontSize: '1rem', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                {t('experience.overviewDescription')}
              </p>

              <div className="experience-summary-grid">
                <div className="experience-summary-card">
                  <div className="experience-summary-icon">⚛️</div>
                  <h4 className="experience-summary-card-title">{t('experience.summary.fullStack')}</h4>
                  <p className="experience-summary-card-desc">React.js, Node.js, Express, REST APIs, and database design.</p>
                </div>
                <div className="experience-summary-card">
                  <div className="experience-summary-icon">🔧</div>
                  <h4 className="experience-summary-card-title">{t('experience.summary.itSupport')}</h4>
                  <p className="experience-summary-card-desc">Local servers, networks, cPanel hosting, and tech support.</p>
                </div>
                <div className="experience-summary-card">
                  <div className="experience-summary-icon">📲</div>
                  <h4 className="experience-summary-card-title">{t('experience.summary.digitalization')}</h4>
                  <p className="experience-summary-card-desc">Migrating spreadsheets and paper workflows to web apps.</p>
                </div>
                <div className="experience-summary-card">
                  <div className="experience-summary-icon">📊</div>
                  <h4 className="experience-summary-card-title">{t('experience.summary.businessOps')}</h4>
                  <p className="experience-summary-card-desc">Budget calculation (RAB/RAP), documentation, and reporting.</p>
                </div>
              </div>
            </motion.div>

            {/* How My Experience Supports Full Stack Developer Roles Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="experience-hrd-value-panel"
              style={{ marginBottom: 'var(--space-12)' }}
            >
              <h3 style={{ marginBottom: 'var(--space-2)', fontSize: '1.4rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                {t('experience.hrdValueTitle')}
              </h3>
              <p style={{ opacity: 0.8, marginBottom: 'var(--space-6)', fontSize: '1rem', lineHeight: '1.5', color: 'var(--text-secondary)' }}>
                {t('experience.hrdValueDescription')}
              </p>

              <div className="experience-hrd-value-grid">
                <div className="experience-hrd-value-item">
                  <span className="experience-hrd-value-bullet">💼</span>
                  <div>
                    <h4 className="experience-hrd-value-item-title">{t('experience.hrdValue.workflow')}</h4>
                    <p className="experience-hrd-value-item-desc">
                      Real-world business process understanding allows for designing relevant, problem-solving database structures and user flows.
                    </p>
                  </div>
                </div>
                <div className="experience-hrd-value-item">
                  <span className="experience-hrd-value-bullet">🖥️</span>
                  <div>
                    <h4 className="experience-hrd-value-item-title">{t('experience.hrdValue.systemSupport')}</h4>
                    <p className="experience-hrd-value-item-desc">
                      Troubleshooting local database servers, web hosting systems, networks, and handling user technical support.
                    </p>
                  </div>
                </div>
                <div className="experience-hrd-value-item">
                  <span className="experience-hrd-value-bullet">📝</span>
                  <div>
                    <h4 className="experience-hrd-value-item-title">{t('experience.hrdValue.reporting')}</h4>
                    <p className="experience-hrd-value-item-desc">
                      Strong grasp of inventory tracking, cost calculations (RAB), and digital reporting to build precise administrative tools.
                    </p>
                  </div>
                </div>
                <div className="experience-hrd-value-item">
                  <span className="experience-hrd-value-bullet">🚀</span>
                  <div>
                    <h4 className="experience-hrd-value-item-title">{t('experience.hrdValue.webApplication')}</h4>
                    <p className="experience-hrd-value-item-desc">
                      End-to-end practical application development using modern frameworks (React.js, Node.js, Express, databases) and version control.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

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
                      displayDate={getLocalDisplayDate(exp, locale)}
                      variants={itemVariants}
                      locale={locale}
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
