import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

function Bildirimler() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bildirimler</Text>
      {/* Arama içerikleri */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default Bildirimler;

