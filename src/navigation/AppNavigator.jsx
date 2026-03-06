import { View, Text } from 'react-native';
import React from 'react';
import { useAuth } from '../context/authContext.js';
import AuthStack from './AuthStack.jsx';
import AppStack from './AppStack.jsx';
const AppNavigator = () => {
  const [auth] = useAuth();
  return auth?.token ? <AppStack /> : <AuthStack />;
};

export default AppNavigator;
