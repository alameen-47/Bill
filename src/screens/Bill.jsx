import {
  View,
  Text,
  Image,
  TextInput,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import React, { useState } from 'react';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
import searchImg from '../assets/icons/search.png';
import { useNavigation } from '@react-navigation/native';

export default function Bill() {
  const [search, setSearch] = useState('');
  const navigation = useNavigation();
  const products = [
    { id: 1, name: 'Apple', price: 50, emoji: '🍎' },
    { id: 2, name: 'Banana', price: 20, emoji: '🍌' },
    { id: 3, name: 'Orange', price: 30, emoji: '🍊' },
    { id: 4, name: 'Grapes', price: 40, emoji: '🍇' },
    { id: 5, name: 'Pineapple', price: 70, emoji: '🍍' },
    { id: 6, name: 'Watermelon', price: 20, emoji: '🍉' },
    { id: 7, name: 'Mango', price: 60, emoji: '🥭' },
    { id: 8, name: 'Strawberry', price: 90, emoji: '🍓' },
    { id: 9, name: 'Blueberry', price: 80, emoji: '🫐' },
  ];
  const [filteredProducts, setFilteredProducts] = useState(products);

  // -------------------------------------------

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
        style={{ padding: hp('4%'), backgroundColor: '#171717', height: '100%', width: '100%', flex: 1, justifyContent: 'flex-start', alignItems: 'flex-start' }}
      >
        <View
          style={{ alignItems: 'flex-start', width: '100%', top: hp('-5%') }}
        >
          <Text style={{ fontSize: 55, color: 'white', fontWeight: 400 }}>
            Products
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
        {/* PRODUCTS */}
        <FlatList
          data={filteredProducts}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.productCard}>
              <Text style={styles.productImage}>{item.emoji}</Text>
              <Text style={{ fontSize: 25, color: 'white' }}>{item.name}</Text>
              <Text style={{ fontSize: 25, color: 'white' }}>
                ₹ {item.price}.00
              </Text>
            </View>
          )}
        />
        {/* PRINT BILL BUTTON */}
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>PRINT</Text>
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
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    width: '100%',
  },
  buttonText: {
    color: 'white',
    fontSize: 28,
    textAlign: 'center',
    fontWeight: '600',
  },
};

