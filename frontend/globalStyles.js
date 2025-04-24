// Créez un fichier globalStyles.js
import { StyleSheet } from "react-native";

export default StyleSheet.create({
  appContainer: {
    flex: 1, // Le plus important
    backgroundColor: "#fff",
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 15,
  },
});
