import { View, StyleSheet } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { useEffect } from "react";

export default function GlowBorder({ children, style }) {
  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, {
        duration: 6000,
      }),
      -1,
      false
    );
  }, []);

  const animatedGlowStyle = useAnimatedStyle(() => ({
    transform: [
      {
        rotate: `${rotation.value}deg`,
      },
    ],
  }));

  return (
    <View style={[styles.container, style]}>
      <View style={styles.glowLayer}>
        <Animated.View
          style={[styles.glow, animatedGlowStyle]}
        />
      </View>

      <View style={styles.content}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    overflow: "hidden",
    borderRadius: 24,
    backgroundColor: "#0B0B0B",
  },

  glowLayer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: "hidden",
    borderRadius: 24,
  },

  glow: {
    position: "absolute",
    width: "180%",
    height: "180%",
    top: "-40%",
    left: "-40%",
    borderRadius: 999,
    borderWidth: 2,
    borderColor: "#E85002",
    opacity: 0.35,
  },

  content: {
    position: "relative",
    zIndex: 1,
  },
});