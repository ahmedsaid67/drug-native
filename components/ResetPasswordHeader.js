import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // Import FontAwesome icons
import { useNavigation } from '@react-navigation/native';
import { colors } from '../styles/colors'; // Adjust the import path as necessary
import styles from '../styles/LoginHeaderStyles';

const ResetPasswordHeader = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.navigate('ResetPasswordCode')}>
        <Icon name="arrow-left" size={24} color={colors.icon} />
      </TouchableOpacity>
      <Text style={styles.logoText}>MenDosa</Text>
    </View>
  );
};


export default ResetPasswordHeader;