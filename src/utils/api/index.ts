import axios from 'axios';
import { getToken } from '../storage/token';
import * as SecureStore from 'expo-secure-store';
import { router } from 'expo-router';
import { AUTH_TOKEN_KEY } from '~/src/lib/constants/token';

const axiosInstance = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  timeout: 10000,
});

axiosInstance.interceptors.request.use(
  async (config) => {
    const token = await getToken();
    if (!!token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await SecureStore.deleteItemAsync(AUTH_TOKEN_KEY);
      router.push('/auth');
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
