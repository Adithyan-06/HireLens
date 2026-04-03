import axios from 'axios';

const API_BASE_URL = 'https://hirelens-oowi.onrender.com/';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

// Automatically attach Supabase Token to requests
apiClient.interceptors.request.use(async (config) => {
  const { data } = await apiClient.get('/auth/session'); // Or get from local state
  // config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const jobService = {
  search: (params) => apiClient.get('/jobs/search', { params }),
  getDetails: (id) => apiClient.get(`/jobs/${id}`),
};

export const aiService = {
  parseResume: (formData) => apiClient.post('/resume/parse', formData),
  generateRoadmap: (data) => apiClient.post('/roadmap/generate', data),
};