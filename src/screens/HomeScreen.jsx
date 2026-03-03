import {
  View,
  Text,
  Button,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import React, { useEffect, useState, useCallback, useContext } from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import plus from '../assets/icons/plus.png';
import stack from '../assets/icons/stack.png';
import shop from '../assets/icons/shop.png';
import graph from '../assets/icons/graph.png';
import settings from '../assets/icons/settings.png';
import search from '../assets/icons/search.png';
import logo from '../assets/images/logo.png';
import { TextInput } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { BillContext } from '../context/billContext';
import { useLanguage } from '../context/languageContext';

const PROFILE_STORAGE_KEY = '@user_profile';
export default function HomeScreen({ navigation }) {
  const [query, setQuery] = useState('');
  const size = wp('30%');
  const { getLast5Bills, loadSavedBills } = useContext(BillContext);
  const { t } = useLanguage();
  const [last5Bills, setLast5Bills] = useState([]);
  const [profile, setProfile] = useState('');

  const getProfileDetails = async () => {
    try {
      const details = await AsyncStorage.getItem(PROFILE_STORAGE_KEY);
      if (details) {
        const parsed = JSON.parse(details);
        setProfile(parsed?.details || parsed);
      }
    } catch (error) {
      console.log('Error. on loading Profile', error);
    }
  };
  useEffect(() => {
    getProfileDetails();
    loadBills();
  }, []);

  // Use useFocusEffect to refresh bills when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadBills();
    }, [])
  );

  const loadBills = () => {
    const bills = getLast5Bills();
    setLast5Bills(bills);
  };

  const searchItem = text => {
    setQuery(text);
    const bills = getLast5Bills();
    // Filter bills by bill number or item names
    const result = bills.filter(bill => 
      bill.billNumber?.toLowerCase().includes(text.toLowerCase()) ||
      bill.items?.some(item => item.name?.toLowerCase().includes(text.toLowerCase()))
    );
    setLast5Bills(result.length > 0 || text === '' ? (text === '' ? getLast5Bills() : result) : getLast5Bills());
    console.log('Searching for:', result);
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView
        style={{
          padding: wp('4%'),
          backgroundColor: '#171717',
          height: '100%',
          width: '100%',
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {/* //////// */}
        <View
          style={{
            gap: wp('5%'),
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <View
            style={{
              width: size,
              height: size,
              borderRadius: size / 2,
              overflow: 'hidden',
              backgroundColor: 'white',
              borderWidth: 2,
              borderColor: 'white',
            }}
          >
            <Image
              source={{ uri: profile.shopLogo }} // any URL image
              style={{
                width: '100%',
                height: '100%',
              }}
              resizeMode="cover"
              backgroundColor="black"
            />
          </View>
          <Text
            style={{ fontSize: wp('6%'), color: 'white', fontWeight: '600' }}
          >
            {profile.shopName?.toUpperCase()}
          </Text>
        </View>
        <View
          style={{
            width: '90%',
            borderBottomWidth: 1,
            borderBottomColor: 'white',
            marginVertical: 16,
          }}
        />

        <View
          style={{
            padding: wp('2%'),
            gap: '5%',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <TouchableOpacity
            onPress={() => navigation.navigate('NewBill')}
            style={{
              padding: wp('4%'),
              height: 'auto',
              width: wp('40%'),
              backgroundColor: '#143227',
              borderRadius: 12,
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <Image
              source={plus}
              resizeMode="contain"
              style={{ width: wp('8%'), height: hp('5%') }}
            />
            <Text
              style={{ fontSize: wp('5%'), color: 'white', fontWeight: '600' }}
            >
              {t('newBill')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('AllBills')}
            style={{
              padding: wp('4%'),
              height: 'auto',
              width: wp('40%'),
              backgroundColor: '#143227',
              borderRadius: 12,
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <Image
              source={stack}
              resizeMode="contain"
              style={{ width: wp('10%'), height: hp('5%') }}
            />
            <Text
              style={{ fontSize: wp('5%'), color: 'white', fontWeight: '600' }}
            >
              {t('allBills')}
            </Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            padding: wp('2%'),
            gap: '5%',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <TouchableOpacity
            onPress={() => navigation.navigate('Products')}
            style={{
              padding: wp('4%'),
              height: 'auto',
              width: wp('40%'),
              backgroundColor: '#143227',
              borderRadius: 12,
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <Image
              source={shop}
              resizeMode="contain"
              style={{ width: wp('8%'), height: hp('5%') }}
            />
            <Text
              style={{ fontSize: wp('5%'), color: 'white', fontWeight: '600' }}
            >
              {t('products')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('Reports')}
            style={{
              padding: wp('4%'),
              height: 'auto',
              width: wp('40%'),
              backgroundColor: '#143227',
              borderRadius: 12,
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <Image
              source={graph}
              resizeMode="contain"
              style={{ width: wp('5%'), height: hp('5%') }}
            />
            <Text
              style={{ fontSize: wp('5%'), color: 'white', fontWeight: '600' }}
            >
              {t('reports')}
            </Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            width: '90%',
            borderBottomWidth: 1,
            borderBottomColor: 'white',
            marginVertical: 16,
          }}
        />
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
            source={search}
          />
          <TextInput
            placeholder={t('search')}
            value={query}
            placeholderTextColor="gray"
            onChangeText={searchItem}
            style={{ color: 'white', fontSize: 20, fontWeight: '600', flex: 1 }}
          />
        </View>
        <ScrollView
          contentContainerStyle={{ paddingBottom: wp('50%') }}
          showsVerticalScrollIndicator={false}
          scrollEnabled={true}
          // declerationRate="normal"
          overScrollMode="always"
        >
          {last5Bills.length === 0 ? (
            <View style={{ alignItems: 'center', paddingVertical: hp('5%') }}>
              <Text style={{ color: 'gray', fontSize: wp('5%') }}>{t('noBillsYet')}</Text>
              <Text style={{ color: 'gray', fontSize: wp('4%'), marginTop: 8 }}>{t('printBillToSee')}</Text>
            </View>
          ) : (
            last5Bills.map((b, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => navigation.navigate('BillDetail', { bill: b })}
                style={{
                  padding: wp('4%'),
                  gap: '5%',
                  height: hp('10%'),
                  backgroundColor: '#2C2C2C',
                  width: '100%',
                  marginVertical: 8,
                  borderRadius: 12,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <View style={{ flexDirection: 'column', gap: 8, flex: 1 }}>
                  <Text
                    style={{
                      fontSize: wp('5%'),
                      color: 'white',
                      fontWeight: '600',
                    }}
                  >
                    {b.billNumber || 'N/A'}
                  </Text>
                  <Text style={{ color: 'gray', fontSize: wp('3.5%') }}>
                    {b.items?.length || 0} items • {b.date || 'N/A'}
                  </Text>
                </View>
                <Text
                  style={{
                    fontSize: wp('5%'),
                    color: '#DA7320',
                    fontWeight: '700',
                  }}
                >
                  ₹ {b.grandTotal?.toFixed(2) || '0.00'}
                </Text>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
