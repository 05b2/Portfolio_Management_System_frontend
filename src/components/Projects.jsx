import React, { useState, useEffect } from 'react';
import { projectsAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import ProjectCard from './ProjectCard';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    techStack: '',
    github: '',
    liveDemo: '',
    imageUrl: '',
    featured: false
  });
  
  const { isAdmin } = useAuth();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const data = await projectsAPI.getAll();
      setProjects(data);
    } catch (error) {
      setError('Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const projectData = {
        ...formData,
        techStack: formData.techStack.split(',').map(tech => tech.trim()).filter(tech => tech)
      };
      
      if (editingProject) {
        const updatedProject = await projectsAPI.update(editingProject._id, projectData);
        setProjects(projects.map(project => 
          project._id === editingProject._id ? updatedProject : project
        ));
      } else {
        const newProject = await projectsAPI.create(projectData);
        setProjects([newProject, ...projects]);
      }
      
      resetForm();
      setError('');
    } catch (error) {
      setError(`Failed to ${editingProject ? 'update' : 'create'} project`);
    }
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      description: project.description,
      techStack: project.techStack.join(', '),
      github: project.github,
      liveDemo: project.liveDemo || '',
      imageUrl: project.imageUrl || '',
      featured: project.featured || false
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    
    try {
      await projectsAPI.delete(id);
      setProjects(projects.filter(project => project._id !== id));
    } catch (error) {
      setError('Failed to delete project');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      techStack: '',
      github: '',
      liveDemo: '',
      imageUrl: '',
      featured: false
    });
    setEditingProject(null);
    setShowForm(false);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const featuredProjects = projects.filter(project => project.featured);
  const regularProjects = projects.filter(project => !project.featured);

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="projects-container">
      <div className="projects-header">
        <h1>Projects</h1>
        {isAdmin() && (
          <button 
            className="btn btn-primary"
            onClick={() => setShowForm(true)}
          >
            Add Project
          </button>
        )}
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      {showForm && (
        <div className="project-form-container">
          <form className="project-form" onSubmit={handleSubmit}>
            <h3>{editingProject ? 'Edit Project' : 'Add New Project'}</h3>
            
            <div className="form-group">
              <label>Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={4}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Tech Stack (comma separated)</label>
              <input
                type="text"
                value={formData.techStack}
                onChange={(e) => handleInputChange('techStack', e.target.value)}
                placeholder="React, Node.js, MongoDB"
                required
              />
            </div>
            
            <div className="form-group">
              <label>GitHub URL</label>
              <input
                type="url"
                value={formData.github}
                onChange={(e) => handleInputChange('github', e.target.value)}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Live Demo URL</label>
              <input
                type="url"
                value={formData.liveDemo}
                onChange={(e) => handleInputChange('liveDemo', e.target.value)}
              />
            </div>
            
            <div className="form-group">
              <label>Image URL</label>
              <input
                type="url"
                value={formData.imageUrl}
                onChange={(e) => handleInputChange('imageUrl', e.target.value)}
              />
            </div>
            
            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => handleInputChange('featured', e.target.checked)}
                />
                Featured Project
              </label>
            </div>
            
            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                {editingProject ? 'Update' : 'Add'} Project
              </button>
              <button type="button" className="btn btn-secondary" onClick={resetForm}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
      
      {featuredProjects.length > 0 && (
        <section className="featured-projects">
          <h2>Featured Projects</h2>
          <div className="projects-grid">
            {featuredProjects.map(project => (
              <ProjectCard
                key={project._id}
                project={project}
                isAdmin={isAdmin()}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </section>
      )}
      
      {regularProjects.length > 0 && (
        <section className="regular-projects">
          <h2>All Projects</h2>
          <div className="projects-grid">
            {regularProjects.map(project => (
              <ProjectCard
                key={project._id}
                project={project}
                isAdmin={isAdmin()}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </section>
      )}
      
      {projects.length === 0 && (
        <div className="no-projects">
          <p>No projects found.</p>
        </div>
      )}
    </div>
  );
};

export default Projects;