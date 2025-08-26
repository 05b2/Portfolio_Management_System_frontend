const API_URL = import.meta.env.VITE_API_URL;

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` })
  };
};

// Generic API request function
const apiRequest = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      headers: getAuthHeaders(),
      ...options
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'API request failed');
    }
    
    return data;
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);
    throw error;
  }
};

// Auth API
export const authAPI = {
  login: async (email, password) => {
    return apiRequest('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  },
  
  verify: async () => {
    return apiRequest('/api/auth/verify');
  }
};

// About API
export const aboutAPI = {
  get: async () => {
    return apiRequest('/api/about');
  },
  
  update: async (data) => {
    return apiRequest('/api/about', {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }
};

// Skills API
export const skillsAPI = {
  getAll: async () => {
    return apiRequest('/api/skills');
  },
  
  create: async (data) => {
    return apiRequest('/api/skills', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },
  
  update: async (id, data) => {
    return apiRequest(`/api/skills/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },
  
  delete: async (id) => {
    return apiRequest(`/api/skills/${id}`, {
      method: 'DELETE'
    });
  }
};

// Projects API
export const projectsAPI = {
  getAll: async () => {
    return apiRequest('/api/projects');
  },
  
  getById: async (id) => {
    return apiRequest(`/api/projects/${id}`);
  },
  
  create: async (data) => {
    return apiRequest('/api/projects', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },
  
  update: async (id, data) => {
    return apiRequest(`/api/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },
  
  delete: async (id) => {
    return apiRequest(`/api/projects/${id}`, {
      method: 'DELETE'
    });
  }
};

// Contact API
export const contactAPI = {
  create: async (data) => {
    return apiRequest('/api/contact', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },
  
  getAll: async () => {
    return apiRequest('/api/contact');
  },
  
  update: async (id, data) => {
    return apiRequest(`/api/contact/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },
  
  delete: async (id) => {
    return apiRequest(`/api/contact/${id}`, {
      method: 'DELETE'
    });
  }
};