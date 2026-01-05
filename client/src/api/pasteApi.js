import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add test mode header if in test environment
if (import.meta.env.VITE_TEST_MODE === '1') {
  api.interceptors.request.use((config) => {
    const testTime = localStorage.getItem('test-now-ms');
    if (testTime) {
      config.headers['x-test-now-ms'] = testTime;
    }
    return config;
  });
}

export const pasteApi = {
  // Health check
  healthCheck: () => api.get('/healthz'),

  // Create paste
  createPaste: (data) => api.post('/pastes', data),

  // Get paste (API)
  getPaste: (id) => api.get(`/pastes/${id}`),
};

export default api;
