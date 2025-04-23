import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { adminAPI } from "../../services/api";
import { useUser } from "../../contexts/UserContext";

export default function BorrowingsTab() {
  const { user } = useUser();
  const [borrowings, setBorrowings] = useState([]);

  const fetchBorrowings = async () => {
    try {
      const res = await adminAPI.get("/borrowings");
      setBorrowings(res.data);
    } catch (err) {
      console.error("Erreur chargement emprunts:", err);
    }
  };

  const handleReturn = async (id) => {
    Alert.alert("Confirmation", "Marquer comme retourné ?", [
      { text: "Annuler" },
      {
        text: "Oui",
        onPress: async () => {
          try {
            await adminAPI.put(`/borrowings/${id}/return`);
            fetchBorrowings();
          } catch (err) {
            console.error("Erreur retour:", err);
          }
        },
      },
    ]);
  };

  useEffect(() => {
    fetchBorrowings();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>📖 Emprunts</Text>
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
