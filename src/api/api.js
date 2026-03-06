import axios from 'axios';
import { Platform } from 'react-native';
// Use 10.0.2.2 for Android emulator, localhost or your IP for iOS simulator or physical device

const api = axios.create({
  baseURL: 'https://bill-h3p1.onrender.com/',
});

export default api;
