import React, { useState, useEffect } from 'react';

const ExperienceForm = ({ initialData, onSubmit, saving }) => {
  const [sharedData, setSharedData] = useState({
    company: '',
    location: '',
    type: '',
    startDate: '',
    endDate: '',
    isCurrent: false,
    techStack: '',
    status: 'PUBLISHED',
    experienceKind: 'FORMAL_WORK',
    order: 0
  });

  const [translationsData, setTranslationsData] = useState({
    EN: { role: '', description: '', highlights: '' },
    ID: { role: '', description: '', highlights: '' },
    JA: { role: '', description: '', highlights: '' }
  });

  const [activeTab, setActiveTab] = useState('EN'); // EN, ID, JA
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    if (initialData) {
      setSharedData({
        company: initialData.company || '',
        location: initialData.location || '',
        type: initialData.type || '',
        startDate: initialData.startDate ? new Date(initialData.startDate).toISOString().split('T')[0] : '',
        endDate: initialData.endDate ? new Date(initialData.endDate).toISOString().split('T')[0] : '',
        isCurrent: initialData.isCurrent || false,
        techStack: initialData.techStack ? initialData.techStack.join(', ') : '',
        status: initialData.status || 'PUBLISHED',
        experienceKind: initialData.experienceKind || 'FORMAL_WORK',
        order: initialData.order || 0
      });

      const defaultTrans = {
        EN: { role: '', description: '', highlights: '' },
        ID: { role: '', description: '', highlights: '' },
        JA: { role: '', description: '', highlights: '' }
      };

      if (initialData.translations && Array.isArray(initialData.translations)) {
        initialData.translations.forEach(t => {
          if (defaultTrans[t.locale]) {
            defaultTrans[t.locale] = {
              role: t.role || '',
              description: t.description || '',
              highlights: Array.isArray(t.highlights) ? t.highlights.join('\n') : (t.highlights || '')
            };
          }
        });
      } else {
        // Fallback to legacy fields for EN
        defaultTrans.EN = {
          role: initialData.role || '',
          description: initialData.description || '',
          highlights: Array.isArray(initialData.highlights) ? initialData.highlights.join('\n') : (initialData.highlights || '')
        };
      }
      setTranslationsData(defaultTrans);
    }
  }, [initialData]);

  const handleSharedChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSharedData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (type === 'number' ? parseInt(value) : value)
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

    if (lang === 'EN' && name === 'role' && value.trim()) {
      setValidationError('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setValidationError('');

    const enRole = translationsData.EN.role ? translationsData.EN.role.trim() : '';

    if (!enRole) {
      setValidationError('English Role is required because English is the default fallback language.');
      setActiveTab('EN');
      return;
    }

    const parseMultiline = (text) => {
      if (!text || typeof text !== 'string') return [];
      return text
        .split('\n')
        .map(line => line.trim())
        .filter(line => line !== '');
    };

    const techArray = sharedData.techStack
      ? sharedData.techStack.split(',').map(item => item.trim()).filter(item => item !== '')
      : [];

    const submissionData = {
      company: sharedData.company,
      location: sharedData.location || null,
      type: sharedData.type || null,
      startDate: sharedData.startDate || null,
      endDate: sharedData.isCurrent ? null : (sharedData.endDate || null),
      isCurrent: sharedData.isCurrent,
      techStack: techArray,
      status: sharedData.status,
      experienceKind: sharedData.experienceKind,
      order: sharedData.order,
      // Fallback flat fields for EN
      role: enRole,
      description: translationsData.EN.description.trim() || null,
      highlights: parseMultiline(translationsData.EN.highlights),
      translations: {
        EN: {
          role: enRole,
          description: translationsData.EN.description.trim() || null,
          highlights: parseMultiline(translationsData.EN.highlights)
        },
        ID: {
          role: translationsData.ID.role.trim() || '',
          description: translationsData.ID.description.trim() || '',
          highlights: parseMultiline(translationsData.ID.highlights)
        },
        JA: {
          role: translationsData.JA.role.trim() || '',
          description: translationsData.JA.description.trim() || '',
          highlights: parseMultiline(translationsData.JA.highlights)
        }
      }
    };

    onSubmit(submissionData);
  };

  return (
    <form onSubmit={handleSubmit} className="card" style={{ padding: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      
      {/* SECTION 1: Shared Fields */}
      <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary-color)', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px', marginBottom: '8px' }}>
        Global Experience Settings (Shared Content)
      </h3>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
        <div className="form-group">
          <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontWeight: 600 }}>Company Name*</label>
          <input 
            name="company"
            required
            value={sharedData.company}
            onChange={handleSharedChange}
            placeholder="e.g. Google"
            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-color)' }}
          />
        </div>
        <div className="form-group">
          <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontWeight: 600 }}>Location</label>
          <input 
            name="location"
            value={sharedData.location}
            onChange={handleSharedChange}
            placeholder="e.g. Jakarta, Indonesia (Remote)"
            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-color)' }}
          />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
        <div className="form-group">
          <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontWeight: 600 }}>Employment Type</label>
          <input 
            name="type"
            value={sharedData.type}
            onChange={handleSharedChange}
            placeholder="e.g. Full-time, Freelance"
            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-color)' }}
          />
        </div>
        <div className="form-group">
          <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontWeight: 600 }}>Tech Stack (Comma-separated)</label>
          <input 
            name="techStack"
            value={sharedData.techStack}
            onChange={handleSharedChange}
            placeholder="React, Node.js, GraphQL"
            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-color)' }}
          />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--space-4)', alignItems: 'end' }}>
        <div className="form-group">
          <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontWeight: 600 }}>Start Date</label>
          <input 
            name="startDate"
            type="date"
            value={sharedData.startDate}
            onChange={handleSharedChange}
            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-color)' }}
          />
        </div>
        <div className="form-group">
          <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontWeight: 600 }}>End Date</label>
          <input 
            name="endDate"
            type="date"
            disabled={sharedData.isCurrent}
            value={sharedData.endDate}
            onChange={handleSharedChange}
            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-color)', opacity: sharedData.isCurrent ? 0.5 : 1 }}
          />
        </div>
        <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', paddingBottom: '12px' }}>
          <input 
            id="isCurrent"
            name="isCurrent"
            type="checkbox"
            checked={sharedData.isCurrent}
            onChange={handleSharedChange}
          />
          <label htmlFor="isCurrent" style={{ fontWeight: 600, cursor: 'pointer' }}>Currently Working</label>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--space-4)' }}>
        <div className="form-group">
          <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontWeight: 600 }}>Experience Kind</label>
          <select
            name="experienceKind"
            value={sharedData.experienceKind}
            onChange={handleSharedChange}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '4px',
              border: '1px solid var(--border-color)',
              backgroundColor: 'var(--bg-color)',
              color: 'var(--text-color)',
              fontWeight: '600',
              borderLeft: sharedData.experienceKind === 'IT_FREELANCE'
                ? '4px solid #6366f1'
                : sharedData.experienceKind === 'GENERAL_FREELANCE'
                  ? '4px solid #f59e0b'
                  : '4px solid #22c55e'
            }}
          >
            <option value="FORMAL_WORK">Formal Work</option>
            <option value="IT_FREELANCE">IT Freelance</option>
            <option value="GENERAL_FREELANCE">General Freelance</option>
          </select>
        </div>
        <div className="form-group">
          <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontWeight: 600 }}>Status</label>
          <select 
            name="status"
            value={sharedData.status}
            onChange={handleSharedChange}
            style={{ 
              width: '100%', 
              padding: '10px', 
              borderRadius: '4px', 
              border: '1px solid var(--border-color)', 
              backgroundColor: 'var(--bg-color)', 
              color: sharedData.status === 'PUBLISHED' ? '#166534' : '#854d0e',
              fontWeight: '600',
              borderLeft: sharedData.status === 'PUBLISHED' ? '4px solid #22c55e' : '4px solid #eab308'
            }}
          >
            <option value="DRAFT">DRAFT (Hidden from Public)</option>
            <option value="PUBLISHED">PUBLISHED (Visible to Public)</option>
          </select>
        </div>
        <div className="form-group">
          <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontWeight: 600 }}>Display Order</label>
          <input 
            name="order"
            type="number"
            value={sharedData.order}
            onChange={handleSharedChange}
            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-color)' }}
          />
        </div>
      </div>

      {/* SECTION 2: Localization Settings */}
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
            Role / Title {activeTab === 'EN' ? '*' : '(Optional)'}
          </label>
          <input 
            name="role"
            required={activeTab === 'EN'}
            value={translationsData[activeTab].role}
            onChange={(e) => handleTranslationChange(e, activeTab)}
            placeholder={`e.g. Senior Web Developer in ${activeTab === 'EN' ? 'English' : activeTab === 'ID' ? 'Indonesian' : 'Japanese'}`}
            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-color)' }}
          />
        </div>

        <div className="form-group">
          <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontWeight: 600 }}>Short Description</label>
          <textarea 
            name="description"
            rows="3"
            value={translationsData[activeTab].description}
            onChange={(e) => handleTranslationChange(e, activeTab)}
            placeholder={`Brief summary of your role in ${activeTab === 'EN' ? 'English' : activeTab === 'ID' ? 'Indonesian' : 'Japanese'}...`}
            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-color)', resize: 'vertical' }}
          />
        </div>

        <div className="form-group">
          <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontWeight: 600 }}>Highlights (One per line)</label>
          <textarea 
            name="highlights"
            rows="5"
            value={translationsData[activeTab].highlights}
            onChange={(e) => handleTranslationChange(e, activeTab)}
            placeholder={`Highlights/Achievements in ${activeTab === 'EN' ? 'English' : activeTab === 'ID' ? 'Indonesian' : 'Japanese'}...&#10;Developed a scalable API...`}
            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-color)', resize: 'vertical' }}
          />
        </div>
      </div>

      <button type="submit" className="btn btn-primary" disabled={saving} style={{ marginTop: 'var(--space-4)', padding: '12px' }}>
        {saving ? 'Saving...' : (initialData ? 'Update Experience' : 'Create Experience')}
      </button>
    </form>
  );
};

export default ExperienceForm;
