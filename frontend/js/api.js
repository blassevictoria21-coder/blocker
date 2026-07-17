const API_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:5000'
  : process.env.REACT_APP_API_URL || window.location.origin;

class SpamBlockerAPI {
  constructor() {
    this.token = localStorage.getItem('auth_token');
  }

  setToken(token) {
    this.token = token;
    localStorage.setItem('auth_token', token);
  }

  getHeaders() {
    return {
      'Content-Type': 'application/json',
      ...(this.token && { 'Authorization': `Bearer ${this.token}` }),
    };
  }

  async request(endpoint, options = {}) {
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'API request failed');
      }

      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Auth methods
  async register(email, password, firstName, lastName) {
    const data = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, firstName, lastName }),
    });
    this.setToken(data.token);
    return data;
  }

  async login(email, password) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    this.setToken(data.token);
    return data;
  }

  async logout() {
    localStorage.removeItem('auth_token');
    this.token = null;
  }

  async getCurrentUser() {
    return this.request('/auth/me');
  }

  // Email methods
  async classifyEmail(from, to, subject) {
    return this.request('/emails/classify', {
      method: 'POST',
      body: JSON.stringify({ from, to, subject }),
    });
  }

  async getEmails(limit = 50, offset = 0, filter = 'all') {
    return this.request(`/emails?limit=${limit}&offset=${offset}&filter=${filter}`);
  }

  async deleteEmail(emailId) {
    return this.request(`/emails/${emailId}`, { method: 'DELETE' });
  }

  // Stats methods
  async getDashboardStats() {
    return this.request('/stats/dashboard');
  }
}

const api = new SpamBlockerAPI();
