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
      backgroundColor: 'rgba(0, 0, 0, 0.5)', // Daha hafif bir şeffaflık
    },
    modalContainer: {
      width: '90%', // Modal genişliği artırıldı
      padding: 30, // Daha fazla padding
      backgroundColor: '#F2F2F2', // Açık gri tonunda sade bir renk
      borderRadius: 20, // Köşeler daha yumuşak
      shadowColor: '#000',
      shadowOpacity: 0.3,
      shadowRadius: 10,
      elevation: 10,
      alignItems: 'center',
    },
    closeButton: {
      position: 'absolute',
      top: 15,
      right: 15,
    },
    modalTitle: {
      fontSize: 22, // Başlık boyutu biraz artırıldı
      fontWeight: '700',
      color: '#333', // Koyu gri, profesyonel bir görünüm
      marginBottom: 30,
    },
    modalActions: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
    },
    pauseButton: {
      backgroundColor: '#6FA3EF', // Modern bir mavi tonu
      paddingVertical: 12,
      paddingHorizontal: 30,
      borderRadius: 10,
      marginRight: 10,
    },
    deleteButton: {
      backgroundColor: '#FF5959', // Kırmızı tonunu biraz daha soft yaptık
      paddingVertical: 12,
      paddingHorizontal: 30,
      borderRadius: 10,
    },
    actionText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '600',
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