import React from "react";
import { View, Text, Button, Alert, StyleSheet } from "react-native";
import { useUser } from "../contexts/UserContext";

export default function ProfileScreen({ navigation }) {
  const { user, logout } = useUser();

  const handleLogout = () => {
    Alert.alert("Déconnexion", "Êtes-vous sûr de vouloir vous déconnecter ?", [
      { text: "Annuler", style: "cancel" },
      {
        text: "Déconnexion",
        onPress: () => {
          logout();
          navigation.reset({
            index: 0,
            routes: [{ name: "Login" }],
          });
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {user?.isAdmin ? "Profil Administrateur" : "Profil Utilisateur"}
      </Text>

      <View style={styles.infoContainer}>
        <Text style={styles.label}>Nom:</Text>
        <Text style={styles.value}>{user?.name}</Text>

        <Text style={styles.label}>Email:</Text>
        <Text style={styles.value}>{user?.email}</Text>

        <Text style={styles.label}>Statut:</Text>
        <Text style={styles.value}>
          {user?.isAdmin ? "Administrateur" : "Utilisateur standard"}
        </Text>
      </View>

      {user?.isAdmin && (
        <View style={styles.adminSection}>
          <Text style={styles.adminTitle}>Fonctions d'administration</Text>
          <Button
            title="Gérer les utilisateurs"
            onPress={() => navigation.navigate("UserManagement")}
            color="#2c3e50"
          />
        </View>
      )}

      <Button
        title="Déconnexion"
        onPress={handleLogout}
        color="#e74c3c"
        style={styles.logoutButton}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f8f9fa",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
    color: "#2c3e50",
  },
  infoContainer: {
    marginBottom: 20,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    fontSize: 16,
    color: "#7f8c8d",
    marginBottom: 5,
  },
  value: {
    fontSize: 18,
    color: "#2c3e50",
    marginBottom: 15,
  },
  adminSection: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#ecf0f1",
    borderRadius: 10,
  },
  adminTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#3498db",
    marginBottom: 10,
  },
  logoutButton: {
    marginTop: 30,
  },
});
