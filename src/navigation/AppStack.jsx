import { View, Text, TouchableOpacity, Image } from 'react-native';
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
import Settings from '../screens/Settings.jsx';
import Reciept from '../screens/Reciept.jsx';

import settings from '../assets/icons/settings.png';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { BillProvider } from '../context/billContext.js';
const Stack = createNativeStackNavigator();

export default function AppStack() {
  return (
    <BillProvider>
      <Stack.Navigator
        initialRouteName="Reciept"
        screenOptions={({ navigation }) => ({
          headerTitle: '',
          headerTintColor: '#fff',
          headerStyle: { backgroundColor: '#171717' },

          headerRight: () => (
            <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
              <Image
                style={styles.settings}
                source={settings}
                resizeMode="contain"
              />
            </TouchableOpacity>
          ),
        })}
      >
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="Products" component={Products} />
        <Stack.Screen name="Bill" component={Bill} />
        <Stack.Screen name="AddProduct" component={AddProduct} />
        <Stack.Screen name="AllBills" component={AllBills} />
        <Stack.Screen name="NewBill" component={NewBill} />
        <Stack.Screen name="Reports" component={Report} />
        <Stack.Screen name="Settings" component={Settings} />
        <Stack.Screen name="Reciept" component={Reciept} />
      </Stack.Navigator>
    </BillProvider>
  );
}
const styles = {
  settings: {
    width: wp('8%'),
    height: hp('5%'),
  },
};
