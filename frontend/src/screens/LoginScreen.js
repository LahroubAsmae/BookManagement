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
  ActivityIndicator,
} from "react-native";
import { authService } from "../services/api"; // Modification ici
import { useUser } from "../contexts/UserContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { storeUser } = useUser();

  const validateForm = () => {
    const errors = [];

    if (!email.trim()) errors.push("L'email est requis");
    if (!password.trim()) errors.push("Le mot de passe est requis");

    if (email.trim() && !/\S+@\S+\.\S+/.test(email)) {
      errors.push("Format email invalide");
    }

    if (errors.length > 0) {
      Alert.alert("Erreur de validation", errors.join("\n"));
      return false;
    }

    return true;
  };

  // screens/LoginScreen.js
  const handleLogin = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const result = await authService.login({ email, password });

      if (!result?.user?.id) {
        throw new Error("Données utilisateur manquantes");
      }

      await storeUser(result.user, result.token);
    } catch (error) {
      let message = error.message;

      // Personnalisation des messages
      if (message.includes("401")) {
        message = "Identifiants incorrects";
      } else if (message.includes("50")) {
        message = "Problème serveur - Réessayez plus tard";
      }

      Alert.alert("Erreur", message);
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
        <Text style={styles.title}>Connexion</Text>

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

        <TouchableOpacity
          style={[styles.button, loading && styles.disabledButton]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Se connecter</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.linkContainer}
          onPress={() => navigation.navigate("Register")}
        >
          <Text style={styles.linkText}>
            Pas de compte ?{" "}
            <Text style={styles.linkHighlight}>Créer un compte</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

// Les styles restent identiques

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", backgroundColor: "#fff" },
  innerContainer: { paddingHorizontal: 20 },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    backgroundColor: "#f9f9f9",
  },
  button: {
    backgroundColor: "#007BFF",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  disabledButton: { backgroundColor: "#999" },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  linkContainer: { marginTop: 15, alignItems: "center" },
  linkText: { color: "#666" },
  linkHighlight: { color: "#007BFF", fontWeight: "bold" },
});
