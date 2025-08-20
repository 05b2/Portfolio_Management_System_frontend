import React, { useState, useEffect } from 'react';
import { skillsAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const Skills = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    iconUrl: '',
    category: 'other',
    proficiency: 3
  });
  
  const { isAdmin } = useAuth();

  const categories = ['frontend', 'backend', 'database', 'tools', 'other'];

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const data = await skillsAPI.getAll();
      setSkills(data);
    } catch (error) {
      setError('Failed to fetch skills');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingSkill) {
        const updatedSkill = await skillsAPI.update(editingSkill._id, formData);
        setSkills(skills.map(skill => 
          skill._id === editingSkill._id ? updatedSkill : skill
        ));
      } else {
        const newSkill = await skillsAPI.create(formData);
        setSkills([...skills, newSkill]);
      }
      
      resetForm();
      setError('');
    } catch (error) {
      setError(`Failed to ${editingSkill ? 'update' : 'create'} skill`);
    }
  };

  const handleEdit = (skill) => {
    setEditingSkill(skill);
    setFormData({
      name: skill.name,
      iconUrl: skill.iconUrl,
      category: skill.category,
      proficiency: skill.proficiency
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this skill?')) return;
    
    try {
      await skillsAPI.delete(id);
      setSkills(skills.filter(skill => skill._id !== id));
    } catch (error) {
      setError('Failed to delete skill');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      iconUrl: '',
      category: 'other',
      proficiency: 3
    });
    setEditingSkill(null);
    setShowForm(false);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const groupedSkills = skills.reduce((acc, skill) => {
    const category = skill.category || 'other';
    if (!acc[category]) acc[category] = [];
    acc[category].push(skill);
    return acc;
  }, {});

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="skills-container">
      <div className="skills-header">
        <h1>Skills</h1>
        {isAdmin() && (
          <button 
            className="btn btn-primary"
            onClick={() => setShowForm(true)}
          >
            Add Skill
          </button>
        )}
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      {showForm && (
        <div className="skill-form-container">
          <form className="skill-form" onSubmit={handleSubmit}>
            <h3>{editingSkill ? 'Edit Skill' : 'Add New Skill'}</h3>
            
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Icon URL</label>
              <input
                type="url"
                value={formData.iconUrl}
                onChange={(e) => handleInputChange('iconUrl', e.target.value)}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Category</label>
              <select
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label>Proficiency (1-5)</label>
              <input
                type="range"
                min="1"
                max="5"
                value={formData.proficiency}
                onChange={(e) => handleInputChange('proficiency', parseInt(e.target.value))}
              />
              <span className="proficiency-value">{formData.proficiency}</span>
            </div>
            
            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                {editingSkill ? 'Update' : 'Add'} Skill
              </button>
              <button type="button" className="btn btn-secondary" onClick={resetForm}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
      
      <div className="skills-grid">
        {categories.map(category => {
          const categorySkills = groupedSkills[category];
          if (!categorySkills?.length) return null;
          
          return (
            <div key={category} className="skill-category">
              <h2 className="category-title">
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </h2>
              <div className="skills-list">
                {categorySkills.map(skill => (
                  <div key={skill._id} className="skill-card">
                    <div className="skill-icon">
                      <img src={skill.iconUrl} alt={skill.name} />
                    </div>
                    <h3 className="skill-name">{skill.name}</h3>
                    <div className="skill-proficiency">
                      {[...Array(5)].map((_, i) => (
                        <span 
                          key={i} 
                          className={`star ${i < skill.proficiency ? 'filled' : ''}`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    
                    {isAdmin() && (
                      <div className="skill-actions">
                        <button 
                          className="btn btn-sm btn-secondary"
                          onClick={() => handleEdit(skill)}
                        >
                          Edit
                        </button>
                        <button 
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(skill._id)}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Skills;