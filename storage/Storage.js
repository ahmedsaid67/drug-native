import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeToken = async (token) => {
    try {
      await AsyncStorage.setItem('token', token);
    } catch (error) {
      console.log('AsyncStorage kaydetme hatası: ' + error.message);
    }
  }
  
  // token'i AsyncStorage'den okuyan fonksiyon
export  const getToken = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      console.log("token:",token)
      return token;
    } catch (error) {
      console.log("token yok")
    }
  }
export const deleteToken = async ()=> {
    try {
      await AsyncStorage.removeItem('token');
    } catch (error) {
      console.log('AsyncStorage silme hatası: ' + error.message);
    }
  }