import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // Import FontAwesome icons
import styles from '../styles/UstBarStyles';
import { colors } from '../styles/colors'; // Adjust the import path as necessary
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation from React Navigation

const UstBar = () => {
  const user = useSelector((state) => state.user);
  const navigation = useNavigation(); // Initialize navigation
  // console.log("userUstBar:",user)

  const displayName = user.id ? `${user.first_name} ${user.last_name}` : 'Misafir';

  const handleIconPress = () => {
    if (user.id) {
      navigation.navigate('Profil'); // Navigate to Profile if user is logged in
    } else {
      navigation.navigate('Login'); // Navigate to Login if user is not logged in
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logoText}>MenDosa</Text>
      <View style={styles.rightSection}>
        <Text style={styles.guestText}>{displayName}</Text>
        <TouchableOpacity onPress={handleIconPress}>
          <Icon name="user" size={24} color={colors.icon} /> 
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default UstBar;



