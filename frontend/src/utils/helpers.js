export const TOKEN_KEY = 'authToken';
export const ROLE_KEY = 'authRole';
export const USERNAME_KEY = 'authUsername';
export const API_VERSION_KEY = 'apiVersion';

export const setToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const setRole = (role) => {
  if (role) {
    localStorage.setItem(ROLE_KEY, role);
  }
};

export const setUsername = (username) => {
  if (username) {
    localStorage.setItem(USERNAME_KEY, username);
  }
};

export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

export const getRole = () => {
  return localStorage.getItem(ROLE_KEY);
};

export const getUsername = () => {
  return localStorage.getItem(USERNAME_KEY);
};

export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

export const removeRole = () => {
  localStorage.removeItem(ROLE_KEY);
};

export const removeUsername = () => {
  localStorage.removeItem(USERNAME_KEY);
};

export const clearAuth = () => {
  removeToken();
  removeRole();
  removeUsername();
};

export const setApiVersion = (version) => {
  if (version === 'v1' || version === 'v2') {
    localStorage.setItem(API_VERSION_KEY, version);
  }
};

export const getApiVersion = () => {
  const savedVersion = localStorage.getItem(API_VERSION_KEY);
  return savedVersion === 'v2' ? 'v2' : 'v1';
};

export const removeApiVersion = () => {
  localStorage.removeItem(API_VERSION_KEY);
};

export const isAuthenticated = () => {
  return Boolean(getToken());
};

export const getDashboardPath = (role) => {
  return role === 'admin' ? '/admin-dashboard' : '/user-dashboard';
};
