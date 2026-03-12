import axios from 'axios';
import { Platform } from 'react-native';
// Use 10.0.2.2 for Android emulator, localhost or your IP for iOS simulator or physical device

const api = axios.create({
  baseURL: 'https://bill-h3p1.onrender.com/',
});

// Backup API functions
export const backupAPI = {
  // Save backup to cloud and send email
  saveBackup: async (token) => {
    const response = await api.post(
      '/api/v1/backup/save',
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    return response.data;
  },

  // Auto-restore from cloud backup
  autoRestore: async (token) => {
    const response = await api.post(
      '/api/v1/backup/restore',
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    return response.data;
  },

  // Get backup status (check if backup exists)
  getBackupStatus: async (token) => {
    const response = await api.get('/api/v1/backup/status', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  // Legacy functions (kept for compatibility)
  sendBackupEmail: async (backupEmail, token) => {
    const response = await api.post(
      '/api/v1/backup/sendEmail',
      { backupEmail },
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    return response.data;
  },

  restoreFromBackup: async (backupData, token) => {
    const response = await api.post(
      '/api/v1/backup/restoreCode',
      { backupData },
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    return response.data;
  },

  getBackupPreview: async token => {
    const response = await api.get('/api/v1/backup/preview', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },
};

// Product API functions
export const productAPI = {
  updateProduct: async (id, data, token) => {
    const response = await api.put(
      `/api/v1/products/getSingleProduct/${id}`,
      data,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    return response.data;
  },

  deleteProduct: async (id, token) => {
    const response = await api.delete(
      `/api/v1/products/deleteSingleProduct/${id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    return response.data;
  },
};

export default api;
