import { View, Text, Button, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import '.././global.css';
import AppNavigator from './navigation/AppNavigator.jsx';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './context/authContext.js';
import NavigationBar from './components/NavigationBar';
export default function App({ navigation }) {
  return (
    <>
      <AuthProvider>
        <NavigationContainer>
          <AppNavigator />
          <NavigationBar navigation={navigation} />
        </NavigationContainer>
      </AuthProvider>
    </>
  );
}
