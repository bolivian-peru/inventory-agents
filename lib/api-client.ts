/**
 * IFA API Client
 * Handles all communication with the backend API
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://app.inventoryforagents.xyz';

export interface User {
  id: string;
  email: string;
  name?: string;
  createdAt: string;
}

export interface Agent {
  id: string;
  name: string;
  status: 'provisioning' | 'active' | 'paused' | 'error';
  shopId?: string;
  shopName?: string;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export class APIClient {
  private getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('ifa_token');
  }

  private setToken(token: string) {
    if (typeof window === 'undefined') return;
    localStorage.setItem('ifa_token', token);
  }

  clearToken() {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('ifa_token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  // Auth endpoints
  async register(email: string, password: string, name?: string): Promise<AuthResponse> {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name })
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({ error: 'Registration failed' }));
      throw new Error(error.error || 'Registration failed');
    }

    const data = await res.json();
    if (data.token) {
      this.setToken(data.token);
    }
    return data;
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({ error: 'Login failed' }));
      throw new Error(error.error || 'Login failed');
    }

    const data = await res.json();
    if (data.token) {
      this.setToken(data.token);
    }
    return data;
  }

  async getMe(): Promise<User> {
    const token = this.getToken();
    if (!token) throw new Error('Not authenticated');

    const res = await fetch(`${API_URL}/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!res.ok) {
      if (res.status === 401) {
        this.clearToken();
        throw new Error('Session expired');
      }
      throw new Error('Failed to fetch user data');
    }

    return res.json();
  }

  // Agent endpoints
  async getAgents(): Promise<Agent[]> {
    const token = this.getToken();
    if (!token) throw new Error('Not authenticated');

    const res = await fetch(`${API_URL}/agents`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!res.ok) {
      throw new Error('Failed to fetch agents');
    }

    return res.json();
  }

  async createAgent(name: string): Promise<Agent> {
    const token = this.getToken();
    if (!token) throw new Error('Not authenticated');

    const res = await fetch(`${API_URL}/agents`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name })
    });

    if (!res.ok) {
      throw new Error('Failed to create agent');
    }

    return res.json();
  }

  // Etsy OAuth
  getEtsyAuthUrl(): string {
    return `${API_URL}/etsy/oauth/authorize`;
  }

  async getProducts() {
    const token = this.getToken();
    if (!token) throw new Error('Not authenticated');

    const res = await fetch(`${API_URL}/products`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!res.ok) {
      throw new Error('Failed to fetch products');
    }

    return res.json();
  }

  async syncProducts() {
    const token = this.getToken();
    if (!token) throw new Error('Not authenticated');

    const res = await fetch(`${API_URL}/products/sync`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!res.ok) {
      throw new Error('Failed to sync products');
    }

    return res.json();
  }
}

export const api = new APIClient();
