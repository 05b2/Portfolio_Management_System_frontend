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
    return apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  },
  
  verify: async () => {
    return apiRequest('/auth/verify');
  }
};

// About API
export const aboutAPI = {
  get: async () => {
    return apiRequest('/about');
  },
  
  update: async (data) => {
    return apiRequest('/about', {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }
};

// Skills API
export const skillsAPI = {
  getAll: async () => {
    return apiRequest('/skills');
  },
  
  create: async (data) => {
    return apiRequest('/skills', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },
  
  update: async (id, data) => {
    return apiRequest(`/skills/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },
  
  delete: async (id) => {
    return apiRequest(`/skills/${id}`, {
      method: 'DELETE'
    });
  }
};

// Projects API
export const projectsAPI = {
  getAll: async () => {
    return apiRequest('/projects');
  },
  
  getById: async (id) => {
    return apiRequest(`/projects/${id}`);
  },
  
  create: async (data) => {
    return apiRequest('/projects', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },
  
  update: async (id, data) => {
    return apiRequest(`/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },
  
  delete: async (id) => {
    return apiRequest(`/projects/${id}`, {
      method: 'DELETE'
    });
  }
};

// Contact API
export const contactAPI = {
  create: async (data) => {
    return apiRequest('/contact', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },
  
  getAll: async () => {
    return apiRequest('/contact');
  },
  
  update: async (id, data) => {
    return apiRequest(`/contact/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },
  
  delete: async (id) => {
    return apiRequest(`/contact/${id}`, {
      method: 'DELETE'
    });
  }
};