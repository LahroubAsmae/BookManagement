import React from "react";
import { View, Text, Alert, StyleSheet } from "react-native";
import { useUser } from "../contexts/UserContext";
import { Button, Card } from "react-native-paper";

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
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.label}>Nom</Text>
          <Text style={styles.value}>{user?.name}</Text>

          <Text style={styles.label}>Email</Text>
          <Text style={styles.value}>{user?.email}</Text>

          <Text style={styles.label}>Statut</Text>
          <Text style={styles.value}>
            {user?.isAdmin ? "Administrateur" : "Utilisateur standard"}
          </Text>
        </Card.Content>
      </Card>

      <Button
        mode="contained"
        icon="logout"
        onPress={handleLogout}
        style={styles.logoutButton}
        buttonColor="#e74c3c"
        textColor="white"
      >
        Déconnexion
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f0f2f5",
    justifyContent: "flex-start",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
    color: "#34495e",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    elevation: 3,
    marginBottom: 30,
    paddingHorizontal: 8,
  },
  label: {
    fontSize: 14,
    color: "#7f8c8d",
    marginTop: 10,
  },
  value: {
    fontSize: 18,
    color: "#2c3e50",
    fontWeight: "500",
  },
  logoutButton: {
    marginTop: 20,
    paddingVertical: 8,
    borderRadius: 6,
  },
});
