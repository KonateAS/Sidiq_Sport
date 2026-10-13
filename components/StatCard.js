import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useEffect } from "react";

const AnimatedText = Animated.createAnimatedComponent(Text);

export default function StatCard({
  icon,
  value,
  unit,
  label,
  color,
}) {
  const numericValue = parseFloat(value);
  const valueProgress = useSharedValue(0);
  const valueOpacity = useSharedValue(0);
  const valueTranslate = useSharedValue(8);
  const accentProgress = useSharedValue(0);
  const iconProgress = useSharedValue(0);

  useEffect(() => {
    valueProgress.value = withDelay(
      350,
      withTiming(1, {
        duration: 900,
      })
    );

    valueOpacity.value = withDelay(
      350,
      withTiming(1, {
        duration: 450,
      })
    );

    valueTranslate.value = withDelay(
      350,
      withTiming(0, {
        duration: 450,
      })
    );

    accentProgress.value = withDelay(
  500,
  withTiming(1, {
    duration: 650,
  })
);

iconProgress.value = withDelay(
  300,
  withSpring(1, {
    damping: 14,
    stiffness: 180,
  })
);
  }, []);

  const animatedValueProps = useAnimatedProps(() => {
    const currentValue =
      numericValue * valueProgress.value;

    const formattedValue = Number.isInteger(numericValue)
      ? Math.round(currentValue).toString()
      : currentValue.toFixed(1);

    return {
      text: formattedValue,
    };
  });

  const valueAnimatedStyle = useAnimatedStyle(() => ({
    opacity: valueOpacity.value,
    transform: [
      {
        translateY: valueTranslate.value,
      },
    ],
    
  }));
  const iconAnimatedStyle = useAnimatedStyle(() => ({
  transform: [
    {
      scale: 0.82 + iconProgress.value * 0.18,
    },
  ],
}));

const accentAnimatedStyle = useAnimatedStyle(() => ({
  width: 22 * accentProgress.value,
  opacity: accentProgress.value,
}));

  return (
    <View style={styles.card}>

      {/* HEADER */}
      <View style={styles.header}>

        <Animated.View
  style={[
    styles.iconContainer,
 ,   {
      backgroundColor: `${color}18`,
      borderColor: `${color}35`,
    },
    iconAnimatedStyle,
  ]}
>
          <Ionicons
            name={icon}
            size={19}
            color={color}
          />
        </Animated.View>

        <Text style={styles.label}>
          {label.toUpperCase()}
        </Text>

      </View>

      {/* VALUE */}
      <Animated.View
        style={[
          styles.valueRow,
          valueAnimatedStyle,
        ]}
      >
        <AnimatedText
          animatedProps={animatedValueProps}
          style={styles.value}
        >
          0
        </AnimatedText>

        <Text style={styles.unit}>
          {unit}
        </Text>
      </Animated.View>

      {/* ACCENT */}
      <Animated.View
  style={[
    styles.accent,
    {
      backgroundColor: color,
    },
    accentAnimatedStyle,
  ]}
/>

    </View>
  );
}

const styles = StyleSheet.create({
  card: {
  backgroundColor: "#0B0B0B",
  borderRadius: 16,
  padding: 10,
  marginBottom: 12,
  width: "100%",

  borderWidth: 1,
  borderColor: "#202020",

  minHeight: 104,
},

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  iconContainer: {
  width: 32,
  height: 32,
  borderRadius: 11,

  alignItems: "center",
  justifyContent: "center",

  borderWidth: 1,
},

label: {
  color: "#777777",
  fontSize: 8,
  fontWeight: "900",
  letterSpacing: 0.7,
  textAlign: "right",
},

valueRow: {
  flexDirection: "row",
  alignItems: "baseline",
  marginTop: 11,
},

value: {
  color: "#F9F9F9",
  fontSize: 24,
  fontWeight: "900",
  letterSpacing: -0.8,
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