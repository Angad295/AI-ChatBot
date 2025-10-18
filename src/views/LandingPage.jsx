import React from 'react';

/**
 * LandingPage Component
 * The initial landing/intro page before entering the chat
 */
function LandingPage({ onStartChat, theme, onToggleTheme }) {
  return (
    <div className="landing-page">
      <div className="landing-container">
        <div className="landing-header">
          <div className="logo-area">
            <div className="logo-icon">🎓</div>
            <h1>GCET College Assistant</h1>
          </div>
        </div>

        <div className="landing-content">
          <p className="tagline">Your intelligent academic companion</p>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">📅</div>
              <h3>Smart Timetable</h3>
              <p>Get your personalized class schedule instantly</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">📝</div>
              <h3>Exam Reminders</h3>
              <p>Stay updated with exam dates and venues</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">📚</div>
              <h3>Study Materials</h3>
              <p>Access notes, question papers, and resources</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🔔</div>
              <h3>Instant Updates</h3>
              <p>Receive notifications about important events</p>
            </div>
          </div>

          <button className="start-btn" onClick={onStartChat}>
            Start Chatting
            <span className="btn-arrow">→</span>
          </button>

          <div className="landing-footer">
            <p>Made with ❤️ for GCET students</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
