import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ServiceCard from './components/ServiceCard';
import ProjectCard from './components/ProjectCard';
import ClientChat from './components/ClientChat';
import AdminPanel from './pages/AdminPanel';
import { servicesData, projectsData, socialLinks } from './data/portfolioData';
import './App.css';
import ContactPage from './components/ContactPage';

// Get admin secret from environment variables
const ADMIN_SECRET_PATH = import.meta.env.VITE_ADMIN_TOKEN || "teddybrothedeveloper";

// Main Portfolio Component
function Portfolio() {
  useEffect(() => {
    // Animation on scroll
    const cards = document.querySelectorAll('.service-card, .project-card, .about-text, .graphics-badge');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).style.opacity = '1';
            (entry.target as HTMLElement).style.transform = 'translateY(0px)';
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -20px 0px' }
    );

    cards.forEach(card => {
      (card as HTMLElement).style.opacity = '0';
      (card as HTMLElement).style.transform = 'translateY(18px)';
      (card as HTMLElement).style.transition = 'opacity 0.5s ease, transform 0.4s ease';
      observer.observe(card);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        
        <section id="services">
          <div className="container">
            <h2 className="section-title">What I deliver</h2>
            <div className="services-grid">
              {servicesData.map((service, idx) => (
                <ServiceCard key={idx} service={service} />
              ))}
            </div>
          </div>
        </section>

        <section id="projects">
          <div className="container">
            <h2 className="section-title">Featured builds</h2>
            <div className="projects-grid">
              {projectsData.map((project, idx) => (
                <ProjectCard key={idx} project={project} />
              ))}
            </div>
          </div>
        </section>

        <section style={{ paddingTop: 0 }}>
          <div className="container about-flex">
            <div className="about-text">
              <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Beyond code → Creative vision</h2>
              <p style={{ fontSize: '1.1rem', color: '#334155' }}>
                As a software developer, I don't just write logic — I craft experiences. From high-performance 
                backend systems to pixel-perfect interfaces, I merge engineering with artistic design.
              </p>
              <p style={{ marginTop: '1.2rem' }}>
                💡 <strong>Complex backend?</strong> Node.js, Spring Boot, Django, databases, serverless.<br />
                📱 <strong>Mobile up:</strong> Flutter, React Native, or native bridges.<br />
                🎨 <strong>Graphics:</strong> Adobe Suite, Figma, brand strategy.
              </p>
            </div>
            <div className="graphics-badge">
              <i className="fas fa-crown"></i>
              <h3>Graphics Designer soul</h3>
              <p>Logos, marketing materials, UI concepts, 3D elements — I merge design thinking with development.</p>
              <div style={{ marginTop: '1rem', fontWeight: 600 }}>✨ "Design is intelligence made visible"</div>
            </div>
          </div>
        </section>

        <section id="contact" className="contact-section">
          <div className="container" style={{ padding: '3rem 2rem' }}>
            <div className="contact-inner">
              <div className="contact-left">
                <h3>Let's connect</h3>
                <p style={{ margin: '0.8rem 0', opacity: 0.85 }}>
                  Got an ambitious project? or just want to collaborate?<br />
                  I'm ready to build modern web, mobile, or design something iconic.
                </p>
                <div className="social-links">
                  {socialLinks.map((link, idx) => (
                    <a key={idx} href={link.url} target="_blank" rel="noopener noreferrer" aria-label={link.label}>
                      <i className={`fab ${link.icon}`}></i>
                    </a>
                  ))}
                </div>
              </div>
              <div style={{ minWidth: '200px' }}>
                <p><i className="fas fa-envelope"></i> tewodros.m@devportfolio.me</p>
                <p style={{ marginTop: '12px' }}><i className="fas fa-map-marker-alt"></i> Addis Ababa / Remote</p>
                <p style={{ marginTop: '12px' }}><i className="fas fa-clock"></i> Open for freelance & full-time</p>
              </div>
            </div>
            <div className="footer-bottom">
              <p>© 2025 Tewodros Mekonen — Software Dev & Graphics Designer. Built with React + TypeScript.</p>
            </div>
          </div>
        </section>
      </main>
      <ClientChat />
    </>
  );
}

// Debug component to show current route
function DebugInfo() {
  const location = useLocation();
  console.log('Current path:', location.pathname);
  console.log('Admin secret path:', ADMIN_SECRET_PATH);
  console.log('Should match?', location.pathname === `/${ADMIN_SECRET_PATH}`);
  return null;
}

// Main App with Routes
function App() {
  return (
    <>
      <DebugInfo />
      <Routes>
        {/* Admin route with secret path */}
        <Route path={`/${ADMIN_SECRET_PATH}`} element={<AdminPanel />} />
        {/* Main portfolio route */}
        <Route path="/" element={<Portfolio />} />
        {/* Catch all other routes - redirect to home */}
        <Route path="*" element={<Portfolio />} />
        <Route path="/contact" element={<ContactPage />} />
      </Routes>
    </>
  );
}

export default App;