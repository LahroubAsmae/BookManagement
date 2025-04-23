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
  // Ajouter cette méthode
  getAll: async () => {
    try {
      const { data } = await api.get("/borrowings/myborrowings"); // Endpoint backend
      return data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Erreur emprunts");
    }
  },

  // Méthode pour créer un emprunt (corrigée)
  create: async (bookId) => {
    try {
      const { data } = await api.post("/borrowings", { bookId });
      return data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Échec création");
    }
  },

  // Méthode pour retourner un livre
  returnBook: async (borrowingId) => {
    try {
      const { data } = await api.put(`/borrowings/${borrowingId}/return`);
      return data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Échec retour");
    }
  },
};

export const adminService = {
  getUsers: async () => {
    try {
      const { data } = await api.get("/admin/users");
      return data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Échec utilisateurs");
    }
  },
};

export default api;
