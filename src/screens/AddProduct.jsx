import { View, Text, Image, TextInput, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
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
export default function Products() {
  const navigation = useNavigation();
  const [category, setCategory] = useState('');
  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [auth] = useAuth();
  const token = auth.token;
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
  const openCamera = async () => {
    const result = await launchCamera({
      mediaType: 'photo',
      cameraType: 'front',
      quality: 0.8,
      saveToPhotos: true,
    });
    if (result.didCancel) return;
    if (result.errorCode) {
      console.log('Camera Error:', result.errorMessage);
    }
    const image = result.assets[0];
    console.log(image);
  };
  const openGallery = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 0.8,
      selectionLimit: 1,
    });
    if (result.didCancel) return;
    if (result.errorCode) {
      console.log('Gallery error:', result.errorMessage);
      return;
    }
    const image = result.assets[0];
    console.log(image);
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
            Add Product
          </Text>
          <View className="w-[100%] border-b border-white " />
          <View style={styles.Container}>
            <TouchableOpacity onPress={openCamera}>
              <View style={styles.ImageContainer}>
                <Image style={styles.ImageStyle} source={image} />
              </View>
            </TouchableOpacity>
            <View style={styles.ContentContainer}>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  marginBottom: hp('2%'),
                }}
              >
                <Text style={styles.text}>Category</Text>
                <TextInput
                  style={styles.TextInput}
                  value={category}
                  onChangeText={setCategory}
                  placeholder="Enter Category"
                  placeholderTextColor="gray"
                />
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
