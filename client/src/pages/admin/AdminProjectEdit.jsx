import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ProjectForm from '../../components/admin/ProjectForm';
import { getAdminProject, updateProject } from '../../lib/api';
import { removeToken } from '../../lib/auth';

const AdminProjectEdit = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const data = await getAdminProject(id);
        setProject(data.project);
      } catch (err) {
        if (err.message.includes('401') || err.message.toLowerCase().includes('unauthorized')) {
          removeToken();
          navigate('/admin/login');
        } else {
          setError(err.message || 'Failed to load project data');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id, navigate]);

  const handleSubmit = async (data) => {
    setSaving(true);
    setError('');

    try {
      await updateProject(id, data);
      navigate('/admin/projects');
    } catch (err) {
      if (err.message.includes('401') || err.message.toLowerCase().includes('unauthorized')) {
        removeToken();
        navigate('/admin/login');
      } else {
        setError(err.message || 'Failed to update project');
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: 'var(--space-8)' }}>Loading project data...</div>;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: 'var(--space-6)' }}>Edit Project</h1>
      
      {error && (
        <div style={{ backgroundColor: '#fee2e2', color: '#dc2626', padding: 'var(--space-4)', borderRadius: '4px', marginBottom: 'var(--space-6)' }}>
          {error}
        </div>
      )}

      {project && (
        <ProjectForm 
          initialData={project}
          onSubmit={handleSubmit} 
          onCancel={() => navigate('/admin/projects')}
          loading={saving}
        />
      )}
    </div>
  );
};

export default AdminProjectEdit;
