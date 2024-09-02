import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome'; // Import FontAwesome icons
import styles from '../styles/AltBarStyles';
import { colors } from '../styles/colors'; // Adjust the import path as necessary

const AltBar = () => {
  const navigate = useNavigation();

  const navigateToScreen = (screenName, params = {}) => {
    navigate.navigate(screenName, params);
  };

  return (
    <View style={styles.bottomBar}>
      <TouchableOpacity
        onPress={() => navigateToScreen('Ana Sayfa')}
        style={styles.button}
      >
        <Icon name="home" size={24} color={colors.icon} />
        <Text style={styles.label}>Ana Sayfa</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigateToScreen('Arama')}
        style={styles.button}
      >
        <Icon name="search" size={24} color={colors.icon} />
        <Text style={styles.label}>Arama</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigateToScreen('Bildirimler')}
        style={styles.button}
      >
        <Icon name="bell" size={24} color={colors.icon} />
        <Text style={styles.label}>Bildirimler</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigateToScreen('Hatırlatıcılar')}
        style={styles.button}
      >
        <Icon name="clock-o" size={24} color={colors.icon} />
        <Text style={styles.label}>Hatırlatıcılar</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AltBar;



