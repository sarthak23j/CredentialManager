import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const login = (username, password) => api.post('/login', { username, password });
export const register = (username, password) => api.post('/register', { username, password });
export const getCredentials = (username) => api.get(`/credentials/${username}`);
export const addCredential = (username, service, data) => api.post('/credentials', { username, service, data });
export const updateCredential = (username, service, data) => api.post('/credentials/update', { username, service, data });
export const importCredentials = (username, credentials) => api.post('/credentials/import', { username, credentials });
export const deleteCredential = (username, service) => api.delete('/credentials/delete', { data: { username, service } });
export const searchCredentials = (username, query) => api.post('/credentials/search', { username, query });
export const changePassword = (username, oldPassword, newPassword) => api.post('/change-password', { username, old_password: oldPassword, new_password: newPassword });

export default api;
