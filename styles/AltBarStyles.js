import { StyleSheet } from 'react-native';
import { colors } from './colors'; // Adjust the import path as necessary

const styles = StyleSheet.create({
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: colors.MainContainerBackground, // Use color from constants
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    zIndex: 1,
    borderTopWidth: 1, // Subtle top border
    borderTopColor: colors.border, // Use color from constants
  },
  button: {
    flex: 1,
    alignItems: 'center',
  },
  label: {
    color: colors.text, // Use color from constants
    fontSize: 16, // Increased font size
    marginTop: 4,
  },
});

export default styles;

