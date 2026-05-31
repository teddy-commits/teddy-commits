import React from 'react';

const Hero: React.FC = () => {
  return (
    <section id="home" className="hero">
      <div className="container hero-grid">
        <div className="hero-content">
          <div className="hero-badge">
            <i className="fas fa-code"></i> Available for opportunities
          </div>
          <h1>
            Tewodros Mekonen<br />
            <span className="highlight">Software Developer</span> & Creative Engineer
          </h1>
          <div className="hero-title">Full-Stack • Mobile • Graphics Design</div>
          <p className="hero-desc">
            I build complex web apps, backend systems, cross-platform mobile apps, and bring ideas to life 
            with modern design & animation. Also crafting stunning visual identities as a graphics designer.
          </p>
          <div className="btn-group">
            <a href="#projects" className="btn-primary" onClick={(e) => {
              e.preventDefault();
              document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
            }}>
              <i className="fas fa-arrow-right"></i> View Projects
            </a>
            <a href="#contact" className="btn-outline" onClick={(e) => {
              e.preventDefault();
              document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
            }}>
              <i className="fas fa-comment"></i> Let's talk
            </a>
          </div>
        </div>
        <div className="hero-image">
          <div className="img-placeholder" id="profilePlaceholder">
            <i className="fas fa-user-astronaut"></i>
            <span>📸 Your image here</span>
            <small style={{ marginTop: '8px', fontSize: '11px' }}>(replace later)</small>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;