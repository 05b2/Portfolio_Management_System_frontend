import React, { useState, useEffect } from 'react';
import { projectsAPI, skillsAPI, contactAPI } from '../services/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    projects: 0,
    skills: 0,
    messages: 0,
    unreadMessages: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [projects, skills, messages] = await Promise.all([
        projectsAPI.getAll(),
        skillsAPI.getAll(),
        contactAPI.getAll()
      ]);
      
      setStats({
        projects: projects.length,
        skills: skills.length,
        messages: messages.length,
        unreadMessages: messages.filter(msg => msg.status === 'unread').length
      });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading dashboard...</div>;

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      
      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Projects</h3>
          <div className="stat-number">{stats.projects}</div>
          <p>Total projects in portfolio</p>
        </div>
        
        <div className="stat-card">
          <h3>Skills</h3>
          <div className="stat-number">{stats.skills}</div>
          <p>Skills showcased</p>
        </div>
        
        <div className="stat-card">
          <h3>Messages</h3>
          <div className="stat-number">{stats.messages}</div>
          <p>Total contact messages</p>
        </div>
        
        <div className="stat-card highlight">
          <h3>Unread</h3>
          <div className="stat-number">{stats.unreadMessages}</div>
          <p>Unread messages</p>
        </div>
      </div>
      
      <div className="dashboard-actions">
        <h2>Quick Actions</h2>
        <div className="action-cards">
          <div className="action-card">
            <h3>Content Management</h3>
            <p>Use the navigation menu to:</p>
            <ul>
              <li>Edit your About section</li>
              <li>Add/edit Skills</li>
              <li>Manage Projects</li>
              <li>Review Contact messages</li>
            </ul>
          </div>
          
          <div className="action-card">
            <h3>Recent Activity</h3>
            <p>Dashboard Overview:</p>
            <ul>
              <li>Portfolio sections: 4</li>
              <li>Last login: Just now</li>
              <li>System status: Online</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;