import { View, Text, TextInput, Button, TouchableOpacity } from 'react-native';
import React from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import api from '../api/api.js';

export default function Login({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const login = async () => {
    try {
      const res = await api.post('/api/v1/auth/login', { email, password });
      if (res.data?.success) {
        await navigation.navigate('HomeScreen');
        console.log('User Registered Succesfully');
      }
    } catch (error) {
      console.error('Error in Login', error);
    }
  };
  return (
    <View
      style={{ gap: wp('13%') }}
      className="bg-[#171717] flex-1 flex justify-center px-6    "
    >
      <Text
        style={{ fontSize: wp('13%') }}
        className="text-white  font-semibold"
      >
        Login
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

        <Text
          style={{ fontSize: wp('5%') }}
          className="text-[#9C9E9C]  font-semibold underline text-center "
        >
          Forgot Password?
        </Text>
        <TouchableOpacity
          onPress={() => login()}
          style={{ padding: wp('3%') }}
          className="bg-[#DA7320] w-full flex justify-center items-center align-middle text-center rounded-xl"
        >
          <Text
            style={{ fontSize: wp('8%') }}
            className=" font-semibold text-white text-center"
          >
            Login
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
