import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import React from 'react';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';
import WebView from 'react-native-webview';

export default function PrivacyPolicy() {
  const navigation = useNavigation();

  return (
    <SafeAreaProvider>
      <SafeAreaView
        style={{
          backgroundColor: '#171717',
          flex: 1,
        }}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Privacy Policy</Text>
        </View>
        <WebView
          source={{ uri: 'https://bill-h3p1.onrender.com/api/v1/bill47/privacy' }}
          style={styles.webView}
          startInLoadingState={true}
          renderLoading={() => (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Loading...</Text>
            </View>
          )}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: wp('4%'),
    backgroundColor: '#171717',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  backButton: {
    paddingRight: wp('4%'),
  },
  backButtonText: {
    color: '#DA7320',
    fontSize: wp('5%'),
    fontWeight: '600',
  },
  title: {
    color: 'white',
    fontSize: wp('6%'),
    fontWeight: '600',
  },
  webView: {
    flex: 1,
    backgroundColor: '#171717',
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#171717',
  },
  loadingText: {
    color: 'white',
    fontSize: wp('5%'),
  },
});

