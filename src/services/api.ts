import axios from 'axios';

export const api = axios.create({
    baseURL: 'http://localhost:3000', 
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('coleta_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

api.interceptors.response.use(response => response, error => {
    if (error.response?.status === 401 || error.response?.status === 403) {
        localStorage.removeItem('coleta_token');

    }
    return Promise.reject(error);
});