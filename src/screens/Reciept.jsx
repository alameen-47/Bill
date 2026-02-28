import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { PermissionsAndroid, Platform } from 'react-native';
import ThermalPrinterModule from 'react-native-thermal-printer';
import Toast from 'react-native-toast-message';
import RNBluetoothClassic from 'react-native-bluetooth-classic';

export default function Reciept() {
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
      console.log('PAIRED DEVICES:- ', devices);
    } catch (error) {
      console.log('Scan Error', error);
    }
  };

  ThermalPrinterModule.defaultConfig = {
    ...ThermalPrinterModule.defaultConfig,
    ip: '192.168.100.246',
    port: 9100,
    autoCut: false,
    timeout: 30000, // in milliseconds (version >= 2.2.0)
  };
  const handlePrint = async () => {
    try {
      await ThermalPrinterModule.printBluetooth({
        payload: 'hello world',
        printerNbrCharactersPerLine: 38,
      });
      Toast.show({ type: 'info', text1: 'DONE PRINTING ✅' });
    } catch (error) {
      console.log(error.message);
      Toast.show({ type: 'error', text1: 'ERROR ON PRINTING ❌', error });
    }
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
            Reciept
          </Text>
          <View className="w-[100%] border-b border-white " />
          <TouchableOpacity
            className=" bg-[#DA7320] p-2 rounded-lg"
            onPress={() => {
              // navigation.navigate('Reciept');
            }}
          >
            <Text style={styles.buttonText}>📶 CONNECT BT</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className=" bg-[#DA7320] p-2 rounded-lg"
            onPress={() => {
              scanDevices();
            }}
          >
            <Text style={styles.buttonText}>🖨️ PRINT</Text>
          </TouchableOpacity>
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
