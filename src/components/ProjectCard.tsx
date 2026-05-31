import React from 'react';
import type { Project } from '../types';

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const handleViewCase = () => {
    alert(`✨ "${project.title}" — More details will be added soon. Real project demo ready on request.`);
  };

  return (
    <div className="project-card">
      <div className="project-img">
        <i className={`fas ${project.icon}`} style={{ fontSize: '3rem' }}></i>
        <span style={{ fontWeight: '500' }}>preview image</span>
      </div>
      <div className="project-info">
        <h3>{project.title}</h3>
        <p style={{ color: '#475569', margin: '0.5rem 0' }}>{project.desc}</p>
        <div className="tech-stack">
          {project.tech.map((tech, idx) => (
            <span key={idx}>{tech}</span>
          ))}
        </div>
        <a href="#" className="project-link" onClick={(e) => {
          e.preventDefault();
          handleViewCase();
        }}>
          View case <i className="fas fa-arrow-right"></i>
        </a>
      </div>
    </div>
  );
};

export default ProjectCard;