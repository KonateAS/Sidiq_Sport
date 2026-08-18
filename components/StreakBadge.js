import { View, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

export default function StreakBadge({ days, level }) {
  const tiers = {
    ROOKIE: { emoji: "🐣", color: "#7A8A7E" },
    WARRIOR: { emoji: "💪", color: "#00FF87" },
    BEAST: { emoji: "⚡", color: "#FF3B30" },
    TITAN: { emoji: "👑", color: "#FFD700" },
    APEX: { emoji: "🦁", color: "#00FF87" },
  };
  const tier = tiers[level] || tiers.WARRIOR;

  return (
    <LinearGradient
      colors={["#0F1F12", "#003D1A"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={{
        borderRadius: 20,
        padding: 16,
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: tier.color + "50",
      }}
    >
      <Text style={{ fontSize: 40 }}>{tier.emoji}</Text>
      <View style={{ marginLeft: 16, flex: 1 }}>
        <Text style={{ color: "#7A8A7E", fontSize: 10, letterSpacing: 1 }}>
          STREAK EN COURS
        </Text>
        <View style={{ flexDirection: "row", alignItems: "baseline" }}>
          <Text style={{ color: tier.color, fontWeight: "bold", fontSize: 36 }}>
            {days}
          </Text>
          <Text style={{ color: "#F0FFF0", fontWeight: "bold", fontSize: 18, marginLeft: 8 }}>
            jours
          </Text>
        </View>
        <Text style={{ color: "#00FF87", fontSize: 10, letterSpacing: 1, marginTop: 4 }}>
          ⚡ NIVEAU {level}
        </Text>
      </View>
      <Ionicons name="flame" size={32} color={tier.color} />
    </LinearGradient>
  );
}
