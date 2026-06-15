import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ProjectDetailModal = ({ isOpen, onClose, project }) => {
  if (!project) return null;

  const links = project.links || {};
  const techStack = project.techStack || project.technologies || [];

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

  const primaryCTAs = [
    { key: 'demo', label: 'Demo', icon: '🌐', url: links.demo || project.demoUrl || project.demo || project.liveUrl },
    { key: 'github', label: 'GitHub', icon: '💻', url: links.github || project.githubUrl || project.github },
    { key: 'figma', label: 'Figma', icon: '🎨', url: links.figma || project.figmaUrl || project.figma },
  ];

  const secondaryLinks = [
    { key: 'drive', label: 'Google Drive', icon: '📂', url: links.drive || links.googleDrive },
    { key: 'rab', label: 'RAB / Estimasi', icon: '📊', url: links.rab },
    { key: 'model', label: 'Model Preview', icon: '🏗️', url: links.model || links.modelPreview },
  ].filter(tile => isValidUrl(tile.url));


  return (
    <AnimatePresence>
      {isOpen && (
        <div className="project-modal-overlay" onClick={onClose}>
          <motion.div 
            className="project-modal-content"
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 30 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: 'var(--bg-color)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-xl)',
              overflowY: 'auto'
            }}
          >
            <button 
              className="project-modal-close"
              onClick={onClose}
              aria-label="Tutup detail proyek"
            >
              &times;
            </button>

            {/* Header Banner */}
            <div style={{ width: '100%', height: '280px', overflow: 'hidden', position: 'relative', background: 'linear-gradient(135deg, rgba(var(--primary-color-rgb), 0.12) 0%, rgba(129, 140, 248, 0.12) 100%)' }}>
              {project.imageUrl && !project.imageUrl.includes('placeholder') ? (
                <img 
                  src={project.imageUrl} 
                  alt={project.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', width: '100%' }}>
                  <span style={{ fontSize: '4.5rem', filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.15))' }}>
                    {project.category === 'IT & Web' ? '💻' : project.category === 'Model Mesin 3D' ? '🏗️' : '⚙️'}
                  </span>
                </div>
              )}
              <div style={{ 
                position: 'absolute', 
                bottom: 0, left: 0, right: 0, 
                height: '60%', 
                background: 'linear-gradient(to top, var(--bg-color), transparent)',
                zIndex: 1
              }} />
            </div>

            <div style={{ padding: '0 var(--space-8) var(--space-8)', marginTop: '-var(--space-10)', position: 'relative', zIndex: 2 }}>
              {/* Title Section */}
              <div style={{ marginBottom: 'var(--space-6)' }}>
                <span className="category-badge" style={{ 
                  marginBottom: 'var(--space-3)', 
                  display: 'inline-block',
                  background: 'rgba(var(--primary-color-rgb), 0.1)',
                  color: 'var(--primary-color)',
                  border: '1px solid rgba(var(--primary-color-rgb), 0.2)',
                  padding: '4px 12px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.7rem',
                  fontWeight: '800',
                  textTransform: 'uppercase',
                  letterSpacing: '0.8px'
                }}>
                  {project.category}
                </span>
                <div style={{ 
                  fontSize: '2.25rem', 
                  fontWeight: 800, 
                  color: 'var(--text-primary)', 
                  marginBottom: 'var(--space-2)',
                  lineHeight: 1.2,
                  fontFamily: 'var(--font-heading)'
                }}>
                  {project.title}
                </div>
                {project.subtitle && (
                  <p style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', fontWeight: 500, margin: 0 }}>
                    {project.subtitle}
                  </p>
                )}
              </div>

              {/* Main Content Layout Grid */}
              <div className="project-modal-grid-container" style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 'var(--space-8)' }}>
                
                {/* Left Column: Summary & Features & Challenges */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
                  <div>
                    <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--primary-color)', marginBottom: 'var(--space-3)', fontWeight: 700 }}>
                      Ringkasan Proyek
                    </h4>
                    <p style={{ lineHeight: 1.75, opacity: 0.95, fontSize: '1rem', color: 'var(--text-primary)', margin: 0 }}>
                      {project.description || 'Detail deskripsi proyek belum tersedia.'}
                    </p>
                  </div>

                  {project.features && project.features.length > 0 && (
                    <div>
                      <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--primary-color)', marginBottom: 'var(--space-3)', fontWeight: 700 }}>
                        Fitur Utama
                      </h4>
                      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                        {project.features.map((feature, i) => (
                          <li key={i} style={{ fontSize: '0.95rem', display: 'flex', alignItems: 'flex-start', gap: '10px', lineHeight: 1.5, color: 'var(--text-primary)' }}>
                            <span style={{ color: 'var(--primary-color)', fontWeight: 'bold' }}>✓</span>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {(project.challenge || project.solution) && (
                    <div style={{ 
                      padding: 'var(--space-5)', 
                      background: 'rgba(var(--primary-color-rgb), 0.03)', 
                      borderRadius: 'var(--radius-lg)', 
                      border: '1px solid var(--border-color)', 
                      display: 'flex', 
                      flexDirection: 'column', 
                      gap: 'var(--space-4)' 
                    }}>
                      {project.challenge && (
                        <div>
                          <h5 style={{ fontSize: '0.85rem', fontWeight: 700, margin: '0 0 var(--space-1)', color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Tantangan</h5>
                          <p style={{ fontSize: '0.9rem', lineHeight: 1.6, opacity: 0.85, margin: 0, color: 'var(--text-primary)' }}>{project.challenge}</p>
                        </div>
                      )}
                      {project.solution && (
                        <div>
                          <h5 style={{ fontSize: '0.85rem', fontWeight: 700, margin: '0 0 var(--space-1)', color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Solusi</h5>
                          <p style={{ fontSize: '0.9rem', lineHeight: 1.6, opacity: 0.85, margin: 0, color: 'var(--text-primary)' }}>{project.solution}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Right Column: Meta Details, Tech, Links */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
                  
                  {/* Metadata Card */}
                  <div style={{ background: 'var(--surface-color)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-5)', backdropFilter: 'var(--glass-blur)' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                      <div>
                        <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-secondary)', display: 'block', marginBottom: '2px' }}>Peran</span>
                        <span style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)' }}>{project.role || 'Contributor'}</span>
                      </div>
                      <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: 'var(--space-3)' }}>
                        <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-secondary)', display: 'block', marginBottom: '2px' }}>Status</span>
                        <span style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--primary-color)' }}>{project.status || 'Completed'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Tech stack */}
                  <div>
                    <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--text-secondary)', marginBottom: 'var(--space-3)', fontWeight: 700 }}>
                      Teknologi & Tools
                    </h4>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {techStack.map((tech, i) => (
                        <span key={i} className="tech-badge" style={{ fontSize: '0.72rem', padding: '4px 10px', borderRadius: 'var(--radius-sm)', margin: 0 }}>
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Related Links */}
                  <div>
                    <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--text-secondary)', marginBottom: 'var(--space-3)', fontWeight: 700 }}>
                      Tautan & Aset
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {/* Primary CTAs */}
                      {primaryCTAs.map(tile => {
                        const valid = isValidUrl(tile.url);
                        if (valid) {
                          return (
                            <a 
                              key={tile.key}
                              href={tile.url.trim()}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="modal-link-item"
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                padding: '12px 16px',
                                background: 'var(--surface-color)',
                                border: '1px solid var(--border-color)',
                                borderRadius: 'var(--radius-md)',
                                textDecoration: 'none',
                                color: 'var(--text-primary)',
                                gap: '12px'
                              }}
                            >
                              <span style={{ fontSize: '1.25rem' }}>{tile.icon}</span>
                              <span style={{ fontSize: '0.88rem', fontWeight: 600, flex: 1 }}>{tile.label}</span>
                              <span className="modal-link-arrow" style={{ transition: 'transform 0.2s ease', opacity: 0.8, fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary-color)' }}>Open &rarr;</span>
                            </a>
                          );
                        } else {
                          return (
                            <div 
                              key={tile.key}
                              className="modal-link-item-disabled"
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                padding: '12px 16px',
                                background: 'var(--surface-color)',
                                border: '1px solid var(--border-color)',
                                borderRadius: 'var(--radius-md)',
                                color: 'var(--text-secondary)',
                                gap: '12px',
                                opacity: 0.5,
                                cursor: 'not-allowed',
                                userSelect: 'none'
                              }}
                            >
                              <span style={{ fontSize: '1.25rem' }}>{tile.icon}</span>
                              <span style={{ fontSize: '0.88rem', fontWeight: 600, flex: 1, opacity: 0.7 }}>{tile.label}</span>
                              <span style={{ fontSize: '0.75rem', fontWeight: 600, opacity: 0.6, letterSpacing: '0.5px', textTransform: 'uppercase' }}>Coming Soon</span>
                            </div>
                          );
                        }
                      })}

                      {/* Secondary Links */}
                      {secondaryLinks.map(tile => (
                        <a 
                          key={tile.key}
                          href={tile.url.trim()}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="modal-link-item"
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            padding: '12px 16px',
                            background: 'var(--surface-color)',
                            border: '1px solid var(--border-color)',
                            borderRadius: 'var(--radius-md)',
                            textDecoration: 'none',
                            color: 'var(--text-primary)',
                            gap: '12px'
                          }}
                        >
                          <span style={{ fontSize: '1.25rem' }}>{tile.icon}</span>
                          <span style={{ fontSize: '0.88rem', fontWeight: 600, flex: 1 }}>{tile.label}</span>
                          <span className="modal-link-arrow" style={{ transition: 'transform 0.2s ease', opacity: 0.6 }}>&rarr;</span>
                        </a>
                      ))}
                    </div>
                  </div>

                </div>

              </div>

              {/* Project Impact Callout */}
              {project.impact && (
                <div style={{ 
                  marginTop: 'var(--space-8)', 
                  padding: 'var(--space-5)', 
                  background: 'rgba(var(--primary-color-rgb), 0.04)', 
                  borderRadius: 'var(--radius-lg)', 
                  border: '1px solid rgba(var(--primary-color-rgb), 0.15)',
                  textAlign: 'center' 
                }}>
                  <h4 style={{ 
                    fontSize: '0.8rem', 
                    textTransform: 'uppercase', 
                    letterSpacing: '1.5px', 
                    color: 'var(--primary-color)', 
                    marginBottom: 'var(--space-2)', 
                    fontWeight: 700, 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    gap: '6px' 
                  }}>
                    ✨ Dampak & Hasil
                  </h4>
                  <p style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>{project.impact}</p>
                </div>
              )}

            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ProjectDetailModal;
