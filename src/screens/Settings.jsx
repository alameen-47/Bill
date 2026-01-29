import { View, Text, TouchableOpacity } from 'react-native';
import React, { useContext } from 'react';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../context/authContext';
export default function Settings() {
  const [auth, setAuth] = useAuth();
  const logout = async () => {
    try {
      await AsyncStorage.removeItem('auth');

      setAuth(null);
      await AsyncStorage.clear();
      console.log('Async Stored Data REmoved Succesfully');
    } catch (error) {
      console.log(error.message || 'Error in logout function');
    }
  };
  console.log(auth, 'AUTH');
  return (
    <SafeAreaProvider>
      <SafeAreaView
        style={{ padding: hp('4%') }}
        className="bg-Cdarkgray h-screen w-screen flex-1 flex justify-start  items-start"
      >
        <View
          style={{ alignItems: 'flex-start', width: '100%', top: hp('-5%') }}
        >
          <Text style={{ fontSize: 55, color: 'white', fontWeight: 400 }}>
            Settings
          </Text>
          <View className="w-[100%] border-b border-white " />
          <TouchableOpacity
            onPress={logout}
            style={{ backgroundColor: 'white', width: wp(20), height: hp(20) }}
          >
            <Text>LOGOUT</Text>
            <Text>{AsyncStorage.getItem('auth')}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
