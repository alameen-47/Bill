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
import trashIcon from '../assets/icons/trash.png';
import { productAPI } from '../api/api';
import React, { useContext, useEffect, useState } from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import searchImg from '../assets/icons/search.png';
import pencil from '../assets/icons/pencil_white.png';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import api from '../api/api';
import { useAuth } from '../context/authContext';
import { useNavigation } from '@react-navigation/native';
import { BillContext } from '../context/billContext';
import { useLanguage } from '../context/languageContext';

export default function Products() {
  const { t } = useLanguage();
  const [auth] = useAuth('');
  const [search, setSearch] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editForm, setEditForm] = useState({
    name: '',
    price: '',
    category: '',
  });
  const [updateLoading, setUpdateLoading] = useState(false);
  const [filteredItems, setFilteredItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedCategoryItems, setSelectedCategoryItems] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const { addItem } = useContext(BillContext);

  const searchData = search => {
    setSearch(search);
    const query = search.toLowerCase();
    const result = products.flatMap(cat =>
      cat.items.filter(item => item.name.toLowerCase().includes(query)),
    );
    setFilteredItems(result);
  };

  const refreshProducts = () => {
    fetchProducts();
    if (selectedCategory) fethCategoryProducts(selectedCategory);
  };

  const handleEditProduct = product => {
    setEditingProduct(product);
    setEditForm({
      name: product.name,
      price: product.price.toString(),
      category: product.category,
    });
    setModalVisible(true);
  };

  const handleUpdateProduct = async () => {
    if (!editForm.name || !editForm.price || editForm.price <= 0) {
      Alert.alert('Error', 'Please fill all fields correctly');
      return;
    }
    setUpdateLoading(true);
    try {
      const res = await productAPI.updateProduct(
        editingProduct._id,
        editForm,
        auth.token,
      );
      if (res.success) {
        Alert.alert('Success', 'Product updated!');
        setModalVisible(false);
        setEditingProduct(null);
        refreshProducts();
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update product');
    }
    setUpdateLoading(false);
  };

  const handleDeleteProduct = () => {
    Alert.alert('Confirm Delete', `Delete ${editingProduct.name}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            const res = await productAPI.deleteProduct(
              editingProduct._id,
              auth.token,
            );
            if (res.success) {
              Alert.alert('Success', 'Product deleted!');
              setModalVisible(false);
              setEditingProduct(null);
              refreshProducts();
            }
          } catch (error) {
            Alert.alert('Error', 'Failed to delete product');
          }
        },
      },
    ]);
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
        style={{
          padding: hp('4%'),
          backgroundColor: '#171717',
          height: '100%',
          width: '100%',
          flex: 1,
          justifyContent: 'flex-start',
          alignItems: 'flex-start',
        }}
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
                      style={{
                        fontSize: wp('5%'),
                        color: 'white',
                        fontWeight: '600',
                      }}
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
          <View
            style={{
              backgroundColor: '#2C2C2C',
              width: '100%',
              height: 'auto',
              borderRadius: 8,
              flexDirection: 'row',
              alignItems: 'center',
              textAlign: 'center',
              marginVertical: 8,
              gap: 8,
              paddingHorizontal: 8,
            }}
          >
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
              style={{
                color: 'white',
                fontSize: 20,
                fontWeight: '600',
                flex: 1,
              }}
            />
          </View>
          {loading && (
            <View
              style={{
                margin: 'auto',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'rgba(0,0,0,0.2)',
              }}
            >
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
                }}
              >
                {/* <Text style={styles.image}>{item.emoji}</Text> */}
                <View
                  style={{
                    paddingHorizontal: 8,
                    width: '100%',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
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
                  <TouchableOpacity
                    style={{
                      backgroundColor: '#DA7320',
                      borderRadius: 10,
                      padding: 4,
                    }}
                    onPress={e => {
                      e.stopPropagation();
                      handleEditProduct(item);
                    }}
                  >
                    <Image source={pencil} resizeMode="contain" />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
        <TouchableOpacity
          style={styles.fab}
          onPress={() => navigation.navigate('AddProduct')}
        >
          <Text style={styles.fabText}>+</Text>
        </TouchableOpacity>
        {/* ----------------MODAL------------------------- */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: hp(2),
                }}
              >
                <Text
                  style={{ fontSize: wp(6), color: 'white', fontWeight: '700' }}
                >
                  Edit Product
                </Text>
                <Pressable
                  style={styles.closeButton}
                  onPress={() => {
                    setModalVisible(false);
                    setEditingProduct(null);
                  }}
                >
                  <Text style={styles.closeText}>X</Text>
                </Pressable>
              </View>

              <View style={{ gap: hp(2), marginBottom: hp(3) }}>
                <TextInput
                  style={[styles.inputField, { backgroundColor: '#2C2C2C' }]}
                  placeholder="Product Name"
                  placeholderTextColor="gray"
                  value={editForm.name}
                  onChangeText={text =>
                    setEditForm(prev => ({ ...prev, name: text }))
                  }
                />

                <TextInput
                  style={[styles.inputField, { backgroundColor: '#2C2C2C' }]}
                  placeholder="Price (₹)"
                  placeholderTextColor="gray"
                  value={editForm.price}
                  keyboardType="decimal-pad"
                  onChangeText={text =>
                    setEditForm(prev => ({ ...prev, price: text }))
                  }
                />

                <TextInput
                  style={[styles.inputField, { backgroundColor: '#2C2C2C' }]}
                  placeholder="Category"
                  placeholderTextColor="gray"
                  value={editForm.category}
                  onChangeText={text =>
                    setEditForm(prev => ({ ...prev, category: text }))
                  }
                />
              </View>

              <View style={{ flexDirection: 'row', gap: wp(4) }}>
                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: '#DA7320' }]}
                  onPress={handleUpdateProduct}
                  disabled={updateLoading}
                >
                  {updateLoading ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <Text style={styles.buttonText}>Update</Text>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.actionButton,
                    { backgroundColor: '#FF4444', flex: 1 },
                  ]}
                  onPress={e => {
                    e.stopPropagation(); // prevents parent click
                    handleDeleteProduct;
                  }}
                >
                  <Text style={[styles.buttonText, { fontSize: wp(4.5) }]}>
                    Delete
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: '#171717',
    borderRadius: 20,
    padding: wp(8),
    width: '90%',
    maxHeight: hp(60),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  modalImage: {
    fontSize: wp(25),
    padding: 25,
  },
  closeButton: {
    position: 'absolute',
    borderRadius: 1000,
    right: 10,
    padding: 10,
  },
  closeText: {
    fontSize: wp(5),
    fontWeight: 'bold',
    color: 'white',
  },
  inputField: {
    padding: wp(5),
    borderRadius: 12,
    fontSize: wp(4.5),
    color: 'white',
    borderWidth: 1,
    borderColor: '#3A3A3A',
    marginBottom: hp(1.5),
  },
  actionButton: {
    flex: 1,
    paddingVertical: hp(2.5),
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 25,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#DA7320',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
  },

  fabText: {
    fontSize: 30,
    color: '#fff',
    fontWeight: 'bold',
    lineHeight: 32,
  },
};
