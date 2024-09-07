import { StyleSheet } from 'react-native';
import { colors } from './colors'; // Adjust the import path as necessary

const styles = StyleSheet.create({
    pageContainer: {
      flex: 1,
      backgroundColor: colors.MainContainerBackground,
    },
    container: {
      paddingHorizontal: 30,
      paddingVertical: 20,
    },
    image: {
      width: 100,
      height: 100,
      marginBottom: 20,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
      color: 'black',
      textAlign: 'left',  // Sol hizalı başlık
    },
    input: {
      width: '100%',
      padding: 15,
      marginBottom: 10,
      borderRadius: 5,
      textAlign: 'left',  // Sol hizalı input
      borderWidth: 1,     // Kenar çizgisi kalınlığı
      borderColor: colors.border,
      color: colors.text,
    },
    button: {
      backgroundColor: colors.butonBackround,
      width: '100%',
      padding: 15,
      borderRadius: 5,
      alignItems: 'center',
      marginTop: 10,
      minHeight:52,
    },
    buttonText: {
      color: colors.secondText,
      fontWeight: 'bold',
      fontSize: 16,
    },
    forgotPasswordText: {
      color: colors.secondColor,
      marginTop: 10,
      textAlign: 'left',  // Sol hizalı
    },
    registerContainer: {
      flexDirection: 'row',
      marginTop: 20,
      justifyContent: 'flex-start',  // Sol hizalı kayıt ol bölümü
    },
    registerText: {
      color: 'black',
      marginRight: 5,
    },
    registerLink: {
      color: colors.secondColor,
    },
    inputError: {
      borderColor: colors.uyariBorder,
      borderWidth: 1,
    },
    errorText: {
      color: colors.uyariText,
      fontSize: 12,
      marginBottom: 8,
    },
    loadingIndicator: {
      padding: 15,
      alignItems: 'center',
    },
    passwordContainer: {
      position: 'relative',
    },
    eyeIcon: {
      position: 'absolute',
      right: 10,
      top: 15,
      zIndex: 1,
    },
    eyeIconImage: {
      width: 24,
      height: 24,
    },
    googleButton: {
      backgroundColor: '#4285F4',
      width: '100%',
      padding: 15,
      borderRadius: 5,
      alignItems: 'center',
      marginTop: 10,
      minHeight: 52,
    },
    
    
});

export default styles;
