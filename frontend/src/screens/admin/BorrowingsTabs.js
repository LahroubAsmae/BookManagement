import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useUser } from "../../contexts/UserContext";
import { adminService } from "../../services/api";

export default function BorrowingsTab() {
  const [borrowings, setBorrowings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();

  const fetchBorrowings = async () => {
    if (!user?.isAdmin) return;

    try {
      setLoading(true);
      const response = await adminService.getAllBorrowings();
      setBorrowings(response);
    } catch (err) {
      Alert.alert("Erreur", "Accès admin requis");
    } finally {
      setLoading(false);
    }
  };

  const handleReturn = (id) => {
    Alert.alert("Confirmation", "Marquer comme retourné ?", [
      { text: "Annuler", style: "cancel" },
      {
        text: "Confirmer",
        onPress: async () => {
          try {
            const result = await adminService.returnBorrowing(id);

            if (result.success) {
              Alert.alert("Succès", result.message);
              fetchBorrowings();
            } else {
              Alert.alert("Erreur", result.error);
            }
          } catch (err) {
            console.error("[FRONTEND ERROR]", err);
            Alert.alert("Erreur", err.message || "Action impossible", [
              {
                text: "Réessayer",
                onPress: () => handleReturn(id),
              },
              {
                text: "Voir les logs",
                onPress: () => console.log("Détails erreur:", err),
              },
            ]);
          }
        },
      },
    ]);
  };
  useEffect(() => {
    fetchBorrowings();
  }, [user?.isAdmin]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#E63946" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Bienvenue, Admin 👋</Text>

      <View style={styles.filters}>
        <TouchableOpacity style={styles.filterBtn}>
          <Text style={styles.filterText}>Année</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.filterBtn, styles.filterActive]}>
          <Text style={[styles.filterText, styles.filterTextActive]}>Mois</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterBtn}>
          <Text style={styles.filterText}>Semaine</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={borrowings}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Icon name="book-open-outline" size={26} color="#E63946" />
              <Text style={styles.cardTitle}>{item.book?.title}</Text>
            </View>

            <View style={styles.detailRow}>
              <Icon name="account-circle-outline" size={18} color="#888" />
              <Text style={styles.detailText}>{item.user?.name}</Text>
            </View>
            <View style={styles.detailRow}>
              <Icon name="calendar-month" size={18} color="#888" />
              <Text style={styles.detailText}>
                {new Date(item.createdAt).toLocaleDateString()}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Icon
                name={
                  item.returned ? "check-circle-outline" : "book-clock-outline"
                }
                size={18}
                color={item.returned ? "#2ECC71" : "#F39C12"}
              />
              <Text
                style={[
                  styles.detailText,
                  { color: item.returned ? "#2ECC71" : "#F39C12" },
                ]}
              >
                {item.returned ? "Retourné" : "En cours"}
              </Text>
            </View>

            {!item.returned && (
              <TouchableOpacity
                style={styles.returnBtn}
                onPress={() => handleReturn(item._id)}
              >
                <Icon name="backup-restore" size={18} color="#fff" />
                <Text style={styles.returnBtnText}>Marquer comme retourné</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
    padding: 16,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 22,
    fontWeight: "700",
    color: "#333",
    marginBottom: 10,
  },
  filters: {
    flexDirection: "row",
    marginBottom: 15,
    justifyContent: "space-between",
  },
  filterBtn: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: "#eaeaea",
  },
  filterActive: {
    backgroundColor: "#E63946",
  },
  filterText: {
    color: "#555",
    fontWeight: "600",
  },
  filterTextActive: {
    color: "#fff",
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 10,
    color: "#333",
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },
  detailText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#666",
  },
  returnBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E63946",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginTop: 12,
    justifyContent: "center",
  },
  returnBtnText: {
    color: "#fff",
    fontWeight: "600",
    marginLeft: 6,
  },
});
