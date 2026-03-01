import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  PermissionsAndroid,
  StyleSheet,
  FlatList,
} from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../context/authContext';
import RNBluetoothClassic from 'react-native-bluetooth-classic';
import Toast from 'react-native-toast-message';

export default function Settings() {
  const [auth, setAuth] = useAuth();
  const [pairedDevices, setPairedDevices] = useState('');
  const [printers, setPrinters] = useState('');
  const logout = async () => {
    try {
      await AsyncStorage.removeItem('auth');

      setAuth(null);
      await AsyncStorage.clear();
      console.log('Async Stored Data REmoved Succesfully');
    } catch (error) {
      console.log(error.message || 'Error in logout function');
    }
  };

  const requestBlutoothPermission = async () => {
    if (Platform.OS === 'android') {
      await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      ]);
    } else {
      await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
    }
  };
  const scanDevices = async () => {
    try {
      await requestBlutoothPermission();
      const enabled = await RNBluetoothClassic.isBluetoothEnabled();
      if (!enabled) {
        await RNBluetoothClassic.requestBluetoothEnabled();
      }
      const devices = await RNBluetoothClassic.getBondedDevices();
      if (devices) {
        await setPairedDevices(devices);
      }
      console.log('PAIRED DEVICES:- ', pairedDevices);
    } catch (error) {
      console.log('Scan Error - ', error);
    }
  };

  const filteredPrinters = async () => {
    const printerList = pairedDevices.filter(
      device => device?.deviceClass?.majorClass === 1536,
    );
    if (printerList) {
      setPrinters(printerList);
    }
  };
  useEffect(() => {
    filteredPrinters();
  }, [pairedDevices]);

  const printTest = async () => {
    const connectedPrinter = printers.find(d => d.name.includes('PT-210'));
    await connectedPrinter.connect();
    const text = 'TEST PRINT /n HELLO PRINT /n THANK YOU';
    await connectedPrinter.write(text);
    console.log('PRINTED');
    Toast.show({ type: 'info', text1: 'DONE ✅' });
  };
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
            Settings
          </Text>
          <View className="w-[100%] border-b border-white " />
          <TouchableOpacity
            onPress={logout}
            className=" bg-[#DA7320] p-2 rounded-lg flex-row justify-center align-middle items-center"
          >
            <Text style={styles.buttonText}>📤 LOGOUT</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className=" bg-[#DA7320] p-2 rounded-lg"
            onPress={() => {
              scanDevices();

              // navigation.navigate('Reciept');
            }}
          >
            <Text style={styles.buttonText}>📶 CONNECT BT</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className=" bg-[#DA7320] p-2 rounded-lg"
            onPress={() => {
              printTest();
            }}
          >
            <Text style={styles.buttonText}>🖨️ PRINT</Text>
          </TouchableOpacity>

          <FlatList
            data={printers}
            keyExtractor={item => item.id} // use id, not _id
            renderItem={({ item }) => (
              <View style={{ padding: 15, borderBottomWidth: 1 }}>
                <Text
                  style={{ fontSize: 16, fontWeight: 'bold', color: 'green' }}
                >
                  🖨️ {item.name}
                </Text>
                <Text style={{ color: 'white' }}>{item.address}</Text>
              </View>
            )}
            ListEmptyComponent={<Text>No printers found</Text>}
          />
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
const styles = StyleSheet.create({
  button: {
    backgroundColor: '#DA7320',
    padding: 15,
    borderRadius: 10,
    margin: 10,
    width: '100%',
  },
  buttonText: {
    color: 'white',
    fontSize: 28,
    textAlign: 'center',
    fontWeight: '600',
  },
});
