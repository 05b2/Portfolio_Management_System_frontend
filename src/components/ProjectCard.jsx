import React from 'react';

const ProjectCard = ({ project, isAdmin, onEdit, onDelete }) => {
  const {
    _id,
    title,
    description,
    techStack,
    github,
    liveDemo,
    imageUrl,
    featured,
    createdAt
  } = project;

  return (
    <div className={`project-card ${featured ? 'featured' : ''}`}>
      {imageUrl && (
        <div className="project-image">
          <img src={imageUrl} alt={title} />
          {featured && <span className="featured-badge">Featured</span>}
        </div>
      )}
      
      <div className="project-content">
        <h3 className="project-title">{title}</h3>
        <p className="project-description">{description}</p>
        
        <div className="project-tech">
          {techStack.map((tech, index) => (
            <span key={index} className="tech-tag">
              {tech}
            </span>
          ))}
        </div>
        
        <div className="project-links">
          <a 
            href={github} 
            target="_blank" 
            rel="noopener noreferrer"
            className="project-link github-link"
          >
            GitHub
          </a>
          
          {liveDemo && (
            <a 
              href={liveDemo} 
              target="_blank" 
              rel="noopener noreferrer"
              className="project-link demo-link"
            >
              Live Demo
            </a>
          )}
        </div>
        
        <div className="project-date">
          Created: {new Date(createdAt).toLocaleDateString()}
        </div>
        
        {isAdmin && (
          <div className="project-admin-actions">
            <button 
              className="btn btn-secondary"
              onClick={() => onEdit(project)}
            >
              Edit
            </button>
            <button 
              className="btn btn-danger"
              onClick={() => onDelete(_id)}
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectCard;