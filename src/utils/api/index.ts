import axios from 'axios';
import { getToken } from '../storage/token';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

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
      await AsyncStorage.clear(); // if you want to clear all storage
      router.push('/auth');
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
