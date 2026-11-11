const BASE_URL = '/api';

const getHeaders = () => {
  const token = localStorage.getItem('dirtrace_token');
  const headers = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

export const api = {
  // Auth
  async login(email, password) {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Login failed');
    return data;
  },

  async register(payload) {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Registration failed');
    return data;
  },

  async getMe() {
    const res = await fetch(`${BASE_URL}/auth/me`, {
      headers: getHeaders()
    });
    if (!res.ok) throw new Error('Session invalid');
    return res.json();
  },

  // Events
  async getEvents() {
    const res = await fetch(`${BASE_URL}/events`);
    if (!res.ok) throw new Error('Failed to load events');
    return res.json();
  },

  async getEvent(id) {
    const res = await fetch(`${BASE_URL}/events/${id}`);
    if (!res.ok) throw new Error('Event not found');
    return res.json();
  },

  async checkDuplicate(payload) {
    const res = await fetch(`${BASE_URL}/events/check-duplicate`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload)
    });
    return res.json();
  },

  async createEvent(payload) {
    const res = await fetch(`${BASE_URL}/events`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to create event');
    return data;
  },

  async upgradeEventPro(eventId) {
    const res = await fetch(`${BASE_URL}/events/${eventId}/upgrade-pro`, {
      method: 'POST',
      headers: getHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to upgrade event');
    return data;
  },

  async registerForEvent(eventId, payload) {
    const res = await fetch(`${BASE_URL}/events/${eventId}/register`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Registration failed');
    return data;
  },

  // Clubs
  async getClubs() {
    const res = await fetch(`${BASE_URL}/clubs`);
    if (!res.ok) throw new Error('Failed to load clubs');
    return res.json();
  },

  async createClub(payload) {
    const res = await fetch(`${BASE_URL}/clubs`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to create club');
    return data;
  },

  async payClubActivation(clubId) {
    const res = await fetch(`${BASE_URL}/clubs/${clubId}/pay-activation`, {
      method: 'POST',
      headers: getHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Activation failed');
    return data;
  },

  // Dashboards
  async getRiderDashboard() {
    const res = await fetch(`${BASE_URL}/dashboard/rider`, {
      headers: getHeaders()
    });
    if (!res.ok) throw new Error('Failed to load rider dashboard');
    return res.json();
  },

  async getClubDashboard() {
    const res = await fetch(`${BASE_URL}/dashboard/club`, {
      headers: getHeaders()
    });
    if (!res.ok) throw new Error('Failed to load club dashboard');
    return res.json();
  },

  async getStats() {
    const res = await fetch(`${BASE_URL}/platform-stats`);
    if (!res.ok) throw new Error('Failed to fetch stats');
    return res.json();
  }
};
