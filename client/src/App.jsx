import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import About from './pages/About';
import Projects from './pages/Projects';
import Learn from './pages/Learn';
import Experience from './pages/Experience';
import Contact from './pages/Contact';
import Credentials from './pages/Credentials';
// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProjects from './pages/admin/AdminProjects';
import AdminProjectCreate from './pages/admin/AdminProjectCreate';
import AdminProjectEdit from './pages/admin/AdminProjectEdit';
import AdminAccount from './pages/admin/AdminAccount';
import AdminContact from './pages/admin/AdminContact';
import AdminHeroSettings from './pages/admin/AdminHeroSettings';
import AdminProfileSettings from './pages/admin/AdminProfileSettings';
import AdminSkills from './pages/admin/AdminSkills';
import AdminSkillCreate from './pages/admin/AdminSkillCreate';
import AdminSkillEdit from './pages/admin/AdminSkillEdit';
import AdminExperiences from './pages/admin/AdminExperiences';
import AdminExperienceCreate from './pages/admin/AdminExperienceCreate';
import AdminExperienceEdit from './pages/admin/AdminExperienceEdit';
import AdminCertifications from './pages/admin/AdminCertifications';
import AdminCertificationCreate from './pages/admin/AdminCertificationCreate';
import AdminCertificationEdit from './pages/admin/AdminCertificationEdit';
import AdminEducation from './pages/admin/AdminEducation';
import AdminCvBuilder from './pages/admin/AdminCvBuilder';
import AdminLearning from './pages/admin/AdminLearning';
import AdminLearningCreate from './pages/admin/AdminLearningCreate';
import AdminLearningEdit from './pages/admin/AdminLearningEdit';
import ProtectedRoute from './components/admin/ProtectedRoute';

import AdminLayout from './layouts/AdminLayout';
import { LanguageProvider } from './context/LanguageContext';

function App() {
  return (
    <LanguageProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<MainLayout><Home /></MainLayout>} />
          <Route path="/about" element={<MainLayout><About /></MainLayout>} />
          <Route path="/projects" element={<MainLayout><Projects /></MainLayout>} />
          <Route path="/learn" element={<MainLayout><Learn /></MainLayout>} />
          <Route path="/experience" element={<MainLayout><Experience /></MainLayout>} />
          <Route path="/contact" element={<MainLayout><Contact /></MainLayout>} />
          <Route path="/credentials" element={<MainLayout><Credentials /></MainLayout>} />

          {/* Admin Login - No Layout */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Admin Dashboard Routes - Protected */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="projects" element={<AdminProjects />} />
            <Route path="projects/new" element={<AdminProjectCreate />} />
            <Route path="projects/:id/edit" element={<AdminProjectEdit />} />
            <Route path="account" element={<AdminAccount />} />
            <Route path="contact" element={<AdminContact />} />
            <Route path="settings/hero" element={<AdminHeroSettings />} />
            <Route path="settings/profile" element={<AdminProfileSettings />} />
            <Route path="skills" element={<AdminSkills />} />
            <Route path="skills/new" element={<AdminSkillCreate />} />
            <Route path="skills/:id/edit" element={<AdminSkillEdit />} />
            <Route path="experience" element={<AdminExperiences />} />
            <Route path="experience/new" element={<AdminExperienceCreate />} />
            <Route path="experience/:id/edit" element={<AdminExperienceEdit />} />
            <Route path="certifications" element={<AdminCertifications />} />
            <Route path="certifications/new" element={<AdminCertificationCreate />} />
            <Route path="certifications/:id/edit" element={<AdminCertificationEdit />} />
            <Route path="education" element={<AdminEducation />} />
            <Route path="cv-builder" element={<AdminCvBuilder />} />
            <Route path="learning" element={<AdminLearning />} />
            <Route path="learning/new" element={<AdminLearningCreate />} />
            <Route path="learning/:id/edit" element={<AdminLearningEdit />} />
          </Route>


        </Routes>
      </Router>
    </LanguageProvider>
  );
}

export default App;
