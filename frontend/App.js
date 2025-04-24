import React from "react";
import { UserProvider } from "./src/contexts/UserContext";
import AppNavigator from "./src/navigation/AppNavigator";
import globalStyles from "./globalStyles";
import { View } from "react-native";

export default function App() {
  return (
    <UserProvider>
      <View style={globalStyles.appContainer}>
        <AppNavigator />
      </View>
    </UserProvider>
  );
}
