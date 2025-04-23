import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import BorrowingsTabs from "./BorrowingsTabs";
import BooksTab from "./BooksTab";

const Tab = createMaterialTopTabNavigator();

export default function AdminHomeScreen() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Emprunts" component={BorrowingsTabs} />
      <Tab.Screen name="Livres" component={BooksTab} />
    </Tab.Navigator>
  );
}
