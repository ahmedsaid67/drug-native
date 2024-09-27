import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const NoReminders = () => {

  return (
    <View style={styles.container}>
      <Icon name="bell-slash" size={80} color="#1DA1F2" style={styles.icon} />
      <Text style={styles.text}>Hatırlatıcı bulunmuyor.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  icon: {
    marginBottom: 20,
  },
  text: {
    fontSize: 18,
    color: '#1DA1F2',
    textAlign: 'center',
    marginBottom: 20,
  },

});

export default NoReminders;
