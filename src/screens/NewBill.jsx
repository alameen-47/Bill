import {
  View,
  Text,
  Image,
  TextInput,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
import searchImg from '../assets/icons/search.png';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/authContext';
import { BillContext } from '../context/billContext';
import orangePlus from '../assets/icons/orangePlus.png';
import orangeMinus from '../assets/icons/orangeMinus.png';
import trash from '../assets/icons/trash.png';
export default function NewBill({ route }) {
  const [auth] = useAuth();
  const [search, setSearch] = useState('');
  const navigation = useNavigation();
  const [products, setProducts] = useState([]);
  const { billItems, decreaseQty, increaseQty, clearBill, total } =
    useContext(BillContext);

  // -------------------------------------------

  // ---------------------------------
  return (
    <SafeAreaProvider>
      <SafeAreaView
        style={{ padding: hp('4%') }}
        className="bg-Cdarkgray h-screen w-screen flex-1 flex justify-start  items-start"
      >
        <View
          style={{ alignItems: 'flex-start', width: '100%', top: hp('-5%') }}
        >
          <Text style={{ fontSize: 55, color: 'white', fontWeight: 400 }}>
            New Bill
          </Text>
          <View className="w-[100%] border-b border-white " />
        </View>
        {/* ///////SEARCHBAR//////
        <View className="bg-Clightgray w-full h-[rem] rounded-lg  flex flex-row   items-center text-center my-2 gap-2 px-2">
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
            className="text-white text-xl Appfont-semibold  "
          />
        </View> */}
        {/* PRODUCTS */}
        <FlatList
          data={billItems}
          keyExtractor={item => item._id.toString()}
          renderItem={({ item }) => (
            <View style={styles.productCard}>
              <View>
                <Text
                  style={{ fontSize: 25, color: 'white', fontWeight: '500' }}
                >
                  {item.name.toUpperCase()}
                </Text>
                <Text style={{ fontSize: 20, color: 'white' }}>
                  ₹ {item.price}.00
                </Text>
              </View>
              <View className="flex-row text-center justify-center align-middle items-center ">
                <TouchableOpacity onPress={() => decreaseQty(item._id)}>
                  <Image
                    source={orangeMinus}
                    resizeMode="contain"
                    style={styles.quantityButtons}
                  />
                </TouchableOpacity>
                <Text className="text-white flex items mx-3 text-[20px]">
                  {item.quantity}
                </Text>
                <TouchableOpacity onPress={() => increaseQty(item._id)}>
                  <Image source={orangePlus} style={styles.quantityButtons} />
                </TouchableOpacity>
              </View>
            </View>
          )}
        />

        <View className="w-full flex flex-row justify-between align-middle items-center">
          <TouchableOpacity onPress={clearBill}>
            <Image
              source={trash}
              style={styles.trashCan}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <Text className="text-white text-3xl">Total : {total}/-</Text>
        </View>
        {/* ADD NEW PRODUCT TO BILL BUTTON */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Products')}
        >
          <Text style={styles.buttonText}>+ Add Product</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
const styles = {
  productCard: {
    width: '100%',
    backgroundColor: '#2C2C2C',
    borderRadius: 10,
    padding: 15,
    marginVertical: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productImage: {
    fontSize: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  button: {
    backgroundColor: '#DA7320',
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
    width: '100%',
  },
  buttonText: {
    color: 'white',
    fontSize: 28,
    textAlign: 'center',
    fontWeight: '600',
  },
  quantityButtons: {
    color: 'white',
  },
  trashCan: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 3,
    height: '50',
    width: '40',
  },
};
