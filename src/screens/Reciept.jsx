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
import Svg, { Path } from 'react-native-svg';

const { width } = Dimensions.get('window');
const HEIGHT = 200;
// import Printer, {
//   COMMANDS,
//   ColumnAlignment,
// } from '@haroldtran/react-native-thermal-printer';

export default function Reciept() {
  // const handlePrint = async () => {
  //   try {
  //     const Printer = DEVICE_PRINTER[selectedValue];
  //     const BOLD_ON = COMMANDS.TEXT_FORMAT.TXT_BOLD_ON;
  //     const BOLD_OFF = COMMANDS.TEXT_FORMAT.TXT_BOLD_OFF;
  //     const CENTER = COMMANDS.TEXT_FORMAT.TXT_ALIGN_CT;
  //     let orderList = [
  //       ['1. Skirt Palas Labuh Muslimah Fashion', 'x2', '500$'],
  //       ['2. BLOUSE ROPOL VIRAL MUSLIMAH FASHION ', 'x4222', '12.333.500$'],
  //       [
  //         '3. Women Crew Neck Button Down Ruffle Collar Loose Blouse',
  //         'x1',
  //         '30000000000000$',
  //       ],
  //     ];
  //     let columnAlignment = [
  //       ColumnAlignment.LEFT,
  //       ColumnAlignment.CENTER,
  //       ColumnAlignment.RIGHT,
  //     ];
  //     let columnWidth = [48 - (7 + 12), 7, 12];
  //     const header = ['Product list', 'Qty', 'Price'];
  //     Printer.printImage('https://i.ibb.co/21dsjpLx/image-23-2.png', {
  //       imageWidth: 400,
  //     });
  //     Printer.printColumnsText(header, columnWidth, columnAlignment, [
  //       `${BOLD_ON}`,
  //       '',
  //       '',
  //     ]);
  //     for (let i in orderList) {
  //       Printer.printColumnsText(orderList[i], columnWidth, columnAlignment, [
  //         `${BOLD_OFF}`,
  //         '',
  //         '',
  //       ]);
  //     }
  //     Printer.printBill(`${CENTER}Thank you\n`);
  //   } catch (err) {
  //     console.warn('Print bill error' + err);
  //   }
  // };

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
          </Text>{' '}
          <View className="w-[100%] border-b border-white " />
          <TouchableOpacity
            className=" bg-[#DA7320] p-2 rounded-lg"
            onPress={() => navigation.navigate('Reciept')}
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
