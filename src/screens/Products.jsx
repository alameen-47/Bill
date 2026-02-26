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
  ActivityIndicator,
} from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import searchImg from '../assets/icons/search.png';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import api from '../api/api';
import { useAuth } from '../context/authContext';
import { useNavigation } from '@react-navigation/native';
import { BillContext } from '../context/billContext';

export default function Products() {
  const [auth] = useAuth('');
  const [search, setSearch] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState('');
  const [filteredItems, setFilteredItems] = useState('');
  const [categories, setCategories] = useState('');
  const [products, setProducts] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedCategoryItems, setSelectedCategoryItems] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const { addItem } = useContext(BillContext);

  const searchData = search => {
    setSearch(search);
    const query = search.toLowerCase();
    const result = products.flatMap(product =>
      product.items.filter(item => item.name.toLowerCase().includes(query)),
    );
    setFilteredItems(result);
  };
  //FETCH-PRODUCTS
  const fetchProducts = async () => {
    try {
      const res = await api.get('/api/v1/products/getAllProducts', {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      if (res.data.success) {
        setProducts(res.data.products);
      }
    } catch (error) {
      console.log('Error in fetchProduct Frontend', error);
    }
  };
  //FETCH-ALLCATEGORIES
  const fetchAllCategories = async () => {
    try {
      const res = await api.get('/api/v1/category/getAllCategory', {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      if (res.data.success) {
        setCategories(res.data.allCategory);
      }
    } catch (error) {
      console.log('Error in fetchAllcategory Frontend', error);
    }
  };
  //FETCH-CATEGORY-PRODUCTS
  const fethCategoryProducts = async selectedCategory => {
    try {
      setLoading(true);
      const res = await api.get(
        `api/v1/category/getCategoryProducts/${selectedCategory}`,
        {
          headers: { Authorization: `Bearer ${auth.token}` },
        },
      );
      if (res.data.success) {
        setSelectedCategoryItems(res.data.products);
      }
      setLoading(false);
    } catch (error) {
      console.log('Error on fetchCategoryProduct frontend - ', error);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchAllCategories();
  }, []);

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
            Products
          </Text>
          <View style={styles.buttonContainer}>
            <View
              style={{
                height: hp(0.1),
                backgroundColor: 'white',
                width: wp(90),
              }}
            />
            <View
              style={{
                gap: hp('2%'),
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
            >
              {/* //CATEGORIES */}
              <FlatList
                data={categories}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={item => item._id.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => {
                      setSelectedCategory(item.category);
                      fethCategoryProducts(item.category);
                    }}
                  >
                    <Text
                      style={{ fontSize: wp('5%') }}
                      className=" text-white text-xl font-semibold"
                    >
                      {item.category.toUpperCase()}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            </View>
            {/* /////LINE//// */}
            <View
              style={{
                height: hp(0.1),
                backgroundColor: 'white',
                width: wp(90),
              }}
            />
          </View>
          {/* ///////SEARCHBAR////// */}
          <View className="bg-Clightgray w-full h-[4rem] rounded-lg  flex flex-row   items-center text-center my-2 gap-2 px-2">
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
          {loading && (
            <View className=" m-auto justify-center items-center bg-black/20">
              <ActivityIndicator size="large" color="#fff" />
            </View>
          )}
          {/* ////PRODUCTS//// */}
          <FlatList
            data={
              filteredItems?.length > 0
                ? filteredItems
                : selectedCategoryItems?.length > 0
                  ? selectedCategoryItems
                  : products
            }
            keyExtractor={item => item.name}
            horizontal={false}
            numColumns={1}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.productCardContainer}
                onPress={() => {
                  addItem(item);
                  navigation.goBack();
                  // setSelectedItem(item);
                  // setModalVisible(!modalVisible);
                }}
              >
                {/* <Text style={styles.image}>{item.emoji}</Text> */}
                <View className="px-2 w-full flex-row justify-between items-center">
                  <Text
                    style={{
                      fontSize: wp('5%'),
                      color: 'white',
                    }}
                  >
                    {item.name.toUpperCase()}
                  </Text>
                  <Text
                    style={{
                      fontSize: wp('5%'),
                      color: 'orange',
                    }}
                  >
                    {item.price}/-
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
        {/* ----------------MODAL------------------------- */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert('Modal has been closed');
            setModalVisible(!modalVisible);
          }}
        >
          {selectedItem && (
            <View style={styles.modalContainer}>
              <Pressable
                style={styles.closeButton}
                onPress={() => setModalVisible(!modalVisible)}
              >
                <Text style={styles.closeText}>🆇 </Text>
              </Pressable>
              <View style={styles.imageContainer}>
                <Text style={styles.image}>{selectedItem.emoji}</Text>
              </View>
              <Text style={styles.text}>{selectedItem.name}</Text>
              <View style={{ display: 'flex', flexDirection: 'row', gap: 20 }}>
                <TextInput
                  style={styles.textInput}
                  placeholder="AMOUNT /-"
                  backgroundColor="white"
                />
                <TextInput
                  style={styles.textInput}
                  placeholder="QUANTITY "
                  backgroundColor="white"
                />
              </View>
              <TextInput
                style={[styles.textInput, { height: hp(8), margin: 5 }]}
                placeholder="TOTAL"
                backgroundColor="white"
              />
              <TouchableOpacity style={styles.addButton}>
                <Text style={styles.buttonText}>ADD</Text>
              </TouchableOpacity>
            </View>
          )}
        </Modal>
        {/* ----------------------------------------- */}
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
  productCardContainer: {
    backgroundColor: '#143227',
    width: wp(80),
    height: hp(8),
    borderRadius: 10,
    margin: wp(2),
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
  modalContainer: {
    height: hp(40),
    display: 'absolute',
    top: hp(25),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(153, 147, 147, 1)',
    borderRadius: 20,
  },
  modalImage: {
    fontSize: wp(25),
    padding: 25,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 8,
  },
  closeText: {
    fontSize: wp(10),
    fontWeight: 'bold',
    color: 'white',
  },
  textInput: {
    width: wp(30),
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'black',
  },
  addButton: {
    backgroundColor: '#DA7320',
    padding: 10,
    borderRadius: 15,
    width: wp(50),
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
  },
};
