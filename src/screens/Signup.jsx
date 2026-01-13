import { View, Text, TextInput, Button, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import api from '../api/api.js';
export default function Signup({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const registerUser = async () => {
    try {
      const response = await api.post('/api/v1/auth/register', {
        name,
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
      style={{ gap: wp('1%') }}
      className="bg-[#171717] flex-1 flex justify-center px-6    "
    >
      <Text
        style={{ fontSize: wp('13%') }}
        className="text-white  font-semibold"
      >
        Sign Up
      </Text>

      <View
        style={{ gap: wp('8%') }}
        className="w-full items-center justify-center "
      >
        <View className=" w-full ">
          <Text
            style={{ fontSize: wp('5%') }}
            className="text-[#9C9E9C]  font-semibold"
          >
            Name
          </Text>
          <TextInput
            style={{ fontSize: wp('5%') }}
            className="bg-[#1C1C1D] px-[1.5rem] text-white  rounded-xl  h-[5rem]"
            value={name}
            onChangeText={setName}
          />
        </View>
        <View className=" w-full ">
          <Text
            style={{ fontSize: wp('5%') }}
            className="text-[#9C9E9C]  font-semibold"
          >
            Mobile/Email
          </Text>
          <TextInput
            style={{ fontSize: wp('5%') }}
            className="bg-[#1C1C1D] px-[1.5rem] text-white  rounded-xl  h-[5rem]"
            value={email}
            onChangeText={setEmail}
          />
        </View>
        <View className="  w-full">
          <Text
            style={{ fontSize: wp('5%') }}
            className="text-[#9C9E9C]  font-semibold"
          >
            Password
          </Text>
          <TextInput
            style={{ fontSize: wp('5%') }}
            className="bg-[#1C1C1D] px-[1.5rem] text-white  rounded-xl  h-[5rem] "
            value={password}
            onChangeText={setPassword}
          />
        </View>
        <View className="  w-full">
          <Text
            style={{ fontSize: wp('5%') }}
            className="text-[#9C9E9C]  font-semibold"
          >
            OTP
          </Text>
          <View className=" flex flex-row justify-center align-middle items-center gap-[1rem]">
            {Array.from({ length: 4 }).map((_, index) => (
              <TextInput
                style={{ height: hp('7%'), fontSize: wp('5%') }}
                key={index}
                maxLength={1}
                keyboardType="number-pad"
                className="bg-[#1C1C1D] text-center px-[1.5rem] text-white  rounded-xl w-[6rem] h-[5rem]"
              />
            ))}
          </View>
        </View>
        <View className="flex flex-row justify-between gap-5">
          <Text
            style={{ fontSize: wp('5%') }}
            className="text-[#9C9E9C]  font-semibold underline text-center "
          >
            Send OTP
          </Text>
          <Text
            onPress={() => navigation.navigate('Login')}
            style={{ fontSize: wp('5%') }}
            className="text-[#9C9E9C]  font-semibold underline text-center "
          >
            Login
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => registerUser()}
          style={{ padding: wp('3%') }}
          className="bg-[#DA7320] w-full flex justify-center items-center align-middle text-center rounded-xl"
        >
          <Text
            style={{ fontSize: wp('8%') }}
            className=" font-semibold text-white text-center"
          >
            Sign Up
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
