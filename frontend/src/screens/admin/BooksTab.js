import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Button, TextInput } from "react-native-paper";
import { adminAPI } from "../../services/api";

export default function BooksTab() {
  const [books, setBooks] = useState([]);
  const [newBook, setNewBook] = useState({ title: "", author: "" });

  const fetchBooks = async () => {
    try {
      const res = await adminAPI.get("/books");
      setBooks(res.data);
    } catch (err) {
      console.error(
        "Erreur chargement livres:",
        err.response?.data || err.message
      );
      Alert.alert("Erreur", "Impossible de charger les livres");
    }
  };

  const handleAddBook = async () => {
    try {
      await adminAPI.post("/books", newBook);
      setNewBook({ title: "", author: "" });
      fetchBooks();
    } catch (err) {
      console.error("Erreur ajout livre:", err.response?.data || err.message);
      Alert.alert("Erreur", "Impossible d'ajouter le livre");
    }
  };

  const handleDelete = async (id) => {
    Alert.alert("Confirmation", "Supprimer ce livre ?", [
      { text: "Annuler" },
      {
        text: "Supprimer",
        onPress: async () => {
          try {
            await adminAPI.delete(`/books/${id}`);
            fetchBooks();
          } catch (err) {
            console.error(
              "Erreur suppression:",
              err.response?.data || err.message
            );
            Alert.alert("Erreur", "Impossible de supprimer le livre");
          }
        },
      },
    ]);
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>📚 Livres</Text>

      <TextInput
        label="Titre"
        value={newBook.title}
        onChangeText={(text) => setNewBook({ ...newBook, title: text })}
        mode="outlined"
        style={styles.input}
      />
      <TextInput
        label="Auteur"
        value={newBook.author}
        onChangeText={(text) => setNewBook({ ...newBook, author: text })}
        mode="outlined"
        style={styles.input}
      />
      <Button mode="contained" onPress={handleAddBook}>
        Ajouter un livre
      </Button>

      <FlatList
        data={books}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.title}>{item.title}</Text>
            <Text>Auteur: {item.author}</Text>
            <TouchableOpacity onPress={() => handleDelete(item._id)}>
              <Text style={styles.delete}>🗑 Supprimer</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 10 },
  header: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  input: { marginVertical: 5 },
  card: {
    backgroundColor: "#f5f5f5",
    padding: 10,
    marginVertical: 5,
    borderRadius: 8,
  },
  title: { fontWeight: "bold" },
  delete: { color: "red", marginTop: 5 },
});
