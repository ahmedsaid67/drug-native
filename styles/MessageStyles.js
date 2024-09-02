import { StyleSheet } from 'react-native';
import { colors } from './colors'; // Adjust the import path as necessary

const styles = StyleSheet.create({
    messageContainer: {
      position: 'absolute',
      bottom: 20,
      alignSelf: 'center', // Center horizontally
      paddingVertical: 15,
      paddingHorizontal: 15,
      borderRadius: 10,
      flexDirection: 'row',
      justifyContent: 'center', // Center vertically
      elevation: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.3,
      shadowRadius: 10,
      zIndex: 1000,
      
      marginHorizontal: 20, // Optional: adjust margin if necessary
    },
    messageText: {
      color: colors.secondText,
      fontSize: 16,
    },
  });

export default styles;
