import * as SecureStore from 'expo-secure-store';
import { UserI } from '~/src/types/user';
import { removeToken } from '../token';
import { AUTH_USER_KEY } from '~/src/lib/constants/token';
// get token from async storage
export const getUser = async () => {
  return await SecureStore.getItemAsync(AUTH_USER_KEY);
};

// set token in async storage
export const setUser = async (user: UserI) => {
  return await SecureStore.setItemAsync(AUTH_USER_KEY, JSON.stringify(user));
};

// remove token from async storage
export const removeUser = async () => {
  await removeToken();
  return await SecureStore.deleteItemAsync(AUTH_USER_KEY);
};
