import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
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
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loginMode, setLoginMode] = useState('password'); // 'password' or 'otp'
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [auth, setAuth] = useAuth();
  const navigation = useNavigation();

  const handleOtpChange = (value, index) => {
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // Only take last character
    setOtp(newOtp);
  };

  const loginWithPassword = async () => {
    try {
      setLoading(true);
      const res = await api.post('/api/v1/auth/login', { email, password });
      if (res.data?.success) {
        setAuth({ user: res.data?.user, token: res.data?.token });
        await AsyncStorage.setItem('auth', JSON.stringify(res.data));
      }
    } catch (error) {
      console.error('Error in Login', error);
      Alert.alert(
        'Login Failed',
        error.response?.data?.message || 'Invalid credentials',
      );
    } finally {
      setLoading(false);
    }
  };

  const sendLoginOTP = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email');
      return;
    }
    try {
      setLoading(true);
      const res = await api.post('/api/v1/auth/send-login-otp', { email });
      if (res.data?.success) {
        setOtpSent(true);
        Alert.alert('Success', 'OTP sent to your email');
      }
    } catch (error) {
      console.error('Error sending OTP', error);
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Failed to send OTP',
      );
    } finally {
      setLoading(false);
    }
  };

  const verifyLoginOTP = async () => {
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      Alert.alert('Error', 'Please enter valid 6-digit OTP');
      return;
    }
    try {
      setLoading(true);
      const res = await api.post('/api/v1/auth/verify-login-otp', {
        email,
        otp: otpString,
      });
      if (res.data?.success) {
        setAuth({ user: res.data?.user, token: res.data?.token });
        await AsyncStorage.setItem('auth', JSON.stringify(res.data));
      }
    } catch (error) {
      console.error('Error verifying OTP', error);
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Invalid or expired OTP',
      );
    } finally {
      setLoading(false);
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
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        {loginMode === 'password' ? (
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
              secureTextEntry
            />
          </View>
        ) : (
          <View style={{ width: '100%' }}>
            <Text
              style={{
                fontSize: wp('5%'),
                color: '#9C9E9C',
                fontWeight: '600',
                marginBottom: 8,
              }}
            >
              OTP
            </Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                gap: wp('1%'),
              }}
            >
              {otp.map((digit, index) => (
                <TextInput
                  style={{
                    height: hp('7%'),
                    fontSize: wp('5%'),
                    backgroundColor: '#1C1C1D',
                    textAlign: 'center',
                    paddingHorizontal: wp('1.5%'),
                    color: 'white',
                    borderRadius: 12,
                    width: wp('12%'),
                  }}
                  key={index}
                  value={digit}
                  onChangeText={value => handleOtpChange(value, index)}
                  maxLength={1}
                  keyboardType="number-pad"
                  placeholder="*"
                  placeholderTextColor="gray"
                />
              ))}
            </View>
          </View>
        )}

        {/* Toggle between password and OTP login */}
        <TouchableOpacity
          onPress={() => {
            setLoginMode(loginMode === 'password' ? 'otp' : 'password');
            setOtpSent(false);
            setOtp(['', '', '', '', '', '']);
          }}
        >
          <Text
            style={{
              fontSize: wp('4.5%'),
              color: '#DA7320',
              fontWeight: '600',
              textDecorationLine: 'underline',
              textAlign: 'center',
            }}
          >
            {loginMode === 'password'
              ? 'Login with OTP'
              : 'Login with Password'}
          </Text>
        </TouchableOpacity>

        {loginMode === 'otp' && !otpSent && (
          <TouchableOpacity onPress={sendLoginOTP} disabled={loading}>
            <Text
              style={{
                fontSize: wp('5%'),
                color: '#27ae60',
                fontWeight: '600',
                textDecorationLine: 'underline',
                textAlign: 'center',
              }}
            >
              Send OTP
            </Text>
          </TouchableOpacity>
        )}

        <Text
          onPress={() => navigation.navigate('ForgotPassword')}
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
          onPress={() =>
            loginMode === 'password' ? loginWithPassword() : verifyLoginOTP()
          }
          disabled={loading}
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
            {loading ? 'Please wait...' : 'Login'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
