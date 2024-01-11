import {Platform} from "react-native";

const URL_DEV = Platform.select({
  android: 'http://10.0.2.2:3000',
  ios: 'http://localhost:3000'
})

const URL_PRODUCTION = "https://tutor-api.onrender.com"

const CURRENT_BASE_URL = __DEV__ ?  URL_DEV : URL_PRODUCTION;

export default {
  API_BASE_URL: CURRENT_BASE_URL, // API_BASE_URL: 'http://10.0.2.2:3000' for local android, http://localhost:3000 for ios
  UPLOAD_BASE_URL: 'https://dev-api.k-will.xyz/v1',
  DOWNLOAD_BASE_URL: 'https://dev-api.k-will.xyz/v1',
  API_CLASS_URL: 'https://dev-api.k-will.xyz/v1',
  IMAGE_LG_URL: 'https://dev-api.k-will.xyz/v1',
  IMAGE_MD_URL: 'https://dev-api.k-will.xyz/v1',
  IMAGE_SM_URL: 'https://dev-api.k-will.xyz/v1',
  SOCKET_HOST: CURRENT_BASE_URL,
  NOTIFICATION_URL: 'https://dev-api.k-will.xyz/v1',
  API_PAYMENT_URL: 'https://dev-api.k-will.xyz/v1'
};
