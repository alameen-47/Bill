import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import React, { useState } from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import api from '../api/api.js';
import { useNavigation } from '@react-navigation/native';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step, setStep] = useState(1); // 1: email, 2: OTP, 3: new password
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const handleOtpChange = (value, index) => {
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // Only take last character
    setOtp(newOtp);
  };

  const sendOTP = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email');
      return;
    }
    try {
      setLoading(true);
      const res = await api.post('/api/v1/auth/send-forgot-password-otp', { email });
      if (res.data?.success) {
        setStep(2);
        Alert.alert('Success', 'OTP sent to your email');
      }
    } catch (error) {
      console.error('Error sending OTP', error);
      Alert.alert('Error', error.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async () => {
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      Alert.alert('Error', 'Please enter valid 6-digit OTP');
      return;
    }
    try {
      setLoading(true);
      const res = await api.post('/api/v1/auth/verify-forgot-password-otp', { email, otp: otpString });
      if (res.data?.success) {
        setStep(3);
      }
    } catch (error) {
      console.error('Error verifying OTP', error);
      Alert.alert('Error', error.response?.data?.message || 'Invalid or expired OTP');
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      Alert.alert('Error', 'Please enter both passwords');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }
    try {
      setLoading(true);
      const otpString = otp.join('');
      const res = await api.post('/api/v1/auth/reset-password', { email, otp: otpString, newPassword });
      if (res.data?.success) {
        Alert.alert('Success', 'Password reset successfully', [
          { text: 'OK', onPress: () => navigation.navigate('Login') }
        ]);
      }
    } catch (error) {
      console.error('Error resetting password', error);
      Alert.alert('Error', error.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View
      style={{
        gap: wp('8%'),
        backgroundColor: '#171717',
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: wp('6%'),
      }}
    >
      <Text style={{ fontSize: wp('13%'), color: 'white', fontWeight: '600' }}>
        Reset Password
      </Text>

      <View
        style={{
          gap: wp('6%'),
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {step === 1 && (
          <View style={{ width: '100%' }}>
            <Text
              style={{
                fontSize: wp('5%'),
                color: '#9C9E9C',
                fontWeight: '600',
                marginBottom: 8,
              }}
            >
              Enter your email
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
        )}

        {step === 2 && (
          <View style={{ width: '100%' }}>
            <Text
              style={{
                fontSize: wp('5%'),
                color: '#9C9E9C',
                fontWeight: '600',
                marginBottom: 8,
              }}
            >
              Enter OTP sent to your email
            </Text>
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: wp('1%') }}>
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
                  onChangeText={(value) => handleOtpChange(value, index)}
                  maxLength={1}
                  keyboardType="number-pad"
                  placeholder="*"
                  placeholderTextColor="gray"
                />
              ))}
            </View>
          </View>
        )}

        {step === 3 && (
          <>
            <View style={{ width: '100%' }}>
              <Text
                style={{
                  fontSize: wp('5%'),
                  color: '#9C9E9C',
                  fontWeight: '600',
                  marginBottom: 8,
                }}
              >
                New Password
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
                value={newPassword}
                onChangeText={setNewPassword}
                placeholder="Enter new password"
                placeholderTextColor="gray"
                secureTextEntry
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
                Confirm Password
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
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Confirm password"
                placeholderTextColor="gray"
                secureTextEntry
              />
            </View>
          </>
        )}

        <TouchableOpacity
          onPress={() => {
            if (step === 1) sendOTP();
            else if (step === 2) verifyOTP();
            else resetPassword();
          }}
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
            {loading ? 'Please wait...' : step === 1 ? 'Send OTP' : step === 2 ? 'Verify OTP' : 'Reset Password'}
          </Text>
        </TouchableOpacity>

        <Text
          onPress={() => navigation.navigate('Login')}
          style={{
            fontSize: wp('5%'),
            color: '#9C9E9C',
            fontWeight: '600',
            textDecorationLine: 'underline',
            textAlign: 'center',
          }}
        >
          Back to Login
        </Text>
      </View>
    </View>
  );
}

