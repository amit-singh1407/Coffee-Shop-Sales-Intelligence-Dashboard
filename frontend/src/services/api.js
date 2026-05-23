import axios from 'axios';
import {
  getDemoAnalytics,
  getDemoAnomalies,
  getDemoChatbotReply,
  getDemoDataset,
  getDemoForecast,
  getDemoInsights,
  getDemoRecommendations,
  getDemoOverview,
} from './demoData';

const DEFAULT_API_BASE_URL = 'http://localhost:5000/api';
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE_URL).replace(/\/$/, '');
const USE_DEMO_DATA = !import.meta.env.VITE_API_BASE_URL || /localhost|127\.0\.0\.1/.test(API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const withDemoFallback = async (requestFn, demoFn) => {
  if (USE_DEMO_DATA) {
    return demoFn();
  }

  try {
    return await requestFn();
  } catch (error) {
    console.warn('Backend API request failed. Falling back to demo data.', error);
    return demoFn();
  }
};

export const getOverview = async () => {
  return withDemoFallback(async () => {
    const response = await api.get('/overview');
    return response.data;
  }, getDemoOverview);
};

export const getAnalytics = async () => {
  return withDemoFallback(async () => {
    const response = await api.get('/analytics');
    return response.data;
  }, getDemoAnalytics);
};

export const getForecast = async () => {
  return withDemoFallback(async () => {
    const response = await api.get('/forecast');
    return response.data;
  }, getDemoForecast);
};

export const getAnomalies = async () => {
  return withDemoFallback(async () => {
    const response = await api.get('/anomaly-detection');
    return response.data;
  }, getDemoAnomalies);
};

export const getRecommendations = async () => {
  return withDemoFallback(async () => {
    const response = await api.get('/recommendations');
    return response.data;
  }, getDemoRecommendations);
};

export const getInsights = async () => {
  return withDemoFallback(async () => {
    const response = await api.get('/insights');
    return response.data;
  }, getDemoInsights);
};

export const getDataset = async (params = {}) => {
  return withDemoFallback(async () => {
    const response = await api.get('/dataset', { params });
    return response.data;
  }, () => getDemoDataset(params));
};

export const sendChatMessage = async (query) => {
  return withDemoFallback(async () => {
    const response = await api.post('/chatbot', { query });
    return response.data;
  }, () => getDemoChatbotReply(query));
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
