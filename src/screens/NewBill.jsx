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
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState('');
  const categories = [
    {
      name: 'Fruits',
      id: 1,
      items: [
        { id: 1, name: 'Apple', emoji: '🍎' },
        { id: 2, name: 'Banana', emoji: '🍌' },
        { id: 3, name: 'Orange', emoji: '🍊' },
        { id: 4, name: 'Grapes', emoji: '🍇' },
        { id: 5, name: 'Mango', emoji: '🥭' },
      ],
    },
    {
      name: 'Vegetables',
      id: 2,
      items: [
        { id: 6, name: 'Carrot', emoji: '🥕' },
        { id: 7, name: 'Broccoli', emoji: ' 🥦' },
        { id: 8, name: 'Potato', emoji: '🥔' },
        { id: 9, name: 'Tomato', emoji: '🍅' },
        { id: 10, name: 'Cucumber', emoji: '🥒' },
      ],
    },
    {
      name: 'Dairy',
      id: 3,
      items: [
        { id: 11, name: 'Milk', emoji: '🥛' },
        { id: 12, name: 'Cheese', emoji: '🧀' },
        { id: 13, name: 'Yogurt', emoji: '🍦' },
        { id: 14, name: 'Butter', emoji: '🧈' },
        { id: 15, name: 'Ice Cream', emoji: '🍧' },
      ],
    },
    {
      name: 'Bakery',
      id: 4,
      items: [
        { id: 16, name: 'Bread', emoji: '🍞' },
        { id: 17, name: 'Croissant', emoji: '🥐' },
        { id: 18, name: 'Bagel', emoji: '🥯' },
        { id: 19, name: 'Muffin', emoji: '🧁' },
        { id: 20, name: 'Cake', emoji: '🍰' },
      ],
    },
  ];
  const [selectedCategoryId, setSelectedCategoryId] = useState(
    categories[0].id,
  );

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
    categories.find(cat => cat.id === selectedCategoryId)?.items || [];
  console.log('+++++++++', selectedItem, '4444444444');
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
            New Bill
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
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
            >
              {/* //CATEGORIES */}
              <FlatList
                data={categories}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={item => item.id.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => setSelectedCategoryId(item.id)}
                  >
                    <Text
                      style={{ fontSize: wp('5%') }}
                      className=" text-white text-xl font-semibold"
                    >
                      {item.name.toUpperCase()}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            </View>
            {/* /////LINE//// */}
            <View
              style={{
                height: hp(0.1),
                backgroundColor: 'white',
                width: wp(90),
              }}
            />
          </View>
          {/* ///////SEARCHBAR////// */}
          <View className="bg-Clightgray w-full h-[4rem] rounded-lg  flex flex-row   items-center text-center my-2 gap-2 px-2">
            <Image
              resizeMode="contain"
              style={{ width: wp('8%'), height: hp('4%') }}
              source={searchImg}
            />
            <TextInput
              placeholder="Search"
              value={search}
              placeholderTextColor="gray"
              onChangeText={searchData}
              className="text-white text-xl Appfont-semibold  "
            />
          </View>
          {categories.map(category => {
            category.items.map(item => {
              <Text style={styles.image}>{item.emoji}</Text>;
            });
          })}

          {/* ////PRODUCTS//// */}
          <FlatList
            data={selectedCategoryItems}
            keyExtractor={item => item.name}
            horizontal={false}
            numColumns={2}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.imageContainer}
                onPress={() => {
                  setSelectedItem(item);
                  setModalVisible(!modalVisible);
                }}
              >
                <Text style={styles.image}>{item.emoji}</Text>
                <Text
                  style={{
                    fontSize: wp('4%'),
                    color: 'white',
                  }}
                >
                  {item.name}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
        {/* ----------------MODAL------------------------- */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert('Modal has been closed');
            setModalVisible(!modalVisible);
          }}
        >
          {selectedItem && (
            <View style={styles.modalContainer}>
              <Pressable
                style={styles.closeButton}
                onPress={() => setModalVisible(!modalVisible)}
              >
                <Text style={styles.closeText}>🆇 </Text>
              </Pressable>
              <View style={styles.imageContainer}>
                <Text style={styles.image}>{selectedItem.emoji}</Text>
              </View>
              <Text style={styles.text}>{selectedItem.name}</Text>
              <View style={{ display: 'flex', flexDirection: 'row', gap: 20 }}>
                <TextInput
                  style={styles.textInput}
                  placeholder="AMOUNT /-"
                  backgroundColor="white"
                />
                <TextInput
                  style={styles.textInput}
                  placeholder="QUANTITY "
                  backgroundColor="white"
                />
              </View>
              <TextInput
                style={[styles.textInput, { height: hp(8), margin: 5 }]}
                placeholder="TOTAL"
                backgroundColor="white"
              />
              <TouchableOpacity style={styles.addButton}>
                <Text style={styles.buttonText}>ADD</Text>
              </TouchableOpacity>
            </View>
          )}
        </Modal>
        {/* ----------------------------------------- */}
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
    margin: wp(2),
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
  modalContainer: {
    height: hp(40),
    display: 'absolute',
    top: hp(25),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(153, 147, 147, 1)',
    borderRadius: 20,
  },
  modalImage: {
    fontSize: wp(25),
    padding: 25,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 8,
  },
  closeText: {
    fontSize: wp(10),
    fontWeight: 'bold',
    color: 'white',
  },
  textInput: {
    width: wp(30),
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'black',
  },
  addButton: {
    backgroundColor: '#DA7320',
    padding: 10,
    borderRadius: 15,
    width: wp(50),
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
  },
};
