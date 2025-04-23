import React, { createContext, useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const storeUser = async (userData, token) => {
    try {
      // Validation des données utilisateur
      if (
        !userData?.id ||
        !userData?.email ||
        typeof userData.isAdmin !== "boolean"
      ) {
        throw new Error("Données utilisateur incomplètes");
      }

      await AsyncStorage.multiSet([
        ["userInfo", JSON.stringify(userData)],
        ["userToken", token],
      ]);
      setUser(userData);
    } catch (error) {
      console.error("Erreur stockage:", error.message);
      throw new Error("Sauvegarde session échouée: " + error.message);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.multiRemove(["userInfo", "userToken"]);
      setUser(null);
    } catch (error) {
      console.error("Erreur déconnexion:", error.message);
    }
  };

  const loadUser = useCallback(async () => {
    try {
      const [storedUser, token] = await AsyncStorage.multiGet([
        "userInfo",
        "userToken",
      ]);

      if (storedUser[1] && token[1]) {
        const parsedUser = JSON.parse(storedUser[1]);
        if (
          parsedUser?.id &&
          parsedUser?.email &&
          typeof parsedUser.isAdmin === "boolean"
        ) {
          setUser(parsedUser);
        } else {
          console.warn("Données corrompues, déconnexion...");
          await logout();
        }
      }
    } catch (error) {
      console.error("Erreur chargement:", error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  return (
    <UserContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        isAdmin: user?.isAdmin || false,
        storeUser,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = React.useContext(UserContext);
  if (!context) {
    throw new Error("useUser doit être utilisé dans un UserProvider");
  }
  return context;
};
