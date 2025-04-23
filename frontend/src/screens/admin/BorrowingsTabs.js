import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { adminService } from "../../services/api";
import { useUser } from "../../contexts/UserContext";

export default function BorrowingsTab() {
  const [borrowings, setBorrowings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();

  const fetchBorrowings = async () => {
    try {
      setLoading(true);
      // Vérifier que l'utilisateur est admin
      if (!user?.isAdmin) return;

      const response = await adminService.getAllBorrowings();
      setBorrowings(response);
    } catch (err) {
      Alert.alert("Erreur", "Accès admin requis");
    } finally {
      setLoading(false);
    }
  };

  const handleReturn = async (id) => {
    Alert.alert("Confirmation", "Marquer comme retourné ?", [
      { text: "Annuler" },
      {
        text: "Oui",
        onPress: async () => {
          try {
            await adminService.returnBorrowing(id);
            fetchBorrowings();
          } catch (err) {
            Alert.alert("Erreur", "Action admin requise");
          }
        },
      },
    ]);
  };

  useEffect(() => {
    fetchBorrowings();
  }, [user?.isAdmin]); // Recharge si le statut admin change

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>📖 Tous les emprunts</Text>
      <FlatList
        data={borrowings}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text>Livre: {item.book?.title}</Text>
            <Text>Utilisateur: {item.user?.name}</Text>
            <Text>Date: {new Date(item.createdAt).toLocaleDateString()}</Text>
            <Text>Statut: {item.returned ? "✅ Retourné" : "📚 Emprunté"}</Text>
            {!item.returned && (
              <TouchableOpacity onPress={() => handleReturn(item._id)}>
                <Text style={styles.return}>🔁 Marquer comme retourné</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      />
    </View>
  );
}
// Styles inchangés

const styles = StyleSheet.create({
  container: { padding: 10 },
  header: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  card: {
    backgroundColor: "#fff3e0",
    padding: 10,
    marginVertical: 5,
    borderRadius: 8,
  },
  return: { color: "green", marginTop: 5 },
});
