import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = "http://192.168.0.140:5000/api";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Intercepteur pour le token JWT
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("userToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const authService = {
  login: async (credentials) => {
    try {
      const { data } = await api.post("/users/login", credentials);

      if (!data._id || !data.token || typeof data.isAdmin !== "boolean") {
        throw new Error("Réponse serveur invalide");
      }

      return {
        user: {
          id: data._id,
          email: data.email,
          isAdmin: data.isAdmin,
          name: data.name || "",
        },
        token: data.token,
      };
    } catch (error) {
      throw new Error(error.response?.data?.message || "Échec de la connexion");
    }
  },

  register: async (userData) => {
    try {
      const { data } = await api.post("/users", userData);
      return data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Échec de l'inscription"
      );
    }
  },

  getProfile: async () => {
    try {
      const { data } = await api.get("/users/profile");
      return data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Échec profil");
    }
  },
};

export const bookService = {
  getAll: async () => {
    try {
      const { data } = await api.get("/books");
      return data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Échec livres");
    }
  },
};

export const borrowingService = {
  // Récupérer les emprunts de l'utilisateur
  getAll: async () => {
    try {
      const { data } = await api.get("/borrowings/myborrowings"); // Endpoint backend corrigé
      return data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Erreur de chargement");
    }
  },

  // Créer un nouvel emprunt (méthode unique)
  create: async (bookId) => {
    try {
      const { data } = await api.post("/borrowings", { bookId });
      return data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Échec de l'emprunt");
    }
  },

  // Retourner un livre
  returnBook: async (borrowingId) => {
    try {
      const { data } = await api.put(`/borrowings/${borrowingId}/return`);
      return data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Échec du retour");
    }
  },
};
// services/api.js
export const adminService = {
  // Récupérer tous les emprunts (admin)
  getAllBorrowings: async () => {
    try {
      const { data } = await api.get("/borrowings"); // Utiliser l'endpoint existant
      return data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Échec emprunts");
    }
  },

  // Retourner un emprunt (admin)
  returnBorrowing: async (id) => {
    try {
      const { data } = await api.put(`/borrowings/${id}/return`);
      return data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Échec retour");
    }
  },
};
export default api;
