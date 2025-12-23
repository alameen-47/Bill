import { View, Text, Touchable, TouchableOpacity } from 'react-native';
import React from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
export default function NewBill() {
  return (
    <View
      style={{ padding: wp('4%') }}
      className="bg-Cdarkgray h-screen w-screen flex-1 flex justify-center align-middle items-center"
    >
      <Text style={{ height: hp('20%'), width: wp('10%') }}>New Bill</Text>
      <TouchableOpacity style={styles.button}>
        <Text
          style={{ fontSize: wp('5%')  }}
          className=" text-white text-xl font-semibold"
        >
          VEGETABLES
        </Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = {
  text: {
    fontSize: wp('5%'),
    color: 'white',
    fontWeight: '600',
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    shadowColor: '#c1bfbfff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    padding: wp('4%'),
    height: hp('auto'),
    width: wp('40%'),
    backgroundColor: '#143227',
  },
};
