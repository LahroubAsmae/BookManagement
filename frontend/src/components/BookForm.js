import React, { useState, useEffect } from "react";
import { View, TextInput, Button, StyleSheet } from "react-native";
import { adminAPI } from "../services/api";

const BookForm = ({ route, navigation }) => {
  const [form, setForm] = useState({
    title: "",
    author: "",
    description: "",
    available: true,
  });

  useEffect(() => {
    if (route.params?.book) {
      setForm(route.params.book);
    }
  }, [route.params]);

  const handleSubmit = async () => {
    try {
      if (form._id) {
        await adminAPI.updateBook(form._id, form);
      } else {
        await adminAPI.createBook(form);
      }
      navigation.goBack();
    } catch (error) {
      console.error("Submission error:", error);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Titre"
        value={form.title}
        onChangeText={(text) => setForm({ ...form, title: text })}
        style={styles.input}
      />
      <TextInput
        placeholder="Auteur"
        value={form.author}
        onChangeText={(text) => setForm({ ...form, author: text })}
        style={styles.input}
      />
      <TextInput
        placeholder="Description"
        value={form.description}
        onChangeText={(text) => setForm({ ...form, description: text })}
        style={styles.input}
        multiline
      />
      <Button title="Enregistrer" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
  },
});

export default BookForm;
