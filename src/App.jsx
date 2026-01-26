import { View, Text, Button, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import '.././global.css';
import AppNavigator from './navigation/AppNavigator.jsx';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { AuthProvider } from './context/authContext.js';
import NavigationBar from './components/NavigationBar';
import Toast from 'react-native-toast-message';

export default function App({ navigation }) {
  return (
    <AuthProvider>
      <NavigationContainer>
        <AppNavigator />
        <NavigationBar navigation={navigation} />
        <Toast />
      </NavigationContainer>
    </AuthProvider>
  );
}
