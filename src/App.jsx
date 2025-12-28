import { View, Text, Button ,TouchableOpacity,Image} from 'react-native';
import React from 'react';
import '.././global.css';
import AppNavigator from './navigation/AppNavigator';
import { NavigationContainer } from '@react-navigation/native';
import settings from './assets/icons/settings.png';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import NavigationBar from './components/NavigationBar';
export default function App({ navigation }) {
  return (
    <>
      <NavigationContainer>
        {/* //SETTINGS//// */}
        <TouchableOpacity>
          <Image
            source={settings}
            resizeMode="contain"
            style={{
              width: wp('8%'),
              height: hp('5%'),
              alignSelf: '!flex-end',
              left: wp('40%'),
            }}
          />
        </TouchableOpacity>{' '}
        <AppNavigator />
        <NavigationBar navigation={navigation} />
      </NavigationContainer>
    </>
  );
}
