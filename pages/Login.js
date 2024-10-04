import React, { useState, useEffect } from 'react';
import { Text, TextInput, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { submitLogin } from '../context/features/auth/loginSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import styles from '../styles/LoginStyles';
import LoginHeader from '../components/LoginHeader';
import { colors } from '../styles/colors'; // Adjust the import path as necessary
import Icon from 'react-native-vector-icons/FontAwesome';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { submitGoogleLogin } from '../context/features/auth/loginSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_ROUTES } from '../utils/constant';

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

  const userMail = useSelector((state) => state.user.email);

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


  // Geçmiş bildirimleri kontrol eden fonksiyon
  const checkNotificationsOnAppStart = async () => {
    try {
      const notificationsString = await AsyncStorage.getItem('notifications');
  
      if (notificationsString) {
        const notificationsList = JSON.parse(notificationsString);
        const currentTime = new Date().getTime(); // Şu anki zaman
  
        // Geçmişteki bildirimleri filtrele
        const pastNotifications = notificationsList.filter(notification => {
          const notificationTime = new Date(notification.tarih + ' ' + notification.saat).getTime(); // Tarih ve saat bilgisini birleştir
  
          // Geçmişteki ve kullanıcıya ait bildirimler
          return notificationTime < currentTime && notification.email === userMail;
        });
  
        console.log("pastNotifications:", pastNotifications);
  
        if (pastNotifications.length > 0) {
          // API'ye gönder
          await axios.post(API_ROUTES.NOTIFICATIONS_CREATE, { bildirim_list: pastNotifications });
  
          // Gönderilen bildirimleri yerel depolamadan sil
          const updatedNotificationsList = notificationsList.filter(notification =>
            !pastNotifications.some(pastNotification => pastNotification.id === notification.id)
          );
          await AsyncStorage.setItem('notifications', JSON.stringify(updatedNotificationsList));
          console.log("Past notifications sent and removed from storage.");
        }
      }
    } catch (error) {
      console.error('Error checking notifications on app start:', error);
    }
  };



  useEffect(() => {
    if (loginStatus) {
      checkNotificationsOnAppStart();
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
            <ActivityIndicator size="small" color={colors.loadingColor} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Giriş</Text>
          </TouchableOpacity>
        )}

        {mailLoading ? (
          <TouchableOpacity style={styles.googleButton} disabled={true}>
            <ActivityIndicator size="small" color={colors.loadingColor} />
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
