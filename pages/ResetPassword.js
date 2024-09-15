import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, ActivityIndicator, ScrollView } from 'react-native';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { showMessage } from '../context/features/message/messageSlice'; // Import the showMessage action
import { colors } from '../styles/colors';
import { API_ROUTES } from '../utils/constant';
import ResetPasswordHeader from '../components/ResetPasswordHeader';
import styles from '../styles/ResetPasswordCodeStyle'
import Icon from 'react-native-vector-icons/FontAwesome'; // Import FontAwesome icons
import { useNavigation } from '@react-navigation/native';

const ResetPassword = () => {
  const [code, setCode] = useState(''); // State to store the email input
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); // State to handle loading indicator
  const [showPassword, setShowPassword] = useState(false); // State for password visibility
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const navigation = useNavigation();
  
  // Function to handle password reset request
 // Function to handle password reset request
const handlePasswordReset = async () => {
  const newErrors = {};
  
  // Form Validations
  if (!code) {
    newErrors.code = '6 haneli kod gerekli!';
  } else if (code.length !== 6) {
    newErrors.code = 'Kod 6 haneli olmalıdır!';
  }

  if (!password) {
    newErrors.password = 'Yeni şifre gerekli!';
  } else if (password.length < 8) {
    newErrors.password = 'Şifre en az 8 karakter olmalıdır!';
  }

  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    return;
  }

  setLoading(true);

  try {
    const response = await axios.post(API_ROUTES.RESET_PASSWORD, {
      code: code,
      new_password: password,
    });

    dispatch(showMessage({
      message: 'Şifre başarılı bir şekilde yenilenmiştir.',
      variant: 'success',
    }));
    navigation.navigate('Login');
  } catch (error) {
    // Genel hata mesajı
    let errorMessage = 'Bir hata oluştu. Lütfen tekrar deneyin.';
  
    if (error.response && error.response.data && error.response.data.detail) {
      // Backend'den gelen spesifik hata mesajını yakala ve Türkçe'ye çevir
      const backendMessage = error.response.data.detail;
  
      if (backendMessage === 'Invalid or expired code.') {
        errorMessage = 'Geçersiz, süresi dolmuş veya daha önce kullanılmış bir kod girdiniz.';
      } else if (backendMessage === 'Code has expired.') {
        errorMessage = 'Kodun süresi dolmuş!';
      } else {
        errorMessage = 'Beklenmedik bir hata oluştu.';
      }
    }
  
    // Kullanıcıya mesajı göster
    dispatch(showMessage({
      message: errorMessage,
      variant: 'error',
    }));
  
    console.log("error:", error);
  }
  finally {
    setLoading(false);
  }
};


  return (
    <View style={styles.pageContainer}>
      <ResetPasswordHeader />
        <View style={styles.container}>
        <Text style={styles.title}>Şifre Sıfırlama</Text>
            <TextInput
            style={styles.input}
            placeholder="6 haneli kodu giriniz"
            onChangeText={(text) => {
                setCode(text)
                if (text) setErrors((prev) => ({ ...prev, code: '' }))
            }} // Update email state on text change
            value={code} // Display the current email value
            autoCapitalize="none" // Disable automatic capitalization
            placeholderTextColor={colors.text}
            />
            {errors.code && <Text style={styles.errorText}>{errors.code}</Text>}
            <View style={styles.passwordContainer}>
                <TextInput
                    style={[styles.input, errors.email && styles.inputError]}
                    placeholder="Şifre"
                    onChangeText={(text) => {
                    setPassword(text);
                    if (text) setErrors((prev) => ({ ...prev, password: '' }));
                    }}
                    value={password}
                    secureTextEntry={!showPassword}
                    placeholderTextColor={colors.text}
                />
                <TouchableOpacity
                    style={styles.eyeIcon}
                    onPress={() => setShowPassword(!showPassword)}
                >
                    <Icon
                    name={showPassword ? 'eye' : 'eye-slash'}
                    size={24}
                    color={colors.text}
                    />
                </TouchableOpacity>
            </View>
            {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
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
        </View>
    </View>
  );
};




export default ResetPassword;
