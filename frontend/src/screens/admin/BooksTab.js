import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Modal,
  Pressable,
} from "react-native";
import { FAB, TextInput, Button } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import api from "../../services/api";

export default function BooksTab() {
  const [books, setBooks] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newBook, setNewBook] = useState({ title: "", author: "" });
  const [editingBook, setEditingBook] = useState(null);

  const fetchBooks = async () => {
    try {
      const res = await api.get("/books");
      setBooks(res.data);
    } catch (err) {
      Alert.alert("Erreur", err.message);
    }
  };

  const handleAddBook = async () => {
    if (!newBook.title || !newBook.author) {
      Alert.alert("Champs requis", "Veuillez remplir tous les champs.");
      return;
    }

    try {
      await api.post("/books", newBook);
      setNewBook({ title: "", author: "" });
      setModalVisible(false);
      fetchBooks();
      Alert.alert("Succès", "Livre ajouté avec succès.");
    } catch (err) {
      Alert.alert("Erreur", "Impossible d'ajouter le livre");
    }
  };

  const handleUpdateBook = async () => {
    try {
      const updateData = {
        title: editingBook.title,
        author: editingBook.author,
        description: editingBook.description,
        publishedYear: editingBook.publishedYear,
      };

      Object.keys(updateData).forEach((key) => {
        if (!updateData[key]) delete updateData[key];
      });

      const response = await api.put(`/books/${editingBook._id}`, updateData);

      if (response.data.success) {
        setModalVisible(false);
        fetchBooks();
        Alert.alert("Succès", "Livre mis à jour avec succès.");
      } else {
        Alert.alert("Erreur", response.data.error);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.error || "Erreur inconnue";
      const fields = err.response?.data?.validationErrors;

      if (fields) {
        Alert.alert(
          "Erreur de validation",
          Object.values(fields)
            .map((f) => f.message)
            .join("\n")
        );
      } else {
        Alert.alert("Erreur", errorMessage);
      }
    }
  };

  const handleDelete = async (id) => {
    Alert.alert(
      "Confirmation",
      "Êtes-vous sûr de vouloir supprimer ce livre ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          onPress: async () => {
            try {
              await api.delete(`/books/${id}`);
              fetchBooks();
              Alert.alert("Succès", "Livre supprimé avec succès.");
            } catch (err) {
              Alert.alert("Erreur", "Suppression échouée");
            }
          },
          style: "destructive",
        },
      ]
    );
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={books}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ paddingBottom: 80 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardRow}>
              <Icon name="book-outline" size={20} color="#333" />
              <Text style={styles.title}>{item.title}</Text>
            </View>
            <View style={styles.cardRow}>
              <Icon name="account" size={18} color="#666" />
              <Text style={styles.author}>{item.author}</Text>
            </View>
            <View style={styles.cardActions}>
              <TouchableOpacity
                style={[styles.actionBtn, styles.editBtn]}
                onPress={() => {
                  setEditingBook(item);
                  setModalVisible(true);
                }}
              >
                <Icon name="pencil-outline" size={18} color="#fff" />
                <Text style={styles.actionText}>Modifier</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionBtn, styles.deleteBtn]}
                onPress={() => handleDelete(item._id)}
              >
                <Icon name="delete-outline" size={18} color="#fff" />
                <Text style={styles.actionText}>Supprimer</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => setModalVisible(true)}
      />

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => {
          setModalVisible(false);
          setEditingBook(null);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>
              {editingBook ? "Modifier le livre" : "Ajouter un livre"}
            </Text>

            <TextInput
              label="Titre"
              value={editingBook ? editingBook.title : newBook.title}
              onChangeText={(text) =>
                editingBook
                  ? setEditingBook({ ...editingBook, title: text })
                  : setNewBook({ ...newBook, title: text })
              }
              mode="outlined"
              style={styles.input}
              theme={{ colors: { background: "#fff" } }}
            />

            <TextInput
              label="Auteur"
              value={editingBook ? editingBook.author : newBook.author}
              onChangeText={(text) =>
                editingBook
                  ? setEditingBook({ ...editingBook, author: text })
                  : setNewBook({ ...newBook, author: text })
              }
              mode="outlined"
              style={styles.input}
              theme={{ colors: { background: "#fff" } }}
            />

            <TextInput
              label="Description"
              value={editingBook?.description || ""}
              onChangeText={(text) =>
                setEditingBook({ ...editingBook, description: text })
              }
              multiline
              numberOfLines={3}
              mode="outlined"
              style={styles.input}
              theme={{ colors: { background: "#fff" } }}
            />

            <TextInput
              label="Année de publication"
              value={editingBook?.publishedYear?.toString() || ""}
              onChangeText={(text) =>
                setEditingBook({
                  ...editingBook,
                  publishedYear: parseInt(text) || 0,
                })
              }
              keyboardType="numeric"
              mode="outlined"
              style={styles.input}
              theme={{ colors: { background: "#fff" } }}
            />

            {editingBook ? (
              <View style={styles.editButtons}>
                <Button
                  mode="contained"
                  onPress={handleUpdateBook}
                  style={[styles.button, { backgroundColor: "#4CAF50" }]}
                >
                  Mettre à jour
                </Button>
                <Button
                  mode="outlined"
                  onPress={() => {
                    setEditingBook(null);
                    setModalVisible(false);
                  }}
                  style={styles.button}
                >
                  Annuler
                </Button>
              </View>
            ) : (
              <Button
                icon="plus"
                mode="contained"
                onPress={handleAddBook}
                style={styles.addButton}
              >
                Ajouter un livre
              </Button>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f9f9f9" },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
    elevation: 2,
  },
  cardRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  title: { fontSize: 16, fontWeight: "600", marginLeft: 8 },
  author: { fontSize: 14, color: "#555", marginLeft: 8 },
  cardActions: {
    flexDirection: "row",
    marginTop: 10,
    justifyContent: "flex-start",
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    padding: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginRight: 10,
  },
  editBtn: { backgroundColor: "#2196F3" },
  deleteBtn: { backgroundColor: "#E63946" },
  actionText: { color: "#fff", marginLeft: 6, fontSize: 14 },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 20,
    backgroundColor: "#E63946",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "#00000088",
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    width: "85%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "stretch",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  input: {
    marginBottom: 10,
    backgroundColor: "#f0f0f0",
  },
  addButton: {
    backgroundColor: "#E63946",
    marginTop: 5,
  },
  editButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
  },
});
