import { View, Text, TextInput, Button, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import api from '../api/api.js';
export default function Signup({ navigation }) {
  const [shopName, setShopName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const registerUser = async () => {
    try {
      const response = await api.post('/api/v1/auth/register', {
        shopName,
        email,
        password,
      });
      if (response.data?.success) {
        navigation.navigate('Login');
      }
      console.log(response.data, '{{{{{{{{{------{{{DATA}}}------}}}}}');
    } catch (error) {
      console.error(error.response?.data || error.message);
    }
  };
  return (
    <View
      style={{ gap: wp('1%'), backgroundColor: '#171717', flex: 1, justifyContent: 'center', paddingHorizontal: wp('6%') }}
    >
      <Text
        style={{ fontSize: wp('13%'), marginBottom: 10, color: 'white', fontWeight: '600' }}
      >
        Sign Up
      </Text>

      <View
        style={{ gap: wp('4%'), width: '100%', alignItems: 'center', justifyContent: 'center' }}
      >
        <View style={{ width: '100%' }}>
          <Text
            style={{ fontSize: wp('5%'), color: '#9C9E9C', fontWeight: '600' }}
          >
            Shop Name
          </Text>
          <TextInput
            style={{ fontSize: wp('5%'), backgroundColor: '#1C1C1D', paddingHorizontal: wp('1.5%'), color: 'white', borderRadius: 12, height: wp('12%') }}
            value={shopName}
            onChangeText={setShopName}
            placeholder="Enter shop name"
            placeholderTextColor="gray"
          />
        </View>
        <View style={{ width: '100%' }}>
          <Text
            style={{ fontSize: wp('5%'), color: '#9C9E9C', fontWeight: '600' }}
          >
            Mobile/Email
          </Text>
          <TextInput
            style={{ fontSize: wp('5%'), backgroundColor: '#1C1C1D', paddingHorizontal: wp('1.5%'), color: 'white', borderRadius: 12, height: wp('12%') }}
            value={email}
            onChangeText={setEmail}
            placeholder="Enter email"
            placeholderTextColor="gray"
          />
        </View>
        <View style={{ width: '100%' }}>
          <Text
            style={{ fontSize: wp('5%'), color: '#9C9E9C', fontWeight: '600' }}
          >
            Password
          </Text>
          <TextInput
            style={{ fontSize: wp('5%'), backgroundColor: '#1C1C1D', paddingHorizontal: wp('1.5%'), color: 'white', borderRadius: 12, height: wp('12%') }}
            value={password}
            onChangeText={setPassword}
            placeholder="Enter password"
            placeholderTextColor="gray"
            secureTextEntry
          />
        </View>
        <View style={{ width: '100%' }}>
          <Text
            style={{ fontSize: wp('5%'), color: '#9C9E9C', fontWeight: '600' }}
          >
            OTP
          </Text>
          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: wp('1%') }}>
            {Array.from({ length: 4 }).map((_, index) => (
              <TextInput
                style={{ height: hp('7%'), fontSize: wp('5%'), backgroundColor: '#1C1C1D', textAlign: 'center', paddingHorizontal: wp('1.5%'), color: 'white', borderRadius: 12, width: wp('15%') }}
                key={index}
                maxLength={1}
                keyboardType="number-pad"
                placeholder="*"
                placeholderTextColor="gray"
              />
            ))}
          </View>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: wp('5%') }}>
          <Text
            style={{ fontSize: wp('5%'), color: '#9C9E9C', fontWeight: '600', textDecorationLine: 'underline', textAlign: 'center' }}
          >
            Send OTP
          </Text>
          <Text
            onPress={() => navigation.navigate('Login')}
            style={{ fontSize: wp('5%'), color: '#9C9E9C', fontWeight: '600', textDecorationLine: 'underline', textAlign: 'center' }}
          >
            Login
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => registerUser()}
          style={{ padding: wp('3%'), backgroundColor: '#DA7320', width: '100%', justifyContent: 'center', alignItems: 'center', borderRadius: 12 }}
        >
          <Text
            style={{ fontSize: wp('8%'), fontWeight: '600', color: 'white', textAlign: 'center' }}
          >
            Sign Up
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

