import AsyncStorage from '@react-native-async-storage/async-storage';
import { AUTH_TOKEN_KEY } from '~/src/lib/constants/token';
// get token from async storage
export const getToken = async () => {
  return await AsyncStorage.getItem(AUTH_TOKEN_KEY);
};

// set token in async storage
export const setToken = async (token: string) => {
  return await AsyncStorage.setItem(AUTH_TOKEN_KEY, token);
};

// remove token from async storage
export const removeToken = async () => {
  return await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
};
