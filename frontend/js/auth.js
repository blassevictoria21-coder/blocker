class AuthManager {
  static async handleRegister(email, password, firstName, lastName) {
    try {
      await api.register(email, password, firstName, lastName);
      window.location.href = 'dashboard.html';
    } catch (error) {
      alert(`Registration failed: ${error.message}`);
    }
  }

  static async handleLogin(email, password) {
    try {
      await api.login(email, password);
      window.location.href = 'dashboard.html';
    } catch (error) {
      alert(`Login failed: ${error.message}`);
    }
  }

  static async logout() {
    await api.logout();
    window.location.href = 'index.html';
  }

  static isAuthenticated() {
    return !!localStorage.getItem('auth_token');
  }

  static requireAuth() {
    if (!this.isAuthenticated()) {
      window.location.href = 'index.html';
    }
  }
}
