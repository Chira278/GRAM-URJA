import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/pages.css';

const AboutPage = () => {
  const navigate = useNavigate();

  return (
    <div className="about-container">
      <button className="btn-back" onClick={() => navigate('/login')}>← Back</button>

      <div className="about-content">
        <h1>🌱 GRAM URJA</h1>
        <p className="tagline">Renewable Energy Intelligence for Rural India</p>

        <section className="about-section">
          <h2>About GRAM URJA</h2>
          <p>
            GRAM URJA is an innovative platform designed to assess and promote renewable energy adoption in rural villages across India. 
            Our mission is to empower communities with data-driven insights about their renewable energy potential.
          </p>
        </section>

        <section className="about-section">
          <h2>Vision</h2>
          <p>
            To transform rural India through sustainable renewable energy solutions, enabling every village to harness its natural energy resources 
            for economic growth and environmental sustainability.
          </p>
        </section>

        <section className="about-section">
          <h2>Key Features</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">☀️</div>
              <h3>Solar Energy</h3>
              <p>Assess solar potential based on geographical and climatic factors</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💨</div>
              <h3>Wind Energy</h3>
              <p>Evaluate wind resources for small-scale turbine installation</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🌱</div>
              <h3>Biomass Energy</h3>
              <p>Analyze agricultural waste for biogas production potential</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💧</div>
              <h3>Hydro Energy</h3>
              <p>Identify micro-hydro project opportunities in your region</p>
            </div>
          </div>
        </section>

        <section className="about-section">
          <h2>How It Works</h2>
          <ol className="steps-list">
            <li><strong>Add Village:</strong> Enter your village details and location</li>
            <li><strong>Analyze:</strong> Our AI analyzes solar, wind, biomass, and hydro potential</li>
            <li><strong>Get Insights:</strong> Receive personalized energy recommendations</li>
            <li><strong>Generate Report:</strong> Download comprehensive analysis reports</li>
            <li><strong>Take Action:</strong> Implement recommended energy solutions</li>
          </ol>
        </section>

        <section className="about-section">
          <h2>Energy Scores Explained</h2>
          <div className="scores-table">
            <div className="score-row">
              <div className="score-label">85-100</div>
              <div className="score-desc">Excellent - Highly recommended for implementation</div>
            </div>
            <div className="score-row">
              <div className="score-label">70-84</div>
              <div className="score-desc">Very Good - Strong potential, favorable conditions</div>
            </div>
            <div className="score-row">
              <div className="score-label">50-69</div>
              <div className="score-desc">Moderate - Worth considering with proper planning</div>
            </div>
            <div className="score-row">
              <div className="score-label">Below 50</div>
              <div className="score-desc">Low - May require additional investments or alternatives</div>
            </div>
          </div>
        </section>

        <section className="about-section">
          <h2>Benefits</h2>
          <ul className="benefits-list">
            <li>✓ Reduce electricity costs for rural communities</li>
            <li>✓ Create sustainable livelihoods through green energy</li>
            <li>✓ Minimize environmental impact</li>
            <li>✓ Access to reliable energy supply 24/7</li>
            <li>✓ Government subsidies and financing options</li>
            <li>✓ Long-term cost savings</li>
          </ul>
        </section>

        <section className="about-section">
          <h2>Technology Stack</h2>
          <p>
            Built with modern web technologies:
            React • Recharts • Framer Motion • Node.js • Flask
          </p>
        </section>

        <section className="about-section">
          <h2>Get Started</h2>
          <p>
            Ready to assess your village's renewable energy potential?
          </p>
          <button className="btn-get-started" onClick={() => navigate('/login')}>
            Login & Get Started
          </button>
        </section>

        <footer className="about-footer">
          <p>&copy; 2025 GRAM URJA - Empowering Rural India with Renewable Energy</p>
        </footer>
      </div>
    </div>
  );
};

export default AboutPage;
