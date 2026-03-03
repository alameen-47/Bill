import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  PermissionsAndroid,
  StyleSheet,
  FlatList,
  Alert,
  Modal,
  ScrollView,
} from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../context/authContext';
import { PrinterContext } from '../context/printerContext';
import { useLanguage, languages } from '../context/languageContext';
import RNBluetoothClassic from 'react-native-bluetooth-classic';
import Toast from 'react-native-toast-message';

export default function Settings() {
  const [auth, setAuth] = useAuth();
  const { connectedPrinter, connectPrinter, disconnectPrinter } =
    useContext(PrinterContext);
  const { t, currentLanguage, changeLanguage, getCurrentLanguage } =
    useLanguage();
  const [pairedDevices, setPairedDevices] = useState([]);
  const [printers, setPrinters] = useState([]);
  const [isScanning, setIsScanning] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('auth');
      setAuth(null);
      await AsyncStorage.clear();
      Toast.show({
        type: 'success',
        text1: t('success'),
        text2: 'Logged Out Successfully',
      });
    } catch (error) {
      console.log(error.message || 'Error in logout function');
      Toast.show({ type: 'error', text1: t('error'), text2: 'Logout Failed' });
    }
  };

  const requestBlutoothPermission = async () => {
    if (Platform.OS === 'android') {
      await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      ]);
    } else {
      console.log('iOS Bluetooth permissions handled by the library');
    }
  };

  const scanDevices = async () => {
    try {
      setIsScanning(true);
      Toast.show({ type: 'info', text1: t('scanning') });

      await requestBlutoothPermission();
      const enabled = await RNBluetoothClassic.isBluetoothEnabled();

      if (!enabled) {
        await RNBluetoothClassic.requestBluetoothEnabled();
      }

      const devices = await RNBluetoothClassic.getBondedDevices();

      if (devices && devices.length > 0) {
        setPairedDevices(devices);
        const printerList = devices.filter(
          device => device?.deviceClass?.majorClass === 1536,
        );
        setPrinters(printerList);
        Toast.show({
          type: 'success',
          text1: `Found ${devices.length} devices`,
        });
      } else {
        Toast.show({ type: 'info', text1: 'No paired devices found' });
      }
    } catch (error) {
      console.log('Scan Error - ', error);
      Toast.show({ type: 'error', text1: 'Scan Failed', text2: error.message });
    } finally {
      setIsScanning(false);
    }
  };

  const connectToPrinter = async device => {
    try {
      Toast.show({ type: 'info', text1: 'Connecting to printer...' });

      const isConnected = await device.isConnected();
      if (!isConnected) {
        await device.connect();
      }

      connectPrinter(device);
      Toast.show({
        type: 'success',
        text1: 'Printer Connected!',
        text2: device.name,
      });
    } catch (error) {
      console.log('Connect Error:', error);
      Toast.show({
        type: 'error',
        text1: 'Connection Failed',
        text2: error.message,
      });
    }
  };

  const disconnectFromPrinter = async () => {
    try {
      if (connectedPrinter) {
        await connectedPrinter.disconnect();
        disconnectPrinter();
        Toast.show({ type: 'info', text1: 'Printer Disconnected' });
      }
    } catch (error) {
      console.log('Disconnect Error:', error);
      Toast.show({ type: 'error', text1: 'Disconnect Failed' });
    }
  };

  const printTestPage = async () => {
    if (!connectedPrinter) {
      Toast.show({ type: 'error', text1: 'No Printer Connected' });
      return;
    }

    try {
      Toast.show({ type: 'info', text1: 'Printing test page...' });

      const isConnected = await connectedPrinter.isConnected();
      if (!isConnected) {
        await connectedPrinter.connect();
      }

      const testText =
        '================================\n' +
        '         TEST PRINT\n' +
        '================================\n' +
        '     This is a test page.\n' +
        '     Printer is working!\n' +
        '================================\n' +
        '         Thank You!\n';

      await connectedPrinter.write(testText);
      Toast.show({ type: 'success', text1: 'Test Print Complete' });
    } catch (error) {
      console.log('Print Error:', error);
      Toast.show({ type: 'error', text1: 'Print Failed' });
    }
  };

  const handleLanguageChange = async languageCode => {
    await changeLanguage(languageCode);
    setShowLanguageModal(false);
    Toast.show({
      type: 'success',
      text1: t('success'),
      text2: 'Language changed!',
    });
  };

  const currentLang = getCurrentLanguage();

  return (
    <SafeAreaProvider>
      <ScrollView showsVerticalScrollIndicator={false}>
        <SafeAreaView
          style={{
            padding: hp('4%'),
            backgroundColor: '#171717',
            height: '100%',
            width: '100%',
            flex: 1,
          }}
        >
          <View
            style={{ alignItems: 'flex-start', width: '100%', top: hp('-5%') }}
          >
            <Text style={{ fontSize: 55, color: 'white', fontWeight: 400 }}>
              {t('settings')}
            </Text>
            <View
              style={{
                width: '100%',
                borderBottomWidth: 1,
                borderBottomColor: 'white',
                marginBottom: 16,
              }}
            />

            {/* Language Selection */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                {t('language').toUpperCase()}
              </Text>
              <TouchableOpacity
                style={styles.languageSelector}
                onPress={() => setShowLanguageModal(true)}
              >
                <Text style={styles.languageFlag}>{currentLang.flag}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.languageName}>
                    {currentLang.nativeName}
                  </Text>
                  <Text style={styles.languageSubtext}>{currentLang.name}</Text>
                </View>
                <Text style={styles.changeText}>Change</Text>
              </TouchableOpacity>
            </View>

            {auth && auth.user && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>{t('userInformation')}</Text>
                <View style={styles.infoCard}>
                  <Text style={styles.infoText}>
                    👤 {auth.user.name || 'User'}
                  </Text>
                  <Text style={styles.infoText}>
                    📧 {auth.user.email || 'No email'}
                  </Text>
                </View>
              </View>
            )}

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t('printerStatus')}</Text>
              {connectedPrinter ? (
                <View style={styles.connectedPrinterCard}>
                  <Text style={styles.printerName}>
                    🖨️ {connectedPrinter.name}
                  </Text>
                  <View style={styles.printerActions}>
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={printTestPage}
                    >
                      <Text style={styles.actionButtonText}>
                        🧪 {t('testPrint')}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.actionButton, styles.disconnectButton]}
                      onPress={disconnectFromPrinter}
                    >
                      <Text style={styles.actionButtonText}>
                        ❌ {t('disconnect')}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <View style={styles.noPrinterCard}>
                  <Text style={styles.noPrinterText}>
                    ⚠️ {t('printerNotConnected')}
                  </Text>
                </View>
              )}
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t('bluetoothDevices')}</Text>
              <TouchableOpacity
                style={[styles.scanButton, isScanning && styles.scanningButton]}
                onPress={scanDevices}
                disabled={isScanning}
              >
                <Text style={styles.scanButtonText}>
                  {isScanning
                    ? '⏳ ' + t('scanning')
                    : '📶 ' + t('scanForDevices')}
                </Text>
              </TouchableOpacity>

              {printers.length > 0 ? (
                <FlatList
                  data={printers}
                  keyExtractor={item => item.id || item.address}
                  scrollEnabled={false}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={[
                        styles.deviceCard,
                        connectedPrinter?.address === item.address &&
                          styles.connectedDevice,
                      ]}
                      onPress={() => connectToPrinter(item)}
                    >
                      <Text style={styles.deviceName}>🖨️ {item.name}</Text>
                      {connectedPrinter?.address === item.address && (
                        <Text style={styles.connectedBadge}>
                          {t('connected')}
                        </Text>
                      )}
                    </TouchableOpacity>
                  )}
                />
              ) : null}
            </View>

            <TouchableOpacity
              style={styles.logoutButton}
              onPress={() =>
                Alert.alert('Logout', 'Are you sure?', [
                  { text: t('cancel'), style: 'cancel' },
                  { text: t('logout'), onPress: logout, style: 'destructive' },
                ])
              }
            >
              <Text style={styles.logoutButtonText}>
                📤 {t('logout').toUpperCase()}
              </Text>
            </TouchableOpacity>
          </View>
          {/* Language Selection Modal */}
          <Modal
            visible={showLanguageModal}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setShowLanguageModal(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>🌐 {t('selectLanguage')}</Text>

                <ScrollView style={{ maxHeight: hp('50%') }}>
                  {languages.map(lang => (
                    <TouchableOpacity
                      key={lang.code}
                      style={[
                        styles.languageOption,
                        currentLanguage === lang.code &&
                          styles.selectedLanguage,
                      ]}
                      onPress={() => handleLanguageChange(lang.code)}
                    >
                      <Text style={styles.languageOptionFlag}>{lang.flag}</Text>
                      <View style={{ flex: 1 }}>
                        <Text
                          style={[
                            styles.languageOptionName,
                            currentLanguage === lang.code &&
                              styles.selectedLanguageText,
                          ]}
                        >
                          {lang.nativeName}
                        </Text>
                        <Text style={styles.languageOptionSub}>
                          {lang.name}
                        </Text>
                      </View>
                      {currentLanguage === lang.code && (
                        <Text style={{ color: '#DA7320', fontSize: 20 }}>
                          ✓
                        </Text>
                      )}
                    </TouchableOpacity>
                  ))}
                </ScrollView>

                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setShowLanguageModal(false)}
                >
                  <Text style={styles.closeButtonText}>{t('cancel')}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </SafeAreaView>
      </ScrollView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  section: { width: '100%', marginBottom: 20 },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#DA7320',
    marginBottom: 8,
    letterSpacing: 1,
  },
  languageSelector: {
    backgroundColor: '#2C2C2C',
    borderRadius: 10,
    padding: 15,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  languageFlag: { fontSize: 30, marginRight: 15 },
  languageName: { color: 'white', fontSize: 18, fontWeight: '600' },
  languageSubtext: { color: '#888', fontSize: 14 },
  changeText: { color: '#DA7320', fontSize: 14, fontWeight: '600' },
  infoCard: {
    backgroundColor: '#2C2C2C',
    borderRadius: 10,
    padding: 15,
    width: '100%',
  },
  infoText: { color: 'white', fontSize: 14, marginBottom: 5 },
  connectedPrinterCard: {
    backgroundColor: '#1a3a1a',
    borderRadius: 10,
    padding: 15,
    width: '100%',
    borderWidth: 1,
    borderColor: '#2ecc71',
  },
  printerName: {
    color: '#2ecc71',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  printerActions: { flexDirection: 'row', gap: 10 },
  actionButton: {
    backgroundColor: '#DA7320',
    padding: 10,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
  },
  disconnectButton: { backgroundColor: '#c0392b' },
  actionButtonText: { color: 'white', fontSize: 14, fontWeight: '600' },
  noPrinterCard: {
    backgroundColor: '#3a1a1a',
    borderRadius: 10,
    padding: 15,
    width: '100%',
    borderWidth: 1,
    borderColor: '#e74c3c',
  },
  noPrinterText: { color: '#e74c3c', fontSize: 14, textAlign: 'center' },
  scanButton: {
    backgroundColor: '#DA7320',
    padding: 15,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
  },
  scanningButton: { backgroundColor: '#a85a1a' },
  scanButtonText: { color: 'white', fontSize: 18, fontWeight: '600' },
  deviceCard: {
    backgroundColor: '#2C2C2C',
    borderRadius: 10,
    padding: 15,
    width: '100%',
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  connectedDevice: { borderWidth: 1, borderColor: '#2ecc71' },
  deviceName: { color: 'white', fontSize: 16, fontWeight: '600' },
  connectedBadge: { color: '#2ecc71', fontSize: 12, fontWeight: 'bold' },
  logoutButton: {
    backgroundColor: '#c0392b',
    padding: 15,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 30,
  },
  logoutButtonText: { color: 'white', fontSize: 18, fontWeight: '600' },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#2C2C2C',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '70%',
  },
  modalTitle: {
    fontSize: wp('6%'),
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 20,
  },
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#1C1C1D',
    borderRadius: 10,
    marginBottom: 10,
  },
  selectedLanguage: {
    borderWidth: 2,
    borderColor: '#DA7320',
    backgroundColor: '#3a2a1a',
  },
  languageOptionFlag: { fontSize: 28, marginRight: 15 },
  languageOptionName: { color: 'white', fontSize: 18, fontWeight: '600' },
  languageOptionSub: { color: '#888', fontSize: 14 },
  selectedLanguageText: { color: '#DA7320' },
  closeButton: {
    backgroundColor: '#444',
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '600',
  },
});
