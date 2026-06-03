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
            <span className="highlight">Full-Stack Developer</span>
          </h1>
          <div className="hero-title">Java Spring Boot • React • Express.js</div>
          <p className="hero-desc">
            I build robust backend systems with Spring Boot and Node.js/Express, 
            create responsive frontends with React, and develop cross-platform mobile apps. 
            Passionate about clean code, scalable architecture, and delivering real business value.
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