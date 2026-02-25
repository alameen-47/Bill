import {
  View,
  Text,
  Image,
  TextInput,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
import searchImg from '../assets/icons/search.png';
import { useNavigation } from '@react-navigation/native';
import api from '../api/api';
import { useAuth } from '../context/authContext';

export default function NewBill() {
  const [auth] = useAuth();
  const [search, setSearch] = useState('');
  const navigation = useNavigation();
  // const products = [
  //   { id: 1, name: 'Apple', price: 50, emoji: '🍎' },
  //   { id: 2, name: 'Banana', price: 20, emoji: '🍌' },
  //   { id: 3, name: 'Orange', price: 30, emoji: '🍊' },
  //   { id: 4, name: 'Grapes', price: 40, emoji: '🍇' },
  //   { id: 5, name: 'Pineapple', price: 70, emoji: '🍍' },
  //   { id: 6, name: 'Watermelon', price: 20, emoji: '🍉' },
  //   { id: 7, name: 'Mango', price: 60, emoji: '🥭' },
  //   { id: 8, name: 'Strawberry', price: 90, emoji: '🍓' },
  //   { id: 9, name: 'Blueberry', price: 80, emoji: '🫐' },
  // ];
  const [products, setProducts] = useState([]);

  const [filteredProducts, setFilteredProducts] = useState([]);

  // -------------------------------------------

  useEffect(() => {
    const fetchProducts = async () => {
      const token = auth.token;
      try {
        const res = await api.get('/api/v1/products/getAllProducts', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res?.data?.success) {
          setProducts(res.data.products);
        }
      } catch (error) {
        console.log('Error on Getting Products', error.message);
      }
    };
    fetchProducts();
  }, []);
  useEffect(() => {
    setFilteredProducts(products);
  }, [products]);

  console.log(products, "'''''''''''PRODUCtsssss---------------");
  const searchData = search => {
    setSearch(search);
    const result = products.filter(item =>
      item.name.toLowerCase().includes(search.toLowerCase()),
    );
    setFilteredProducts(result);
  };

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
        {/* ///////SEARCHBAR////// */}
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
        </View>
        {/* PRODUCTS */}
        <FlatList
          data={filteredProducts}
          keyExtractor={item => item._id.toString()}
          renderItem={({ item }) => (
            <View style={styles.productCard}>
              {/* <Text style={styles.productImage}>{item.emoji}</Text> */}
              <Text style={{ fontSize: 25, color: 'white' }}>{item.name}</Text>
              <Text style={{ fontSize: 25, color: 'white' }}>
                ₹ {item.price}.00
              </Text>
            </View>
          )}
        />
        {/* ADD NEW PRODUCT TO BILL */}

        {/* ADD NEW PRODUCT TO BILL BUTTON */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('AddProduct')}
        >
          <Text style={styles.buttonText}>+</Text>
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
    borderRadius: 100,
    left: '80%',
    width: '20%',
  },
  buttonText: {
    color: 'white',
    fontSize: 28,
    textAlign: 'center',
    fontWeight: '600',
  },
};
