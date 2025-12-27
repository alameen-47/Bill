import {
  View,
  Text,
  Button,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import React, { useState } from 'react';
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
import NavigationBar from '../components/NavigationBar.jsx';
import { TextInput } from 'react-native';
export default function HomeScreen({ navigation }) {
  const [query, setQuery] = useState('');
  const [filteredBills, setFilteredBills] = useState(bills);
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

  const searchItem = text => {
    setQuery(text);
    // Implement search functionality here
    const result = bills.filter(bill =>
      bill.name.toLowerCase().includes(text.toLowerCase()),
    );
    setFilteredBills(result);
    console.log('Searching for:', result);
  };
  return (
    <View
      style={{ padding: wp('4%') }}
      className="bg-Cdarkgray h-screen w-screen flex-1 flex justify-center align-middle items-center"
    >
      {/* //SETTINGS//// */}
      <TouchableOpacity>
        <Image
          source={settings}
          resizeMode="contain"
          style={{
            width: wp('8%'),
            height: hp('5%'),
            alignSelf: '!flex-end',
            left: wp('40%'),
          }}
        />
      </TouchableOpacity>
      {/* //////// */}
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
          className="text-white overflow-hidden break-words  font-semibold"
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
          onPress={() => navigation.navigate('NewBill')}
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
          onPress={() => navigation.navigate('AllBills')}
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
          onPress={() => navigation.navigate('Products')}
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
          onPress={() => navigation.navigate('Reports')}
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
      {/* ///////SEARCHBAR////// */}
      <View className="bg-Clightgray w-full h-[4rem] rounded-lg  flex flex-row   items-center text-center my-2 gap-2 px-2">
        <Image
          resizeMode="contain"
          style={{ width: wp('8%'), height: hp('4%') }}
          source={search}
        />
        <TextInput
          placeholder="Search"
          value={query}
          placeholderTextColor="gray"
          onChangeText={searchItem}
          className="text-white text-xl Appfont-semibold  "
        />
      </View>
      <ScrollView
        contentContainerStyle={{ paddingBottom: wp('50%') }}
        showsVerticalScrollIndicator={false}
        scrollEnabled={true}
        // declerationRate="normal"
        overScrollMode="always"
      >
        {Array.isArray(filteredBills) &&
          filteredBills.map((b, index) => (
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
      {/* ///////////NAVIGATION BAR //////////// */}
      <View>
        <NavigationBar navigation={navigation} />
      </View>
    </View>
  );
}
