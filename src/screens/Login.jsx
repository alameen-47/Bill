import { View, Text, TextInput, Button, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import api from '../api/api.js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../context/authContext.js';
import { useNavigation } from '@react-navigation/native';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [auth, setAuth] = useAuth();
  const navigation = useNavigation();
  const login = async () => {
    try {
      const res = await api.post('/api/v1/auth/login', { email, password });
      console.log('LOGIN RESPONSE. -- > ', res.data);
      if (res.data?.success) {
        setAuth({ user: res.data?.user, token: res.data?.token });
        await AsyncStorage.setItem('auth', JSON.stringify(res.data));
        console.log('User Logged In Succesfully');
      }
    } catch (error) {
      console.error('Error in Login', error);
    }
  };
  return (
    <View
      style={{
        gap: wp('13%'),
        backgroundColor: '#171717',
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: wp('6%'),
      }}
    >
      <Text style={{ fontSize: wp('13%'), color: 'white', fontWeight: '600' }}>
        Login
      </Text>

      <View
        style={{
          gap: wp('8%'),
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <View style={{ width: '100%' }}>
          <Text
            style={{
              fontSize: wp('5%'),
              color: '#9C9E9C',
              fontWeight: '600',
              marginBottom: 8,
            }}
          >
            Mobile/Email
          </Text>
          <TextInput
            style={{
              fontSize: wp('5%'),
              backgroundColor: '#1C1C1D',
              paddingHorizontal: wp('1.5%'),
              color: 'white',
              borderRadius: 12,
              height: wp('12%'),
            }}
            value={email}
            onChangeText={setEmail}
            placeholder="Enter email"
            placeholderTextColor="gray"
          />
        </View>
        <View style={{ width: '100%' }}>
          <Text
            style={{
              fontSize: wp('5%'),
              color: '#9C9E9C',
              fontWeight: '600',
              marginBottom: 8,
            }}
          >
            Password
          </Text>
          <TextInput
            style={{
              fontSize: wp('5%'),
              backgroundColor: '#1C1C1D',
              paddingHorizontal: wp('1.5%'),
              color: 'white',
              borderRadius: 12,
              height: wp('12%'),
            }}
            value={password}
            onChangeText={setPassword}
            placeholder="Enter password"
            placeholderTextColor="gray"
          />
        </View>

        <Text
          style={{
            fontSize: wp('5%'),
            color: '#9C9E9C',
            fontWeight: '600',
            textDecorationLine: 'underline',
            textAlign: 'center',
          }}
        >
          Forgot Password?
        </Text>
        <Text
          onPress={() => navigation.navigate('SignUp')}
          style={{
            fontSize: wp('5%'),
            color: '#9C9E9C',
            fontWeight: '600',
            textDecorationLine: 'underline',
            textAlign: 'center',
          }}
        >
          Sign Up
        </Text>
        <TouchableOpacity
          onPress={() => login()}
          style={{
            padding: wp('3%'),
            backgroundColor: '#DA7320',
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 12,
          }}
        >
          <Text
            style={{
              fontSize: wp('8%'),
              fontWeight: '600',
              color: 'white',
              textAlign: 'center',
            }}
          >
            Login
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
