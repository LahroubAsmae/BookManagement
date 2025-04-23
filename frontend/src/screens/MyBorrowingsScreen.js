import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Button,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { borrowingService } from "../services/api"; // Correction de l'import

export default function MyBorrowingsScreen() {
  const [borrowings, setBorrowings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyBorrowings = async () => {
    try {
      setLoading(true);
      // Utilisation correcte du service
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
      // Utilisation correcte de la méthode returnBook
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
        <ActivityIndicator size="large" color="#000" />
        <Text>Chargement...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mes emprunts</Text>
      {borrowings.length === 0 ? (
        <Text>Aucun emprunt en cours.</Text>
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
                <Button
                  title="Retourner"
                  onPress={() => handleReturn(item._id)}
                />
              )}
            </View>
          )}
        />
      )}
    </View>
  );
}

// Les styles restent identiques

const styles = StyleSheet.create({
  container: { padding: 16 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
  bookTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 5 },
  card: {
    padding: 12,
    backgroundColor: "#f2f2f2",
    borderRadius: 8,
    marginBottom: 12,
  },
  returned: {
    color: "green",
    marginBottom: 8,
  },
  active: {
    color: "orange",
    marginBottom: 8,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
