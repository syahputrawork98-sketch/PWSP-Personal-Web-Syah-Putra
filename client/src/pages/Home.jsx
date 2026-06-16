import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';
import { getPublicSkills, getPublicHero, getPublicContact } from '../lib/api';
import EmptyState from '../components/EmptyState';
import { services } from '../data/homeData';
import ServiceCard from '../components/home/ServiceCard';
import { getSkillIcon } from '../utils/skillIcons';
import { contactFallback } from '../fallback/contactFallback';
import { useLanguage } from '../context/LanguageContext';

import '../styles/home.css';



const Home = () => {
  const { t } = useLanguage();
  const [highlightSkills, setHighlightSkills] = useState([]);
  const [heroData, setHeroData] = useState(null);
  const [contactData, setContactData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(false);
  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(false);
      try {
        const [skillsData, heroResponse, contactResponse] = await Promise.all([
          getPublicSkills(),
          getPublicHero(),
          getPublicContact().catch(err => {
            console.warn('Home: Failed to fetch contact, using fallback:', err.message);
            return null;
          })
        ]);

        if (skillsData && Array.isArray(skillsData.skills)) {
          const topSkills = skillsData.skills.slice(0, 8);
          setHighlightSkills(topSkills);
        } else if (Array.isArray(skillsData)) {
          const topSkills = skillsData.slice(0, 8);
          setHighlightSkills(topSkills);
        }

        if (heroResponse && heroResponse.hero) {
          setHeroData(heroResponse.hero);
        } else if (heroResponse && heroResponse.data && heroResponse.data.hero) {
          setHeroData(heroResponse.data.hero);
        } else if (heroResponse && !heroResponse.success && heroResponse.title) {
          setHeroData(heroResponse); // Fallback for direct object
        }

        if (contactResponse) {
          setContactData(contactResponse);
        }
      } catch (err) {
        console.error('Home: Failed to fetch data:', err.message);
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
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  if (loading) {
    return (
      <section id="home" className="section-padding flex-center hero-section">
        <div className="container">
          <p style={{ opacity: 0.6, fontSize: '1rem', textAlign: 'center' }}>{t('home.loading')}</p>
        </div>
      </section>
    );
  }


  const currentHero = {
    name: heroData?.name || "Syah Putra Nugraha",
    roles: heroData?.roles && heroData.roles.length > 0 ? heroData.roles : ["Full Stack Developer", "Software Engineer"],
    title: heroData?.title || "Full Stack Web Developer specializing in PHP, Laravel, React, and MySQL.",
    subtitle: heroData?.subtitle || "I build web applications with authentication, admin dashboards, CRUD systems, REST API, and database integration.",
    primaryCtaLabel: heroData?.primaryCtaLabel || "Lihat Project",
    secondaryCtaLabel: heroData?.secondaryCtaLabel || "Download CV",
  };

  const githubUrl = contactData?.github || contactFallback.github;
  const linkedinUrl = contactData?.linkedin || contactFallback.linkedin;

  const typeSequence = currentHero.roles && currentHero.roles.length > 0 
    ? currentHero.roles.flatMap(role => [role, 2000]) 
    : [currentHero.name || '', 2000];

  return (
    <section id="home" className="section-padding flex-center hero-section">
      <motion.div 
        className="container"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.p className="hero-role" variants={itemVariants}>
          {typeSequence.length > 0 && (
            <TypeAnimation
              key={heroData ? 'api' : 'fallback'}
              sequence={typeSequence}
              wrapper="span"
              speed={50}
              repeat={Infinity}
              style={{ display: 'inline-block', minHeight: '1.2em' }}
            />
          )}
        </motion.p>
        
        <motion.h1 className="hero-title" variants={itemVariants}>
          {currentHero.title}
        </motion.h1>
        
        <motion.p className="hero-subtitle" variants={itemVariants}>
          {currentHero.subtitle}
        </motion.p>
        
        {highlightSkills.length > 0 && (
          <motion.div className="skill-pills" variants={itemVariants}>
            {highlightSkills.map((skill, index) => {
              const skillName = typeof skill === 'string' ? skill : skill.name;
              const skillIcon = typeof skill === 'object' ? skill.icon : null;
              const fallbackIcon = getSkillIcon(skillName);

              return (
                <span key={index} className="skill-pill">
                  {skillIcon && skillIcon.startsWith('http') ? (
                    <img src={skillIcon} alt={skillName} className="skill-pill-icon" />
                  ) : (
                    fallbackIcon && <span className="skill-pill-icon-wrapper">{fallbackIcon}</span>
                  )}
                  <span>{skillName}</span>
                </span>
              );
            })}
          </motion.div>
        )}

        <motion.div className="cta-group" variants={itemVariants}>
          {currentHero.primaryCtaLabel && (
            <Link to="/projects" className="btn btn-primary">{currentHero.primaryCtaLabel}</Link>
          )}
          {currentHero.secondaryCtaLabel && (
            <a href="/cv/cv-syah-putra-nugraha-web-developer.pdf" target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
              {currentHero.secondaryCtaLabel}
            </a>
          )}
          <Link to="/contact" className="btn btn-secondary">{t('home.contactMe')}</Link>

          {githubUrl && (
            <a href={githubUrl} target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-social">
              GitHub
            </a>
          )}
          {linkedinUrl && (
            <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-social">
              LinkedIn
            </a>
          )}
        </motion.div>

        {/* What I Can Do Section */}
        <motion.div 
          variants={itemVariants} 
          className="services-grid"
        >
          {services.map((item, idx) => (
            <ServiceCard key={idx} {...item} />
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
};


export default Home;
