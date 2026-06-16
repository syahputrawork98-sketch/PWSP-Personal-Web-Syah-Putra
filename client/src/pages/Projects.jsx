import React, { useState } from 'react';
import ProjectCard from '../components/ProjectCard';
import ProjectDetailModal from '../components/ProjectDetailModal';
import { motion } from 'framer-motion';
import EmptyState from '../components/EmptyState';
import { useFetch } from '../hooks/useFetch';
import { useLanguage } from '../context/LanguageContext';

const Projects = () => {
  const { locale, t } = useLanguage();

  const categoriesMap = [
    { key: 'Semua', label: t('projects.categories.all') },
    { key: 'IT & Web', label: t('projects.categories.it') },
    { key: 'Manufaktur & Teknik', label: t('projects.categories.mfg') },
    { key: 'Model Mesin 3D', label: t('projects.categories.machine') },
    { key: 'Model Bangunan & RAB', label: t('projects.categories.est') }
  ];

  const fetchProjectsWithLocale = React.useCallback(async () => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    const res = await fetch(`${API_URL}/api/projects?locale=${locale}`);
    const json = await res.json();
    if (!res.ok || json.success === false) {
      throw new Error(json.message || 'Something went wrong');
    }
    return json.data !== undefined ? json.data : json;
  }, [locale]);

  const { data, loading, error } = useFetch(fetchProjectsWithLocale);
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [selectedProject, setSelectedProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const rawProjects = (Array.isArray(data) 
    ? data 
    : (data?.projects || data?.data?.projects)) || [];

  // Normalize and Sort
  const projects = rawProjects.map(p => ({
    ...p,
    category: p.category || "IT & Web" // Fallback for old data
  })).sort((a, b) => (a.order || a.orderIndex) - (b.order || b.orderIndex));

  // Filter by Category
  const filteredProjects = activeCategory === "Semua"
    ? projects
    : projects.filter(p => p.category === activeCategory);

  const featuredProjects = filteredProjects.filter(p => p.featured);
  const otherProjects = filteredProjects.filter(p => !p.featured);

  const handleOpenModal = (project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedProject(null), 300);
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

  if (loading) {
    return (
      <section id="projects" className="section-padding flex-center">
        <div className="container">
          <p style={{ opacity: 0.6, fontSize: '1rem', textAlign: 'center' }}>{t('projects.loading')}</p>
        </div>
      </section>
    );
  }

  if (projects.length === 0 && !error) {
    return (
      <section id="projects" className="section-padding flex-center">
        <div className="container">
          <EmptyState message={t('projects.empty')} />
        </div>
      </section>
    );
  }

  const activeCategoryLabel = categoriesMap.find(c => c.key === activeCategory)?.label || activeCategory;

  return (
    <section id="projects" className="section-padding">
      <div className="container">
        <motion.div 
          style={{ textAlign: 'center', marginBottom: 'var(--space-12)' }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-center" style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>
            {t('projects.title')}
          </h2>
          <div style={{ width: '60px', height: '4px', background: 'var(--primary-color)', margin: 'var(--space-4) auto', borderRadius: 'var(--radius-full)' }} />
          <p style={{ maxWidth: '650px', margin: '0 auto', opacity: 0.8, fontSize: '1.1rem', lineHeight: 1.6 }}>
            {t('projects.description')}
          </p>
        </motion.div>

        {/* Category Tabs */}
        <div className="filter-container">
          {categoriesMap.map(cat => (
            <button
              key={cat.key}
              className={`filter-btn ${activeCategory === cat.key ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat.key)}
            >
              {cat.label}
            </button>
          ))}
        </div>
          <>
            {/* Featured Projects Heading */}
            {featuredProjects.length > 0 && (
              <motion.div
                style={{ marginBottom: 'var(--space-6)' }}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 'var(--space-2)' }}>
                  {t('projects.featuredTitle')}
                </h3>
                <p style={{ opacity: 0.75, fontSize: '0.95rem', lineHeight: 1.5, maxWidth: '720px' }}>
                  {t('projects.featuredDescription')}
                </p>
              </motion.div>
            )}

            {/* Featured Projects Grid */}
            {featuredProjects.length > 0 && (
              <motion.div 
                className="projects-grid"
                style={{ 
                  marginBottom: otherProjects.length > 0 ? 'var(--space-12)' : 0
                }}
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
              >
                {featuredProjects.map((project) => (
                  <ProjectCard 
                    key={project.id} 
                    project={project} 
                    onClick={() => handleOpenModal(project)}
                  />
                ))}
              </motion.div>
            )}

            {/* Section Divider */}
            {otherProjects.length > 0 && (
              <motion.div 
                style={{ marginBottom: 'var(--space-8)' }}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                <h3 style={{ opacity: 0.6, fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '2px', borderBottom: '1px solid var(--border-color)', paddingBottom: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
                  {t('projects.otherProjects')}
                </h3>
                <p style={{ opacity: 0.7, fontSize: '0.9rem', lineHeight: 1.5, maxWidth: '720px' }}>
                  {t('projects.otherDescription')}
                </p>
              </motion.div>
            )}

            {/* Other Projects Grid */}
            {otherProjects.length > 0 && (
              <motion.div 
                className="projects-grid-other"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
              >
                {otherProjects.map((project) => (
                  <ProjectCard 
                    key={project.id} 
                    project={project} 
                    onClick={() => handleOpenModal(project)}
                  />
                ))}
              </motion.div>
            )}

            {filteredProjects.length === 0 && (
              <div style={{ padding: 'var(--space-12) 0' }}>
                <EmptyState message={t('projects.emptyCategory').replace('{category}', activeCategoryLabel)} />
              </div>
            )}
          </>

          <ProjectDetailModal 
            isOpen={isModalOpen} 
            onClose={handleCloseModal} 
            project={selectedProject} 
          />
      </div>
    </section>
  );
};


export default Projects;
