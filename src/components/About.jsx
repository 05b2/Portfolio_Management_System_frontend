import React, { useState, useEffect } from 'react';
import { aboutAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const About = () => {
  const [about, setAbout] = useState({
    bio: '',
    interests: [],
    experience: '',
    education: '',
    location: '',
    resumeUrl: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  
  const { isAdmin } = useAuth();

  useEffect(() => {
    fetchAbout();
  }, []);

  const fetchAbout = async () => {
    try {
      const data = await aboutAPI.get();
      setAbout(data);
      setFormData(data);
    } catch (error) {
      setError('Failed to fetch about information');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setEditing(true);
    setFormData({ ...about });
  };

  const handleCancel = () => {
    setEditing(false);
    setFormData({ ...about });
  };

  const handleSave = async () => {
    try {
      const updatedAbout = await aboutAPI.update(formData);
      setAbout(updatedAbout);
      setEditing(false);
      setError('');
    } catch (error) {
      setError('Failed to update about information');
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleInterestsChange = (value) => {
    const interests = value.split(',').map(item => item.trim()).filter(item => item);
    setFormData(prev => ({
      ...prev,
      interests
    }));
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="about-container">
      <h1>About Me</h1>
      
      {error && <div className="error-message">{error}</div>}
      
      {editing ? (
        <div className="about-form">
          <div className="form-group">
            <label>Bio</label>
            <textarea
              value={formData.bio || ''}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              rows={5}
            />
          </div>
          
          <div className="form-group">
            <label>Interests (comma separated)</label>
            <input
              type="text"
              value={formData.interests?.join(', ') || ''}
              onChange={(e) => handleInterestsChange(e.target.value)}
            />
          </div>
          
          <div className="form-group">
            <label>Experience</label>
            <textarea
              value={formData.experience || ''}
              onChange={(e) => handleInputChange('experience', e.target.value)}
              rows={3}
            />
          </div>
          
          <div className="form-group">
            <label>Education</label>
            <textarea
              value={formData.education || ''}
              onChange={(e) => handleInputChange('education', e.target.value)}
              rows={3}
            />
          </div>
          
          <div className="form-group">
            <label>Location</label>
            <input
              type="text"
              value={formData.location || ''}
              onChange={(e) => handleInputChange('location', e.target.value)}
            />
          </div>
          
          <div className="form-group">
            <label>Resume URL</label>
            <input
              type="url"
              value={formData.resumeUrl || ''}
              onChange={(e) => handleInputChange('resumeUrl', e.target.value)}
            />
          </div>
          
          <div className="form-actions">
            <button className="btn btn-primary" onClick={handleSave}>
              Save
            </button>
            <button className="btn btn-secondary" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="about-content">
          {about.bio && (
            <section className="bio-section">
              <h2>Bio</h2>
              <p>{about.bio}</p>
            </section>
          )}
          
          {about.interests?.length > 0 && (
            <section className="interests-section">
              <h2>Interests</h2>
              <div className="interests-list">
                {about.interests.map((interest, index) => (
                  <span key={index} className="interest-tag">
                    {interest}
                  </span>
                ))}
              </div>
            </section>
          )}
          
          {about.experience && (
            <section className="experience-section">
              <h2>Experience</h2>
              <p>{about.experience}</p>
            </section>
          )}
          
          {about.education && (
            <section className="education-section">
              <h2>Education</h2>
              <p>{about.education}</p>
            </section>
          )}
          
          {about.location && (
            <section className="location-section">
              <h2>Location</h2>
              <p>{about.location}</p>
            </section>
          )}
          
          {about.resumeUrl && (
            <section className="resume-section">
              <a 
                href={about.resumeUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                Download Resume
              </a>
            </section>
          )}
          
          {isAdmin() && (
            <div className="admin-actions">
              <button className="btn btn-secondary" onClick={handleEdit}>
                Edit About
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default About;