import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { submitLogin } from '../context/features/auth/loginSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import styles from '../styles/LoginStyles';
import LoginHeader from '../components/LoginHeader';
import { colors } from '../styles/colors'; // Adjust the import path as necessary
import Icon from 'react-native-vector-icons/FontAwesome';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { submitGoogleLogin } from '../context/features/auth/loginSlice';



const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false); // State for password visibility

  const navigation = useNavigation();
  const dispatch = useDispatch();

  const loading = useSelector((state) => state.login.loading);
  const loginStatus = useSelector((state) => state.login.success);
  const mailLoading = useSelector((state) => state.mailLogin.loading);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: '961430999782-h5hk92jjacn5gb2rjt8mmv6nrlpftarp.apps.googleusercontent.com', // Web Client ID
      offlineAccess: true, // Oturum yenileme için offline erişimi etkinleştirir
    });
  }, []);
  

  const handleLogin = () => {
    const newErrors = {};
    if (!email) newErrors.email = 'Email gerekli!';
    if (!password) newErrors.password = 'Şifre gerekli!';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    dispatch(submitLogin(email, password));
  };

  const handleGoogleLogin = async () => {
    try {
        await GoogleSignin.hasPlayServices();
        const userInfo = await GoogleSignin.signIn();
        // Dispatch the submitGoogleLogin action with userInfo
        dispatch(submitGoogleLogin(userInfo));
    } catch (error) {
        console.error("Google Sign-In Error: ", error);
    }
};



  useEffect(() => {
    if (loginStatus) {
      navigation.navigate('Ana Sayfa');
    }
  }, [loginStatus, navigation]);

  return (
    <View style={styles.pageContainer}>
      <LoginHeader />
      <View style={styles.container}>
        <Text style={styles.title}>Giriş Yap</Text>

        <TextInput
          style={[styles.input, errors.email && styles.inputError]}
          placeholder="Email"
          onChangeText={(text) => {
            setEmail(text);
            if (text) setErrors((prev) => ({ ...prev, email: '' }));
          }}
          value={email}
          autoCapitalize="none"
          placeholderTextColor={colors.text}
        />
        {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

        <View style={styles.passwordContainer}>
          <TextInput
            style={[styles.input, errors.password && styles.inputError]}
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
        
        {loading ? (
          <TouchableOpacity style={styles.button} disabled={true}>
            <ActivityIndicator size="small" color={colors.secondText} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Giriş</Text>
          </TouchableOpacity>
        )}

        {mailLoading ? (
          <TouchableOpacity style={styles.googleButton} disabled={true}>
            <ActivityIndicator size="small" color={colors.secondText} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.googleButton} onPress={handleGoogleLogin}>
            <Text style={styles.buttonText}>Google ile Devam Et</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={() => navigation.navigate('ResetPasswordCode')}>
          <Text style={styles.forgotPasswordText}>Şifremi unuttum</Text>
        </TouchableOpacity>
        <View style={styles.registerContainer}>
          <Text style={styles.registerText}>Hesabınız yok mu?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.registerLink}>Kayıt ol</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Login;
