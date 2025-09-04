import {
  View,
  Text,
  Button,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import React from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import plus from '../assets/icons/plus.png';
import stack from '../assets/icons/stack.png';
import shop from '../assets/icons/shop.png';
import graph from '../assets/icons/graph.png';
import settings from '../assets/icons/settings.png';
import search from '../assets/icons/search.png';
import logo from '../assets/images/logo.png';
import { TextInput } from 'react-native';
export default function HomeScreen({ navigation }) {
  const size = wp('30%');
  const bills = [
    { name: 'Apple', price: 50 },
    { name: 'Banana', price: 20 },
    { name: 'Orange', price: 30 },
    { name: 'Grapes', price: 40 },
    { name: 'Pineapple', price: 70 },
    { name: 'Watermelon', price: 20 },
    { name: 'Watermelon', price: 20 },
    { name: 'Watermelon', price: 20 },
    { name: 'Watermelon', price: 20 },
  ];

  return (
    <View
      style={{ padding: wp('4%') }}
      className="bg-Cdarkgray h-screen w-screen flex-1 flex justify-center align-middle items-center"
    >
      <View
        style={{ gap: wp('5%') }}
        className=" flex flex-row justify-center align-middle items-center"
      >
        <View
          className="bg-white rounded-full overflow-hidden"
          style={{ width: size, height: size, borderRadius: size / 2 }}
        >
          <Image
            source={logo} // any URL image
            style={{ width: '100%', height: '100%' }}
            resizeMode="cover"
          />
        </View>
        <Text
          style={{ fontSize: wp('6%') }}
          className="text-white overflow-hidden"
        >
          The Fresh Paradise
        </Text>
      </View>
      <View className="w-[90%] border-b border-white my-4" />

      <View
        style={{ padding: wp('2%'), gap: '5%' }}
        className="g flex flex-row justify-center align-middle items-center w-full "
      >
        <TouchableOpacity
          style={{
            padding: wp('4%'),
            height: hp('auto'),
            width: wp('40%'),
          }}
          className="gap-2 bg-Cgreen rounded-xl flex flex-row justify-center align-middle items-center"
        >
          <Image
            source={plus}
            resizeMode="contain"
            style={{ width: wp('8%'), height: hp('5%') }}
          />
          <Text
            style={{ fontSize: wp('5%') }}
            className="text-white text-xl font-semibold"
          >
            New Bill
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            padding: wp('4%'),
            height: hp('auto'),
            width: wp('40%'),
          }}
          className="gap-2 bg-Cgreen rounded-xl flex flex-row justify-center align-middle items-center"
        >
          <Image
            source={stack}
            resizeMode="contain"
            style={{ width: wp('10%'), height: hp('5%') }}
          />
          <Text
            style={{ fontSize: wp('5%') }}
            className="text-white text-xl font-semibold"
          >
            View Bills
          </Text>
        </TouchableOpacity>
      </View>
      <View
        style={{ padding: wp('2%'), gap: '5%' }}
        className="flex flex-row justify-center align-middle items-center w-full "
      >
        <TouchableOpacity
          style={{
            padding: wp('4%'),
            height: hp('auto'),
            width: wp('40%'),
          }}
          className="gap-2 bg-Cgreen rounded-xl flex flex-row justify-center align-middle items-center"
        >
          <Image
            source={shop}
            resizeMode="contain"
            style={{ width: wp('8%'), height: hp('5%') }}
          />
          <Text
            style={{ fontSize: wp('5%') }}
            className="text-white text-xl font-semibold"
          >
            Products
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            padding: wp('4%'),
            height: hp('auto'),
            width: wp('40%'),
          }}
          className="gap-2 bg-Cgreen rounded-xl flex flex-row justify-center align-middle items-center "
        >
          <Image
            source={graph}
            resizeMode="contain"
            style={{ width: wp('5%'), height: hp('5%') }}
          />
          <Text
            style={{ fontSize: wp('5%') }}
            className="text-white text-xl font-semibold"
          >
            Reports
          </Text>
        </TouchableOpacity>
      </View>
      <View className="w-[90%] border-b border-white my-4" />
      <View className="bg-Clightgray w-full h-[4rem] rounded-lg  flex flex-row   items-center text-center my-2 gap-2 px-2">
        <Image
          resizeMode="contain"
          style={{ width: wp('8%'), height: hp('4%') }}
          source={search}
        />
        <TextInput
          placeholder="Search"
          placeholderTextColor="gray"
          className="text-white text-xl font-semibold  "
        />
      </View>
      <ScrollView
        contentContainerStyle={{ paddingBottom: wp('50%') }}
        showsVerticalScrollIndicator={false}
        scrollEnabled={true}
        declerationRate="normal"
        overScrollMode="always"
      >
        {bills.map((b, index) => (
          <View
            key={index}
            style={{ padding: wp('4%'), gap: '5%', height: hp('10%') }}
            className="bg-Clightgray w-full my-2  rounded-xl flex flex-row justify-between align-middle items-center "
          >
            <View className="flex flex-col gap-2">
              <Text
                style={{ fontSize: wp('6%') }}
                className="text-white font-semibold "
              >
                {b.name}
              </Text>
              {/* Dashed line */}
              {[30, 15, 20, 6].map((w, index) => (
                <View
                  key={index}
                  style={{
                    borderBottomWidth: 1,
                    borderStyle: 'dashed',
                    borderColor: 'white',
                    width: wp(`${w}`),
                  }}
                />
              ))}
            </View>
            <Text
              style={{ fontSize: wp('5%') }}
              className="text-white font-semibold"
            >
              ₹ {b.price}.00
            </Text>
          </View>
        ))}
      </ScrollView>
      {/* <Button
        className="bg-white text-xl"
        title="Go to Profile"
        onPress={() => navigation.navigate('Profile')}
        /> */}
    </View>
  );
}
