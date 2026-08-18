import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import Svg, { Circle } from "react-native-svg";

const { width } = Dimensions.get("window");

const TARGET = 200;
const RING_SIZE = Math.min(width - 72, 310);
const STROKE_WIDTH = 12;
const RADIUS = (RING_SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default function WorkoutScreen() {
  const router = useRouter();

  const [count, setCount] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const progressAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const contentOpacity = useRef(new Animated.Value(1)).current;

  /*
   * ============================================================
   * CHRONOMÈTRE
   * ============================================================
   */

  useEffect(() => {
    let interval = null;

    if (isActive && !isCompleted) {
      interval = setInterval(() => {
        setTimer((previous) => previous + 1);
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isActive, isCompleted]);

  /*
   * ============================================================
   * PROGRESSION
   * ============================================================
   */

  useEffect(() => {
    const progress = Math.min(count / TARGET, 1);

    Animated.timing(progressAnim, {
      toValue: progress,
      duration: 350,
      useNativeDriver: false,
    }).start();
  }, [count]);

  /*
   * ============================================================
   * AJOUTER UNE RÉPÉTITION
   * ============================================================
   */

  const increment = async () => {
    if (isCompleted) return;

    const nextCount = Math.min(count + 1, TARGET);

    setCount(nextCount);

    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 1.05,
        friction: 5,
        tension: 120,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        tension: 120,
        useNativeDriver: true,
      }),
    ]).start();

    await Haptics.impactAsync(
      Haptics.ImpactFeedbackStyle.Light
    );

    if (nextCount % 25 === 0) {
      await Haptics.notificationAsync(
        Haptics.NotificationFeedbackType.Success
      );
    }

    if (nextCount === TARGET) {
      setIsActive(false);

      await Haptics.notificationAsync(
        Haptics.NotificationFeedbackType.Success
      );

      setTimeout(() => {
        finishWorkout();
      }, 500);
    }
  };

  /*
   * ============================================================
   * RETIRER UNE RÉPÉTITION
   * ============================================================
   */

  const decrement = () => {
    if (isCompleted) return;

    setCount((previous) => Math.max(0, previous - 1));

    Haptics.impactAsync(
      Haptics.ImpactFeedbackStyle.Light
    );
  };

  /*
   * ============================================================
   * DÉMARRER / PAUSE
   * ============================================================
   */

  const toggleTimer = () => {
    if (isCompleted) return;

    setIsActive((previous) => !previous);

    Haptics.impactAsync(
      Haptics.ImpactFeedbackStyle.Light
    );
  };

  /*
   * ============================================================
   * TERMINER LA SÉANCE
   * ============================================================
   */

  const finishWorkout = () => {
    setIsActive(false);

    Animated.timing(contentOpacity, {
      toValue: 0,
      duration: 220,
      useNativeDriver: true,
    }).start(() => {
      setIsCompleted(true);

      Animated.timing(contentOpacity, {
        toValue: 1,
        duration: 350,
        useNativeDriver: true,
      }).start();
    });
  };

  /*
   * ============================================================
   * RECOMMENCER
   * ============================================================
   */

  const restartWorkout = () => {
    setCount(0);
    setTimer(0);
    setIsActive(false);
    setIsCompleted(false);

    progressAnim.setValue(0);

    Haptics.impactAsync(
      Haptics.ImpactFeedbackStyle.Medium
    );
  };

  /*
   * ============================================================
   * FORMAT TEMPS
   * ============================================================
   */

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;

    return `${minutes
      .toString()
      .padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  /*
   * ============================================================
   * POURCENTAGE
   * ============================================================
   */

  const percentage = Math.round(
    Math.min((count / TARGET) * 100, 100)
  );

  /*
   * ============================================================
   * RENDU — SÉANCE TERMINÉE
   * ============================================================
   */

  if (isCompleted) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#080C09",
          paddingHorizontal: 24,
          paddingTop: 64,
        }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          activeOpacity={0.7}
          style={{
            width: 46,
            height: 46,
            borderRadius: 15,
            backgroundColor: "#101712",
            borderWidth: 1,
            borderColor: "rgba(255,255,255,0.08)",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons
            name="close"
            size={22}
            color="#B7C0BA"
          />
        </TouchableOpacity>

        <Animated.View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            opacity: contentOpacity,
          }}
        >
          <View
            style={{
              width: 96,
              height: 96,
              borderRadius: 32,
              backgroundColor: "rgba(0,255,135,0.10)",
              borderWidth: 1,
              borderColor: "rgba(0,255,135,0.35)",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 28,
            }}
          >
            <Ionicons
              name="checkmark"
              size={46}
              color="#00FF87"
            />
          </View>

          <Text
            style={{
              color: "#7A8A7E",
              fontSize: 11,
              fontWeight: "800",
              letterSpacing: 2,
            }}
          >
            SÉANCE TERMINÉE
          </Text>

          <Text
            style={{
              color: "#F0FFF0",
              fontSize: 38,
              fontWeight: "900",
              marginTop: 10,
              textAlign: "center",
            }}
          >
            Travail accompli.
          </Text>

          <Text
            style={{
              color: "#7A8A7E",
              fontSize: 15,
              marginTop: 10,
              textAlign: "center",
            }}
          >
            Tu viens de terminer ta séance.
          </Text>

          {/* RÉCAPITULATIF */}

          <View
            style={{
              width: "100%",
              flexDirection: "row",
              marginTop: 42,
              gap: 10,
            }}
          >
            <View
              style={{
                flex: 1,
                backgroundColor: "#101712",
                borderRadius: 20,
                paddingVertical: 20,
                alignItems: "center",
                borderWidth: 1,
                borderColor: "rgba(255,255,255,0.06)",
              }}
            >
              <Text
                style={{
                  color: "#F0FFF0",
                  fontSize: 28,
                  fontWeight: "900",
                }}
              >
                {count}
              </Text>

              <Text
                style={{
                  color: "#7A8A7E",
                  fontSize: 11,
                  marginTop: 4,
                }}
              >
                répétitions
              </Text>
            </View>

            <View
              style={{
                flex: 1,
                backgroundColor: "#101712",
                borderRadius: 20,
                paddingVertical: 20,
                alignItems: "center",
                borderWidth: 1,
                borderColor: "rgba(255,255,255,0.06)",
              }}
            >
              <Text
                style={{
                  color: "#F0FFF0",
                  fontSize: 28,
                  fontWeight: "900",
                }}
              >
                {formatTime(timer)}
              </Text>

              <Text
                style={{
                  color: "#7A8A7E",
                  fontSize: 11,
                  marginTop: 4,
                }}
              >
                durée
              </Text>
            </View>
          </View>

          {/* BOUTON ACCUEIL */}

          <TouchableOpacity
            onPress={() => router.replace("/")}
            activeOpacity={0.85}
            style={{
              width: "100%",
              marginTop: 24,
            }}
          >
            <LinearGradient
              colors={["#00FF87", "#00D966"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{
                paddingVertical: 17,
                borderRadius: 17,
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: "#071009",
                  fontSize: 15,
                  fontWeight: "900",
                  letterSpacing: 0.5,
                }}
              >
                RETOUR À L'ACCUEIL
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* RECOMMENCER */}

          <TouchableOpacity
            onPress={restartWorkout}
            activeOpacity={0.7}
            style={{
              marginTop: 18,
              paddingVertical: 12,
            }}
          >
            <Text
              style={{
                color: "#7A8A7E",
                fontSize: 13,
                fontWeight: "700",
              }}
            >
              Recommencer la séance
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    );
  }

  /*
   * ============================================================
   * RENDU — SÉANCE EN COURS
   * ============================================================
   */

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#080C09",
      }}
    >
      {/* HEADER */}

      <View
        style={{
          paddingHorizontal: 24,
          paddingTop: 58,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          activeOpacity={0.7}
          style={{
            width: 46,
            height: 46,
            borderRadius: 15,
            backgroundColor: "#101712",
            borderWidth: 1,
            borderColor: "rgba(255,255,255,0.07)",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons
            name="chevron-back"
            size={23}
            color="#F0FFF0"
          />
        </TouchableOpacity>

        <View
          style={{
            alignItems: "center",
          }}
        >
          <Text
            style={{
              color: "#00FF87",
              fontSize: 10,
              fontWeight: "900",
              letterSpacing: 2,
            }}
          >
            SIDIQ SPORT
          </Text>

          <Text
            style={{
              color: "#F0FFF0",
              fontSize: 17,
              fontWeight: "800",
              marginTop: 3,
            }}
          >
            Squats
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.7}
          style={{
            width: 46,
            height: 46,
            borderRadius: 15,
            backgroundColor: "#101712",
            borderWidth: 1,
            borderColor: "rgba(255,255,255,0.07)",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons
            name="ellipsis-horizontal"
            size={23}
            color="#7A8A7E"
          />
        </TouchableOpacity>
      </View>

      <Animated.View
        style={{
          flex: 1,
          opacity: contentOpacity,
          alignItems: "center",
        }}
      >
        {/* TEMPS */}

        <View
          style={{
            alignItems: "center",
            marginTop: 30,
          }}
        >
          <Text
            style={{
              color: "#66736B",
              fontSize: 10,
              fontWeight: "800",
              letterSpacing: 2,
            }}
          >
            DURÉE
          </Text>

          <Text
            style={{
              color: "#F0FFF0",
              fontSize: 28,
              fontWeight: "800",
              marginTop: 4,
              fontVariant: ["tabular-nums"],
            }}
          >
            {formatTime(timer)}
          </Text>
        </View>

        {/* ANNEAU */}

        <Animated.View
          style={{
            width: RING_SIZE,
            height: RING_SIZE,
            marginTop: 24,
            alignItems: "center",
            justifyContent: "center",
            transform: [{ scale: scaleAnim }],
          }}
        >
          <Svg
            width={RING_SIZE}
            height={RING_SIZE}
            style={{
              position: "absolute",
              transform: [{ rotate: "-90deg" }],
            }}
          >
            {/* FOND */}

            <Circle
              cx={RING_SIZE / 2}
              cy={RING_SIZE / 2}
              r={RADIUS}
              stroke="#142019"
              strokeWidth={STROKE_WIDTH}
              fill="none"
            />

            {/* PROGRESSION */}

            <AnimatedCircle
              cx={RING_SIZE / 2}
              cy={RING_SIZE / 2}
              r={RADIUS}
              stroke="#00FF87"
              strokeWidth={STROKE_WIDTH}
              strokeLinecap="round"
              fill="none"
              strokeDasharray={`${CIRCUMFERENCE} ${CIRCUMFERENCE}`}
              strokeDashoffset={progressAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [
                  CIRCUMFERENCE,
                  0,
                ],
              })}
            />
          </Svg>

          {/* CONTENU CENTRAL */}

          <Text
            style={{
              color: "#66736B",
              fontSize: 10,
              fontWeight: "800",
              letterSpacing: 2,
            }}
          >
            RÉPÉTITIONS
          </Text>

          <Text
            style={{
              color: "#F0FFF0",
              fontSize: 92,
              fontWeight: "900",
              lineHeight: 100,
              marginTop: 4,
              fontVariant: ["tabular-nums"],
            }}
          >
            {count}
          </Text>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 2,
            }}
          >
            <Text
              style={{
                color: "#66736B",
                fontSize: 14,
              }}
            >
              sur
            </Text>

            <Text
              style={{
                color: "#AAB4AD",
                fontSize: 14,
                fontWeight: "700",
                marginLeft: 5,
              }}
            >
              {TARGET}
            </Text>
          </View>

          <Text
            style={{
              color: "#00FF87",
              fontSize: 13,
              fontWeight: "800",
              marginTop: 10,
            }}
          >
            {percentage} %
          </Text>
        </Animated.View>

        {/* COMMANDES */}

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: 18,
          }}
        >
          {/* MOINS */}

          <TouchableOpacity
            onPress={decrement}
            activeOpacity={0.7}
            style={{
              width: 58,
              height: 58,
              borderRadius: 18,
              backgroundColor: "#101712",
              borderWidth: 1,
              borderColor: "rgba(255,255,255,0.08)",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons
              name="remove"
              size={26}
              color="#B7C0BA"
            />
          </TouchableOpacity>

          {/* AJOUT */}

          <TouchableOpacity
            onPress={increment}
            activeOpacity={0.85}
            style={{
              width: 92,
              height: 92,
              borderRadius: 30,
              marginHorizontal: 18,
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
            }}
          >
            <LinearGradient
              colors={["#00FF87", "#00D966"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                width: "100%",
                height: "100%",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons
                name="add"
                size={38}
                color="#071009"
              />

              <Text
                style={{
                  color: "#071009",
                  fontSize: 9,
                  fontWeight: "900",
                  letterSpacing: 1,
                }}
              >
                REP
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* PAUSE */}

          <TouchableOpacity
            onPress={toggleTimer}
            activeOpacity={0.7}
            style={{
              width: 58,
              height: 58,
              borderRadius: 18,
              backgroundColor: "#101712",
              borderWidth: 1,
              borderColor: isActive
                ? "rgba(0,255,135,0.35)"
                : "rgba(255,255,255,0.08)",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons
              name={isActive ? "pause" : "play"}
              size={24}
              color={
                isActive
                  ? "#00FF87"
                  : "#B7C0BA"
              }
            />
          </TouchableOpacity>
        </View>

        {/* TERMINER */}

        <TouchableOpacity
          onPress={finishWorkout}
          activeOpacity={0.7}
          style={{
            marginTop: 22,
            paddingVertical: 10,
            paddingHorizontal: 20,
          }}
        >
          <Text
            style={{
              color: "#7A8A7E",
              fontSize: 12,
              fontWeight: "800",
              letterSpacing: 1,
            }}
          >
            TERMINER LA SÉANCE
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}