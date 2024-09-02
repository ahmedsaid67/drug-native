import React from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import axios from 'axios';

function Anasayfa() {
  const fetchData = async () => {
    try {
      const response = await axios.get("http://192.168.1.103:8000/api/appname/profils/get_by_user_id/data/".replace("data",2));
      console.log("response:", response.data);
      Alert.alert("Data fetched successfully!");
    } catch (error) {
      console.error("Error fetching data:", error);
      Alert.alert("Error fetching data");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ana Sayfa</Text>
      <Button title="Fetch Data" onPress={fetchData} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default Anasayfa;

