// src/navigation/AppNavigator.js
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useUser } from "../contexts/UserContext";

// Screens
import LoadingScreen from "../components/LoadingScreen";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import ProfileScreen from "../screens/ProfileScreen";
import BookListScreen from "../screens/BookListScreen";
import MyBorrowingsScreen from "../screens/MyBorrowingsScreen";

// Admin Screens
import BorrowingsTabs from "../screens/admin/BorrowingsTabs";
import BooksTab from "../screens/admin/BooksTab";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function AdminTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Emprunts" component={BorrowingsTabs} />
      <Tab.Screen name="Livres" component={BooksTab} />
      <Tab.Screen name="Profil" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

function UserTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Livres" component={BookListScreen} />
      <Tab.Screen name="Mes emprunts" component={MyBorrowingsScreen} />
      <Tab.Screen name="Profil" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const { user, loading } = useUser();

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          user.isAdmin ? (
            <Stack.Screen name="Admin" component={AdminTabs} />
          ) : (
            <Stack.Screen name="User" component={UserTabs} />
          )
        ) : (
          // Utiliser Stack.Group au lieu de <>
          <Stack.Group>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </Stack.Group>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
