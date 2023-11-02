/**
 * Handle get/set user token
 * @type {{get: (function()), set: (function(*=))}}
 */
import AsyncStorage from '@react-native-community/async-storage';

export const USER_TOKEN = {
  get: async () => await AsyncStorage.getItem('userToken'),
  set: async (newValue) => {
    await AsyncStorage.setItem('userToken', newValue);
  },
  delete: async () => await AsyncStorage.removeItem('userToken'),
  setTokenImage: async (newValue) => {
    await AsyncStorage.setItem('userTokenImage', `bearer ${newValue}`);
  },
  getTokenImage: async () => await AsyncStorage.getItem('userTokenImage'),
  deleteTokenImage: async () => await AsyncStorage.removeItem('userTokenImage'),
};

export const SOCKET_ID = {
  get: async () => await AsyncStorage.getItem('socketId'),
  set: async (newValue) => {
    await AsyncStorage.setItem('socketId', newValue);
  },
  delete: async () => await AsyncStorage.removeItem('socketId'),
};

export const DEVICE_TOKEN = {
  get: async () => await AsyncStorage.getItem('deviceToken'),
  set: async (newValue) => {
    await AsyncStorage.setItem('deviceToken', newValue);
  },
  delete: async () => await AsyncStorage.removeItem('deviceToken'),
};

export const IP_ADDRESS = {
  get: async () => await AsyncStorage.getItem('ipAddress'),
  set: async (newValue) => {
    await AsyncStorage.setItem('ipAddress', newValue);
  },
  delete: async () => await AsyncStorage.removeItem('@notification'),
};
