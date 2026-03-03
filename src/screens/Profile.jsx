import {
  View,
  Text,
  TextInput,
  Image,
  FlatList,
  TouchableOpacity,
  Alert,
  ScrollView,
  StyleSheet,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import pencil from '../assets/icons/pencil.png';
import logo from '../assets/images/logo.png';
import Toast from 'react-native-toast-message';
import { pick, isCancel, types } from '@react-native-documents/picker';
import RNFS from 'react-native-fs';
const PROFILE_STORAGE_KEY = '@user_profile';

export default function Profile() {
  const [shopName, setShopName] = useState('The Fresh Paradise');
  const [email, setEmail] = useState('alameenkhan1431@gmail.com');
  const [phone, setPhone] = useState('+1 234 567 890');
  const [address, setAddress] = useState(
    '123 Main St, Bangalore, Karnataka, India',
  );
  const [gstNumber, setGstNumber] = useState('29ABCD**E1234**Z5');
  const [taxRate, setTaxRate] = useState('0');
  const [shopLogo, setShopLogo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      const profileData = await AsyncStorage.getItem(PROFILE_STORAGE_KEY);
      if (profileData) {
        const parsed = JSON.parse(profileData);
        setShopName(parsed.shopName || 'The Fresh Paradise');
        setEmail(parsed.email || '');
        setPhone(parsed.phone || '');
        setAddress(parsed.address || '');
        setGstNumber(parsed.gstNumber || '');
        setTaxRate(parsed.taxRate || '0');
        setShopLogo(parsed.shopLogo || null);
      }
    } catch (error) {
      console.log('Error loading profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveProfileData = async () => {
    try {
      const profileData = {
        shopName,
        email,
        phone,
        address,
        gstNumber,
        taxRate,
        shopLogo,
      };
      await AsyncStorage.setItem(
        PROFILE_STORAGE_KEY,
        JSON.stringify(profileData),
      );
      Toast.show({
        type: 'success',
        text1: 'Profile Updated Successfully! ✅',
      });
    } catch (error) {
      console.log('Error saving profile:', error);
      Toast.show({ type: 'error', text1: 'Failed to save profile ❌' });
    }
  };

  const handleLogoUpload = async () => {
    try {
      if (Platform.OS === 'android') {
        await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        ]);
      }

      const result = await pick({
        type: [types.images],
      });

      if (result && result[0]) {
        const file = result[0];
        const logoUri = Platform.OS === 'ios' ? file.fileCopyUri : file.uri;

        // Read the image as base64 and store directly in AsyncStorage
        const base64Data = await RNFS.readFile(logoUri, 'base64');
        const base64Uri = `data:image/png;base64,${base64Data}`;

        setShopLogo(base64Uri);
        Toast.show({
          type: 'success',
          text1: 'Logo uploaded successfully! ✅',
        });
      }
    } catch (err) {
      if (isCancel(err)) {
        console.log('User cancelled document picker');
      } else {
        console.log('Error picking document:', err);
        Toast.show({ type: 'error', text1: 'Failed to upload logo ❌' });
      }
    }
  };

  const handleUpdate = () => {
    Alert.alert(
      'Update Profile',
      'Are you sure you want to save these changes?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Save', onPress: saveProfileData },
      ],
    );
  };

  const renderField = (
    label,
    value,
    setter,
    placeholder,
    keyboardType = 'default',
  ) => (
    <View style={styles.fieldContainer}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={setter}
        style={styles.textInput}
        placeholder={placeholder}
        placeholderTextColor="gray"
        keyboardType={keyboardType}
      />
    </View>
  );

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
            Profile
          </Text>
          <View
            style={{
              width: '100%',
              borderBottomWidth: 1,
              borderBottomColor: 'white',
            }}
          />
        </View>

        <ScrollView
          style={{ width: '100%', flex: 1 }}
          showsVerticalScrollIndicator={false}
        >
          <View style={{ alignItems: 'center', width: '100%', marginTop: 10 }}>
            <TouchableOpacity
              style={styles.logoContainer}
              onPress={handleLogoUpload}
            >
              {shopLogo ? (
                <Image style={styles.logoImage} source={{ uri: shopLogo }} />
              ) : (
                <Image style={styles.logoImage} source={logo} />
              )}
              <View style={styles.editBadge}>
                <Image source={pencil} style={{ width: 20, height: 20 }} />
              </View>
            </TouchableOpacity>
            <Text style={styles.logoHint}>Tap to upload logo</Text>
            <Text style={styles.shopNameText}>{shopName || 'Shop Name'}</Text>
          </View>

          <View
            style={{
              width: '100%',
              borderBottomWidth: 1,
              borderBottomColor: 'white',
              marginVertical: 16,
            }}
          />

          <View style={styles.formContainer}>
            {renderField('Shop Name', shopName, setShopName, 'Enter shop name')}
            {renderField(
              'Email',
              email,
              setEmail,
              'Enter email',
              'email-address',
            )}
            {renderField(
              'Phone',
              phone,
              setPhone,
              'Enter phone number',
              'phone-pad',
            )}
            {renderField('Address', address, setAddress, 'Enter address')}
            {renderField(
              'GST Number (Optional)',
              gstNumber,
              setGstNumber,
              'Enter GST number',
            )}
            {renderField(
              'Tax Rate (%)',
              taxRate,
              setTaxRate,
              'Enter tax rate',
              'numeric',
            )}

            {parseFloat(taxRate) > 0 && (
              <View style={styles.taxPreview}>
                <Text style={styles.taxPreviewText}>
                  Tax will be applied at {taxRate}% on bills
                </Text>
              </View>
            )}

            {gstNumber && (
              <View style={styles.gstPreview}>
                <Text style={styles.gstPreviewText}>GST: {gstNumber}</Text>
              </View>
            )}

            <TouchableOpacity
              style={styles.updateButton}
              onPress={handleUpdate}
            >
              <Text style={styles.updateButtonText}>UPDATE PROFILE</Text>
            </TouchableOpacity>

            <View style={styles.previewCard}>
              <Text style={styles.previewTitle}>RECEIPT PREVIEW</Text>
              <View style={styles.previewDivider} />
              <Text style={styles.previewShopName}>
                {shopName || 'Your Shop Name'}
              </Text>
              <Text style={styles.previewAddress}>
                {address || 'Your Address'}
              </Text>
              {gstNumber ? (
                <Text style={styles.previewGst}>GST: {gstNumber}</Text>
              ) : null}
              {parseFloat(taxRate) > 0 ? (
                <Text style={styles.previewTax}>Tax Rate: {taxRate}%</Text>
              ) : null}
              <View style={styles.previewDivider} />
              <Text style={styles.previewThankYou}>
                Thank you for shopping!
              </Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  logoContainer: {
    width: wp('28%'),
    height: hp('12.5%'),
    borderRadius: 100,
    borderColor: 'white',
    borderWidth: 5,
    backgroundColor: 'gray',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  logoImage: {
    width: '100%',
    height: '100%',
    borderRadius: 100,
    resizeMode: 'cover',
    backgroundColor: 'black',
  },
  editBadge: {
    position: 'absolute',
    right: 5,
    bottom: 5,
    backgroundColor: '#DA7320',
    borderRadius: 20,
    padding: 5,
  },
  logoHint: {
    color: '#aaa',
    fontSize: 12,
    marginTop: 5,
  },
  shopNameText: {
    color: 'white',
    fontSize: wp(8),
    fontWeight: 'bold',
    marginTop: 10,
  },
  formContainer: {
    width: '100%',
    padding: 10,
  },
  fieldContainer: {
    marginBottom: 15,
  },
  label: {
    color: 'white',
    fontWeight: '800',
    fontSize: 16,
    marginBottom: 5,
  },
  textInput: {
    height: hp('6%'),
    backgroundColor: 'white',
    borderRadius: 10,
    paddingLeft: 15,
    fontSize: 16,
    color: '#000',
  },
  taxPreview: {
    backgroundColor: '#1a3a1a',
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#2ecc71',
  },
  taxPreviewText: {
    color: '#2ecc71',
    fontSize: 14,
    textAlign: 'center',
  },
  gstPreview: {
    backgroundColor: '#1a2a3a',
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#3498db',
  },
  gstPreviewText: {
    color: '#3498db',
    fontSize: 14,
    textAlign: 'center',
  },
  updateButton: {
    backgroundColor: '#DA7320',
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
    alignItems: 'center',
  },
  updateButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  previewCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    marginBottom: 20,
  },
  previewTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
    textAlign: 'center',
    letterSpacing: 1,
  },
  previewDivider: {
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    marginVertical: 10,
  },
  previewShopName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
  },
  previewAddress: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 2,
  },
  previewGst: {
    fontSize: 12,
    color: '#3498db',
    textAlign: 'center',
    marginTop: 5,
  },
  previewTax: {
    fontSize: 12,
    color: '#2ecc71',
    textAlign: 'center',
    marginTop: 2,
  },
  previewThankYou: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 5,
  },
});
