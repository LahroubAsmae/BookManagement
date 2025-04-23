import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Button,
  Alert,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import api from "../services/api";
import { borrowingService } from "../services/api"; // Utilisation de l'instance dédiée aux emprunts

const BookListScreen = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const res = await api.get("/books"); // Récupération des livres (publique ou pas protégée par token)
      setBooks(res.data);
    } catch (error) {
      console.error("Erreur lors du chargement des livres :", error);
      Alert.alert("Erreur", "Impossible de charger les livres");
    } finally {
      setLoading(false);
    }
  };

  const borrowBook = async (bookId) => {
    try {
      await borrowingService.create(bookId);
      Alert.alert("Succès", "Livre emprunté avec succès !");
      fetchBooks(); // Mise à jour de la liste
    } catch (error) {
      console.error("Erreur lors de l'emprunt :", error);
      Alert.alert(
        "Erreur",
        error.response?.data?.message || "Erreur d'emprunt"
      );
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchBooks(); // recharge à chaque focus
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
      <Text style={styles.title}>Livres disponibles</Text>
      <FlatList
        data={books.filter((b) => b.available)}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.bookTitle}>{item.title}</Text>
            <Text>Auteur : {item.author}</Text>
            <Button
              title="Emprunter"
              onPress={() => borrowBook(item._id)}
              disabled={!item.available}
            />
          </View>
        )}
      />
    </View>
  );
};

export default BookListScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
  item: {
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#eee",
    borderRadius: 6,
  },
  bookTitle: { fontSize: 18, fontWeight: "600" },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
