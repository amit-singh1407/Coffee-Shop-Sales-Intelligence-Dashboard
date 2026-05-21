import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getOverview = async () => {
  const response = await api.get('/overview');
  return response.data;
};

export const getAnalytics = async () => {
  const response = await api.get('/analytics');
  return response.data;
};

export const getForecast = async () => {
  const response = await api.get('/forecast');
  return response.data;
};

export const getAnomalies = async () => {
  const response = await api.get('/anomaly-detection');
  return response.data;
};

export const getRecommendations = async () => {
  const response = await api.get('/recommendations');
  return response.data;
};

export const getInsights = async () => {
  const response = await api.get('/insights');
  return response.data;
};

export const getDataset = async (params = {}) => {
  const response = await api.get('/dataset', { params });
  return response.data;
};

export const sendChatMessage = async (query) => {
  const response = await api.post('/chatbot', { query });
  return response.data;
};

export default {
  getOverview,
  getAnalytics,
  getForecast,
  getAnomalies,
  getRecommendations,
  getInsights,
  getDataset,
  sendChatMessage,
};
