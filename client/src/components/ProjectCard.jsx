import React from 'react';
import { motion } from 'framer-motion';
import '../styles/projects.css';

const ProjectCard = ({ project, onClick }) => {

  const getStatusColor = (status) => {
    switch (status) {
      case 'Production': return '#10B981';
      case 'Prototype': return '#F59E0B';
      case 'In Progress': return '#3B82F6';
      case 'Internal': return '#6366F1';
      default: return 'var(--primary-color)';
    }
  };

  const isValidUrl = (url) => {
    if (!url || typeof url !== 'string') return false;
    const cleanUrl = url.trim().toLowerCase();
    if (cleanUrl === '' || 
        cleanUrl === '#' || 
        cleanUrl === '-' || 
        cleanUrl === 'coming soon' || 
        cleanUrl === 'todo' || 
        cleanUrl === 'placeholder' ||
        cleanUrl === 'null' ||
        cleanUrl === 'undefined') {
      return false;
    }
    return true;
  };

  const title = project.title || "";
  const subtitle = project.subtitle || project.shortDescription || "";
  const techStack = project.techStack || project.technologies || [];
  
  const links = project.links || {};
  const demoUrl = project.liveUrl || links.demo || links.live || project.demoUrl || project.demo;
  const githubUrl = project.githubUrl || links.github || project.github;
  const figmaUrl = project.figmaUrl || links.figma || project.figma;

  const primaryCTAs = [
    { key: 'demo', label: 'Demo', icon: '🌐', url: demoUrl },
    { key: 'github', label: 'GitHub', icon: '💻', url: githubUrl },
    { key: 'figma', label: 'Figma', icon: '🎨', url: figmaUrl },
  ];

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <motion.div 
      className="project-card"
      variants={cardVariants}
      onClick={onClick}
      style={{ cursor: 'pointer' }}
    >
      {/* Project Image */}
      <div className="project-image-container">
        <img 
          src={project.imageUrl || 'https://via.placeholder.com/600x400?text=Project+Thumbnail'} 
          alt={title}
          className="project-image"
        />
        <div className="project-image-overlay" style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.2), transparent 50%, rgba(0,0,0,0.4))',
          zIndex: 1
        }} />
        <div className="project-badges-top">
          <span className="category-badge">{project.category || "General"}</span>
          {project.status && (
            <span 
              className="project-status-badge"
              style={{ 
                backgroundColor: getStatusColor(project.status)
              }}
            >
              {project.status}
            </span>
          )}
        </div>
      </div>

      {/* Project Content */}
      <div className="project-content">
        <div style={{ marginBottom: 'var(--space-3)' }}>
          <p className="project-role">{project.role || "Project"}</p>
          <h3>{title}</h3>
          <p style={{ fontSize: '0.85rem', opacity: 0.7, lineHeight: 1.4, marginBottom: 'var(--space-4)' }}>
            {subtitle.length > 80 ? subtitle.substring(0, 80) + "..." : subtitle}
          </p>
        </div>

        {/* Tech Stack Badges */}
        <div className="tech-badges">
          {techStack.slice(0, 3).map((tech, idx) => (
            <span key={idx} className="tech-badge">
              {tech}
            </span>
          ))}
          {techStack.length > 3 && (
            <span className="tech-badge">+{techStack.length - 3}</span>
          )}
        </div>

        {/* Actions Container */}
        <div className="project-actions">
          <button 
            className="btn btn-primary" 
            style={{ width: '100%', fontSize: '0.8rem', padding: '8px 0' }}
            onClick={(e) => {
              e.stopPropagation();
              onClick();
            }}
          >
            Detail Proyek
          </button>

          {/* Quick Links Row */}
          <div className="project-quick-links" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', width: '100%' }}>
            {primaryCTAs.map(link => {
              const valid = isValidUrl(link.url);
              if (valid) {
                return (
                  <a 
                    key={link.key}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="quick-link-btn-card"
                    title={link.label}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <span style={{ fontSize: '0.95rem' }}>{link.icon}</span>
                    <span className="quick-link-text">{link.label}</span>
                  </a>
                );
              } else {
                return (
                  <div 
                    key={link.key}
                    className="quick-link-btn-card-disabled"
                    title={`${link.label} - Coming Soon`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <span style={{ fontSize: '0.95rem' }}>{link.icon}</span>
                    <span className="quick-link-text">{link.label} — Soon</span>
                  </div>
                );
              }
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectCard;
