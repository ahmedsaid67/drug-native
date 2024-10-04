import { StyleSheet } from 'react-native';
import { colors } from './colors'; // Adjust the import path as necessary

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor:colors.MainContainerBackground,
    },
    dateSection: {
      width: '100%',
      backgroundColor: '#fff',
      alignItems: 'center',
      paddingVertical: 15,
      marginBottom:40,
    },
    dateContainer: {
      width: 60,
      paddingVertical: 10,
      paddingHorizontal: 15,
      borderRadius: 10,
      marginHorizontal: 10,
      alignItems: 'center',
      justifyContent: 'center',
    },
    selectedDate: {
      backgroundColor: colors.uygulamaRengi,
    },
    dateText: {
      fontSize: 16,
      fontWeight: 'bold',
      color: colors.text,
    },
    dayText: {
      fontSize: 14,
      color: colors.thirdText,
    },
    selectedDateText: {
      color: colors.secondText,
    },
    todayLabel: {
      marginTop: 10,
      fontSize: 16,
      fontWeight: 'bold',
      color: colors.uygulamaRengi,
    },
    reminderContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      backgroundColor: '#fff',
      padding: 15,
      marginHorizontal: 20,
      marginBottom: 20,
      borderRadius: 10,
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowRadius: 5,
      elevation: 3,
      position: 'relative', // Add this to position children absolutely within it
    },
    reminderContent: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1, // Allow this to take up remaining space
    },
    reminderTextContainer: {
      marginLeft: 15,
      flex: 1, // Allow this to take up remaining space
    },
    reminderText: {
      fontSize: 16,
      fontWeight: 'bold',
      color: colors.text,
    },
    reminderDetails: {
      marginTop: 5,
      fontSize: 14,
      color: colors.thirdText,
    },
    reminderDaysLeft: {
      marginTop: 5,
      fontSize: 12,
      color: colors.uygulamaRengi,
    },
    reminderIcon: {
      position: 'absolute', // Position absolutely within the container
      bottom: 0,
      right: 10, // Adjust as needed
    },
    modalBackground: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.7)', // Increased opacity for a darker overlay
  },
  modalContainer: {
      width: '90%',
      padding: 40,
      backgroundColor: '#fff', // Changed to pure white for better contrast
      borderRadius: 30,
      shadowColor: '#000',
      shadowOpacity: 0.4,
      shadowRadius: 15,
      elevation: 12,
      alignItems: 'center',
  },
  closeButton: {
      position: 'absolute',
      top: 15,
      right: 15,
  },
  modalTitle: {
      fontSize: 24, // Increased font size for better visibility
      fontWeight: 'bold',
      color: '#333', // Dark grey for better contrast
      marginBottom: 20,
  },
  uyariText: {
      fontSize: 16,
      color: '#666', // Lighter grey for warning text
      textAlign: 'center',
      marginBottom: 20,
  },
  modalActions: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
      marginTop: 15,
  },
  pauseButton: {
      backgroundColor: '#007BFF', // Bootstrap blue for a modern look
      paddingVertical: 12,
      width:120,
      borderRadius: 16,
      marginRight: 10,
      shadowColor: '#000',
      shadowOpacity: 0.3,
      shadowRadius: 5,
      elevation: 5,
  },
  deleteButton: {
      backgroundColor: '#FF6B6B', // Softer red for delete button
      paddingVertical: 12,
      width:120,
      borderRadius: 16,
      shadowColor: '#000',
      shadowOpacity: 0.3,
      shadowRadius: 5,
      elevation: 5,
  },
  disabledButton: {
    backgroundColor: '#A9A9A9', // Gri renk ile butonu devre dışı olduğunu belli ediyoruz
    shadowOpacity: 0, // Gölgeyi kaldırabiliriz
    elevation: 0, // Gölgeyi mobil cihazlar için de kapatalım
  },
  actionText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '600',
      textAlign: 'center', // Center align text for better appearance
  },
  
    floatingButton: {
      position: 'absolute',
      bottom: 80,
      right: 20,
      backgroundColor: '#1DA1F2',
      width: 60,
      height: 60,
      borderRadius: 30,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
  

export default styles;