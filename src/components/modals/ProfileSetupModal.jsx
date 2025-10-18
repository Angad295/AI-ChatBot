import React, { useState } from 'react';

/**
 * ProfileSetupModal Component
 * Modal for setting up user profile (branch, semester, batch)
 */
function ProfileSetupModal({ isOpen, onClose, onSave }) {
  const [branch, setBranch] = useState('');
  const [semester, setSemester] = useState('');
  const [batch, setBatch] = useState('');
  const [error, setError] = useState('');

  const branches = [
    'Computer Science Engineering',
    'Electronics & Communication Engineering',
    'Electrical Engineering',
    'Mechanical Engineering',
    'Civil Engineering'
  ];

  const semesters = ['1', '2', '3', '4', '5', '6', '7', '8'];

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!branch || !semester || !batch) {
      setError('Please fill all fields');
      return;
    }

    onSave({
      branch,
      semester,
      batch
    });

    // Reset form
    setBranch('');
    setSemester('');
    setBatch('');
    setError('');
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content profile-modal">
        <h2>Setup Your Profile</h2>
        <p className="modal-subtitle">Help us personalize your experience</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="branch">Branch of Study</label>
            <select
              id="branch"
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
            >
              <option value="">Select your branch</option>
              {branches.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="semester">Semester</label>
            <select
              id="semester"
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
            >
              <option value="">Select your semester</option>
              {semesters.map((s) => (
                <option key={s} value={s}>Semester {s}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="batch">Batch Year</label>
            <input
              id="batch"
              type="text"
              placeholder="e.g., 2024"
              value={batch}
              onChange={(e) => setBatch(e.target.value)}
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="modal-btn primary">
            Continue
          </button>
        </form>
      </div>
    </div>
  );
}

export default ProfileSetupModal;
