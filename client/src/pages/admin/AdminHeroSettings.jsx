import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAdminHero, updateAdminHero } from '../../lib/api';
import { removeToken } from '../../lib/auth';

const LOCALES = [
  { code: 'EN', label: 'English' },
  { code: 'ID', label: 'Indonesia' },
  { code: 'JA', label: 'Japanese' }
];

const emptyTranslation = {
  roles: '',
  title: '',
  subtitle: '',
  primaryCtaLabel: '',
  secondaryCtaLabel: ''
};

const AdminHeroSettings = () => {
  const [activeLocale, setActiveLocale] = useState('EN');
  const [formData, setFormData] = useState({
    defaultLocale: 'EN',
    name: '',
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

  const normalizeHeroForm = (hero) => {
    const defaultData = {
      defaultLocale: 'EN',
      name: '',
      resumeUrl: '',
      translations: {
        EN: { ...emptyTranslation },
        ID: { ...emptyTranslation },
        JA: { ...emptyTranslation }
      }
    };

    if (!hero) return defaultData;

    const result = {
      defaultLocale: hero.defaultLocale || 'EN',
      name: hero.name || '',
      resumeUrl: hero.resumeUrl || '',
      translations: {
        EN: { ...defaultData.translations.EN },
        ID: { ...defaultData.translations.ID },
        JA: { ...defaultData.translations.JA }
      }
    };

    // If it's structured translations
    if (hero.translations && typeof hero.translations === 'object') {
      ['EN', 'ID', 'JA'].forEach(lang => {
        const trans = hero.translations[lang] || {};
        result.translations[lang] = {
          roles: Array.isArray(trans.roles) ? trans.roles.join(', ') : trans.roles || '',
          title: trans.title || '',
          subtitle: trans.subtitle || '',
          primaryCtaLabel: trans.primaryCtaLabel || '',
          secondaryCtaLabel: trans.secondaryCtaLabel || ''
        };
      });
    } else {
      // Legacy flat settings -> Map all legacy properties into EN locale
      result.translations.EN = {
        roles: Array.isArray(hero.roles) ? hero.roles.join(', ') : hero.roles || '',
        title: hero.title || '',
        subtitle: hero.subtitle || '',
        primaryCtaLabel: hero.primaryCtaLabel || '',
        secondaryCtaLabel: hero.secondaryCtaLabel || ''
      };
    }

    return result;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAdminHero();
        if (data.hero) {
          const normalized = normalizeHeroForm(data.hero);
          setFormData(normalized);
        }
      } catch (err) {
        if (err.message.includes('401') || err.message.toLowerCase().includes('unauthorized')) {
          removeToken();
          navigate('/admin/login');
        } else {
          setError('Failed to load hero settings: ' + err.message);
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

  const splitRoles = (rolesStr) => {
    if (!rolesStr) return [];
    return rolesStr.split(',').map(r => r.trim()).filter(r => r !== '');
  };

  const isTranslationEmpty = (locale) => {
    const t = formData.translations[locale];
    return !t || !t.title.trim() || !t.subtitle.trim();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const payload = {
        defaultLocale: formData.defaultLocale || 'EN',
        name: formData.name,
        resumeUrl: formData.resumeUrl,
        translations: {
          EN: {
            roles: splitRoles(formData.translations.EN.roles),
            title: formData.translations.EN.title,
            subtitle: formData.translations.EN.subtitle,
            primaryCtaLabel: formData.translations.EN.primaryCtaLabel,
            secondaryCtaLabel: formData.translations.EN.secondaryCtaLabel
          },
          ID: {
            roles: splitRoles(formData.translations.ID.roles),
            title: formData.translations.ID.title,
            subtitle: formData.translations.ID.subtitle,
            primaryCtaLabel: formData.translations.ID.primaryCtaLabel,
            secondaryCtaLabel: formData.translations.ID.secondaryCtaLabel
          },
          JA: {
            roles: splitRoles(formData.translations.JA.roles),
            title: formData.translations.JA.title,
            subtitle: formData.translations.JA.subtitle,
            primaryCtaLabel: formData.translations.JA.primaryCtaLabel,
            secondaryCtaLabel: formData.translations.JA.secondaryCtaLabel
          }
        }
      };

      await updateAdminHero(payload);
      setSuccess('Hero settings updated successfully');
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
      <h1 style={{ marginBottom: '4px' }}>Hero Settings</h1>
      <p style={{ opacity: 0.7, fontSize: '0.9rem', marginBottom: 'var(--space-6)' }}>
        Manage global hero identity and localized hero copy for English, Indonesian, and Japanese public pages.
      </p>

      {error && <div style={{ padding: 'var(--space-4)', backgroundColor: '#fee2e2', color: '#dc2626', borderRadius: '4px', marginBottom: 'var(--space-4)' }}>{error}</div>}
      {success && <div style={{ padding: 'var(--space-4)', backgroundColor: '#dcfce7', color: '#166534', borderRadius: '4px', marginBottom: 'var(--space-4)' }}>{success}</div>}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
        {/* Global Settings Card */}
        <div className="card" style={{ padding: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <h3 style={{ margin: 0, borderBottom: '1px solid var(--border-color)', paddingBottom: 'var(--space-2)' }}>Global Identity</h3>
          
          <div className="form-group">
            <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontWeight: '600' }}>Name</label>
            <input 
              name="name"
              value={formData.name}
              onChange={handleGlobalChange}
              placeholder="e.g. Syah Putra Nugraha"
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
            <div className="form-group">
              <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontWeight: '600' }}>
                Roles (Comma separated for typing animation - {activeLocale})
              </label>
              <input 
                value={activeTranslation.roles}
                onChange={(e) => handleTranslationChange(activeLocale, 'roles', e.target.value)}
                placeholder="e.g. Full Stack Web Developer, Digital Operations Specialist"
                style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-color)', boxSizing: 'border-box' }}
              />
            </div>

            <div className="form-group">
              <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontWeight: '600' }}>
                Main Title ({activeLocale})
              </label>
              <textarea 
                value={activeTranslation.title}
                onChange={(e) => handleTranslationChange(activeLocale, 'title', e.target.value)}
                rows={2}
                placeholder="e.g. Full Stack Web Developer specializing in PHP..."
                style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-color)', resize: 'vertical', boxSizing: 'border-box' }}
              />
            </div>

            <div className="form-group">
              <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontWeight: '600' }}>
                Subtitle ({activeLocale})
              </label>
              <textarea 
                value={activeTranslation.subtitle}
                onChange={(e) => handleTranslationChange(activeLocale, 'subtitle', e.target.value)}
                rows={3}
                placeholder="e.g. I build web applications with authentication..."
                style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-color)', resize: 'vertical', boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
              <div className="form-group">
                <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontWeight: '600' }}>Primary CTA Label ({activeLocale})</label>
                <input 
                  value={activeTranslation.primaryCtaLabel}
                  onChange={(e) => handleTranslationChange(activeLocale, 'primaryCtaLabel', e.target.value)}
                  placeholder="e.g. View Projects"
                  style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-color)', boxSizing: 'border-box' }}
                />
              </div>
              <div className="form-group">
                <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontWeight: '600' }}>Secondary CTA Label ({activeLocale})</label>
                <input 
                  value={activeTranslation.secondaryCtaLabel}
                  onChange={(e) => handleTranslationChange(activeLocale, 'secondaryCtaLabel', e.target.value)}
                  placeholder="e.g. Download CV"
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

export default AdminHeroSettings;
