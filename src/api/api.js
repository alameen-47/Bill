import axios from 'axios';
import { Platform } from 'react-native';
// Use 10.0.2.2 for Android emulator, localhost or your IP for iOS simulator or physical device
const api = axios.create({
  baseURL:
    Platform.OS === 'android'
      ? 'http://10.0.2.2:8000'
      : 'http://localhost:8000',
});

export default api;
