import React, { useState } from 'react';

const ProfileModal = ({ isOpen, onClose, userContext, onSave }) => {
  const [formData, setFormData] = useState({
    branch: userContext.branch || '',
    semester: userContext.semester || '',
    batch: userContext.batch || ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (!isOpen) return null;

  return (
    <div className="context-modal" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-intro">
          <div className="modal-icon">🎓</div>
          <div>
            <h2>Profile Setup</h2>
            <p>Help us personalize your experience with your academic details</p>
          </div>
        </div>
        
        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="branch">Branch</label>
            <select 
              id="branch" 
              name="branch" 
              value={formData.branch}
              onChange={handleChange}
              required
            >
              <option value="">Select your branch</option>
              <option value="CSE">Computer Science & Engineering</option>
              <option value="ECE">Electronics & Communication</option>
              <option value="EEE">Electrical & Electronics</option>
              <option value="MECH">Mechanical Engineering</option>
              <option value="CIVIL">Civil Engineering</option>
              <option value="IT">Information Technology</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="semester">Semester</label>
            <select 
              id="semester" 
              name="semester" 
              value={formData.semester}
              onChange={handleChange}
              required
            >
              <option value="">Select semester</option>
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
            <label htmlFor="batch">Batch (Year)</label>
            <select 
              id="batch" 
              name="batch" 
              value={formData.batch}
              onChange={handleChange}
              required
            >
              <option value="">Select your batch year</option>
              <option value="2020">2020</option>
              <option value="2021">2021</option>
              <option value="2022">2022</option>
              <option value="2023">2023</option>
              <option value="2024">2024</option>
              <option value="2025">2025</option>
            </select>
          </div>

          <button type="submit" className="submit-btn">
            Save Profile
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileModal;