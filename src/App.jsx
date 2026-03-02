import { View, Text, Button, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import '.././global.css';
import AppNavigator from './navigation/AppNavigator.jsx';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './context/authContext.js';
import { PrinterProvider } from './context/printerContext.js';
import { BillProvider } from './context/billContext.js';
import NavigationBar from './components/NavigationBar';
import Toast from 'react-native-toast-message';

export default function App() {
  return (
    <AuthProvider>
      <PrinterProvider>
        <BillProvider>
          <NavigationContainer>
            <AppNavigator />
            <NavigationBar />
            <Toast />
          </NavigationContainer>
        </BillProvider>
      </PrinterProvider>
    </AuthProvider>
  );
}
