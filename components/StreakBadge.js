import { View, Text } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { useEffect } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

export default function StreakBadge({ days, level }) {

    const iconScale = useSharedValue(1);

  useEffect(() => {
    iconScale.value = withRepeat(
      withSequence(
        withTiming(1.08, { duration: 900 }),
        withTiming(1, { duration: 900 })
      ),
      -1,
      true
    );
  }, []);

  const iconAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: iconScale.value }],
  }));

    const tiers = {
    DÉBUTANT: {
      icon: "fitness-outline",
      color: "#646464",
    },
    RÉGULIER: {
      icon: "trending-up-outline",
      color: "#E85002",
    },
    DISCIPLINÉ: {
      icon: "trophy-outline",
      color: "#F16001",
    },
    ATHLÈTE: {
      icon: "barbell-outline",
      color: "#E85002",
    },
    GUERRIER: {
      icon: "trophy-outline",
      color: "#E85002",
    },
    VÉTÉRAN: {
      icon: "shield-outline",
      color: "#D9C3AB",
    },
    ÉLITE: {
      icon: "diamond-outline",
      color: "#C10801",
    },
  };

  const tier = tiers[level] || tiers.DÉBUTANT;
  return (
    <LinearGradient
      colors={["#000000", "#140604", "#0B0B0B"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{
        borderRadius: 20,
        padding: 16,
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: tier.color + "55",
      }}
    >
      <Animated.View
  style={[
    {
      width: 58,
      height: 58,
      borderRadius: 18,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: tier.color + "12",
      borderWidth: 1,
      borderColor: tier.color + "30",
    },
    iconAnimatedStyle,
  ]}
>
  <Ionicons
    name={tier.icon}
    size={30}
    color={tier.color}
  />
</Animated.View>

      <View
        style={{
          marginLeft: 16,
          flex: 1,
        }}
      >
        <Text
          style={{
            color: "#A7A7A7",
            fontSize: 10,
            fontWeight: "800",
            letterSpacing: 1.5,
          }}
        >
          STREAK EN COURS
        </Text>

        <View
          style={{
            flexDirection: "row",
            alignItems: "baseline",
          }}
        >
          <Text
            style={{
              color: tier.color,
              fontWeight: "900",
              fontSize: 36,
            }}
          >
            {days}
          </Text>

          <Text
            style={{
              color: "#F9F9F9",
              fontWeight: "800",
              fontSize: 18,
              marginLeft: 8,
            }}
          >
            jours
          </Text>
        </View>

        <Text
          style={{
            color: "#E85002",
            fontSize: 10,
            fontWeight: "900",
            letterSpacing: 1.2,
            marginTop: 4,
          }}
        >
          NIVEAU {level}
        </Text>
      </View>

      <View
        style={{
          width: 44,
          height: 44,
          borderRadius: 14,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: tier.color + "12",
          borderWidth: 1,
          borderColor: tier.color + "25",
        }}
      >
        <Ionicons
          name="trending-up-outline"
          size={25}
          color={tier.color}
        />
      </View>
    </LinearGradient>
  );
}