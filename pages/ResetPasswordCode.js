import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, ActivityIndicator, ScrollView } from 'react-native';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { showMessage } from '../context/features/message/messageSlice'; // Import the showMessage action
import { colors } from '../styles/colors';
import { API_ROUTES } from '../utils/constant';
import ResetPasswordCodeHeader from '../components/ResetPasswordCodeHeader';
import styles from '../styles/ResetPasswordCodeStyle'
import { useNavigation } from '@react-navigation/native';


const ResetPasswordCode = () => {
  const [email, setEmail] = useState(''); // State to store the email input
  const [loading, setLoading] = useState(false); // State to handle loading indicator
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const navigation = useNavigation();
  // Function to handle password reset request
  const handlePasswordReset = async () => {
    const newErrors = {};
    if (!email) newErrors.email = 'Email gerekli!';
  
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
  
    setLoading(true);
  
    try {
      const response = await axios.post(API_ROUTES.RESET_PASSWORD_CODE, {
        email: email,
      });
  
      dispatch(showMessage({
        message: 'Şifre sıfırlama talebiniz gönderildi. E-posta adresinizi kontrol edin.',
        variant: 'success',
      }));
      navigation.navigate('ResetPassword');
    } catch (err) {
      let errorMessage = 'Bir hata oluştu. Lütfen tekrar deneyin.';
  
      // Backend'den gelen spesifik hata mesajlarını kontrol etme
      if (err?.response?.data?.email) {
        const emailErrors = err.response.data.email;
  
        if (emailErrors.includes("Geçerli bir e-posta adresi girin.")) {
          errorMessage = "Geçerli bir e-posta adresi girin.";
        } else if (emailErrors.includes("Bu e-posta adresine sahip bir kullanıcı bulunamadı.")) {
          errorMessage = "Bu e-posta adresi sistemde kayıtlı değil.";
        } else if (emailErrors.includes("E-posta gerekli.")) {
          errorMessage = "E-posta alanı gerekli.";
        } else {
          errorMessage = "E-posta ile ilgili bir hata oluştu.";
        }
      }
  
      dispatch(showMessage({
        message: errorMessage,
        variant: 'error',
      }));
  
      console.log("error:", err);
    }
    finally {
        setLoading(false);
      }
    };
  

  return (
    <View style={styles.pageContainer}>
      <ResetPasswordCodeHeader />
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Şifre Sıfırlama</Text>

            <TextInput
            style={styles.input}
            placeholder="E-posta adresiniz"
            onChangeText={(text) => {
              setEmail(text);
              if (text) setErrors((prev) => ({ ...prev, email: '' }));
            }}
            value={email} // Display the current email value
            autoCapitalize="none" // Disable automatic capitalization
            placeholderTextColor={colors.placeholderText} // Set placeholder text color
            />
            {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
            <TouchableOpacity
            style={styles.button}
            onPress={handlePasswordReset} // Trigger password reset on button press
            disabled={loading} // Disable button when loading
            >
            {loading ? (
                <ActivityIndicator size="small" color={colors.loadingColor} /> // Show loading indicator if loading
            ) : (
                <Text style={styles.buttonText}>Şifreyi Sıfırla</Text> // Button text
            )}
            </TouchableOpacity>
        </ScrollView>
    </View>
  );
};




export default ResetPasswordCode;


