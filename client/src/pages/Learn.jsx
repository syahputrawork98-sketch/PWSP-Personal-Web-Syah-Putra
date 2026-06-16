import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import EmptyState from '../components/EmptyState';
import { getPublicLearningItems } from '../lib/api';
import { useLanguage } from '../context/LanguageContext';

const learningCategories = [
  "All",
  "Programming Languages",
  "Frontend",
  "Backend",
  "Database & Data",
  "DevOps & Deployment",
  "Tools & Workflow"
];

const staticLearningItems = [
  {
    id: 1,
    title: "JavaScript Fundamentals",
    category: "Programming Languages",
    status: "In Progress",
    level: "Beginner to Intermediate",
    topics: ["ES6", "DOM", "Array Methods", "Async JavaScript"],
    repoUrl: "#",
    description: "Deep dive into core JavaScript concepts to build a strong foundation for modern web development."
  },
  {
    id: 2,
    title: "TypeScript Fundamentals",
    category: "Programming Languages",
    status: "Learning",
    level: "Beginner",
    topics: ["Types", "Interfaces", "Generics", "React TypeScript"],
    repoUrl: "#",
    description: "Introduction to statically typed JavaScript with TypeScript to improve code quality and developer experience."
  },
  {
    id: 3,
    title: "React Practice",
    category: "Frontend",
    status: "In Progress",
    level: "Beginner to Intermediate",
    topics: ["Components", "Props", "State", "Hooks", "Routing"],
    repoUrl: "#",
    description: "Practical exercises and mini-projects to master React ecosystem and component-driven UI development."
  },
  {
    id: 4,
    title: "Node.js API Basics",
    category: "Backend",
    status: "Planned",
    level: "Beginner",
    topics: ["Express", "REST API", "Middleware", "Auth Basics"],
    repoUrl: "#",
    description: "Learning server-side JavaScript using Node.js and Express to build robust RESTful APIs."
  },
  {
    id: 5,
    title: "PostgreSQL & Prisma Notes",
    category: "Database & Data",
    status: "Planned",
    level: "Beginner",
    topics: ["Schema", "Relations", "Migration", "Seed Data"],
    repoUrl: "#",
    description: "Relational database concepts and modern ORM practices using PostgreSQL and Prisma."
  },
  {
    id: 6,
    title: "Git & GitHub Workflow",
    category: "Tools & Workflow",
    status: "In Progress",
    level: "Beginner to Intermediate",
    topics: ["Git Commit", "Branching", "Pull Request", "Documentation"],
    repoUrl: "#",
    description: "Version control best practices, collaborative workflows, and repository management."
  }
];

