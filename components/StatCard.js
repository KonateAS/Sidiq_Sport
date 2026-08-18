import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function StatCard({ icon, value, unit, label, color }) {
  return (
    <View
      style={{
        backgroundColor: "#0F1F12",
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        width: "48%",
        borderWidth: 1,
        borderColor: "rgba(0,255,135,0.15)",
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <View
          style={{
            width: 40,
            height: 40,
            borderRadius: 999,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: color + "20",
          }}
        >
          <Ionicons name={icon} size={20} color={color} />
        </View>
        <Text style={{ color: "#00FF87", fontSize: 10, letterSpacing: 1 }}>{label.toUpperCase()}</Text>
      </View>
      <View style={{ flexDirection: "row", alignItems: "baseline", marginTop: 12 }}>
        <Text style={{ color: "#F0FFF0", fontWeight: "bold", fontSize: 30 }}>{value}</Text>
        <Text style={{ color: "#7A8A7E", fontSize: 12, marginLeft: 4 }}>{unit}</Text>
      </View>
    </View>
  );
}
