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
  TextInput,
  ActivityIndicator,
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
import { backupAPI } from '../api/api';

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

  // Backup state
  const [showBackupModal, setShowBackupModal] = useState(false);
  const [showRestoreModal, setShowRestoreModal] = useState(false);
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [backupStatus, setBackupStatus] = useState(null);
  const [loadingStatus, setLoadingStatus] = useState(false);

  // Load backup status on mount
  useEffect(() => {
    if (auth?.token) {
      loadBackupStatus();
    }
  }, [auth?.token]);

  // Load backup status from cloud
  const loadBackupStatus = async () => {
    if (!auth?.token) return;

    setLoadingStatus(true);
    try {
      const response = await backupAPI.getBackupStatus(auth.token);
      if (response.success) {
        setBackupStatus({
          hasBackup: response.hasBackup,
          lastBackupDate: response.lastBackupDate,
          stats: response.stats,
        });
      }
    } catch (error) {
      console.log('Error loading backup status:', error);
    } finally {
      setLoadingStatus(false);
    }
  };

  // Handle backup to cloud + email - automatic
  const handleBackup = async () => {
    if (!auth?.token) {
      Toast.show({
        type: 'error',
        text1: t('error'),
        text2: 'Please login to backup data',
      });
      return;
    }

    if (!auth?.user?.email) {
      Toast.show({
        type: 'error',
        text1: t('error'),
        text2: 'No email found in your profile',
      });
      return;
    }

    setIsBackingUp(true);
    try {
      // Use new cloud backup API
      const response = await backupAPI.saveBackup(auth.token);

      if (response.success) {
        // Refresh backup status
        await loadBackupStatus();

        Toast.show({
          type: 'success',
          text1: t('backupSent'),
          text2: 'Backup saved to cloud & sent to email!',
        });
        setShowBackupModal(false);
      } else {
        Toast.show({
          type: 'error',
          text1: t('backupFailed'),
          text2: response.message,
        });
      }
    } catch (error) {
      console.log('Backup Error:', error);
      Toast.show({
        type: 'error',
        text1: t('backupFailed'),
        text2:
          error?.response?.data?.message || error.message || 'Unknown error',
      });
    } finally {
      setIsBackingUp(false);
    }
  };

  // Handle restore from cloud - automatic, no input needed
  const handleRestore = async () => {
    if (!auth?.token) {
      Toast.show({
        type: 'error',
        text1: t('error'),
        text2: 'Please login to restore data',
      });
      return;
    }

    if (!backupStatus?.hasBackup) {
      Toast.show({
        type: 'error',
        text1: t('error'),
        text2: 'No backup found. Please create a backup first.',
      });
      return;
    }

    // Show confirmation
    Alert.alert(
      'Restore Data',
      'This will restore your data from the cloud backup. Existing data will not be deleted. Continue?',
      [
        { text: t('cancel'), style: 'cancel' },
        {
          text: t('restoreData'),
          style: 'destructive',
          onPress: async () => {
            await performRestore();
          },
        },
      ],
    );
  };

  // Perform the actual restore
  const performRestore = async () => {
    setIsRestoring(true);
    try {
      const response = await backupAPI.autoRestore(auth.token);

      if (response.success) {
        Toast.show({
          type: 'success',
          text1: t('dataRestored'),
          text2: `Bills: ${response.results.billsRestored}, Products: ${response.results.productsRestored}, Categories: ${response.results.categoriesRestored}`,
        });
        setShowRestoreModal(false);
      } else {
        Toast.show({
          type: 'error',
          text1: t('restoreFailed'),
          text2: response.message,
        });
      }
    } catch (error) {
      console.log('Restore Error:', error);
      Toast.show({
        type: 'error',
        text1: t('restoreFailed'),
        text2:
          error?.response?.data?.message || error.message || 'Unknown error',
      });
    } finally {
      setIsRestoring(false);
    }
  };

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
        '   TEST PRINT\n' +
        '================================\n' +
        '   This is a test page.\n' +
        '   Printer is working!\n' +
        '================================\n' +
        '   Thank You!\n\n\n\n';

      await connectedPrinter.write(testText);
      Toast.show({ type: 'success', text1: 'Test Print Complete' });
    } catch (error) {
      console.log('Print Error:', error);
      Toast.show({ type: 'error', text1: 'Print Failed' });
    }
  };

  // Handle backup to email - uses user's logged-in email automatically
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

            {/* Email Backup Section */}
            {/* <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t('emailBackup')}</Text>
               */}
            {/* Backup Card */}
            {/* <TouchableOpacity
                style={styles.backupCard}
                onPress={() => setShowBackupModal(true)}
                disabled={!auth?.token}
              >
                <View style={styles.backupCardContent}>
                  <Text style={styles.backupIcon}>📧</Text>
                  <View style={styles.backupCardText}>
                    <Text style={styles.backupTitle}>{t('backupData')}</Text>
                    <Text style={styles.backupDescription}>
                      {t('backupDescription')}
                    </Text>
                  </View>
                  <Text style={styles.backupArrow}>→</Text>
                </View>
              </TouchableOpacity> */}

            {/* Restore Card */}
            {/* <TouchableOpacity
                style={[styles.backupCard, styles.restoreCard]}
                onPress={() => setShowRestoreModal(true)}
                disabled={!auth?.token}
              >
                <View style={styles.backupCardContent}>
                  <Text style={styles.backupIcon}>♻️</Text>
                  <View style={styles.backupCardText}>
                    <Text style={styles.backupTitle}>{t('restoreData')}</Text>
                    <Text style={styles.backupDescription}>
                      {t('restoreDescription')}
                    </Text>
                  </View>
                  <Text style={styles.backupArrow}>→</Text>
                </View>
              </TouchableOpacity> */}

            {/* {!auth?.token && (
                <Text style={styles.loginHint}>
                  ⚠️ Please login to use backup features
                </Text>
              )}
            </View> */}

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

          {/* Backup Modal */}
          <Modal
            visible={showBackupModal}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setShowBackupModal(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>📧 {t('backupData')}</Text>

                <View style={styles.userEmailCard}>
                  <Text style={styles.userEmailLabel}>
                    Backup will be sent to:
                  </Text>
                  <Text style={styles.userEmail}>{auth?.user?.email}</Text>
                </View>

                <Text style={styles.modalInfoText}>
                  Your bills, products, and categories will be backed up and
                  sent to your registered email.
                </Text>

                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => {
                      setShowBackupModal(false);
                    }}
                  >
                    <Text style={styles.cancelButtonText}>{t('cancel')}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.confirmButton,
                      isBackingUp && styles.disabledButton,
                    ]}
                    onPress={handleBackup}
                    disabled={isBackingUp}
                  >
                    {isBackingUp ? (
                      <ActivityIndicator color="white" size="small" />
                    ) : (
                      <Text style={styles.confirmButtonText}>
                        📤 {t('backupNow')}
                      </Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>

          {/* Restore Modal */}
          <Modal
            visible={showRestoreModal}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setShowRestoreModal(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>♻️ {t('restoreData')}</Text>

                {backupStatus?.hasBackup ? (
                  <>
                    <View style={styles.backupInfoCard}>
                      <Text style={styles.backupInfoTitle}>
                        ✓ Cloud Backup Found
                      </Text>
                      {backupStatus.lastBackupDate && (
                        <Text style={styles.backupInfoDate}>
                          Last backup:{' '}
                          {new Date(
                            backupStatus.lastBackupDate,
                          ).toLocaleDateString()}
                        </Text>
                      )}
                      {backupStatus.stats && (
                        <View style={styles.backupStats}>
                          <Text style={styles.backupStatItem}>
                            📄 Bills: {backupStatus.stats.totalBills || 0}
                          </Text>
                          <Text style={styles.backupStatItem}>
                            📦 Products: {backupStatus.stats.totalProducts || 0}
                          </Text>
                          <Text style={styles.backupStatItem}>
                            📁 Categories:{' '}
                            {backupStatus.stats.totalCategories || 0}
                          </Text>
                        </View>
                      )}
                    </View>

                    <Text style={styles.modalInfoText}>
                      Your data will be restored from the cloud backup. Existing
                      data will not be deleted.
                    </Text>
                  </>
                ) : (
                  <View style={styles.noBackupCard}>
                    <Text style={styles.noBackupText}>⚠️ No Backup Found</Text>
                    <Text style={styles.noBackupHint}>
                      Please create a backup first before restoring.
                    </Text>
                  </View>
                )}

                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => {
                      setShowRestoreModal(false);
                    }}
                  >
                    <Text style={styles.cancelButtonText}>{t('cancel')}</Text>
                  </TouchableOpacity>

                  {backupStatus?.hasBackup && (
                    <TouchableOpacity
                      style={[
                        styles.confirmButton,
                        styles.restoreButton,
                        (isRestoring || loadingStatus) && styles.disabledButton,
                      ]}
                      onPress={handleRestore}
                      disabled={isRestoring || loadingStatus}
                    >
                      {isRestoring ? (
                        <ActivityIndicator color="white" size="small" />
                      ) : (
                        <Text style={styles.confirmButtonText}>
                          ♻️ {t('restoreData')}
                        </Text>
                      )}
                    </TouchableOpacity>
                  )}
                </View>
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

  // Backup Card Styles
  backupCard: {
    backgroundColor: '#2C2C2C',
    borderRadius: 10,
    padding: 15,
    width: '100%',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#DA7320',
  },
  restoreCard: {
    borderColor: '#27ae60',
  },
  backupCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backupIcon: {
    fontSize: 30,
    marginRight: 15,
  },
  backupCardText: {
    flex: 1,
  },
  backupTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  backupDescription: {
    color: '#888',
    fontSize: 12,
    marginTop: 2,
  },
  backupArrow: {
    color: '#DA7320',
    fontSize: 20,
    fontWeight: 'bold',
  },
  loginHint: {
    color: '#e74c3c',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 5,
  },

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
    marginBottom: 10,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    marginBottom: 15,
  },
  modalInfoText: {
    fontSize: 13,
    color: '#aaa',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 18,
  },
  userEmailCard: {
    backgroundColor: '#1a3a1a',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#2ecc71',
  },
  userEmailLabel: {
    fontSize: 12,
    color: '#2ecc71',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 16,
    color: 'white',
    fontWeight: '600',
  },
  backupInfoCard: {
    backgroundColor: '#1a3a1a',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#2ecc71',
  },
  backupInfoTitle: {
    fontSize: 18,
    color: '#2ecc71',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  backupInfoDate: {
    fontSize: 14,
    color: '#aaa',
    marginBottom: 10,
  },
  backupStats: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#2ecc71',
  },
  backupStatItem: {
    fontSize: 14,
    color: 'white',
    marginBottom: 5,
  },
  noBackupCard: {
    backgroundColor: '#3a1a1a',
    borderRadius: 10,
    padding: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#e74c3c',
    alignItems: 'center',
  },
  noBackupText: {
    fontSize: 18,
    color: '#e74c3c',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  noBackupHint: {
    fontSize: 14,
    color: '#aaa',
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#1C1C1D',
    borderRadius: 10,
    padding: 15,
    color: 'white',
    fontSize: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#444',
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  cancelButton: {
    backgroundColor: '#444',
    padding: 15,
    borderRadius: 10,
    flex: 1,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  confirmButton: {
    backgroundColor: '#DA7320',
    padding: 15,
    borderRadius: 10,
    flex: 1,
    alignItems: 'center',
  },
  restoreButton: {
    backgroundColor: '#27ae60',
  },
  disabledButton: {
    opacity: 0.7,
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
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
