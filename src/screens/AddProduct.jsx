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
import { useNavigation } from '@react-navigation/native';
import image from '../assets/icons/image.png';
export default function Products() {
  const navigation = useNavigation();

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
            <View style={styles.ImageContainer}>
              <Image style={styles.ImageStyle} source={image} />
            </View>
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
                  placeholder="Enter Category"
                  placeholderTextColor="gray"
                />
                <Text style={styles.text}>Name</Text>
                <TextInput
                  style={styles.TextInput}
                  placeholder="Enter Name"
                  placeholderTextColor="gray"
                />
                <Text style={styles.text}>Price</Text>
                <TextInput
                  keyboardType="numeric"
                  style={styles.TextInput}
                  placeholder="Enter Price"
                  placeholderTextColor="gray"
                />
                {/* ADD PRODUCT BUTTON */}
                <TouchableOpacity
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
