import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function StatCard({ icon, value, unit, label, color }) {
  return (
    <View style={styles.card}>

      {/* HEADER */}
      <View style={styles.header}>

        <View
          style={[
            styles.iconContainer,
            {
              backgroundColor: color + "18",
              borderColor: color + "35",
            },
          ]}
        >
          <Ionicons
            name={icon}
            size={19}
            color={color}
          />
        </View>

        <Text style={styles.label}>
          {label.toUpperCase()}
        </Text>

      </View>

      {/* VALUE */}
      <View style={styles.valueRow}>
        <Text style={styles.value}>
          {value}
        </Text>

        <Text style={styles.unit}>
          {unit}
        </Text>
      </View>

      {/* ACCENT */}
      <View
        style={[
          styles.accent,
          { backgroundColor: color },
        ]}
      />

    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#0B0B0B",
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    width: "48%",

    borderWidth: 1,
    borderColor: "#202020",

    minHeight: 128,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 14,

    alignItems: "center",
    justifyContent: "center",

    borderWidth: 1,
  },

  label: {
    color: "#777777",
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 1.1,
  },

  valueRow: {
    flexDirection: "row",
    alignItems: "baseline",
    marginTop: 15,
  },

  value: {
    color: "#F9F9F9",
    fontSize: 30,
    fontWeight: "900",
    letterSpacing: -1,
  },

  unit: {
    color: "#777777",
    fontSize: 11,
    fontWeight: "700",
    marginLeft: 5,
  },

  accent: {
    width: 22,
    height: 3,
    borderRadius: 10,
    marginTop: 13,
  },
});