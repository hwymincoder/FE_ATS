import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || '/api';

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor - attach token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('TOKEN');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Response interceptor - handle errors
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('TOKEN');
      window.location.href = '/login';
    }
    return Promise.reject(error.response?.data || error);
  }
);

export class BaseService {
  constructor(endpoint) {
    this.endpoint = endpoint;
  }

  getAll(params) {
    return apiClient.get(this.endpoint, { params });
  }

  getById(id) {
    return apiClient.get(`${this.endpoint}/${id}`);
  }

  create(data) {
    return apiClient.post(this.endpoint, data);
  }

  update(id, data) {
    return apiClient.put(`${this.endpoint}/${id}`, data);
  }

  delete(id) {
    return apiClient.delete(`${this.endpoint}/${id}`);
  }

  download(url, data, fileName) {
    return apiClient.post(url, data, { responseType: 'blob' }).then((blob) => {
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(new Blob([blob]));
      link.download = fileName || 'download';
      link.click();
    });
  }
}

export { apiClient };
