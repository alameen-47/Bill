import { View, Text, TextInput, Button, TouchableOpacity } from 'react-native';
import React from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

export default function Login({ navigation }) {
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
          />
        </View>
        {/* <View className="  w-full">
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
        </View> */}
        <Text
          style={{ fontSize: wp('5%') }}
          className="text-[#9C9E9C]  font-semibold underline text-center "
        >
          Forgot Password?
        </Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('HomeScreen')}
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
