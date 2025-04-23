import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { registerUser } from "../services/api";
import { useUser } from "../contexts/UserContext";

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { storeUser } = useUser();

  const validateForm = () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      Alert.alert("Erreur", "Tous les champs sont obligatoires");
      return false;
    }

    if (!/^[A-Za-zÀ-ÿ\s]{3,}$/.test(name)) {
      Alert.alert("Erreur", "Nom invalide (min. 3 caractères)");
      return false;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      Alert.alert("Erreur", "Format email invalide");
      return false;
    }

    if (password.length < 6) {
      Alert.alert(
        "Erreur",
        "Le mot de passe doit contenir au moins 6 caractères"
      );
      return false;
    }

    if (password !== confirmPassword) {
      Alert.alert("Erreur", "Les mots de passe ne correspondent pas");
      return false;
    }

    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await registerUser({ name, email, password });

      await storeUser({
        token: response.token,
        name: response.user.name,
        email: response.user.email,
        isAdmin: response.user.isAdmin || false,
      });

      navigation.reset({
        index: 0,
        routes: [{ name: response.user.isAdmin ? "AdminHome" : "Books" }],
      });
    } catch (error) {
      Alert.alert("Erreur", error.message || "Échec de l'inscription");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.innerContainer}>
        <Text style={styles.title}>Inscription</Text>

        <TextInput
          style={styles.input}
          placeholder="Nom complet"
          placeholderTextColor="#666"
          autoCapitalize="words"
          value={name}
          onChangeText={setName}
        />

        <TextInput
          style={styles.input}
          placeholder="Adresse email"
          placeholderTextColor="#666"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          style={styles.input}
          placeholder="Mot de passe"
          placeholderTextColor="#666"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TextInput
          style={styles.input}
          placeholder="Confirmer le mot de passe"
          placeholderTextColor="#666"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        <TouchableOpacity
          style={[styles.button, loading && styles.disabledButton]}
          onPress={handleRegister}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Inscription..." : "S'inscrire"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.linkContainer}
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={styles.linkText}>
            Déjà inscrit ?{" "}
            <Text style={styles.linkHighlight}>Se connecter</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  innerContainer: {
    flex: 1,
    justifyContent: "center",
    padding: 25,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 30,
    textAlign: "center",
  },
  input: {
    height: 50,
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  button: {
    backgroundColor: "#3498db",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  disabledButton: {
    backgroundColor: "#bdc3c7",
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
  linkContainer: {
    marginTop: 25,
  },
  linkText: {
    color: "#7f8c8d",
    textAlign: "center",
    fontSize: 15,
  },
  linkHighlight: {
    color: "#3498db",
    fontWeight: "600",
  },
});
