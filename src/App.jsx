import { View, Text, Button, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import '.././global.css';
import AppNavigator from './navigation/AppNavigator';
import { NavigationContainer } from '@react-navigation/native';

import NavigationBar from './components/NavigationBar';
export default function App({ navigation }) {
  return (
    <>
      <NavigationContainer>
        <AppNavigator />
        <NavigationBar navigation={navigation} />
      </NavigationContainer>
    </>
  );
}

