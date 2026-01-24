// Servicio centralizado de API

const API_BASE = import.meta.env.VITE_API_URL || '/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE;
  }

  getHeaders() {
    const headers = {
      'Content-Type': 'application/json'
    };
    
    const token = localStorage.getItem('token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    return headers;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...options.headers
      }
    };

    const response = await fetch(url, config);
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Error de red' }));
      throw new Error(error.message || 'Error en la solicitud');
    }

    return response.json();
  }

  // Métodos de autenticación
  async login(email, password) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  }

  async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  }

  async getProfile() {
    return this.request('/auth/me');
  }

  // Métodos de beats
  async getBeats() {
    return this.request('/beats');
  }

  async getBeat(id) {
    return this.request(`/beats/${id}`);
  }

  // Métodos de compras
  async createCheckoutSession(beatId, licenseType) {
    return this.request('/checkout/create-session', {
      method: 'POST',
      body: JSON.stringify({ beatId, licenseType })
    });
  }

  async getUserPurchases() {
    return this.request('/purchases/my-purchases');
  }

  async getPurchase(purchaseId) {
    return this.request(`/purchases/${purchaseId}`);
  }

  // Métodos de descargas
  async getDownloadUrl(purchaseId, fileType) {
    return this.request(`/downloads/url`, {
      method: 'POST',
      body: JSON.stringify({ purchaseId, fileType })
    });
  }

  async trackDownload(purchaseId, fileType) {
    return this.request('/downloads/track', {
      method: 'POST',
      body: JSON.stringify({ purchaseId, fileType })
    });
  }
}

export default new ApiService();
