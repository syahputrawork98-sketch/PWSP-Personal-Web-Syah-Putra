import React, { useState, useEffect } from 'react';

const ProjectForm = ({ initialData, onSubmit, onCancel, loading }) => {
  const [activeTab, setActiveTab] = useState('EN'); // EN, ID, JA
  const [prevEnTitle, setPrevEnTitle] = useState('');
  const [validationError, setValidationError] = useState('');

  const [sharedData, setSharedData] = useState({
    slug: '',
    imageUrl: '',
    techStack: '',
    githubUrl: '',
    liveUrl: '',
    figmaUrl: '',
    featured: false,
    status: 'DRAFT',
    order: 0,
    projectType: '',
    clientName: '',
    projectStatus: '',
  });

  const [translationsData, setTranslationsData] = useState({
    EN: { title: '', shortDescription: '', description: '', role: '', projectContext: '', problem: '', solution: '', keyFeatures: '', responsibilities: '', outcomes: '' },
    ID: { title: '', shortDescription: '', description: '', role: '', projectContext: '', problem: '', solution: '', keyFeatures: '', responsibilities: '', outcomes: '' },
    JA: { title: '', shortDescription: '', description: '', role: '', projectContext: '', problem: '', solution: '', keyFeatures: '', responsibilities: '', outcomes: '' }
  });

  useEffect(() => {
    if (initialData) {
      setSharedData({
        slug: initialData.slug || '',
        imageUrl: initialData.imageUrl || '',
        techStack: initialData.techStack ? initialData.techStack.join(', ') : '',
        githubUrl: initialData.githubUrl || '',
        liveUrl: initialData.liveUrl || '',
        figmaUrl: initialData.figmaUrl || '',
        featured: initialData.featured || false,
        status: initialData.status || 'DRAFT',
        order: initialData.order !== undefined ? initialData.order : 0,
        projectType: initialData.projectType || '',
        clientName: initialData.clientName || '',
        projectStatus: initialData.projectStatus || '',
      });

      const defaultTrans = {
        EN: { title: '', shortDescription: '', description: '', role: '', projectContext: '', problem: '', solution: '', keyFeatures: '', responsibilities: '', outcomes: '' },
        ID: { title: '', shortDescription: '', description: '', role: '', projectContext: '', problem: '', solution: '', keyFeatures: '', responsibilities: '', outcomes: '' },
        JA: { title: '', shortDescription: '', description: '', role: '', projectContext: '', problem: '', solution: '', keyFeatures: '', responsibilities: '', outcomes: '' }
      };

      if (initialData.translations && Array.isArray(initialData.translations)) {
        initialData.translations.forEach(t => {
          if (defaultTrans[t.locale]) {
            defaultTrans[t.locale] = {
              title: t.title || '',
              shortDescription: t.shortDescription || '',
              description: t.description || '',
              role: t.role || '',
              projectContext: t.projectContext || '',
              problem: t.problem || '',
              solution: t.solution || '',
              keyFeatures: Array.isArray(t.keyFeatures) ? t.keyFeatures.join('\n') : (t.keyFeatures || ''),
              responsibilities: Array.isArray(t.responsibilities) ? t.responsibilities.join('\n') : (t.responsibilities || ''),
              outcomes: Array.isArray(t.outcomes) ? t.outcomes.join('\n') : (t.outcomes || ''),
            };
          }
        });
      } else {
        // Fallback to legacy flat fields for EN
        defaultTrans.EN = {
          title: initialData.title || '',
          shortDescription: initialData.shortDescription || '',
          description: initialData.description || '',
          role: initialData.role || '',
          projectContext: initialData.projectContext || '',
          problem: initialData.problem || '',
          solution: initialData.solution || '',
          keyFeatures: Array.isArray(initialData.keyFeatures) ? initialData.keyFeatures.join('\n') : (initialData.keyFeatures || ''),
          responsibilities: Array.isArray(initialData.responsibilities) ? initialData.responsibilities.join('\n') : (initialData.responsibilities || ''),
          outcomes: Array.isArray(initialData.outcomes) ? initialData.outcomes.join('\n') : (initialData.outcomes || ''),
        };
      }

      setTranslationsData(defaultTrans);
      if (defaultTrans.EN.title) {
        setPrevEnTitle(defaultTrans.EN.title);
      }
    }
  }, [initialData]);

  const handleSharedChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSharedData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleTranslationChange = (e, lang) => {
    const { name, value } = e.target;
    setTranslationsData(prev => ({
      ...prev,
      [lang]: {
        ...prev[lang],
        [name]: value
      }
    }));

    if (lang === 'EN' && (name === 'title' || name === 'shortDescription') && value.trim()) {
      setValidationError('');
    }

    if (lang === 'EN' && name === 'title') {
      const currentEnTitle = value;
      const expectedOldSlug = prevEnTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      const newGeneratedSlug = currentEnTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      
      setSharedData(prev => {
        if (!prev.slug || prev.slug === expectedOldSlug) {
          return { ...prev, slug: newGeneratedSlug };
        }
        return prev;
      });
      setPrevEnTitle(currentEnTitle);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setValidationError('');

    const enTitle = translationsData.EN.title ? translationsData.EN.title.trim() : '';
    const enShortDesc = translationsData.EN.shortDescription ? translationsData.EN.shortDescription.trim() : '';

    if (!enTitle || !enShortDesc) {
      setValidationError('English title and short description are required because English is the default fallback language.');
      setActiveTab('EN');
      return;
    }
    
    // Process techStack string to array
    const techArray = sharedData.techStack
      ? sharedData.techStack.split(',').map(item => item.trim()).filter(item => item !== '')
      : [];

    const parseMultiline = (text) => {
      if (!text || typeof text !== 'string') return [];
      return text
        .split('\n')
        .map(line => line.trim())
        .filter(line => line !== '');
    };

    // Format all 3 translations
    const formattedTranslations = {
      EN: {
        title: translationsData.EN.title.trim(),
        shortDescription: translationsData.EN.shortDescription.trim(),
        description: translationsData.EN.description.trim() || null,
        role: translationsData.EN.role.trim() || null,
        projectContext: translationsData.EN.projectContext.trim() || null,
        problem: translationsData.EN.problem.trim() || null,
        solution: translationsData.EN.solution.trim() || null,
        keyFeatures: parseMultiline(translationsData.EN.keyFeatures),
        responsibilities: parseMultiline(translationsData.EN.responsibilities),
        outcomes: parseMultiline(translationsData.EN.outcomes)
      },
      ID: {
        title: translationsData.ID.title.trim() || '',
        shortDescription: translationsData.ID.shortDescription.trim() || '',
        description: translationsData.ID.description.trim() || '',
        role: translationsData.ID.role.trim() || '',
        projectContext: translationsData.ID.projectContext.trim() || '',
        problem: translationsData.ID.problem.trim() || '',
        solution: translationsData.ID.solution.trim() || '',
        keyFeatures: parseMultiline(translationsData.ID.keyFeatures),
        responsibilities: parseMultiline(translationsData.ID.responsibilities),
        outcomes: parseMultiline(translationsData.ID.outcomes)
      },
      JA: {
        title: translationsData.JA.title.trim() || '',
        shortDescription: translationsData.JA.shortDescription.trim() || '',
        description: translationsData.JA.description.trim() || '',
        role: translationsData.JA.role.trim() || '',
        projectContext: translationsData.JA.projectContext.trim() || '',
        problem: translationsData.JA.problem.trim() || '',
        solution: translationsData.JA.solution.trim() || '',
        keyFeatures: parseMultiline(translationsData.JA.keyFeatures),
        responsibilities: parseMultiline(translationsData.JA.responsibilities),
        outcomes: parseMultiline(translationsData.JA.outcomes)
      }
    };

    const submissionData = {
      slug: sharedData.slug.trim(),
      imageUrl: sharedData.imageUrl.trim() || null,
      techStack: techArray,
      githubUrl: sharedData.githubUrl.trim() || null,
      liveUrl: sharedData.liveUrl.trim() || null,
      figmaUrl: sharedData.figmaUrl.trim() || null,
      featured: sharedData.featured,
      status: sharedData.status,
      order: parseInt(sharedData.order) || 0,
      projectType: sharedData.projectType || null,
      clientName: sharedData.clientName.trim() || null,
      projectStatus: sharedData.projectStatus || null,
      
      // Legacy flat support (populated from EN translation values)
      title: formattedTranslations.EN.title,
      shortDescription: formattedTranslations.EN.shortDescription,
      description: formattedTranslations.EN.description,
      role: formattedTranslations.EN.role,
      projectContext: formattedTranslations.EN.projectContext,
      problem: formattedTranslations.EN.problem,
      solution: formattedTranslations.EN.solution,
      keyFeatures: formattedTranslations.EN.keyFeatures,
      responsibilities: formattedTranslations.EN.responsibilities,
      outcomes: formattedTranslations.EN.outcomes,

      // New translations payload
      translations: formattedTranslations
    };

    onSubmit(submissionData);
  };

  return (
    <form onSubmit={handleSubmit} className="card" style={{ padding: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      
      <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary-color)', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px', marginBottom: '8px' }}>
        Shared Metadata (Common for all languages)
      </h3>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-4)' }}>
        <div className="form-group">
          <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontWeight: 600 }}>Slug *</label>
          <input 
            name="slug"
            value={sharedData.slug}
            onChange={handleSharedChange}
            required
            placeholder="e.g. my-project-slug"
            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-color)', boxSizing: 'border-box' }}
          />
        </div>

        <div className="form-group">
          <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontWeight: 600 }}>Project Type</label>
          <select 
            name="projectType"
            value={sharedData.projectType}
            onChange={handleSharedChange}
            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-color)', boxSizing: 'border-box' }}
          >
            <option value="">None (Optional)</option>
            <option value="CLIENT_WORK">Client Work</option>
            <option value="FREELANCE">Freelance</option>
            <option value="CASE_STUDY">Case Study</option>
            <option value="LEARNING_PROJECT">Learning Project</option>
            <option value="INTERNAL">Internal</option>
          </select>
        </div>

        <div className="form-group">
          <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontWeight: 600 }}>Work Status</label>
          <select 
            name="projectStatus"
            value={sharedData.projectStatus}
            onChange={handleSharedChange}
            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-color)', boxSizing: 'border-box' }}
          >
            <option value="">None (Optional)</option>
            <option value="COMPLETED">Completed</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="MAINTENANCE">Maintenance</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-4)' }}>
        <div className="form-group">
          <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontWeight: 600 }}>Client Name</label>
          <input 
            name="clientName"
            value={sharedData.clientName}
            onChange={handleSharedChange}
            placeholder="e.g. Acme Corp (Optional)"
            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-color)', boxSizing: 'border-box' }}
          />
        </div>

        <div className="form-group">
          <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontWeight: 600 }}>Image URL</label>
          <input 
            name="imageUrl"
            value={sharedData.imageUrl}
            onChange={handleSharedChange}
            placeholder="https://..."
            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-color)', boxSizing: 'border-box' }}
          />
        </div>

        <div className="form-group">
          <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontWeight: 600 }}>Order Index</label>
          <input 
            name="order"
            type="number"
            value={sharedData.order}
            onChange={handleSharedChange}
            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-color)', boxSizing: 'border-box' }}
          />
        </div>
      </div>

      <div className="form-group">
        <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontWeight: 600 }}>Tech Stack (comma separated)</label>
        <input 
          name="techStack"
          value={sharedData.techStack}
          onChange={handleSharedChange}
          placeholder="e.g. React, Node.js, Prisma"
          style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-color)', boxSizing: 'border-box' }}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-4)' }}>
        <div className="form-group">
          <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontWeight: 600 }}>GitHub URL</label>
          <input 
            name="githubUrl"
            value={sharedData.githubUrl}
            onChange={handleSharedChange}
            placeholder="https://github.com/..."
            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-color)', boxSizing: 'border-box' }}
          />
        </div>
        <div className="form-group">
          <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontWeight: 600 }}>Live Demo URL</label>
          <input 
            name="liveUrl"
            value={sharedData.liveUrl}
            onChange={handleSharedChange}
            placeholder="https://..."
            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-color)', boxSizing: 'border-box' }}
          />
        </div>
        <div className="form-group">
          <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontWeight: 600 }}>Figma URL</label>
          <input 
            name="figmaUrl"
            value={sharedData.figmaUrl}
            onChange={handleSharedChange}
            placeholder="https://figma.com/..."
            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-color)', boxSizing: 'border-box' }}
          />
        </div>
      </div>

      <div style={{ display: 'flex', gap: 'var(--space-6)', alignItems: 'center', marginBottom: '12px' }}>
        <div className="form-group">
          <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontWeight: 600 }}>Status</label>
          <select 
            name="status"
            value={sharedData.status}
            onChange={handleSharedChange}
            style={{ padding: '10px', borderRadius: '4px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-color)' }}
          >
            <option value="DRAFT">DRAFT</option>
            <option value="PUBLISHED">PUBLISHED</option>
          </select>
        </div>
        <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginTop: '24px' }}>
          <input 
            type="checkbox"
            id="featured"
            name="featured"
            checked={sharedData.featured}
            onChange={handleSharedChange}
          />
          <label htmlFor="featured" style={{ fontWeight: 600 }}>Featured Project</label>
        </div>
      </div>

      <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary-color)', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px', marginTop: '12px' }}>
        Localization Settings (Translatable Content)
      </h3>

      {validationError && (
        <div style={{ backgroundColor: '#fee2e2', color: '#dc2626', padding: '10px 16px', borderRadius: '4px', border: '1px solid #fca5a5', fontWeight: 600, fontSize: '0.9rem', marginBottom: '12px' }}>
          ⚠️ {validationError}
        </div>
      )}

      {/* Translations Tab Navigation */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '2px solid var(--border-color)', paddingBottom: '8px', marginBottom: '8px' }}>
        {['EN', 'ID', 'JA'].map(lang => (
          <button
            key={lang}
            type="button"
            onClick={() => setActiveTab(lang)}
            style={{
              padding: '8px 16px',
              borderRadius: '4px',
              border: '1px solid ' + (activeTab === lang ? 'var(--primary-color)' : 'var(--border-color)'),
              backgroundColor: activeTab === lang ? 'var(--primary-color)' : 'var(--surface-color)',
              color: activeTab === lang ? '#ffffff' : 'var(--text-color)',
              fontWeight: 'bold',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            {lang === 'EN' && <span>🇬🇧 English (Required)</span>}
            {lang === 'ID' && <span>🇮🇩 Indonesia (Optional)</span>}
            {lang === 'JA' && <span>🇯🇵 Japanese (Optional)</span>}
          </button>
        ))}
      </div>

      <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '12px', fontStyle: 'italic' }}>
        💡 English content is required and serves as the default fallback. Indonesian and Japanese translations are optional.
      </div>

      {/* Translations Inputs for the Active Tab */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        <div className="form-group">
          <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontWeight: 600 }}>
            Title {activeTab === 'EN' ? '*' : '(Optional)'}
          </label>
          <input 
            name="title"
            value={translationsData[activeTab].title}
            onChange={(e) => handleTranslationChange(e, activeTab)}
            required={activeTab === 'EN'}
            placeholder={`Project Title in ${activeTab === 'EN' ? 'English' : activeTab === 'ID' ? 'Indonesian' : 'Japanese'}`}
            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-color)', boxSizing: 'border-box' }}
          />
        </div>

        <div className="form-group">
          <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontWeight: 600 }}>
            Short Description {activeTab === 'EN' ? '*' : '(Optional)'}
          </label>
          <textarea 
            name="shortDescription"
            value={translationsData[activeTab].shortDescription}
            onChange={(e) => handleTranslationChange(e, activeTab)}
            required={activeTab === 'EN'}
            rows="2"
            placeholder={`Brief elevator pitch/summary in ${activeTab === 'EN' ? 'English' : activeTab === 'ID' ? 'Indonesian' : 'Japanese'}`}
            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-color)', boxSizing: 'border-box' }}
          />
        </div>

        <div className="form-group">
          <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontWeight: 600 }}>Full Description</label>
          <textarea 
            name="description"
            value={translationsData[activeTab].description}
            onChange={(e) => handleTranslationChange(e, activeTab)}
            rows="4"
            placeholder={`Detailed descriptions in ${activeTab === 'EN' ? 'English' : activeTab === 'ID' ? 'Indonesian' : 'Japanese'}`}
            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-color)', boxSizing: 'border-box' }}
          />
        </div>

        <div className="form-group">
          <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontWeight: 600 }}>Role / Role Title</label>
          <input 
            name="role"
            value={translationsData[activeTab].role}
            onChange={(e) => handleTranslationChange(e, activeTab)}
            placeholder="e.g. Lead Architect, Full Stack Developer"
            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-color)', boxSizing: 'border-box' }}
          />
        </div>

        <div className="form-group">
          <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontWeight: 600 }}>Project Context</label>
          <textarea 
            name="projectContext"
            value={translationsData[activeTab].projectContext}
            onChange={(e) => handleTranslationChange(e, activeTab)}
            placeholder="Background, scope, context and duration summary..."
            rows="3"
            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-color)', boxSizing: 'border-box' }}
          />
        </div>

        <div className="form-group">
          <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontWeight: 600 }}>The Problem</label>
          <textarea 
            name="problem"
            value={translationsData[activeTab].problem}
            onChange={(e) => handleTranslationChange(e, activeTab)}
            placeholder="Challenges faced, issues to resolve, bottlenecks..."
            rows="3"
            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-color)', boxSizing: 'border-box' }}
          />
        </div>

        <div className="form-group">
          <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontWeight: 600 }}>The Solution</label>
          <textarea 
            name="solution"
            value={translationsData[activeTab].solution}
            onChange={(e) => handleTranslationChange(e, activeTab)}
            placeholder="Technical decisions, implementation details, resolutions..."
            rows="3"
            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-color)', boxSizing: 'border-box' }}
          />
        </div>

        <div className="form-group">
          <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontWeight: 600 }}>Key Features (one per line)</label>
          <textarea 
            name="keyFeatures"
            value={translationsData[activeTab].keyFeatures}
            onChange={(e) => handleTranslationChange(e, activeTab)}
            placeholder="e.g.&#10;Real-time dashboard&#10;OAuth Google integration"
            rows="4"
            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-color)', boxSizing: 'border-box' }}
          />
        </div>

        <div className="form-group">
          <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontWeight: 600 }}>Key Responsibilities (one per line)</label>
          <textarea 
            name="responsibilities"
            value={translationsData[activeTab].responsibilities}
            onChange={(e) => handleTranslationChange(e, activeTab)}
            placeholder="e.g.&#10;Designing postgresql relational schema&#10;Deploying client container on Vercel"
            rows="4"
            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-color)', boxSizing: 'border-box' }}
          />
        </div>

        <div className="form-group">
          <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontWeight: 600 }}>Outcomes & Impact (one per line)</label>
          <textarea 
            name="outcomes"
            value={translationsData[activeTab].outcomes}
            onChange={(e) => handleTranslationChange(e, activeTab)}
            placeholder="e.g.&#10;Increased user engagement by 20%&#10;Reduced load time by 300ms"
            rows="4"
            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-color)', boxSizing: 'border-box' }}
          />
        </div>
      </div>

      <div style={{ display: 'flex', gap: 'var(--space-4)', marginTop: 'var(--space-6)' }}>
        <button type="submit" className="btn btn-primary" disabled={loading} style={{ flex: 1 }}>
          {loading ? 'Saving...' : 'Save Project'}
        </button>
        <button type="button" onClick={onCancel} className="btn btn-secondary">
          Cancel
        </button>
      </div>
    </form>
  );
};

export default ProjectForm;
