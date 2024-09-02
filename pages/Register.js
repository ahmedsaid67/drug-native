import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../styles/colors';
import { submitCreate } from '../context/features/auth/loginSlice';
import RegisterHeader from '../components/RegisterHeader';
import styles from '../styles/RegisterStyle';
import Icon from 'react-native-vector-icons/FontAwesome'; // Import FontAwesome icons

const MAX_LENGTH = 30; // Maximum character limit for firstName and lastName

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false); // State for password visibility

  const navigation = useNavigation();
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.login.loading);
  const loginStatus = useSelector((state) => state.login.success);

  const handleRegister = () => {
    const newErrors = {};

    // Validate firstName and lastName length
    if (!firstName) {
      newErrors.firstName = 'İsim gerekli!';
    } else if (firstName.length > MAX_LENGTH) {
      newErrors.firstName = `İsim ${MAX_LENGTH} karakterden uzun olamaz!`;
    }

    if (!lastName) {
      newErrors.lastName = 'Soyisim gerekli!';
    } else if (lastName.length > MAX_LENGTH) {
      newErrors.lastName = `Soyisim ${MAX_LENGTH} karakterden uzun olamaz!`;
    }

    if (!email) newErrors.email = 'Email gerekli!';
    if (!password) newErrors.password = 'Şifre gerekli!';

    // If there are errors, set them and stop the function
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // If no errors, proceed with the registration request
    dispatch(submitCreate(email, password, firstName, lastName));
  };

  useEffect(() => {
    if (loginStatus) {
      navigation.navigate('Ana Sayfa');
    }
  }, [loginStatus, navigation]);

  return (
    <View style={styles.pageContainer}>
      <RegisterHeader />
      <View style={styles.container}>
        <Text style={styles.title}>Kayıt Ol</Text>

        <TextInput
          style={[styles.input, errors.firstName && styles.inputError]}
          placeholder="İsim"
          onChangeText={(text) => {
            setFirstName(text);
            if (text) setErrors((prev) => ({ ...prev, firstName: '' }));
          }}
          value={firstName}
          autoCapitalize="words"
          placeholderTextColor={colors.text}
        />
        {errors.firstName && <Text style={styles.errorText}>{errors.firstName}</Text>}

        <TextInput
          style={[styles.input, errors.lastName && styles.inputError]}
          placeholder="Soyisim"
          onChangeText={(text) => {
            setLastName(text);
            if (text) setErrors((prev) => ({ ...prev, lastName: '' }));
          }}
          value={lastName}
          autoCapitalize="words"
          placeholderTextColor={colors.text}
        />
        {errors.lastName && <Text style={styles.errorText}>{errors.lastName}</Text>}

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
          <TouchableOpacity style={styles.button} onPress={handleRegister}>
            <Text style={styles.buttonText}>Kayıt Ol</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default Register;





