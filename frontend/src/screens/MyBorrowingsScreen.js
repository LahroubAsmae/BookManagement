import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { borrowingService } from "../services/api";

export default function MyBorrowingsScreen() {
  const [borrowings, setBorrowings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyBorrowings = async () => {
    try {
      setLoading(true);
      const response = await borrowingService.getAll();
      setBorrowings(response);
    } catch (error) {
      console.log("Erreur:", error.message);
      Alert.alert("Erreur", "Impossible de charger les emprunts");
    } finally {
      setLoading(false);
    }
  };

  const handleReturn = async (id) => {
    try {
      await borrowingService.returnBook(id);
      Alert.alert("Succès", "Livre retourné !");
      fetchMyBorrowings();
    } catch (error) {
      console.log("Erreur retour:", error.message);
      Alert.alert("Erreur", "Échec du retour du livre");
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchMyBorrowings();
    }, [])
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#e63946" />
        <Text style={{ marginTop: 10 }}>Chargement...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {borrowings.length === 0 ? (
        <Text style={styles.emptyText}>Aucun emprunt en cours.</Text>
      ) : (
        <FlatList
          data={borrowings}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.bookTitle}>{item.book?.title}</Text>
              <Text style={item.isReturned ? styles.returned : styles.active}>
                Status : {item.isReturned ? "✅ Retourné" : "📚 En cours"}
              </Text>
              {!item.isReturned && (
                <TouchableOpacity
                  style={styles.returnButton}
                  onPress={() => handleReturn(item._id)}
                >
                  <Text style={styles.buttonText}>Retourner</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 16,
    color: "#2c3e50",
    textAlign: "center",
  },
  emptyText: {
    textAlign: "center",
    color: "#7f8c8d",
    marginTop: 20,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: "#34495e",
  },
  returned: {
    color: "green",
    marginBottom: 10,
    fontWeight: "500",
  },
  active: {
    color: "orange",
    marginBottom: 10,
    fontWeight: "500",
  },
  returnButton: {
    backgroundColor: "#e63946",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
