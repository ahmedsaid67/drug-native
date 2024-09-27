import { StyleSheet } from 'react-native';
import { colors } from './colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.MainContainerBackground,
  },
  secondContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  searchBoxContainer: {
    marginBottom: 16,
  },
  searchBox: {
    height: 45,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    color: colors.text,
    backgroundColor: '#fff',
  },
  popularSearchesContainer: {
    paddingVertical: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
    color: colors.uygulamaRengi,
  },
  popularSearchItem: {
    fontSize: 16,
    paddingVertical: 8,
    color: colors.text,
  },
  searchResultsContainer: {
    flex: 1,
    marginTop: 10,
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: colors.border,
    alignSelf: 'center',
    marginTop: 8,
  },
  medicineItem: {
    width: '100%',
    paddingVertical: 12,
    borderBottomWidth: 1, // Add a border at the bottom
    borderBottomColor: colors.border, // Set the color of the bottom border
    flexDirection: 'row', // Align content horizontally
    alignItems: 'center', // Center content vertically
    justifyContent: 'space-between', // Distribute content horizontally
  },
  medicineContent: {
    flexDirection: 'column', // Elemanları alt alta yerleştir
    justifyContent: 'flex-start', // Üstten başlayarak yerleştirir
    alignItems: 'flex-start', // Sol tarafa hizalar
    paddingHorizontal: 12,
    flex: 1, // İçeriğin yatayda genişlemesini sağlar
  },
  iconContainer: {

    paddingHorizontal: 6,

  },
  medicineName: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 4, // Elemanlar arasındaki boşluk
  },
  medicineEtkenMadde: {
    fontSize: 16,
    color: colors.thirdText,
    marginBottom: 4, // Elemanlar arasındaki boşluk
  },
  noResults: {
    textAlign: 'center',
    fontSize: 16,
    marginTop: 20,
    color: colors.thirdText,
  },
  loadingIndicator: {
    color: colors.uygulamaRengi,
  },
});

export default styles;
