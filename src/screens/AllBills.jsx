import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  FlatList,
  Modal,
  Alert,
  Pressable,
  Button,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import searchImg from '../assets/icons/search.png';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import ReceiptPreview from '../reciept/RecieptPreview';
export default function AllBills({ navigation }) {
  const [search, setSearch] = useState('');
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
  const [filteredBills, setFilteredBills] = useState(bills);
  // -------------------------------------------

  const searchData = search => {
    setSearch(search);
    const result = bills.filter(item =>
      item.name.toLowerCase().includes(search.toLowerCase()),
    );
    setFilteredBills(result);
  };

  //  -------------------------------------------
  const reciept = {
    shopName: 'The Fresh Paradise',
    currency: '₹',

    footer: 'Thank you for shopping with us!',
  };
  // ---------------------------------
  return (
    <SafeAreaProvider>
      <SafeAreaView
        style={{ padding: hp('4%'), backgroundColor: '#171717', height: '100%', width: '100%', flex: 1, justifyContent: 'flex-start', alignItems: 'flex-start' }}
      >
        <View
          style={{ alignItems: 'flex-start', width: '100%', top: hp('-5%') }}
        >
          <Text style={{ fontSize: 55, color: 'white', fontWeight: 400 }}>
            All Bills
          </Text>
          <View style={{ width: '100%', borderBottomWidth: 1, borderBottomColor: 'white' }} />
        </View>
        {/* ///////SEARCHBAR////// */}
        <View style={{ backgroundColor: '#2C2C2C', width: '100%', height: 'auto', borderRadius: 8, flexDirection: 'row', alignItems: 'center', textAlign: 'center', marginVertical: 8, gap: 8, paddingHorizontal: 8 }}>
          <Image
            resizeMode="contain"
            style={{ width: wp('8%'), height: hp('4%') }}
            source={searchImg}
          />
          <TextInput
            placeholder="Search"
            value={search}
            placeholderTextColor="gray"
            onChangeText={searchData}
            style={{ color: 'white', fontSize: 20, fontWeight: '600', flex: 1 }}
          />
        </View>

        {/* ------------------------------------------- */}
        <FlatList
          data={filteredBills}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View
              style={{ padding: wp('4%'), gap: '5%', height: hp('10%'), backgroundColor: '#2C2C2C', width: '100%', marginVertical: 8, borderRadius: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
            >
              <View style={{ flexDirection: 'column', gap: 8 }}>
                <Text
                  style={{ fontSize: wp('6%'), color: 'white', fontWeight: '600' }}
                >
                  {item.name}
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
                style={{ fontSize: wp('5%'), color: 'white', fontWeight: '600' }}
              >
                ₹ {item.price}.00
              </Text>
            </View>
          )}
          contentContainerStyle={{ paddingBottom: hp('2%') }}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
const styles = {
  text: {
    fontSize: wp('5%'),
    color: 'white',
    fontWeight: '600',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: wp('4%'),
  },
  button: {
    marginHorizontal: wp('2%'),
    marginVertical: hp('1%'),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    shadowColor: '#c1bfbfff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    padding: wp('4%'),
    width: wp('40%'),
    backgroundColor: '#143227',
  },
  imageContainer: {
    backgroundColor: '#143227',
    width: wp(40),
    height: hp(15),
    borderRadius: 20,

    display: 'flex',
    itemsAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: wp(0.5),
  },
  image: {
    fontSize: wp(20),
    borderRadius: 20,
  },
};

