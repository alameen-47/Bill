import { View, Text, TouchableOpacity, Image } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import home from '../assets/icons/home.png';
import stack from '../assets/icons/stack.png';
import profile from '../assets/icons/profile.png';
import bill from '../assets/icons/bill.png';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

const NavigationBar = () => {
  const navigation = useNavigation();
  return (
    <SafeAreaView edges={['bottom']}>
      <View
        style={{ height: hp('8%'), paddingHorizontal: wp('10%') }}
        className="bg-Cnavyblue w-screen flex-row -bottom-5 flex  justify-between align-middle items-center"
      >
        <TouchableOpacity
          onPress={() => navigation.navigate('HomeScreen')}
          style={{ height: hp('10%'), width: wp('10%') }}
        >
          <Image
            resizeMode="contain"
            style={{ height: hp('10%'), width: wp('10%') }}
            source={home}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('AllBills')}>
          <Image
            resizeMode="contain"
            style={{ height: hp('10%'), width: wp('10%') }}
            source={stack}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('Profile')}
          style={{ height: hp('10%'), width: wp('10%') }}
        >
          <Image
            resizeMode="contain"
            style={{ height: hp('10%'), width: wp('10%') }}
            source={profile}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('Bill')}
          style={{ height: hp('10%') }}
          className=" cursor-pointer flex justify-center align-Middle items-center"
        >
          <View
            style={{ height: hp('6%') }}
            className="bg-Corange  rounded-xl px-[2rem] flex justify-center align-middle items-center"
          >
            <Image
              resizeMode="contain"
              style={{ width: wp('10%') }}
              source={bill}
            />
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};
export default NavigationBar;
