import { StyleSheet } from 'react-native';
import { colors } from './colors'; // Adjust the import path as necessary

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    backgroundColor: colors.MainContainerBackground,
  },
  container: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: colors.text,
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
    color: colors.text,   // More prominent tone for input text (dark grey)
  },
  button: {
    backgroundColor: colors.uygulamaRengi,
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
  errorText: {
    color: colors.uygulamaRengi,
    fontSize: 12,
    marginBottom: 8,
  },
  inputError: {
    borderColor: colors.uygulamaRengi,
    borderWidth: 1,
  },
  loadingIndicator: {
    marginVertical: 20,
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
});

export default styles;