const Learn = () => {
  const { t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState("All");
  const [learningItems, setLearningItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usingFallback, setUsingFallback] = useState(false);

  const getCategoryLabel = (cat) => {
    switch (cat) {
      case 'All': return t('learn.categories.all');
      case 'Programming Languages': return t('learn.categories.programming');
      case 'Frontend': return t('learn.categories.frontend');
      case 'Backend': return t('learn.categories.backend');
      case 'Database & Data': return t('learn.categories.database');
      case 'DevOps & Deployment': return t('learn.categories.devops');
      case 'Tools & Workflow': return t('learn.categories.tools');
      default: return cat;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getPublicLearningItems();
        if (data && data.learningItems) {
          setLearningItems(data.learningItems);
          setUsingFallback(false);
        } else {
          setLearningItems([]);
        }
      } catch (err) {
        console.error("Failed to fetch learning items:", err);
        setLearningItems(staticLearningItems);
        setUsingFallback(true);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const formatStatus = (status) => {
    if (!status) return t('learn.status.unknown');
    switch (status) {
      case 'PLANNED': return t('learn.status.planned');
      case 'LEARNING': return t('learn.status.learning');
      case 'IN_PROGRESS': return t('learn.status.inProgress');
      case 'COMPLETED': return t('learn.status.completed');
      case 'ARCHIVED': return t('learn.status.archived');
      default: return status;
    }
  };

  const getStatusColor = (status) => {
    if (status === 'COMPLETED') return '#10b981';
    if (status === 'PLANNED' || status === 'ARCHIVED') return '#9ca3af';
    return '#f59e0b';
  };

  const filteredItems = activeCategory === "All"
    ? learningItems
    : learningItems.filter(item => item.category === activeCategory);

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

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <section id="learn" className="section-padding">
      <div className="container">
        <motion.div 
          style={{ textAlign: 'center', marginBottom: 'var(--space-12)' }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-center" style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>
            {t('learn.title')}
          </h2>
          <div style={{ width: '60px', height: '4px', background: 'var(--primary-color)', margin: 'var(--space-4) auto', borderRadius: 'var(--radius-full)' }} />
          <p style={{ maxWidth: '650px', margin: '0 auto', opacity: 0.8, fontSize: '1.1rem', lineHeight: 1.6 }}>
            {t('learn.description')}
          </p>
          {usingFallback && (
            <p style={{ fontSize: '0.85rem', color: '#f59e0b', marginTop: '1rem' }}>
              {t('learn.offlineFallback')}
            </p>
          )}
        </motion.div>

        {/* Category Tabs */}
        <div className="filter-container">
          {learningCategories.map(cat => (
            <button
              key={cat}
              className={`filter-btn ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {getCategoryLabel(cat)}
            </button>
          ))}
        </div>

        {/* Grid */}
        {loading ? (
          <div style={{ padding: 'var(--space-12) 0', textAlign: 'center', opacity: 0.7 }}>
            {t('learn.loading')}
          </div>
        ) : filteredItems.length > 0 ? (
          <motion.div 
            style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
              gap: 'var(--space-8)'
            }}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {filteredItems.map((item) => {
              const itemTopics = Array.isArray(item.topics) ? item.topics : [];
              const hasRepo = item.repoUrl && item.repoUrl !== '#';
              
              return (
                <motion.div 
                  key={item.id} 
                  className="card" 
                  variants={cardVariants}
                  style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: 'var(--space-6)' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-3)' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, padding: '4px 8px', borderRadius: '4px', backgroundColor: 'var(--primary-color)', color: 'white', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      {getCategoryLabel(item.category)}
                    </span>
                    <span style={{ fontSize: '0.8rem', opacity: 0.7, fontWeight: 500, display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span style={{ 
                        width: '8px', 
                        height: '8px', 
                        borderRadius: '50%', 
                        backgroundColor: getStatusColor(item.status)
                      }}></span>
                      {formatStatus(item.status)}
                    </span>
                  </div>
                  
                  <h3 style={{ margin: '0 0 var(--space-2) 0', fontSize: '1.25rem', lineHeight: 1.4 }}>{item.title}</h3>
                  
                  <div style={{ fontSize: '0.85rem', opacity: 0.8, marginBottom: 'var(--space-4)', fontWeight: 500 }}>
                    {t('learn.level')}: {item.level || '-'}
                  </div>
                  
                  <p style={{ opacity: 0.8, fontSize: '0.95rem', lineHeight: 1.6, marginBottom: 'var(--space-6)', flexGrow: 1 }}>
                    {item.description}
                  </p>

                  {itemTopics.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: 'var(--space-6)' }}>
                      {itemTopics.map(topic => (
                        <span key={topic} style={{ fontSize: '0.75rem', padding: '4px 10px', backgroundColor: 'var(--bg-color)', border: '1px solid var(--border-color)', borderRadius: '16px', opacity: 0.8 }}>
                          {topic}
                        </span>
                      ))}
                    </div>
                  )}

                  <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <a 
                      href={hasRepo ? item.repoUrl : undefined} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className={`btn ${!hasRepo ? 'btn-secondary' : 'btn-primary'}`}
                      style={{ width: '100%', textAlign: 'center', pointerEvents: !hasRepo ? 'none' : 'auto', opacity: !hasRepo ? 0.6 : 1 }}
                    >
                      {!hasRepo ? t('learn.repoComingSoon') : t('learn.viewRepo')}
                    </a>
                    {item.notesUrl && (
                      <a 
                        href={item.notesUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="btn btn-secondary"
                        style={{ width: '100%', textAlign: 'center' }}
                      >
                        {t('learn.viewNotes')}
                      </a>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        ) : (
          <div style={{ padding: 'var(--space-12) 0' }}>
            <EmptyState message={t('learn.emptyCategory').replace('{category}', getCategoryLabel(activeCategory))} />
          </div>
        )}
      </div>
    </section>
  );
};

export default Learn;
