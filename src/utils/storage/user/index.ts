import * as SecureStore from 'expo-secure-store';
import { UserI } from '~/src/types/user';
import { removeToken } from '../token';
import { AUTH_USER_KEY } from '~/src/lib/constants/token';
import AsyncStorage from '@react-native-async-storage/async-storage';
// get token from async storage
export const getUser = async () => {
  return (await AsyncStorage.getItem(AUTH_USER_KEY)) as unknown as UserI;
};

// set token in async storage
export const setUser = async (user: UserI) => {
  return await AsyncStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
};

// remove token from async storage
export const removeUser = async () => {
  await removeToken();
  return await AsyncStorage.removeItem(AUTH_USER_KEY);
};
