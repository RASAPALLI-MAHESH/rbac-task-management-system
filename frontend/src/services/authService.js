import apiClient from '../api/axios';
import { clearAuth, getDashboardPath, getToken, setRole, setToken, setUsername } from '../utils/helpers';

const authService = {
  async login(payload) {
    const response = await apiClient.post('/auth/login', payload);
    const token = response?.data?.token;
    const role = response?.data?.role;
    const username = response?.data?.user;

    if (token) {
      setToken(token);
    }

    if (role) {
      setRole(role);
    }

    if (username) {
      setUsername(username);
    }

    return response.data;
  },

  async register(payload) {
    const response = await apiClient.post('/auth/register', payload);
    return response.data;
  },

  async logout() {
    try {
      await apiClient.post('/auth/logout');
    } finally {
      clearAuth();
    }
  },

  getToken() {
    return getToken();
  },

  getDashboardPath(role) {
    return getDashboardPath(role);
  },
};

export default authService;
