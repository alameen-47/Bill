import { View, Text, TextInput, Image, FlatList } from 'react-native';
import React from 'react';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import pencil from '../assets/icons/pencil.png';
export default function Profile() {
  const profile = [
    { id: 1, label: 'Company Name', value: 'The Fresh Paradise' },
    // { id:1, label: 'Name', value: 'John Doe' },
    { id: 2, label: 'Email', value: 'alameenkhan1431@gmail.com' },
    { id: 3, label: 'Phone', value: '+1 234 567 890' },
    { id: 4, label: 'Address', value: '123 Main St, Balele,Karnataka, India' },
    { id: 5, label: 'GST Number {optional}', value: '29ABCDE1234F2Z5' },
  ];

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
            Profile
          </Text>
          <View className="w-[100%] border-b border-white " />
        </View>
        //////// Profile Details/////////
        {/* /////PROFILE IMAGE/////// */}
        <View>
          <View style={styles.ImageContainer}>
            <Image style={styles.ImageStyle} source={''} />
          </View>
        </View>
        ///////////////////////
        <View
          className="w-[100%] mt-10 p-5 rounded-lg"
          style={{ backgroundColor: '#2C2C2C' }}
        >
          <FlatList
            data={profile}
            keyExtractor={profile => profile.id.toString()}
            renderItem={({ item }) => (
              <>
                <Text style={styles.text}>{item.label}</Text>
                <TextInput
                  value={item.value}
                  style={styles.TextInput}
                  placeholder="Enter Name"
                  placeholderTextColor="gray"
                />
              </>
            )}
          />
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
const styles = {
  ImageContainer: {
    width: wp('30%'),
    height: hp('15%'),
    borderRadius: 100,
    backgroundColor: 'gray',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ImageStyle: {
    width: '90%',
    height: '90%',
    borderRadius: 100,
  },
  TextInput: {
    height: hp('6%'),
    backgroundColor: 'white',
    borderRadius: 10,
    paddingLeft: 10,
  },
  button: {
    backgroundColor: '#DA7320',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
  },
  text: {
    color: 'white',
    fontWeight: 800,
    fontSize: 18,
    margin: wp('1%'),
  },
};
