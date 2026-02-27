import axios from 'axios';
import { Platform } from 'react-native';
// Use 10.0.2.2 for Android emulator, localhost or your IP for iOS simulator or physical device

const api = axios.create({
  baseURL: 'http://192.168.1.102:8000',
});

export default api;
