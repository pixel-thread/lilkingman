import AsyncStorage from '@react-native-async-storage/async-storage';
// get token from async storage
export const getToken = async () => {
  return await AsyncStorage.getItem('token');
};

// set token in async storage
export const setToken = async (token: string) => {
  return await AsyncStorage.setItem('token', token);
};

// remove token from async storage
export const removeToken = async () => {
  return await AsyncStorage.removeItem('token');
};
