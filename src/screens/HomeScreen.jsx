import { View, Text, Button } from 'react-native';
import React from 'react';

export default function HomeScreen({ navigation }) {
  return (
    <View className="bg-pink-400 h-screen w-screen">
      <Text>HomeScreen</Text>
      <Button
        className="bg-black text-xl"
        title="Go to Profile"
        onPress={() => navigation.navigate('Profile')}
      />
    </View>
  );
}
