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

import { saveWorkout } from "../lib/workoutStorage";
import { getPremiumStatus } from "../lib/premiumStorage";

const { width } = Dimensions.get("window");

const TARGET = 200;

const RING_SIZE = Math.min(width - 72, 310);

const STROKE_WIDTH = 12;

const RADIUS =
  (RING_SIZE - STROKE_WIDTH) / 2;

const CIRCUMFERENCE =
  2 * Math.PI * RADIUS;

const AnimatedCircle =
  Animated.createAnimatedComponent(Circle);

export default function WorkoutScreen() {
  const router = useRouter();

  /*
   * ============================================================
   * Ã‰TAT DE LA SÃ‰ANCE
   * ============================================================
   */

  const [count, setCount] = useState(0);

  const [timer, setTimer] = useState(0);

  const [isActive, setIsActive] = useState(true);

  const [isCompleted, setIsCompleted] =
    useState(false);

  const [isPremium, setIsPremium] =
    useState(false);

  const [premiumChecked, setPremiumChecked] =
    useState(false);

  /*
   * ============================================================
   * VÃ‰RIFICATION PREMIUM
   * ============================================================
   */

  useEffect(() => {
    const checkPremium = async () => {
      try {
        const premium =
          await getPremiumStatus();

        setIsPremium(premium);
      } catch (error) {
        console.log(
          "Impossible de vÃ©rifier le statut Premium :",
          error
        );

        setIsPremium(false);
      } finally {
        setPremiumChecked(true);
      }
    };

    checkPremium();
  }, []);

  useEffect(() => {
    if (
      premiumChecked &&
      !isPremium
    ) {
      router.replace("/premium");
    }
  }, [
    premiumChecked,
    isPremium,
    router,
  ]);

  /*
   * ============================================================
   * ANIMATIONS
   * ============================================================
   */

  const progressAnim = useRef(
    new Animated.Value(0)
  ).current;

  const scaleAnim = useRef(
    new Animated.Value(1)
  ).current;

  const contentOpacity = useRef(
    new Animated.Value(1)
  ).current;

  /*
   * ============================================================
   * CHRONOMÃˆTRE
   * ============================================================
   */

  useEffect(() => {
    if (!isActive || isCompleted) {
      return;
    }

    const interval = setInterval(() => {
      setTimer(
        (previous) => previous + 1
      );
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [isActive, isCompleted]);

  /*
   * ============================================================
   * PROGRESSION DE L'ANNEAU
   * ============================================================
   */

  useEffect(() => {
    const progress = Math.min(
      count / TARGET,
      1
    );

    Animated.timing(progressAnim, {
      toValue: progress,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [count, progressAnim]);

  /*
   * ============================================================
   * ANIMATION DU COMPTEUR
   * ============================================================
   */

  const animateCounter = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.08,
        duration: 100,
        useNativeDriver: true,
      }),

      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        tension: 80,
        useNativeDriver: true,
      }),
    ]).start();
  };

  /*
   * ============================================================
   * FORMAT DU TEMPS
   * ============================================================
   */

  const formatTime = (seconds) => {
    const minutes = Math.floor(
      seconds / 60
    );

    const remainingSeconds =
      seconds % 60;

    return `${String(minutes).padStart(
      2,
      "0"
    )}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  };
  /*
   * ============================================================
   * AJOUTER UNE RÃ‰PÃ‰TITION
   * ============================================================
   */

  const handleIncrement = async () => {
    if (isCompleted) {
      return;
    }

    const nextCount = Math.min(
      count + 1,
      TARGET
    );

    setCount(nextCount);

    animateCounter();

    await Haptics.impactAsync(
      Haptics.ImpactFeedbackStyle.Light
    );

    /*
     * Feedback intermÃ©diaire toutes les
     * 25 rÃ©pÃ©titions.
     */

    if (
      nextCount > 0 &&
      nextCount % 25 === 0 &&
      nextCount < TARGET
    ) {
      await Haptics.notificationAsync(
        Haptics.NotificationFeedbackType.Success
      );
    }

    /*
     * Objectif atteint.
     */

    if (nextCount === TARGET) {
      setIsActive(false);

      await Haptics.notificationAsync(
        Haptics.NotificationFeedbackType.Success
      );

      /*
       * Sauvegarde de la sÃ©ance terminÃ©e.
       */

      await saveWorkout({
        repetitions: TARGET,
        duration: timer,
        type: "Squats",
      });

      setTimeout(() => {
        finishWorkout();
      }, 500);
    }
  };

  /*
   * ============================================================
   * RETIRER UNE RÃ‰PÃ‰TITION
   * ============================================================
   */

  const handleDecrement = async () => {
    if (
      isCompleted ||
      count <= 0
    ) {
      return;
    }

    setCount(
      (previous) =>
        Math.max(previous - 1, 0)
    );

    await Haptics.impactAsync(
      Haptics.ImpactFeedbackStyle.Light
    );
  };

  /*
   * ============================================================
   * PAUSE / REPRISE
   * ============================================================
   */

  const handleTogglePause = () => {
    if (isCompleted) {
      return;
    }

    setIsActive(
      (previous) => !previous
    );
  };

  /*
   * ============================================================
   * FIN DE SÃ‰ANCE
   * ============================================================
   */

  const finishWorkout = () => {
    setIsActive(false);

    Animated.timing(contentOpacity, {
      toValue: 0,
      duration: 250,
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
    setIsCompleted(false);
    setIsActive(true);

    progressAnim.setValue(0);
    scaleAnim.setValue(1);
    contentOpacity.setValue(1);
  };

  /*
   * ============================================================
   * PROGRESSION
   * ============================================================
   */

  const strokeDashoffset =
    progressAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [
        CIRCUMFERENCE,
        0,
      ],
    });

  const percentage = Math.round(
    (count / TARGET) * 100
  );

  /*
   * ============================================================
   * VÃ‰RIFICATION PREMIUM EN COURS
   * ============================================================
   */

  if (!premiumChecked) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#080C09",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Ionicons
          name="diamond-outline"
          size={28}
          color="#00FF87"
        />

        <Text
          style={{
            color: "#7F8781",
            fontSize: 12,
            fontWeight: "700",
            marginTop: 12,
          }}
        >
          VÃ©rification Premium...
        </Text>
      </View>
    );
  }

  /*
   * ============================================================
   * UTILISATEUR NON PREMIUM
   * ============================================================
   */

  if (!isPremium) {
    return null;
  }

  /*
   * ============================================================
   * Ã‰CRAN DE FIN
   * ============================================================
   */

  if (isCompleted) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#070707",
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: 24,
        }}
      >
        <Text
          style={{
            color: "#FFFFFF",
            fontSize: 32,
            fontWeight: "800",
            letterSpacing: -1,
            marginBottom: 12,
          }}
        >
          SÃ©ance terminÃ©e
        </Text>

        <Text
          style={{
            color: "#8E8E93",
            fontSize: 16,
            marginBottom: 40,
          }}
        >
          Excellent travail.
        </Text>

        <View
          style={{
            width: "100%",
            maxWidth: 340,
            backgroundColor: "#111111",
            borderRadius: 24,
            padding: 24,
            marginBottom: 28,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 18,
            }}
          >
            <Text
              style={{
                color: "#8E8E93",
                fontSize: 15,
              }}
            >
              RÃ©pÃ©titions
            </Text>

            <Text
              style={{
                color: "#FFFFFF",
                fontSize: 18,
                fontWeight: "700",
              }}
            >
              {count} / {TARGET}
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text
              style={{
                color: "#8E8E93",
                fontSize: 15,
              }}
            >
              DurÃ©e
            </Text>

            <Text
              style={{
                color: "#FFFFFF",
                fontSize: 18,
                fontWeight: "700",
              }}
            >
              {formatTime(timer)}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => router.replace("/")}
          activeOpacity={0.85}
          style={{
            width: "100%",
            maxWidth: 340,
            height: 56,
            borderRadius: 18,
            backgroundColor: "#FFFFFF",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 12,
          }}
        >
          <Text
            style={{
              color: "#000000",
              fontSize: 16,
              fontWeight: "800",
            }}
          >
            Retour Ã  l'accueil
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={restartWorkout}
          activeOpacity={0.8}
          style={{
            width: "100%",
            maxWidth: 340,
            height: 56,
            borderRadius: 18,
            borderWidth: 1,
            borderColor: "#2A2A2A",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              color: "#FFFFFF",
              fontSize: 16,
              fontWeight: "700",
            }}
          >
            Recommencer
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  /*
   * ============================================================
   * Ã‰CRAN PRINCIPAL
   * ============================================================
   */

  return (
    <LinearGradient
      colors={[
        "#090909",
        "#050505",
        "#000000",
      ]}
      style={{
        flex: 1,
      }}
    >
      <Animated.View
        style={{
          flex: 1,
          opacity: contentOpacity,
        }}
      >
        {/* =====================================================
            HEADER
            ===================================================== */}

        <View
          style={{
            paddingTop: 58,
            paddingHorizontal: 22,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <TouchableOpacity
            onPress={() => router.back()}
            activeOpacity={0.7}
            style={{
              width: 44,
              height: 44,
              borderRadius: 22,
              backgroundColor: "#111111",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons
              name="chevron-back"
              size={24}
              color="#FFFFFF"
            />
          </TouchableOpacity>

          <View
            style={{
              alignItems: "center",
            }}
          >
            <Text
              style={{
                color: "#FFFFFF",
                fontSize: 17,
                fontWeight: "800",
                letterSpacing: 1.5,
              }}
            >
              SIDIQ SPORT
            </Text>

            <Text
              style={{
                color: "#666666",
                fontSize: 11,
                letterSpacing: 1.2,
                marginTop: 4,
                textTransform: "uppercase",
              }}
            >
              SÃ©ance
            </Text>
          </View>

          <View
            style={{
              width: 44,
              height: 44,
            }}
          />
        </View>

        {/* =====================================================
            CHRONOMÃˆTRE
            ===================================================== */}

        <View
          style={{
            alignItems: "center",
            marginTop: 28,
          }}
        >
          <Text
            style={{
              color: "#777777",
              fontSize: 12,
              fontWeight: "600",
              letterSpacing: 2,
              textTransform: "uppercase",
            }}
          >
            DurÃ©e
          </Text>

          <Text
            style={{
              color: "#FFFFFF",
              fontSize: 25,
              fontWeight: "700",
              letterSpacing: 1,
              marginTop: 5,
            }}
          >
            {formatTime(timer)}
          </Text>
        </View>

        {/* =====================================================
            ANNEAU DE PROGRESSION
            ===================================================== */}

        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            marginTop: 20,
          }}
        >
          <Svg
            width={RING_SIZE}
            height={RING_SIZE}
            viewBox={`0 0 ${RING_SIZE} ${RING_SIZE}`}
          >
            {/* Anneau de fond */}

            <Circle
              cx={RING_SIZE / 2}
              cy={RING_SIZE / 2}
              r={RADIUS}
              stroke="#171717"
              strokeWidth={STROKE_WIDTH}
              fill="none"
            />

            {/* Anneau dynamique */}

            <AnimatedCircle
              cx={RING_SIZE / 2}
              cy={RING_SIZE / 2}
              r={RADIUS}
              stroke="#FFFFFF"
              strokeWidth={STROKE_WIDTH}
              strokeLinecap="round"
              fill="none"
              strokeDasharray={`${CIRCUMFERENCE} ${CIRCUMFERENCE}`}
              strokeDashoffset={strokeDashoffset}
              rotation="-90"
              origin={`${RING_SIZE / 2}, ${RING_SIZE / 2}`}
            />
          </Svg>

          {/* ===================================================
              COMPTEUR CENTRAL
              =================================================== */}

          <Animated.View
            style={{
              position: "absolute",
              alignItems: "center",
              justifyContent: "center",
              transform: [
                {
                  scale: scaleAnim,
                },
              ],
            }}
          >
            <Text
              style={{
                color: "#FFFFFF",
                fontSize: 68,
                fontWeight: "800",
                letterSpacing: -3,
              }}
            >
              {count}
            </Text>

            <Text
              style={{
                color: "#686868",
                fontSize: 14,
                fontWeight: "600",
                letterSpacing: 2,
                marginTop: -4,
              }}
            >
              / {TARGET}
            </Text>

            <Text
              style={{
                color: "#555555",
                fontSize: 11,
                fontWeight: "600",
                letterSpacing: 1,
                marginTop: 8,
              }}
            >
              {percentage} %
            </Text>
          </Animated.View>
        </View>

        {/* =====================================================
            CONTRÃ”LES
            ===================================================== */}

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 18,
            marginTop: 18,
            paddingHorizontal: 24,
          }}
        >
          {/* MOINS */}

          <TouchableOpacity
            onPress={handleDecrement}
            activeOpacity={0.75}
            style={{
              width: 62,
              height: 62,
              borderRadius: 31,
              backgroundColor: "#111111",
              borderWidth: 1,
              borderColor: "#222222",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons
              name="remove"
              size={26}
              color="#FFFFFF"
            />
          </TouchableOpacity>

          {/* PAUSE / REPRISE */}

          <TouchableOpacity
            onPress={handleTogglePause}
            activeOpacity={0.8}
            style={{
              width: 76,
              height: 76,
              borderRadius: 38,
              backgroundColor: "#FFFFFF",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons
              name={
                isActive
                  ? "pause"
                  : "play"
              }
              size={28}
              color="#000000"
            />
          </TouchableOpacity>

          {/* PLUS */}

          <TouchableOpacity
            onPress={handleIncrement}
            activeOpacity={0.75}
            style={{
              width: 62,
              height: 62,
              borderRadius: 31,
              backgroundColor: "#111111",
              borderWidth: 1,
              borderColor: "#222222",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons
              name="add"
              size={28}
              color="#FFFFFF"
            />
          </TouchableOpacity>
        </View>

        {/* =====================================================
            INDICATION
            ===================================================== */}

        <View
          style={{
            alignItems: "center",
            marginTop: 20,
            paddingHorizontal: 24,
          }}
        >
          <Text
            style={{
              color: "#555555",
              fontSize: 12,
              textAlign: "center",
              letterSpacing: 0.5,
            }}
          >
            {isActive
              ? "Appuie sur + Ã  chaque rÃ©pÃ©tition"
              : "SÃ©ance en pause"}
          </Text>
        </View>

        {/* =====================================================
            INFORMATIONS DE LA SÃ‰ANCE
            ===================================================== */}

        <View
          style={{
            alignItems: "center",
            marginTop: 24,
            paddingHorizontal: 24,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            <Ionicons
              name="fitness-outline"
              size={16}
              color="#444444"
            />

            <Text
              style={{
                color: "#444444",
                fontSize: 11,
                fontWeight: "600",
                letterSpacing: 0.8,
              }}
            >
              200 SQUATS
            </Text>
          </View>
        </View>

        {/* =====================================================
            ESPACE BAS
            ===================================================== */}

        <View
          style={{
            flex: 1,
          }}
        />
      </Animated.View>
    </LinearGradient>
  );
}
