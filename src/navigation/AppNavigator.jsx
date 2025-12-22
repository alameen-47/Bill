import { View, Text } from 'react-native';
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from '../screens/Login.jsx';
import Signup from '../screens/Signup.jsx';
import HomeScreen from '../screens/HomeScreen.jsx';
import Profile from '../screens/Profile.jsx';
import NewBill from '../screens/NewBill.jsx';
import AddProduct from '../screens/AddProduct.jsx';
import AllBills from '../screens/AllBills.jsx';
import Products from '../screens/Products.jsx';
import Report from '../screens/Report.jsx';
import Bill from '../screens/Bill.jsx';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="HomeScreen">
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="SignUp" component={Signup} />
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="NewBill" component={NewBill} />
      <Stack.Screen name="Bill" component={Bill} />
      <Stack.Screen name="AddProduct" component={AddProduct} />
      <Stack.Screen name="AllBills" component={AllBills} />
      <Stack.Screen name="Products" component={Products} />
      <Stack.Screen name="Reports" component={Report} />
    </Stack.Navigator>
  );
}
