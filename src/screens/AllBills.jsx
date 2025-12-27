import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  FlatList,
  Modal,
  Alert,
  Pressable,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import searchImg from '../assets/icons/search.png';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

export default function NewBill() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [filterdItems, setFilteredItems] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const categories = [
    {
      name: 'Fruits',
      id: 1,
      items: [
        { name: 'Apple', emoji: '🍎' },
        { name: 'Banana', emoji: '🍌' },
        { name: 'Orange', emoji: '🍊' },
        { name: 'Grapes', emoji: '🍇' },
        { name: 'Mango', emoji: '🥭' },
        { name: 'Apple', emoji: '🍎' },
        { name: 'Banana', emoji: '🍌' },
        { name: 'Orange', emoji: '🍊' },
        { name: 'Grapes', emoji: '🍇' },
        { name: 'Mango', emoji: '🥭' },
        { name: 'Mango', emoji: '🥭' },
        { name: 'Apple', emoji: '🍎' },
        { name: 'Banana', emoji: '🍌' },
        { name: 'Orange', emoji: '🍊' },
        { name: 'Grapes', emoji: '🍇' },
        { name: 'Mango', emoji: '🥭' },
        { name: 'Apple', emoji: '🍎' },
        { name: 'Banana', emoji: '🍌' },
        { name: 'Orange', emoji: '🍊' },
        { name: 'Grapes', emoji: '🍇' },
        { name: 'Mango', emoji: '🥭' },
        { name: 'Mango', emoji: '🥭' },
      ],
    },
    {
      name: 'Vegetables',
      id: 2,
      items: [
        { name: 'Carrot', emoji: '🥕' },
        { name: 'Broccoli', emoji: '  🥦' },
        { name: 'Potato', emoji: '🥔' },
        { name: 'Tomato', emoji: '🍅' },
        { name: 'Cucumber', emoji: '🥒' },
        { name: 'Carrot', emoji: '🥕' },
        { name: 'Broccoli', emoji: '  🥦' },
        { name: 'Potato', emoji: '🥔' },
        { name: 'Tomato', emoji: '🍅' },
        { name: 'Cucumber', emoji: '🥒' },
        { name: 'Carrot', emoji: '🥕' },
        { name: 'Broccoli', emoji: '  🥦' },
        { name: 'Potato', emoji: '🥔' },
        { name: 'Tomato', emoji: '🍅' },
        { name: 'Cucumber', emoji: '🥒' },
        { name: 'Carrot', emoji: '🥕' },
        { name: 'Broccoli', emoji: '  🥦' },
        { name: 'Potato', emoji: '🥔' },
        { name: 'Tomato', emoji: '🍅' },
        { name: 'Cucumber', emoji: '🥒' },
      ],
    },
    {
      name: 'Dairy',
      id: 3,
      items: [
        { name: 'Milk', emoji: '🥛' },
        { name: 'Cheese', emoji: '🧀' },
        { name: 'Yogurt', emoji: '🍦' },
        { name: 'Butter', emoji: '🧈' },
        { name: 'Ice Cream', emoji: '🍧' },
        { name: 'Milk', emoji: '🥛' },
        { name: 'Cheese', emoji: '🧀' },
        { name: 'Yogurt', emoji: '🍦' },
        { name: 'Butter', emoji: '🧈' },
        { name: 'Ice Cream', emoji: '🍧' },
        { name: 'Milk', emoji: '🥛' },
        { name: 'Cheese', emoji: '🧀' },
        { name: 'Yogurt', emoji: '🍦' },
        { name: 'Butter', emoji: '🧈' },
        { name: 'Ice Cream', emoji: '🍧' },
        { name: 'Milk', emoji: '🥛' },
        { name: 'Cheese', emoji: '🧀' },
        { name: 'Yogurt', emoji: '🍦' },
        { name: 'Butter', emoji: '🧈' },
        { name: 'Ice Cream', emoji: '🍧' },
      ],
    },
    {
      name: 'Bakery',
      id: 4,
      items: [
        { name: 'Bread', emoji: '🍞' },
        { name: 'Croissant', emoji: '🥐' },
        { name: 'Bagel', emoji: '🥯' },
        { name: 'Muffin', emoji: '🧁' },
        { name: 'Cake', emoji: '🍰' },
        { name: 'Bread', emoji: '🍞' },
        { name: 'Croissant', emoji: '🥐' },
        { name: 'Bagel', emoji: '🥯' },
        { name: 'Muffin', emoji: '🧁' },
        { name: 'Cake', emoji: '🍰' },
        { name: 'Bread', emoji: '🍞' },
        { name: 'Croissant', emoji: '🥐' },
        { name: 'Bagel', emoji: '🥯' },
        { name: 'Muffin', emoji: '🧁' },
        { name: 'Cake', emoji: '🍰' },
        { name: 'Bread', emoji: '🍞' },
        { name: 'Croissant', emoji: '🥐' },
        { name: 'Bagel', emoji: '🥯' },
        { name: 'Muffin', emoji: '🧁' },
        { name: 'Cake', emoji: '🍰' },
      ],
    },
  ];
  const searchData = search => {
    setSearch(search);
    const result = categories.filter(cat =>
      cat.items.some(item =>
        item.name.toLowerCase().includes(search.toLowerCase()),
      ),
    );
    setFilteredItems(result);
  };
  const selectedCategoryItems =
    categories.find(cat => cat.name === selectedCategory)?.items || [];
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
            All Bills
          </Text>
          <View style={styles.buttonContainer}>
            <View
              style={{
                height: hp(0.1),
                backgroundColor: 'white',
                width: wp(90),
              }}
            />
            <View
              style={{
                gap: hp('2%'),
                marginTop: hp('2%'),
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
            ></View>
          </View>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
const styles = {
  text: {
    fontSize: wp('5%'),
    color: 'white',
    fontWeight: '600',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: wp('4%'),
    marginTop: hp('2%'),
  },
  button: {
    marginHorizontal: wp('2%'),
    marginVertical: hp('1%'),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    shadowColor: '#c1bfbfff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    padding: wp('4%'),
    width: wp('40%'),
    backgroundColor: '#143227',
  },
  imageContainer: {
    backgroundColor: '#143227',
    width: wp(40),
    height: hp(15),
    borderRadius: 20,
    marginTop: hp('2%'),
    display: 'flex',
    itemsAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: wp(0.5),
  },
  image: {
    fontSize: wp(20),
    borderRadius: 20,
  },
};
