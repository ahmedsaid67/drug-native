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
  notificationCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 2,
    borderColor: colors.border,
    borderWidth: 1,
  },
  description: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 8,
    fontWeight: 'bold',
  },
  date: {
    fontSize: 14,
    color: colors.thirdText,
  },
});

export default styles;
