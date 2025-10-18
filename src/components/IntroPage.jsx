import React, { useEffect, useState } from 'react';

const IntroPage = ({ onStartChat }) => {
  const [showModal, setShowModal] = useState(false);
  const [profileData, setProfileData] = useState({
    branch: 'CSE',
    semester: '5',
    batch: '2025'
  });

  useEffect(() => {
    // Apply saved theme
    const savedTheme = localStorage.getItem('gcet_theme');
    if (savedTheme === 'dark') {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }

    // Check if profile already exists
    const saved = localStorage.getItem('userContext');
    let hasProfile = false;
    
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        hasProfile = !!(parsed.branch && parsed.semester && parsed.batch);
        if (hasProfile) {
          setProfileData(parsed);
        }
      } catch (e) {
        // Handle parsing error
      }
    }

    // Show modal after 4 seconds if no profile exists
    if (!hasProfile) {
      const timer = setTimeout(() => {
        setShowModal(true);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleSaveProfile = () => {
    const context = {
      branch: profileData.branch,
      semester: parseInt(profileData.semester, 10),
      batch: profileData.batch
    };
    localStorage.setItem('userContext', JSON.stringify(context));
    setShowModal(false);
  };

  const handleInputChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  return (
    <div className="phone-container">
      <div className="chat-area intro-chat-area">
        <div className="intro-hero-card">
          <div className="intro-hero-header">
            <span className="intro-hero-badge">GCET AI Assistant</span>
            <span className="intro-hero-status">
              <span className="intro-hero-status-dot"></span>
              Ready to assist
            </span>
          </div>
          <div className="intro-hero-tagline">Your college companion</div>
          <div className="intro-hero-body">
            <div className="intro-hero-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="75" height="75">
                {/* Main robot body (rounded rectangle) */}
                <rect x="30" y="35" width="40" height="45" rx="10" fill="none" stroke="currentColor" strokeWidth="3" strokeLinejoin="round"/>
                
                {/* Top panel/screen */}
                <rect x="36" y="42" width="28" height="18" rx="4" fill="currentColor" opacity="0.15"/>
                <rect x="36" y="42" width="28" height="18" rx="4" fill="none" stroke="currentColor" strokeWidth="2"/>
                
                {/* Eyes (digital display style) */}
                <circle cx="44" cy="51" r="3" fill="currentColor"/>
                <circle cx="56" cy="51" r="3" fill="currentColor"/>
                
                {/* Smile line */}
                <path d="M 40 68 Q 50 73 60 68" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                
                {/* Antenna with signal */}
                <line x1="50" y1="35" x2="50" y2="25" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                <circle cx="50" cy="23" r="3.5" fill="currentColor"/>
                <circle cx="50" cy="23" r="6" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.4"/>
                
                {/* Side panels/arms */}
                <rect x="25" y="50" width="5" height="12" rx="2" fill="none" stroke="currentColor" strokeWidth="2"/>
                <rect x="70" y="50" width="5" height="12" rx="2" fill="none" stroke="currentColor" strokeWidth="2"/>
                
                {/* Bottom base */}
                <rect x="35" y="80" width="30" height="8" rx="3" fill="none" stroke="currentColor" strokeWidth="2.5"/>
                
                {/* Graduation cap floating above */}
                <path d="M 22 18 L 50 10 L 78 18 L 50 26 Z" fill="currentColor" opacity="0.2"/>
                <path d="M 22 18 L 50 10 L 78 18 L 50 26 Z" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round"/>
                <rect x="48" y="26" width="4" height="6" fill="currentColor"/>
                <line x1="74" y1="18" x2="80" y2="24" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <circle cx="80" cy="26" r="2" fill="currentColor"/>
                
                {/* Book icon at bottom */}
                <path d="M 42 90 L 42 95 Q 50 97 58 95 L 58 90" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
                <line x1="50" y1="90" x2="50" y2="97" stroke="currentColor" strokeWidth="2"/>
                
                {/* Sparkle effects */}
                <circle cx="18" cy="50" r="1.5" fill="currentColor" opacity="0.6"/>
                <circle cx="82" cy="55" r="1.5" fill="currentColor" opacity="0.6"/>
                <path d="M 15 35 L 16 37 L 18 38 L 16 39 L 15 41 L 14 39 L 12 38 L 14 37 Z" fill="currentColor" opacity="0.5"/>
                <path d="M 85 40 L 86 42 L 88 43 L 86 44 L 85 46 L 84 44 L 82 43 L 84 42 Z" fill="currentColor" opacity="0.5"/>
              </svg>
            </div>
            <div className="intro-hero-copy">
              <p className="intro-hero-desc">
                Your intelligent assistant designed to help GCET students with timetables, exam schedules, and study materials.
              </p>
            </div>
          </div>
        </div>

        {/* Feature callouts */}
        <div className="intro-features">
          <h3 className="intro-features-title">What I can do for you</h3>
          
          <div className="intro-feature-item">
            <div className="intro-feature-icon">📅</div>
            <div className="intro-feature-content">
              <h4>Smart Timetable</h4>
              <p>Get your daily class schedule with subject names, faculty details, and room numbers - all personalized for your branch and semester.</p>
            </div>
          </div>

          <div className="intro-feature-item">
            <div className="intro-feature-icon">📝</div>
            <div className="intro-feature-content">
              <h4>Exam Reminders</h4>
              <p>Stay updated with upcoming exam dates, subjects, and venues. Never miss an important exam again.</p>
            </div>
          </div>

          <div className="intro-feature-item">
            <div className="intro-feature-icon">📚</div>
            <div className="intro-feature-content">
              <h4>Study Materials</h4>
              <p>Upload PDFs and get instant summaries. Share notes and question papers with your classmates easily.</p>
            </div>
          </div>

          <div className="intro-feature-item">
            <div className="intro-feature-icon">🎤</div>
            <div className="intro-feature-content">
              <h4>Voice Support</h4>
              <p>Talk to me naturally with voice commands. Perfect for hands-free operation while studying or walking.</p>
            </div>
          </div>

          <div className="intro-feature-item">
            <div className="intro-feature-icon">🌙</div>
            <div className="intro-feature-content">
              <h4>Dark Mode</h4>
              <p>Comfortable viewing experience that adapts to your environment. Easy on the eyes during late-night study sessions.</p>
            </div>
          </div>

          <div className="intro-feature-item">
            <div className="intro-feature-icon">📱</div>
            <div className="intro-feature-content">
              <h4>Mobile Optimized</h4>
              <p>Designed mobile-first with touch gestures, swipe controls, and responsive design for perfect phone usage.</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Footer */}
      <div className="intro-cta-footer">
        <button className="intro-main-button" onClick={onStartChat}>
          Enter Assistant
        </button>
      </div>

      {/* Profile setup modal */}
      {showModal && (
        <div className="context-modal" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-intro">
              <div className="modal-icon">🎓</div>
              <div>
                <h2>Set up your profile</h2>
                <p>Choose your programme details so I can tailor answers to your timetable and materials.</p>
              </div>
            </div>
            <div className="modal-form">
              <div className="form-group">
                <label htmlFor="branchSelect">Branch</label>
                <select 
                  id="branchSelect" 
                  value={profileData.branch}
                  onChange={(e) => handleInputChange('branch', e.target.value)}
                >
                  <option value="CSE">Computer Science (CSE)</option>
                  <option value="ECE">Electronics & Communication (ECE)</option>
                  <option value="ME">Mechanical Engineering (ME)</option>
                  <option value="CE">Civil Engineering (CE)</option>
                  <option value="EEE">Electrical & Electronics (EEE)</option>
                  <option value="IT">Information Technology (IT)</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="semesterSelect">Semester</label>
                <select 
                  id="semesterSelect" 
                  value={profileData.semester}
                  onChange={(e) => handleInputChange('semester', e.target.value)}
                >
                  <option value="1">1st Semester</option>
                  <option value="2">2nd Semester</option>
                  <option value="3">3rd Semester</option>
                  <option value="4">4th Semester</option>
                  <option value="5">5th Semester</option>
                  <option value="6">6th Semester</option>
                  <option value="7">7th Semester</option>
                  <option value="8">8th Semester</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="batchSelect">Batch Year</label>
                <select 
                  id="batchSelect" 
                  value={profileData.batch}
                  onChange={(e) => handleInputChange('batch', e.target.value)}
                >
                  <option value="2025">Batch 2025</option>
                  <option value="2024">Batch 2024</option>
                  <option value="2023">Batch 2023</option>
                  <option value="2022">Batch 2022</option>
                  <option value="2021">Batch 2021</option>
                  <option value="2020">Batch 2020</option>
                </select>
              </div>
            </div>
            <button className="submit-btn" onClick={handleSaveProfile}>
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default IntroPage;