import React, { useState, useEffect } from 'react';
import { contactAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  
  const { isAdmin } = useAuth();

  useEffect(() => {
    if (isAdmin()) {
      fetchMessages();
    }
  }, []);

  const fetchMessages = async () => {
    try {
      const data = await contactAPI.getAll();
      setMessages(data);
    } catch (error) {
      setError('Failed to fetch messages');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      await contactAPI.create(formData);
      setSuccess('Message sent successfully!');
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      setError('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const updateMessageStatus = async (id, status) => {
    try {
      await contactAPI.update(id, { status });
      setMessages(messages.map(msg => 
        msg._id === id ? { ...msg, status } : msg
      ));
    } catch (error) {
      setError('Failed to update message status');
    }
  };

  const deleteMessage = async (id) => {
    if (!confirm('Are you sure you want to delete this message?')) return;
    
    try {
      await contactAPI.delete(id);
      setMessages(messages.filter(msg => msg._id !== id));
    } catch (error) {
      setError('Failed to delete message');
    }
  };

  return (
    <div className="contact-container">
      <h1>Contact Me</h1>
      
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      
      <div className="contact-content">
        <section className="contact-form-section">
          <h2>Send me a message</h2>
          <form className="contact-form" onSubmit={handleSubmit}>
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
              <label>Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Message</label>
              <textarea
                value={formData.message}
                onChange={(e) => handleInputChange('message', e.target.value)}
                rows={5}
                required
              />
            </div>
            
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </section>
        
        {isAdmin() && (
          <section className="messages-section">
            <h2>Received Messages</h2>
            {messages.length === 0 ? (
              <p>No messages yet.</p>
            ) : (
              <div className="messages-list">
                {messages.map(message => (
                  <div key={message._id} className={`message-card ${message.status}`}>
                    <div className="message-header">
                      <h3>{message.name}</h3>
                      <span className="message-email">{message.email}</span>
                      <span className={`status-badge ${message.status}`}>
                        {message.status}
                      </span>
                    </div>
                    
                    <div className="message-content">
                      <p>{message.message}</p>
                    </div>
                    
                    <div className="message-footer">
                      <span className="message-date">
                        {new Date(message.createdAt).toLocaleDateString()}
                      </span>
                      
                      <div className="message-actions">
                        <select
                          value={message.status}
                          onChange={(e) => updateMessageStatus(message._id, e.target.value)}
                        >
                          <option value="unread">Unread</option>
                          <option value="read">Read</option>
                          <option value="replied">Replied</option>
                        </select>
                        
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => deleteMessage(message._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
};

export default Contact;