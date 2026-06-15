import React, { useState, useEffect } from 'react';

const ProjectForm = ({ initialData, onSubmit, onCancel, loading }) => {
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    shortDescription: '',
    description: '',
    imageUrl: '',
    techStack: '', // Comma-separated string for input
    githubUrl: '',
    liveUrl: '',
    figmaUrl: '',
    featured: false,
    status: 'DRAFT',
    order: 0,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        techStack: initialData.techStack ? initialData.techStack.join(', ') : '',
        description: initialData.description || '',
        imageUrl: initialData.imageUrl || '',
        githubUrl: initialData.githubUrl || '',
        liveUrl: initialData.liveUrl || '',
        figmaUrl: initialData.figmaUrl || '',
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData(prev => {
      const newData = {
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      };

      // Auto-generate slug from title if slug is empty or was auto-generated
      if (name === 'title' && (!prev.slug || prev.slug === prev.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''))) {
        newData.slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      }

      return newData;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Process techStack string to array
    const techArray = formData.techStack
      ? formData.techStack.split(',').map(item => item.trim()).filter(item => item !== '')
      : [];

    const submissionData = {
      ...formData,
      techStack: techArray,
      order: parseInt(formData.order) || 0
    };

    onSubmit(submissionData);
  };

  return (
    <form onSubmit={handleSubmit} className="card" style={{ padding: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      <div className="form-group">
        <label style={{ display: 'block', marginBottom: 'var(--space-2)' }}>Title *</label>
        <input 
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-color)' }}
        />
      </div>

      <div className="form-group">
        <label style={{ display: 'block', marginBottom: 'var(--space-2)' }}>Slug *</label>
        <input 
          name="slug"
          value={formData.slug}
          onChange={handleChange}
          required
          style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-color)' }}
        />
      </div>

      <div className="form-group">
        <label style={{ display: 'block', marginBottom: 'var(--space-2)' }}>Short Description *</label>
        <textarea 
          name="shortDescription"
          value={formData.shortDescription}
          onChange={handleChange}
          required
          rows="2"
          style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-color)' }}
        />
      </div>

      <div className="form-group">
        <label style={{ display: 'block', marginBottom: 'var(--space-2)' }}>Description (Full)</label>
        <textarea 
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="4"
          style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-color)' }}
        />
      </div>

      <div className="form-group">
        <label style={{ display: 'block', marginBottom: 'var(--space-2)' }}>Tech Stack (comma separated)</label>
        <input 
          name="techStack"
          value={formData.techStack}
          onChange={handleChange}
          placeholder="e.g. React, Node.js, Prisma"
          style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-color)' }}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
        <div className="form-group">
          <label style={{ display: 'block', marginBottom: 'var(--space-2)' }}>Image URL</label>
          <input 
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-color)' }}
          />
        </div>
        <div className="form-group">
          <label style={{ display: 'block', marginBottom: 'var(--space-2)' }}>Order Index</label>
          <input 
            name="order"
            type="number"
            value={formData.order}
            onChange={handleChange}
            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-color)' }}
          />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-4)' }}>
        <div className="form-group">
          <label style={{ display: 'block', marginBottom: 'var(--space-2)' }}>GitHub URL</label>
          <input 
            name="githubUrl"
            value={formData.githubUrl}
            onChange={handleChange}
            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-color)' }}
          />
        </div>
        <div className="form-group">
          <label style={{ display: 'block', marginBottom: 'var(--space-2)' }}>Live Demo URL</label>
          <input 
            name="liveUrl"
            value={formData.liveUrl}
            onChange={handleChange}
            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-color)' }}
          />
        </div>
        <div className="form-group">
          <label style={{ display: 'block', marginBottom: 'var(--space-2)' }}>Figma URL</label>
          <input 
            name="figmaUrl"
            value={formData.figmaUrl}
            onChange={handleChange}
            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-color)' }}
          />
        </div>
      </div>

      <div style={{ display: 'flex', gap: 'var(--space-6)', alignItems: 'center' }}>
        <div className="form-group">
          <label style={{ display: 'block', marginBottom: 'var(--space-2)' }}>Status</label>
          <select 
            name="status"
            value={formData.status}
            onChange={handleChange}
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
            checked={formData.featured}
            onChange={handleChange}
          />
          <label htmlFor="featured">Featured Project</label>
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
