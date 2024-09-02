// Arama.js
import React from 'react';
import { View, Text, Button } from 'react-native';

function Arama({ navigation }) {
  return (
    <View>
      <Text>Search Screen</Text>
      <Button title="Go to Login" onPress={() => navigation.navigate('Login')} />
    </View>
  );
}

export default Arama;

