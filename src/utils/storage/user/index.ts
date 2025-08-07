import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserI } from '~/src/types/user';
import { removeToken } from '../token';
// get token from async storage
export const getUser = async () => {
  return await AsyncStorage.getItem('user');
};

// set token in async storage
export const setUser = async (user: UserI) => {
  return await AsyncStorage.setItem('user', JSON.stringify(user));
};

// remove token from async storage
export const removeUser = async () => {
  removeToken();
  return await AsyncStorage.removeItem('user');
};
