import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Button,
  Alert,
  Image,
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
            {item.coverImage && (
              <Image
                source={{
                  uri: `http://192.168.0.140:5000/uploads/${item.coverImage}`, // Vérifiez l'IP réelle
                }}
                style={styles.coverImage}
                onError={(e) =>
                  console.log("Erreur image:", e.nativeEvent.error)
                }
                defaultSource={require("../assets/default-cover.png")} // Chemin corrigé
              />
            )}
            <View style={styles.textContainer}>
              <Text style={styles.bookTitle}>{item.title}</Text>
              <Text style={styles.author}>Auteur : {item.author}</Text>
              <Text style={styles.genre}>Genre : {item.genre}</Text>
            </View>
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
  container: {
    flex: 1,
    padding: 10,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    marginVertical: 8,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  coverImage: {
    width: 80,
    height: 120,
    borderRadius: 5,
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
    marginRight: 10,
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  author: {
    fontSize: 14,
    color: "#666",
    marginBottom: 3,
  },

  genre: {
    fontSize: 12,
    color: "#888",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
});
