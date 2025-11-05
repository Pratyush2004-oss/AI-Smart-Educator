import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function HomeScreen() {
  return (
    <LinearGradient colors={["#A5D6A7", "#E8F5E9"]} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting} className="font-times-bold">
            Welcome to EDUYUG 👋
          </Text>
          <Text style={styles.subtext} className="font-outfit-semibold">
            Ready to learn something new today?
          </Text>
        </View>
        <Image
          source={{
            uri: "https://cdn-icons-png.flaticon.com/512/706/706830.png",
          }}
          style={styles.profile}
        />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {},
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    marginTop: 10,
  },
  greeting: { fontSize: 22, color: "#2E7D32" },
  subtext: { color: "#555", marginTop: 4 },
  profile: { width: 50, borderRadius: 25 },
  progressCard: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 16,
    elevation: 4,
  },
  progressText: {
    fontWeight: "600",
    fontSize: 16,
    marginBottom: 10,
    color: "#2E7D32",
  },
});
