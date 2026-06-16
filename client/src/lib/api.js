import { getToken } from './auth';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const fetcher = async (endpoint, options = {}) => {
  const url = `${API_URL}${endpoint}`;
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const token = getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok || data.success === false) {
    throw new Error(data.message || 'Something went wrong');
  }

  // Helper parser for consistent response formats
  if (data.success && data.data !== undefined) {
    return data.data;
  }
  return data;
};

// Public Projects
export const getPublicProjects = () => fetcher('/api/projects');
export const getPublicProjectBySlug = (slug) => fetcher(`/api/projects/${slug}`);
export const getPublicContact = () => fetcher('/api/settings/contact');
export const getPublicHero = () => fetcher('/api/settings/hero');
export const getPublicProfile = () => fetcher('/api/settings/profile');
export const getPublicEducation = () => fetcher('/api/education');
export const getPublicSkills = (type) => {
  const url = type ? `/api/skills?type=${type}` : '/api/skills';
  return fetcher(url);
};
export const getPublicExperiences = (locale) => {
  const url = locale ? `/api/experiences?locale=${locale}` : '/api/experiences';
  return fetcher(url);
};
export const getPublicLearningItems = () => fetcher('/api/learning');

// Auth
export const loginAdmin = (email, password) => 
  fetcher('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

export const getCurrentAdmin = () => fetcher('/api/auth/me');

// Admin Projects
export const getAdminProjects = () => fetcher('/api/admin/projects');
export const getAdminProject = (id) => fetcher(`/api/admin/projects/${id}`);

export const createProject = (data) => 
  fetcher('/api/admin/projects', {
    method: 'POST',
    body: JSON.stringify(data),
  });

export const updateProject = (id, data) => 
  fetcher(`/api/admin/projects/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });

export const deleteProject = (id) => 
  fetcher(`/api/admin/projects/${id}`, {
    method: 'DELETE',
  });

// Admin Account
export const getAdminAccount = () => fetcher('/api/admin/account');

export const updateAdminEmail = (data) => 
  fetcher('/api/admin/account/email', {
    method: 'PUT',
    body: JSON.stringify(data),
  });

export const updateAdminPassword = (data) => 
  fetcher('/api/admin/account/password', {
    method: 'PUT',
    body: JSON.stringify(data),
  });

// Admin Settings
export const getAdminContact = () => fetcher('/api/admin/settings/contact');
export const updateAdminContact = (data) => 
  fetcher('/api/admin/settings/contact', {
    method: 'PUT',
    body: JSON.stringify(data),
  });

export const getAdminHero = () => fetcher('/api/admin/settings/hero');
export const updateAdminHero = (data) => 
  fetcher('/api/admin/settings/hero', {
    method: 'PUT',
    body: JSON.stringify(data),
  });

export const getAdminProfile = () => fetcher('/api/admin/settings/profile');
export const updateAdminProfile = (data) => 
  fetcher('/api/admin/settings/profile', {
    method: 'PUT',
    body: JSON.stringify(data),
  });

// Admin Education
export const getAdminEducation = () => fetcher('/api/admin/education');
export const getAdminEducationById = (id) => fetcher(`/api/admin/education/${id}`);
export const createAdminEducation = (data) => 
  fetcher('/api/admin/education', {
    method: 'POST',
    body: JSON.stringify(data),
  });
export const updateAdminEducation = (id, data) => 
  fetcher(`/api/admin/education/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
export const deleteAdminEducation = (id) => 
  fetcher(`/api/admin/education/${id}`, {
    method: 'DELETE',
  });

// Admin Skills
export const getAdminSkills = (type) => {
  const url = type ? `/api/admin/skills?type=${type}` : '/api/admin/skills';
  return fetcher(url);
};
export const getAdminSkill = (id) => fetcher(`/api/admin/skills/${id}`);
export const createSkill = (data) => 
  fetcher('/api/admin/skills', {
    method: 'POST',
    body: JSON.stringify(data),
  });
export const updateSkill = (id, data) => 
  fetcher(`/api/admin/skills/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
export const deleteSkill = (id) => 
  fetcher(`/api/admin/skills/${id}`, {
    method: 'DELETE',
  });

// Admin Experience
export const getAdminExperiences = () => fetcher('/api/admin/experiences');
export const getAdminExperience = (id) => fetcher(`/api/admin/experiences/${id}`);
export const createExperience = (data) => fetcher('/api/admin/experiences', { method: 'POST', body: JSON.stringify(data) });
export const updateExperience = (id, data) => fetcher(`/api/admin/experiences/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteExperience = (id) => fetcher(`/api/admin/experiences/${id}`, { method: 'DELETE' });

// Certifications
export const getPublicCertifications = (filters = {}) => {
  const query = new URLSearchParams(filters).toString();
  return fetcher(`/api/certifications${query ? `?${query}` : ''}`);
};

// Admin Certifications
export const getAdminCertifications = (filters = {}) => {
  const query = new URLSearchParams(filters).toString();
  return fetcher(`/api/admin/certifications${query ? `?${query}` : ''}`);
};
export const getAdminCertification = (id) => fetcher(`/api/admin/certifications/${id}`);
export const createCertification = (data) => fetcher('/api/admin/certifications', { method: 'POST', body: JSON.stringify(data) });
export const updateCertification = (id, data) => fetcher(`/api/admin/certifications/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteCertification = (id) => fetcher(`/api/admin/certifications/${id}`, { method: 'DELETE' });

// Admin CV Builder
export const getCvBuilderConfig = () => fetcher('/api/admin/cv-builder/config');
export const updateCvBuilderConfig = (data) => fetcher('/api/admin/cv-builder/config', { method: 'PUT', body: JSON.stringify(data) });

// Admin Learning Library
export const getAdminLearningItems = () => fetcher('/api/admin/learning');
export const getAdminLearningItem = (id) => fetcher(`/api/admin/learning/${id}`);
export const createLearningItem = (data) => fetcher('/api/admin/learning', { method: 'POST', body: JSON.stringify(data) });
export const updateLearningItem = (id, data) => fetcher(`/api/admin/learning/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteLearningItem = (id) => fetcher(`/api/admin/learning/${id}`, { method: 'DELETE' });
