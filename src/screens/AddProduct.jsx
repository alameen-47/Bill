import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  Button,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import image from '../assets/icons/image.png';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import api from '../api/api.js';
import Toast from 'react-native-toast-message';
import { useAuth } from '../context/authContext.js';
import { useNavigation } from '@react-navigation/native';
import DropDownPicker from 'react-native-dropdown-picker';
import greenPlus from '../assets/icons/greenPlus.png';
export default function Products() {
  const navigation = useNavigation();
  const [category, setCategory] = useState('');
  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [auth] = useAuth();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [allCategory, setAllCategory] = useState([]);
  const token = auth.token;

  // ADD CATEGORY
  const addCategory = async () => {
    try {
      const res = await api.post(
        '/api/v1/category/createCategory',
        { category },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      if (res.data.success) {
        Toast.show({
          type: 'success',
          text1: 'Category Created Succesfully ✅',
        });
        console.log(res.data.message);
      }
      await getAllCategory();
    } catch (error) {
      console.log('Error on addCategory', error.message);
      Toast.show({
        type: 'error',
        text1: error.response?.data?.message || 'Something went wrong',
      });
    }
  };
  // GET ALL CATEGORY
  const getAllCategory = async () => {
    try {
      const res = await api.get('/api/v1/category/getAllCategory', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        const formattedData = res.data.allCategory.map(item => ({
          label: item.category,
          value: item._id,
        }));

        setAllCategory(formattedData);
      }
    } catch (error) {
      console.log('Error in getAllCategory ', error);
    }
  };

  useEffect(() => {
    getAllCategory();
  }, []);
  const handleSubmit = async () => {
    try {
      const res = await api.post(
        '/api/v1/products/createProduct',
        {
          category,
          name,
          price,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      if (res.data.success) {
        await Toast.show({
          type: 'success',
          text1: 'Product Created Succesfully ✅',
        });
        console.log('Product Created Succesfully');
        navigation.navigate('Products');
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error ❌',
      });
      console.log(error.response?.data || error.message);
    }
  };

  // ---------------------------------
  return (
    <SafeAreaProvider>
      <SafeAreaView
        style={{ padding: hp('4%') }}
        className="bg-Cdarkgray  w-screen flex-1 flex justify-start  items-start"
      >
        <View
          style={{ alignItems: 'flex-start', width: '100%', top: hp('-5%') }}
        >
          <Text style={{ fontSize: 55, color: 'white', fontWeight: 400 }}>
            Add Product
          </Text>
          <View className="w-[100%] border-b border-white " />
          <View style={styles.Container}>
            <View style={styles.ContentContainer}>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  marginBottom: hp('2%'),
                }}
              >
                <Text style={styles.text}>Add Category</Text>
                <View style={{ flexDirection: 'row' }}>
                  <TextInput
                    style={[styles.TextInput, { width: '85%' }]}
                    value={category}
                    onChangeText={setCategory}
                    placeholder="Enter Category"
                    placeholderTextColor="gray"
                  />
                  <TouchableOpacity
                    onPress={addCategory}
                    style={{
                      backgroundColor: 'white',
                      borderRadius: '30%',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Image
                      style={{ width: '45' }}
                      resizeMode="contain"
                      source={greenPlus}
                    />
                  </TouchableOpacity>
                </View>
                <View className="w-[100%] border-b border-white " />
                <Text style={styles.text}>Select Category</Text>
                <View>
                  <DropDownPicker
                    placeholder="Select a Category"
                    open={open}
                    value={value}
                    items={allCategory}
                    onPress={() => setOpen(!open)}
                    setValue={setValue}
                    setItems={setAllCategory}
                  />
                </View>

                <Text style={styles.text}>Name</Text>
                <TextInput
                  style={styles.TextInput}
                  value={name}
                  onChangeText={setName}
                  placeholder="Enter Name"
                  placeholderTextColor="gray"
                />
                <Text style={styles.text}>Price</Text>
                <TextInput
                  keyboardType="numeric"
                  value={price}
                  onChangeText={setPrice}
                  style={styles.TextInput}
                  placeholder="Enter Price"
                  placeholderTextColor="gray"
                />
                {/* ADD PRODUCT BUTTON */}
                <TouchableOpacity
                  onPressIn={handleSubmit}
                  style={styles.button}
                  onPress={() => navigation.navigate('AddProduct')}
                >
                  <Text style={styles.buttonText}>+ Add Product</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
const styles = {
  Container: {
    display: 'flex',
    width: '100%',
    height: '100%',
    padding: hp('2%'),
    borderRadius: 10,
    alignItems: 'center',
  },
  ImageContainer: {
    width: wp('50%'),
    height: hp('20%'),
    backgroundColor: '#5b5b5bff',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '10%',
  },
  ImageStyle: {
    backgroundColor: '#5b5b5bff',
    resizeMode: 'stretch',
    alignItems: 'center',
  },
  ContentContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginTop: hp('3%'),
  },
  TextInput: {
    height: hp('6%'),
    width: wp('80%'),
    backgroundColor: 'white',
    borderRadius: 10,
    paddingLeft: 10,
  },
  button: {
    backgroundColor: '#DA7320',

    padding: 10,
    borderRadius: 5,
    marginTop: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
  },
  text: {
    color: 'white',
    fontWeight: 500,
    fontSize: 18,
    margin: wp('1%'),
  },
};
