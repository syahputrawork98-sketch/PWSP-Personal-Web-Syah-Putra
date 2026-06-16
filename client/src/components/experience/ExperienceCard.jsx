import React from 'react';
import { motion } from 'framer-motion';

const ExperienceCard = ({ exp, displayDate, variants, locale }) => {
  const getBorderColor = () => {
    switch (exp.experienceKind) {
      case 'IT_FREELANCE':
        return '#6366f1';
      case 'GENERAL_FREELANCE':
        return '#f59e0b';
      case 'FORMAL_WORK':
      default:
        return '#22c55e';
    }
  };

  const getRelevanceValue = (role, loc) => {
    const roleLower = (role || '').toLowerCase();
    
    if (roleLower.includes('developer') || roleLower.includes('web') || roleLower.includes('full stack')) {
      if (loc === 'ID') return 'Mengembangkan aplikasi web secara end-to-end dengan integrasi database & REST API.';
      if (loc === 'JA') return 'データベースとREST APIを統合した、エンドツーエンドのWebアプリ開発実績。';
      return 'End-to-end web application development with database and REST API integration.';
    }
    
    if (roleLower.includes('support') || roleLower.includes('it') || roleLower.includes('administrator')) {
      if (loc === 'ID') return 'Menunjukkan pemeliharaan server database, konfigurasi jaringan, dan administrasi sistem internal.';
      if (loc === 'JA') return 'データベースサーバー保守、ネットワーク設定、および内部システム管理の実績。';
      return 'Database server maintenance, network configuration, and internal system administration.';
    }
    
    // Fallback for business/operational roles (General Staff, Assistant, Estimator, GA)
    if (loc === 'ID') return 'Memberikan pemahaman alur bisnis operasional (RAB, logistik, pelaporan) untuk merancang dashboard.';
    if (loc === 'JA') return 'ダッシュボード設計のためのビジネス業務フロー（予算、物流、レポート）の深い理解。';
    return 'Understanding operational workflows (RAB, logistics, reporting) to design admin dashboards.';
  };

  return (
    <motion.div 
      className="card experience-card"
      variants={variants}
      whileHover={{ x: 10, transition: { duration: 0.2 } }}
      style={{ borderLeftColor: getBorderColor() }}
    >
      <div className="experience-header">
        <h3 style={{ marginBottom: 0 }}>{exp.role}</h3>
        <span className="experience-date">
          {displayDate}
        </span>
      </div>
      <div style={{ display: 'flex', gap: 'var(--space-2)', fontSize: '0.9rem', opacity: 0.8, marginBottom: 'var(--space-2)' }}>
        <p className="experience-company" style={{ margin: 0, fontWeight: 600 }}>{exp.company}</p>
        {exp.location && <span>• {exp.location}</span>}
        {exp.type && <span>• {exp.type}</span>}
      </div>
      <p className="experience-desc" style={{ marginBottom: exp.highlights?.length > 0 ? 'var(--space-3)' : 0 }}>{exp.description}</p>
      
      {exp.highlights && exp.highlights.length > 0 && (
        <ul style={{ fontSize: '0.9rem', opacity: 0.9, paddingLeft: '1.2rem', marginBottom: 'var(--space-4)' }}>
          {exp.highlights.map((h, i) => <li key={i}>{h}</li>)}
        </ul>
      )}

      {/* Dynamic Full Stack Relevance Box */}
      <div className="experience-relevance-box">
        <span className="experience-relevance-tag">
          💡 {locale === 'ID' ? 'Relevansi Full Stack' : locale === 'JA' ? 'フルスタックの関連性' : 'Full Stack Relevance'}:
        </span>{' '}
        <span className="experience-relevance-text">
          {getRelevanceValue(exp.role, locale)}
        </span>
      </div>

      {exp.techStack && exp.techStack.length > 0 && (
        <div className="tech-badges" style={{ marginTop: 'auto' }}>
          {exp.techStack.map((tech, idx) => (
            <span key={idx} className="tech-badge" style={{ fontSize: '0.7rem' }}>{tech}</span>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default ExperienceCard;

