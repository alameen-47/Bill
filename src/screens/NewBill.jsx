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
        style={{ padding: hp('4%'), backgroundColor: '#171717', height: '100%', width: '100%', flex: 1, justifyContent: 'flex-start', alignItems: 'flex-start' }}
      >
        <View
          style={{ alignItems: 'flex-start', width: '100%', top: hp('-5%') }}
        >
          <Text style={{ fontSize: 55, color: 'white', fontWeight: 400 }}>
            New Bill
          </Text>
          <View style={{ width: '100%', borderBottomWidth: 1, borderBottomColor: 'white' }} />
        </View>
        {/* ///////SEARCHBAR//////
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
            style={{ color: 'white', fontSize: 20, fontWeight: '600' }}
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
              <View style={{ flexDirection: 'row', textAlign: 'center', justifyContent: 'center', alignItems: 'center' }}>
                <TouchableOpacity onPress={() => decreaseQty(item._id)}>
                  <Image
                    source={orangeMinus}
                    resizeMode="contain"
                    style={styles.quantityButtons}
                  />
                </TouchableOpacity>
                <Text style={{ color: 'white', marginHorizontal: 12, fontSize: 20 }}>
                  {item.quantity}
                </Text>
                <TouchableOpacity onPress={() => increaseQty(item._id)}>
                  <Image source={orangePlus} style={styles.quantityButtons} />
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
        <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ color: 'white', fontSize: 28, fontWeight: 'bold' }}>Total : </Text>
          <Text style={{ color: 'white', fontSize: 28 }}> {total}/-</Text>
        </View>
        {/* ADD NEW PRODUCT TO BILL BUTTON */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Products')}
        >
          <Text style={styles.buttonText}>+ Add Product</Text>
        </TouchableOpacity>

        <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <TouchableOpacity onPress={clearBill}>
            <Image
              source={trash}
              style={styles.trashCan}
              resizeMode="contain"
            />
          </TouchableOpacity>
          
          <TouchableOpacity style={{ backgroundColor: '#DA7320', padding: 8, borderRadius: 8 }}>
            <Text style={styles.buttonText}>💾 SAVE</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ backgroundColor: '#DA7320', padding: 8, borderRadius: 8 }}
            onPress={() => navigation.navigate('Reciept')}
          >
            <Text style={styles.buttonText}>🖨️ PRINT</Text>
          </TouchableOpacity>
        </View>
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
    marginVertical: 10,
    width: '100%',
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
    textAlign: 'center',
    fontWeight: '600',
  },
  quantityButtons: {
    color: 'white',
    width: 30,
    height: 30,
  },
  trashCan: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 3,
    height: 50,
    width: 40,
  },
};

