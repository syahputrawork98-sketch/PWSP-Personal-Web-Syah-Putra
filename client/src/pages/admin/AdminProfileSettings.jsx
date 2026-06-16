import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAdminProfile, updateAdminProfile } from '../../lib/api';
import { removeToken } from '../../lib/auth';

const LOCALES = [
  { code: 'EN', label: 'English' },
  { code: 'ID', label: 'Indonesia' },
  { code: 'JA', label: 'Japanese' }
];

const emptyTranslation = {
  aboutTitle: '',
  summaryTitle: '',
  summary: '',
  birthPlace: '',
  birthDate: ''
};

const AdminProfileSettings = () => {
  const [activeLocale, setActiveLocale] = useState('EN');
  const [formData, setFormData] = useState({
    defaultLocale: 'EN',
    avatarUrl: '',
    resumeUrl: '',
    translations: {
      EN: { ...emptyTranslation },
      ID: { ...emptyTranslation },
      JA: { ...emptyTranslation }
    }
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const normalizeProfileForm = (profile) => {
    const defaultData = {
      defaultLocale: 'EN',
      avatarUrl: '',
      resumeUrl: '',
      translations: {
        EN: { ...emptyTranslation },
        ID: { ...emptyTranslation },
        JA: { ...emptyTranslation }
      }
    };

    if (!profile) return defaultData;

    const result = {
      defaultLocale: profile.defaultLocale || 'EN',
      avatarUrl: profile.avatarUrl || '',
      resumeUrl: profile.resumeUrl || '',
      translations: {
        EN: { ...defaultData.translations.EN },
        ID: { ...defaultData.translations.ID },
        JA: { ...defaultData.translations.JA }
      }
    };

    if (profile.translations && typeof profile.translations === 'object') {
      ['EN', 'ID', 'JA'].forEach(lang => {
        const trans = profile.translations[lang] || {};
        result.translations[lang] = {
          ...trans, // preserve extra fields like professionalSummary, valuePropositionTitle, etc.
          aboutTitle: trans.aboutTitle || '',
          summaryTitle: trans.summaryTitle || '',
          summary: trans.summary || '',
          birthPlace: trans.birthPlace || '',
          birthDate: trans.birthDate || ''
        };
      });
    } else {
      // Legacy flat profile
      result.translations.EN = {
        aboutTitle: profile.aboutTitle || '',
        summaryTitle: profile.summaryTitle || '',
        summary: profile.summary || '',
        birthPlace: profile.birthPlace || '',
        birthDate: profile.birthDate || ''
      };
    }

    return result;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAdminProfile();
        if (data.profile) {
          const normalized = normalizeProfileForm(data.profile);
          setFormData(normalized);
        }
      } catch (err) {
        if (err.message.includes('401') || err.message.toLowerCase().includes('unauthorized')) {
          removeToken();
          navigate('/admin/login');
        } else {
          setError('Failed to load profile settings: ' + err.message);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleGlobalChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTranslationChange = (locale, field, value) => {
    setFormData(prev => ({
      ...prev,
      translations: {
        ...prev.translations,
        [locale]: {
          ...prev.translations[locale],
          [field]: value
        }
      }
    }));
  };

  const isTranslationEmpty = (locale) => {
    const t = formData.translations[locale];
    return !t || !t.aboutTitle?.trim() || !t.summary?.trim();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const payload = {
        defaultLocale: formData.defaultLocale || 'EN',
        avatarUrl: formData.avatarUrl,
        resumeUrl: formData.resumeUrl,
        translations: {
          EN: {
            ...formData.translations.EN, // preserve extra fields
            aboutTitle: formData.translations.EN.aboutTitle,
            summaryTitle: formData.translations.EN.summaryTitle,
            summary: formData.translations.EN.summary,
            birthPlace: formData.translations.EN.birthPlace,
            birthDate: formData.translations.EN.birthDate
          },
          ID: {
            ...formData.translations.ID,
            aboutTitle: formData.translations.ID.aboutTitle,
            summaryTitle: formData.translations.ID.summaryTitle,
            summary: formData.translations.ID.summary,
            birthPlace: formData.translations.ID.birthPlace,
            birthDate: formData.translations.ID.birthDate
          },
          JA: {
            ...formData.translations.JA,
            aboutTitle: formData.translations.JA.aboutTitle,
            summaryTitle: formData.translations.JA.summaryTitle,
            summary: formData.translations.JA.summary,
            birthPlace: formData.translations.JA.birthPlace,
            birthDate: formData.translations.JA.birthDate
          }
        }
      };

      await updateAdminProfile(payload);
      setSuccess('Profile settings updated successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      if (err.message.includes('401') || err.message.toLowerCase().includes('unauthorized')) {
        removeToken();
        navigate('/admin/login');
      } else {
        setError('Failed to save settings: ' + err.message);
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: 'var(--space-8)' }}>Loading settings...</div>;

  const activeTranslation = formData.translations[activeLocale] || emptyTranslation;

  return (
    <div className="container" style={{ maxWidth: '800px' }}>
      <h1 style={{ marginBottom: '4px' }}>Profile Settings</h1>
      <p style={{ opacity: 0.7, fontSize: '0.9rem', marginBottom: 'var(--space-6)' }}>
        Manage global profile assets and localized About/Profile copy for English, Indonesian, and Japanese public pages.
      </p>

      {error && <div style={{ padding: 'var(--space-4)', backgroundColor: '#fee2e2', color: '#dc2626', borderRadius: '4px', marginBottom: 'var(--space-4)' }}>{error}</div>}
      {success && <div style={{ padding: 'var(--space-4)', backgroundColor: '#dcfce7', color: '#166534', borderRadius: '4px', marginBottom: 'var(--space-4)' }}>{success}</div>}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
        {/* Global Settings Card */}
        <div className="card" style={{ padding: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <h3 style={{ margin: 0, borderBottom: '1px solid var(--border-color)', paddingBottom: 'var(--space-2)' }}>Global Settings</h3>
          
          <div className="form-group">
            <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontWeight: '600' }}>Avatar URL</label>
            <input 
              name="avatarUrl"
              value={formData.avatarUrl}
              onChange={handleGlobalChange}
              placeholder="e.g. https://example.com/avatar.jpg"
              style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-color)', boxSizing: 'border-box' }}
            />
          </div>

          <div className="form-group">
            <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontWeight: '600' }}>Resume URL</label>
            <input 
              name="resumeUrl"
              value={formData.resumeUrl}
              onChange={handleGlobalChange}
              placeholder="e.g. /cv/cv-syah-putra-nugraha-web-developer.pdf"
              style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-color)', boxSizing: 'border-box' }}
            />
          </div>
        </div>

        {/* Translation Settings Section */}
        <div className="card" style={{ padding: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <h3 style={{ margin: 0 }}>Localized Copy</h3>
          
          {/* Tabs switch */}
          <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', marginBottom: 'var(--space-2)' }}>
            {LOCALES.map(loc => {
              const isActive = activeLocale === loc.code;
              const hasEmpty = isTranslationEmpty(loc.code);
              return (
                <button
                  key={loc.code}
                  type="button"
                  onClick={() => setActiveLocale(loc.code)}
                  style={{
                    padding: '10px 20px',
                    cursor: 'pointer',
                    border: 'none',
                    background: 'none',
                    borderBottom: isActive ? '2px solid var(--primary-color)' : '2px solid transparent',
                    color: isActive ? 'var(--primary-color)' : 'var(--text-color)',
                    opacity: isActive ? 1 : 0.6,
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  {loc.label} {hasEmpty && <span style={{ color: '#f59e0b', fontSize: '1rem' }}>*</span>}
                </button>
              );
            })}
          </div>

          {/* Locale tab fields */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
              <div className="form-group">
                <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontWeight: '600' }}>
                  About Title ({activeLocale})
                </label>
                <input 
                  value={activeTranslation.aboutTitle}
                  onChange={(e) => handleTranslationChange(activeLocale, 'aboutTitle', e.target.value)}
                  placeholder="e.g. About Me"
                  style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-color)', boxSizing: 'border-box' }}
                />
              </div>

              <div className="form-group">
                <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontWeight: '600' }}>
                  Summary Title ({activeLocale})
                </label>
                <input 
                  value={activeTranslation.summaryTitle}
                  onChange={(e) => handleTranslationChange(activeLocale, 'summaryTitle', e.target.value)}
                  placeholder="e.g. Professional Summary"
                  style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-color)', boxSizing: 'border-box' }}
                />
              </div>
            </div>

            <div className="form-group">
              <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontWeight: '600' }}>
                Summary Content (HTML supported - {activeLocale})
              </label>
              <textarea 
                value={activeTranslation.summary}
                onChange={(e) => handleTranslationChange(activeLocale, 'summary', e.target.value)}
                rows={8}
                placeholder="e.g. Full Stack Web Developer with experience building..."
                style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-color)', resize: 'vertical', boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
              <div className="form-group">
                <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontWeight: '600' }}>Birth Place ({activeLocale})</label>
                <input 
                  value={activeTranslation.birthPlace}
                  onChange={(e) => handleTranslationChange(activeLocale, 'birthPlace', e.target.value)}
                  placeholder="e.g. Cimahi"
                  style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-color)', boxSizing: 'border-box' }}
                />
              </div>
              <div className="form-group">
                <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontWeight: '600' }}>Birth Date ({activeLocale})</label>
                <input 
                  value={activeTranslation.birthDate}
                  onChange={(e) => handleTranslationChange(activeLocale, 'birthDate', e.target.value)}
                  placeholder="e.g. 29 Mei 1998"
                  style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-color)', boxSizing: 'border-box' }}
                />
              </div>
            </div>
          </div>
        </div>

        <button type="submit" className="btn btn-primary" disabled={saving} style={{ padding: '14px', width: '100%' }}>
          {saving ? 'Saving...' : 'Save All Locales'}
        </button>
      </form>
    </div>
  );
};

export default AdminProfileSettings;
