import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import { useEffect } from "react";

export default function FadeInView({
  children,
  delay = 0,
  duration = 600,
  translateY = 20,
  scale = 1,
  style,
}) {
  const opacity = useSharedValue(0);
  const offset = useSharedValue(translateY);
  const scaleValue = useSharedValue(scale);

  useEffect(() => {
    opacity.value = withDelay(
      delay,
      withTiming(1, { duration })
    );

    offset.value = withDelay(
      delay,
      withTiming(0, { duration })
    );

    scaleValue.value = withDelay(
      delay,
      withTiming(1, { duration })
    );
  }, [delay, duration, translateY, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      {
        translateY: offset.value,
      },
      {
        scale: scaleValue.value,
      },
    ],
  }));

  return (
    <Animated.View style={[animatedStyle, style]}>
      {children}
    </Animated.View>
  );
}