import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { getPublicSkills, getPublicContact, getPublicProfile, getPublicEducation } from '../lib/api';
import EmptyState from '../components/EmptyState';
import TechSkillGroup from '../components/about/TechSkillGroup';
import EducationCard from '../components/about/EducationCard';
import { useLanguage } from '../context/LanguageContext';

import '../styles/about.css';

const About = () => {
  const { t } = useLanguage();
  const [techSkills, setTechSkills] = useState({});
  const [contactData, setContactData] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [educationData, setEducationData] = useState([]);
  const [softSkills, setSoftSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mapping for skill categories

  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(false);
      try {
        const [skillsData, contactResp, profileResp, educationResp] = await Promise.all([
          getPublicSkills(),
          getPublicContact(),
          getPublicProfile(),
          getPublicEducation()
        ]);

        if (skillsData) {
          const skillsArr = Array.isArray(skillsData) ? skillsData : (skillsData.skills || []);
          // Technical Skills (grouped by category)
          const grouped = skillsArr
            .filter(s => s.type === 'TECHNICAL' || !s.type)
            .reduce((acc, skill) => {
              const cat = skill.category || 'Other';
              if (!acc[cat]) acc[cat] = [];
              acc[cat].push(skill);
              return acc;
            }, {});
          setTechSkills(grouped);

          // Soft Skills
          const soft = skillsArr
            .filter(s => s.type === 'SOFT')
            .map(s => s.name);
          setSoftSkills(soft);
        }

        const extractData = (resp, key) => {
          if (!resp) return null;
          if (resp[key]) return resp[key];
          if (resp.data && resp.data[key]) return resp.data[key];
          if (resp && !resp.success && !resp.data) return resp; // Direct object
          return null;
        };

        setContactData(extractData(contactResp, 'contact'));
        setProfileData(extractData(profileResp, 'profile'));
        setEducationData(extractData(educationResp, 'education') || []);

      } catch (err) {
        console.error('About: Failed to fetch data:', err.message);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  if (loading) {
    return (
      <section id="about" className="section-padding flex-center">
        <div className="container">
          <p style={{ opacity: 0.6, fontSize: '1rem', textAlign: 'center' }}>{t('about.loading')}</p>
        </div>
      </section>
    );
  }


  if (!profileData) {
    return (
      <section id="about" className="section-padding flex-center">
        <div className="container">
          <EmptyState message={t('about.empty')} />
        </div>
      </section>
    );
  }

  const currentProfile = profileData || {};
  const currentEducation = educationData;
  const currentContact = contactData || {};

  return (
    <section id="about" className="section-padding">
      <motion.div 
        className="container"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <motion.h2 
          style={{ marginBottom: 'var(--space-6)' }}
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          {currentProfile.aboutTitle || t('about.title')}
        </motion.h2>
        
        {/* 1. Personal Summary Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ marginBottom: 'var(--space-12)' }}
        >
          <div className="profile-summary-container">
            <div>
              <h3 style={{ color: 'var(--primary-color)', marginBottom: 'var(--space-4)', fontSize: '1.6rem' }}>
                {currentProfile.summaryTitle || t('about.summaryTitle')}
              </h3>
              <div 
                dangerouslySetInnerHTML={{ __html: currentProfile.summary || t('about.emptySummary') }} 
                className="about-summary" 
              />
            </div>
            {currentProfile.avatarUrl && (
              <div className="card profile-image-card" style={{ padding: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                <div style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                  <img 
                    src={currentProfile.avatarUrl} 
                    alt="Profile Avatar" 
                    style={{ width: '100%', height: 'auto', display: 'block', maxHeight: '300px', objectFit: 'cover' }} 
                  />
                </div>
                
                <div style={{ 
                  paddingTop: 'var(--space-3)', 
                  borderTop: '1px solid var(--border-color)', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: 'var(--space-2.5)',
                  fontSize: '0.88rem'
                }}>
                  {currentProfile.birthPlace && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ opacity: 0.6, fontWeight: 500 }}>{t('about.birthPlace')}</span>
                      <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{currentProfile.birthPlace}</span>
                    </div>
                  )}
                  {currentProfile.birthDate && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ opacity: 0.6, fontWeight: 500 }}>{t('about.birthDate')}</span>
                      <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{currentProfile.birthDate}</span>
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ opacity: 0.6, fontWeight: 500 }}>{t('about.nationality')}</span>
                    <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{t('about.indonesia')}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ opacity: 0.6, fontWeight: 500 }}>{t('about.status')}</span>
                    <span style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-primary)' }}>
                      <span className="pulse-dot"></span>
                      {t('about.activeFreelance')}
                    </span>
                  </div>
                </div>

                {/* Social Quick Links */}
                {(currentContact.github || currentContact.linkedin || currentContact.instagram) && (
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    gap: '10px', 
                    marginTop: 'var(--space-1)', 
                    borderTop: '1px solid var(--border-color)', 
                    paddingTop: 'var(--space-3)' 
                  }}>
                    {currentContact.github && (
                      <a href={currentContact.github} target="_blank" rel="noopener noreferrer" className="about-social-icon" title="GitHub">
                        🐙 GitHub
                      </a>
                    )}
                    {currentContact.linkedin && (
                      <a href={currentContact.linkedin} target="_blank" rel="noopener noreferrer" className="about-social-icon" title="LinkedIn">
                        💼 LinkedIn
                      </a>
                    )}
                  </div>
                )}

                {/* Download CV Action */}
                <a 
                  href="/cv/cv-syah-putra-nugraha-web-developer.pdf" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="btn btn-primary"
                  style={{ 
                    width: '100%', 
                    fontSize: '0.85rem', 
                    padding: '10px', 
                    marginTop: 'var(--space-2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    boxSizing: 'border-box'
                  }}
                >
                  📄 {t('about.downloadCv')}
                </a>
              </div>
            )}
          </div>
        </motion.div>

        {/* 2. Technical Focus Section (Penting: Penegas Identitas Developer) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="tech-focus-section"
        >
          <h3 style={{ color: 'var(--primary-color)', marginBottom: 'var(--space-6)', fontSize: '1.5rem', textAlign: 'center' }}>
            Technical Focus & Core Stack
          </h3>
          <div className="tech-focus-grid">
            {Object.entries(techSkills).map(([category, skills]) => {
              const skillCatKey = category.toLowerCase() === 'tools & deployment' ? 'tools' : category.toLowerCase();
              const translatedCategory = t('about.categories.' + skillCatKey) !== 'about.categories.' + skillCatKey 
                ? t('about.categories.' + skillCatKey) 
                : category;
              return (
                <TechSkillGroup key={category} category={translatedCategory} skills={skills} />
              );
            })}
          </div>
        </motion.div>

        {/* 3. Education Section (Fondasi Akademis) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6 }}
          style={{ marginBottom: 'var(--space-12)' }}
        >
          <h3 style={{ color: 'var(--primary-color)', marginBottom: 'var(--space-6)', fontSize: '1.5rem' }}>{t('about.educationTitle')}</h3>
          <div className="education-grid">
            {currentEducation.length > 0 ? (
              currentEducation.map((edu) => (
                <EducationCard key={edu.id} {...edu} />
              ))
            ) : (
              <p style={{ opacity: 0.6 }}>{t('about.emptyEducation')}</p>
            )}
          </div>
        </motion.div>

        {/* 4. Experience Reframing (The 8-Year IT Strength) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
          style={{ marginBottom: 'var(--space-12)' }}
        >
          <div className="card" style={{ padding: 'var(--space-8)', borderLeft: '5px solid var(--primary-color)' }}>
            <h3 style={{ marginBottom: 'var(--space-4)', fontSize: '1.5rem' }}>{t('about.experienceReframing.title')}</h3>
            <p style={{ fontSize: '1.05rem', lineHeight: 1.7, opacity: 0.9, marginBottom: 'var(--space-6)' }}>
              {t('about.experienceReframing.desc')}
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-4)' }}>
              {(Array.isArray(t('about.experienceReframing.items')) ? t('about.experienceReframing.items') : []).map((item, i) => (
                <div key={i}>
                  <p style={{ fontWeight: 700, color: 'var(--primary-color)', marginBottom: '4px' }}>{item.title}</p>
                  <p style={{ fontSize: '0.85rem', opacity: 0.7 }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* 5. Values & Strengths (Soft Skills) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.6 }}
          style={{ marginBottom: 'var(--space-12)' }}
        >
          <h3 style={{ color: 'var(--primary-color)', marginBottom: 'var(--space-6)', fontSize: '1.4rem' }}>{t('about.valuesTitle')}</h3>
          <div className="values-container">
            {softSkills.map((skill, index) => (
              <span key={index} className="tech-badge" style={{ padding: '8px 20px', borderRadius: 'var(--radius-full)', background: 'var(--surface-color)', border: '1px solid var(--border-color)', fontWeight: 600 }}>
                {skill}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Credentials Section */}
        <div style={{ marginTop: 'var(--space-12)' }}>
          <div className="card" style={{ padding: 'var(--space-8)', textAlign: 'center', background: 'rgba(var(--primary-color-rgb), 0.03)', border: '1px dashed var(--border-color)' }}>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h3 style={{ color: 'var(--primary-color)', marginBottom: 'var(--space-4)' }}>{t('about.credentialsSection.title')}</h3>
              <p style={{ maxWidth: '600px', margin: '0 auto var(--space-6)', opacity: 0.8, lineHeight: 1.6 }}>
                {t('about.credentialsSection.desc')}
              </p>
              <Link to="/credentials" className="btn btn-primary" style={{ display: 'inline-block' }}>
                {t('about.credentialsSection.buttonText')}
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};
export default About;
