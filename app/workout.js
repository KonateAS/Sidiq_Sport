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
import { useRouter, useLocalSearchParams } from "expo-router";
import * as Haptics from "expo-haptics";
import Svg, { Circle } from "react-native-svg";

import { saveWorkout } from "../lib/workoutStorage";
import { getPremiumStatus } from "../lib/premiumStorage";
import { getWorkoutType } from "../lib/workoutTypes";
import FadeInView from "../components/FadeInView";

const { width } = Dimensions.get("window");

const COLORS = {
  black: "#000000",
  surface: "#0B0B0B",
  surfaceLight: "#111111",
  border: "#242424",
  controlBorder: "#222222",
  orange: "#E85002",
  red: "#C10801",
  white: "#FFFFFF",
  lightGray: "#A7A7A7",
  gray: "#646464",
  muted: "#8E8E93",
  darkMuted: "#777777",
  darkerMuted: "#686868",
  darkestMuted: "#444444",
  ringTrack: "#171717",
  gradientTop: "#090909",
  gradientMiddle: "#050505",
  completedBackground: "#070707",
};

// Le target dépend maintenant de l'activité sélectionnée.

const RING_SIZE = Math.min(width - 72, 310);

const STROKE_WIDTH = 12;

const RADIUS = (RING_SIZE - STROKE_WIDTH) / 2;

const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default function WorkoutScreen() {
  const router = useRouter();

  const { workoutId } = useLocalSearchParams();

  const workout = workoutId ? getWorkoutType(workoutId) : null;

  const TARGET = workout?.target ?? 0;

  /*
   * ============================================================
   * ÉTAT DE LA SÉANCE
   * ============================================================
   */

  const [count, setCount] = useState(0);

  const [timer, setTimer] = useState(0);
  const [restTimer, setRestTimer] = useState(0);

  const [sessionStatus, setSessionStatus] = useState("preparation");

  const [currentSet, setCurrentSet] = useState(1);
  const [setReps, setSetReps] = useState(0);
  const setRepsRef = useRef(0);

  const holdIntervalRef = useRef(null);
  const holdTimeoutRef = useRef(null);
  const holdActiveRef = useRef(false);
  const incrementLockRef = useRef(false);

  const [isCompleted, setIsCompleted] = useState(false);

  const [isPremium, setIsPremium] = useState(false);

  const [premiumChecked, setPremiumChecked] = useState(false);

  /*
   * ============================================================
   * VÉRIFICATION PREMIUM
   * ============================================================
   */

  useEffect(() => {
    let mounted = true;

    const checkPremium = async () => {
      try {
        const status = await getPremiumStatus();

        if (!mounted) {
          return;
        }

        setIsPremium(status);
        setPremiumChecked(true);
      } catch (error) {
        console.log("Erreur lors de la vérification Premium :", error);

        if (!mounted) {
          return;
        }

        setIsPremium(false);
        setPremiumChecked(true);
      }
    };

    checkPremium();

    return () => {
      mounted = false;
    };
  }, []);

  /*
   * ============================================================
   * REDIRECTION UTILISATEUR NON PREMIUM
   * ============================================================
   */

  /*
   * ============================================================
   * ANIMATIONS
   * ============================================================
   */

  const progressAnim = useRef(new Animated.Value(0)).current;

  const scaleAnim = useRef(new Animated.Value(1)).current;

  const contentOpacity = useRef(new Animated.Value(1)).current;
  const completionLock = useRef(false);
  /*
   * ============================================================
   * CHRONOMÈTRE AUTOMATIQUE DE LA SÉANCE
   * ============================================================
   */

  useEffect(() => {
    if (!workout || sessionStatus !== "active" || isCompleted) {
      return;
    }

    const interval = setInterval(() => {
      setTimer((previous) => {
        const nextTimer = previous + 1;

        if (workout.mode === "duration" && nextTimer >= TARGET) {
          setSessionStatus("completed");

          setTimeout(async () => {
            await Haptics.notificationAsync(
              Haptics.NotificationFeedbackType.Success,
            );

            if (completionLock.current) {
              return;
            }

            completionLock.current = true;

            await saveWorkout({
              repetitions: null,
              distance: null,
              duration: TARGET,
              sets: null,
              repetitionsPerSet: null,
              type: workout.name,
              workoutId: workout.id,
              category: workout.category,
              unit: workout.unit,
            });

            finishWorkout();
          }, 100);

          return TARGET;
        }

        return nextTimer;
      });
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [
    sessionStatus,
    isCompleted,
    workout?.mode,
    workout?.name,
    workout?.id,
    workout?.category,
    workout?.unit,
    TARGET,
  ]);

  /*
   * ============================================================
   * CHRONOMÈTRE DE REPOS ENTRE LES SÉRIES
   * ============================================================
   */

  useEffect(() => {
    if (sessionStatus !== "resting" || isCompleted) {
      return;
    }

    const interval = setInterval(() => {
      setRestTimer((previous) => {
        if (previous <= 1) {
          clearInterval(interval);

          setCurrentSet((previousSet) => previousSet + 1);
          setRepsRef.current = 0;
          setSetReps(0);
          setSessionStatus("active");

          return 0;
        }

        return previous - 1;
      });
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [sessionStatus, isCompleted]);

  /*
   * ============================================================
   * PROGRESSION DE L'ANNEAU
   * ============================================================
   */

  useEffect(() => {
    if (!workout) {
      return;
    }

    let progress = 0;

    if (workout.mode === "repetitions" || workout.mode === "distance") {
      progress = TARGET > 0 ? count / TARGET : 0;
    }

    if (workout.mode === "sets") {
      const totalSets = workout.sets ?? 0;
      const targetReps = workout.reps ?? 0;

      if (totalSets > 0 && targetReps > 0) {
        const completedSets = currentSet - 1;
        const currentSetProgress = setReps / targetReps;

        progress = (completedSets + currentSetProgress) / totalSets;
      }
    }

    if (workout.mode === "duration") {
      progress = TARGET > 0 ? timer / TARGET : 0;
    }

    progress = Math.min(progress, 1);

    Animated.timing(progressAnim, {
      toValue: progress,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [
    count,
    timer,
    currentSet,
    setReps,
    TARGET,
    workout?.mode,
    workout?.sets,
    workout?.reps,
    progressAnim,
  ]);

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
    const minutes = Math.floor(seconds / 60);

    const remainingSeconds = seconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds,
    ).padStart(2, "0")}`;
  };

  /*
   * ============================================================
   * AJOUTER UNE RÉPÉTITION
   * ============================================================
   */

  const handleIncrement = async () => {
    if (isCompleted || sessionStatus === "completed") {
      return;
    }

    /*
     * ----------------------------------------------------------
     * ACTIVITÉS À DURÉE
     * Le chronomètre est géré automatiquement.
     * ----------------------------------------------------------
     */

    if (workout.mode === "duration") {
      return;
    }

    /*
     * ----------------------------------------------------------
     * ACTIVITÉS EN SÉRIES
     * ----------------------------------------------------------
     */

    if (workout.mode === "sets") {
      const targetReps = workout.reps ?? 0;
      const totalSets = workout.sets ?? 0;
      const currentReps = setRepsRef.current;

      if (currentReps >= targetReps) {
        return;
      }

      const nextSetReps = currentReps + 1;

      setRepsRef.current = nextSetReps;
      setSetReps(nextSetReps);

      animateCounter();

      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      if (nextSetReps >= targetReps) {
        await Haptics.notificationAsync(
          Haptics.NotificationFeedbackType.Success,
        );

        if (currentSet < totalSets) {
          setRestTimer(workout.rest ?? 60);
          setSessionStatus("resting");
        } else {
          setSessionStatus("completed");
          setIsCompleted(true);

          if (completionLock.current) {
            return;
          }

          completionLock.current = true;

          await saveWorkout({
            repetitions: totalSets * targetReps,
            distance: null,
            duration: null,
            type: workout.name,
            workoutId: workout.id,
            category: workout.category,
            unit: workout.unit,
            sets: totalSets,
            repetitionsPerSet: targetReps,
          });
        }
      }

      return;
    }

    /*
     * ----------------------------------------------------------
     * MOTEUR REP AVEC SÉRIES
     * ----------------------------------------------------------
     */

    if (workout.mode === "repetitions" && workout.structure === "sets_reps") {
      const repsPerSet = workout.reps ?? TARGET;
      const totalSets = Math.ceil(TARGET / repsPerSet);

      if (setReps >= repsPerSet) {
        return;
      }

      const nextSetReps = setReps + 1;
      const nextCount = Math.min(count + 1, TARGET);

      setSetReps(nextSetReps);
      setCount(nextCount);

      animateCounter();

      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      /*
       * Objectif total atteint
       */

      if (nextCount >= TARGET) {
        setCount(TARGET);
        setSessionStatus("completed");

        await Haptics.notificationAsync(
          Haptics.NotificationFeedbackType.Success,
        );

        if (completionLock.current) {
          return;
        }

        completionLock.current = true;

        await saveWorkout({
          repetitions: TARGET,
          distance: null,
          duration: null,
          sets: totalSets,
          repetitionsPerSet: repsPerSet,
          type: workout.name,
          workoutId: workout.id,
          category: workout.category,
          unit: workout.unit,
        });

        setTimeout(() => {
          finishWorkout();
        }, 500);

        return;
      }

      /*
       * Fin de série → repos
       */

      if (nextSetReps >= repsPerSet) {
        await Haptics.notificationAsync(
          Haptics.NotificationFeedbackType.Success,
        );

        if (currentSet < totalSets) {
          setRestTimer(workout.rest ?? 60);
          setSessionStatus("resting");
        }
      }

      return;
    }

    /*
     * ----------------------------------------------------------
     * REP SIMPLE
     * Activités sans structure de séries.
     * ----------------------------------------------------------
     */

    let step = 1;

    if (workout.mode === "distance") {
      step = 0.1;
    }

    const nextCount = Math.min(count + step, TARGET);

    setCount(nextCount);

    animateCounter();

    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    const isRepetition = workout.mode === "repetitions";
    const isDistance = workout.mode === "distance";

    if (
      isRepetition &&
      nextCount > 0 &&
      nextCount % 25 === 0 &&
      nextCount < TARGET
    ) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }

    if (
      isDistance &&
      nextCount > 0 &&
      Number.isInteger(nextCount) &&
      nextCount < TARGET
    ) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }

    if (nextCount >= TARGET) {
      setCount(TARGET);
      setSessionStatus("completed");

      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      if (completionLock.current) {
        return;
      }

      completionLock.current = true;
      await saveWorkout({
        repetitions: workout.mode === "repetitions" ? TARGET : null,

        distance: workout.mode === "distance" ? TARGET : null,

        duration: null,

        type: workout.name,
        workoutId: workout.id,
        category: workout.category,
        unit: workout.unit,
      });

      setTimeout(() => {
        finishWorkout();
      }, 500);
    }
  };
  const runIncrement = async () => {
    if (incrementLockRef.current) {
      return;
    }

    incrementLockRef.current = true;

    try {
      await handleIncrement();
    } finally {
      incrementLockRef.current = false;
    }
  };

  /*
   * ============================================================
   * RETIRER UNE RÉPÉTITION
   * ============================================================
   */

  const handleDecrement = async () => {
    if (isCompleted || sessionStatus === "completed") {
      return;
    }

    if (workout.mode === "repetitions" && workout.structure === "sets_reps") {
      if (setReps <= 0 || count <= 0) {
        return;
      }

      setSetReps((previous) => Math.max(previous - 1, 0));
      setCount((previous) => Math.max(previous - 1, 0));

      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      return;
    }

    if (workout.mode === "sets") {
      if (setReps <= 0) {
        return;
      }

      setSetReps((previous) => Math.max(previous - 1, 0));

      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      return;
    }

    if (count <= 0) {
      return;
    }

    const step = workout.mode === "distance" ? 0.1 : 1;

    setCount((previous) => Math.max(previous - step, 0));

    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };
  const stopHold = () => {
    holdActiveRef.current = false;

    if (holdTimeoutRef.current) {
      clearTimeout(holdTimeoutRef.current);
      holdTimeoutRef.current = null;
    }

    if (holdIntervalRef.current) {
      clearInterval(holdIntervalRef.current);
      holdIntervalRef.current = null;
    }
  };

  const startHold = (action) => {
    stopHold();

    if (
      isCompleted ||
      sessionStatus !== "active" ||
      workout.mode === "duration"
    ) {
      return;
    }

    holdActiveRef.current = true;

    holdTimeoutRef.current = setTimeout(() => {
      if (!holdActiveRef.current) {
        return;
      }

      holdIntervalRef.current = setInterval(() => {
        if (
          !holdActiveRef.current ||
          isCompleted ||
          sessionStatus !== "active"
        ) {
          stopHold();
          return;
        }

        action();
      }, 120);
    }, 350);
  };

  /*
   * ============================================================
   * PAUSE / REPRISE
   * ============================================================
   */

  const handleTogglePause = () => {
    if (isCompleted || sessionStatus === "completed") {
      return;
    }

    setSessionStatus((previous) => {
      if (previous === "preparation") {
        return "active";
      }

      if (previous === "active") {
        return "paused";
      }

      if (previous === "paused") {
        return "active";
      }

      return previous;
    });
  };

  /*
   * ============================================================
   * FIN DE SÉANCE
   * ============================================================
   */

  const finishWorkout = () => {
    setSessionStatus("completed");

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
    setCurrentSet(1);
    setRepsRef.current = 0;
    setSetReps(0);
    setRestTimer(0);
    setIsCompleted(false);
    completionLock.current = false;
    setSessionStatus("preparation");

    progressAnim.setValue(0);
    scaleAnim.setValue(1);
    contentOpacity.setValue(1);
  };

  /*
   * ============================================================
   * PROGRESSION
   * ============================================================
   */

  const strokeDashoffset = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [CIRCUMFERENCE, 0],
  });

  const displayValue =
    workout?.mode === "duration"
      ? formatTime(timer)
      : workout?.mode === "sets" ||
          (workout?.mode === "repetitions" &&
            workout?.structure === "sets_reps")
        ? setReps
        : count;

  const displayTarget =
    workout?.mode === "duration"
      ? `${Math.floor(TARGET / 60)} min`
      : workout?.mode === "sets" ||
          (workout?.mode === "repetitions" &&
            workout?.structure === "sets_reps")
        ? (workout?.reps ?? 0)
        : TARGET;

  /*
   * ============================================================
   * VÉRIFICATION DE LA SÉANCE
   * ============================================================
   */

  if (!workout) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: COLORS.surface,
          alignItems: "center",
          justifyContent: "center",
          paddingHorizontal: 24,
        }}
      >
        <Text
          style={{
            color: COLORS.white,
            fontSize: 20,
            fontWeight: "700",
            textAlign: "center",
          }}
        >
          Séance introuvable
        </Text>

        <Text
          style={{
            color: COLORS.gray,
            fontSize: 14,
            textAlign: "center",
            marginTop: 10,
          }}
        >
          Cette séance n'existe pas ou n'est plus disponible.
        </Text>

        <TouchableOpacity
          onPress={() => router.replace("/sessions")}
          style={{
            marginTop: 24,
            paddingHorizontal: 24,
            paddingVertical: 14,
            borderRadius: 12,
            backgroundColor: COLORS.orange,
          }}
        >
          <Text
            style={{
              color: COLORS.white,
              fontSize: 14,
              fontWeight: "700",
            }}
          >
            RETOUR AUX SÉANCES
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!premiumChecked) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: COLORS.surface,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Ionicons name="diamond-outline" size={28} color={COLORS.orange} />

        <Text
          style={{
            color: COLORS.lightGray,
            fontSize: 12,
            fontWeight: "700",
            marginTop: 12,
          }}
        >
          Vérification Premium...
        </Text>
      </View>
    );
  }

  /*
   * ============================================================
   * UTILISATEUR NON PREMIUM
   * ============================================================
   */

  /*
   * ============================================================
   * ÉCRAN DE FIN
   * ============================================================
   */

  if (isCompleted) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: COLORS.completedBackground,
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: 24,
        }}
      >
        <Text
          style={{
            color: COLORS.white,
            fontSize: 32,
            fontWeight: "800",
            letterSpacing: -1,
            marginBottom: 12,
          }}
        >
          Séance terminée
        </Text>

        <Text
          style={{
            color: COLORS.muted,
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
            backgroundColor: COLORS.surfaceLight,
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
                color: COLORS.muted,
                fontSize: 15,
              }}
            >
              {workout.mode === "repetitions"
                ? "Répétitions"
                : workout.mode === "distance"
                  ? "Distance"
                  : workout.mode === "duration"
                    ? "Durée"
                    : "Séries"}
            </Text>

            <Text
              style={{
                color: COLORS.white,
                fontSize: 18,
                fontWeight: "700",
              }}
            >
              {workout.mode === "sets"
                ? `${workout.sets ?? 0} séries × ${workout.reps ?? displayTarget} répétitions`
                : workout.mode === "repetitions" &&
                    workout.structure === "sets_reps"
                  ? `${Math.ceil(TARGET / (workout.reps ?? TARGET))} séries × ${
                      workout.reps ?? displayTarget
                    } répétitions`
                  : `${displayValue} / ${displayTarget} ${workout.unit}`}
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
                color: COLORS.muted,
                fontSize: 15,
              }}
            >
              Durée
            </Text>

            <Text
              style={{
                color: COLORS.white,
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
            backgroundColor: COLORS.white,
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 12,
          }}
        >
          <Text
            style={{
              color: COLORS.black,
              fontSize: 16,
              fontWeight: "800",
            }}
          >
            Retour à l'accueil
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
            borderColor: COLORS.border,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              color: COLORS.white,
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
   * ÉCRAN PRINCIPAL
   * ============================================================
   */

  return (
    <FadeInView
      duration={450}
      translateY={12}
      scale={0.99}
      style={{
        flex: 1,
      }}
    >
      <LinearGradient
        colors={[COLORS.gradientTop, COLORS.gradientMiddle, COLORS.black]}
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
                backgroundColor: COLORS.surfaceLight,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons name="chevron-back" size={24} color={COLORS.white} />
            </TouchableOpacity>

            <View
              style={{
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: COLORS.white,
                  fontSize: 17,
                  fontWeight: "800",
                  letterSpacing: 1.5,
                }}
              >
                SIDIQ SPORT
              </Text>

              <Text
                style={{
                  color: COLORS.gray,
                  fontSize: 11,
                  letterSpacing: 1.2,
                  marginTop: 4,
                  textTransform: "uppercase",
                }}
              >
                Séance
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
              CHRONOMÈTRE
              ===================================================== */}

          <View
            style={{
              alignItems: "center",
              marginTop: 28,
            }}
          >
            <Text
              style={{
                color: COLORS.darkMuted,
                fontSize: 12,
                fontWeight: "600",
                letterSpacing: 2,
                textTransform: "uppercase",
              }}
            >
              Durée
            </Text>

            <Text
              style={{
                color: COLORS.white,
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
              <Circle
                cx={RING_SIZE / 2}
                cy={RING_SIZE / 2}
                r={RADIUS}
                stroke={COLORS.ringTrack}
                strokeWidth={STROKE_WIDTH}
                fill="none"
              />

              <AnimatedCircle
                cx={RING_SIZE / 2}
                cy={RING_SIZE / 2}
                r={RADIUS}
                stroke={COLORS.white}
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
                  color: COLORS.white,
                  fontSize: workout.mode === "distance" ? 56 : 68,
                  fontWeight: "800",
                  letterSpacing: -3,
                  minWidth: 150,
                  textAlign: "center",
                }}
              >
                {sessionStatus === "resting"
                  ? formatTime(restTimer)
                  : workout.mode === "distance"
                    ? Number(displayValue).toFixed(1)
                    : displayValue}
              </Text>

              <Text
                style={{
                  color: COLORS.darkerMuted,
                  fontSize: 14,
                  fontWeight: "600",
                  letterSpacing: 2,
                  marginTop: -4,
                }}
              >
                {sessionStatus === "resting"
                  ? "REPOS"
                  : workout.mode === "duration"
                    ? `OBJECTIF ${displayTarget}`
                    : `/ ${displayTarget} ${workout.unit}`}
              </Text>

              {(workout.mode === "sets" ||
                (workout.mode === "repetitions" &&
                  workout.structure === "sets_reps")) && (
                <Text
                  style={{
                    color: COLORS.orange,
                    fontSize: 12,
                    fontWeight: "700",
                    letterSpacing: 1.5,
                    marginTop: 8,
                  }}
                >
                  SÉRIE {currentSet} /{" "}
                  {workout.mode === "sets"
                    ? (workout.sets ?? 0)
                    : Math.ceil(TARGET / (workout.reps ?? TARGET))}
                </Text>
              )}
            </Animated.View>
          </View>

          {/* =====================================================
              CONTRÔLES
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

            {workout.mode !== "duration" && (
              <TouchableOpacity
                onPress={handleDecrement}
                onPressIn={() => startHold(handleDecrement)}
                onPressOut={stopHold}
                activeOpacity={0.75}
                style={{
                  width: 62,
                  height: 62,
                  borderRadius: 31,
                  backgroundColor: COLORS.surfaceLight,
                  borderWidth: 1,
                  borderColor: COLORS.controlBorder,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ionicons name="remove" size={26} color={COLORS.white} />
              </TouchableOpacity>
            )}

            {/* PAUSE / REPRISE */}

            <TouchableOpacity
              onPress={handleTogglePause}
              activeOpacity={0.8}
              style={{
                width: 76,
                height: 76,
                borderRadius: 38,
                backgroundColor: COLORS.white,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons
                name={sessionStatus === "active" ? "pause" : "play"}
                size={28}
                color={COLORS.black}
              />
            </TouchableOpacity>

            {/* PLUS */}

            {workout.mode !== "duration" && (
              <TouchableOpacity
                onPress={handleIncrement}
                onPressIn={() => startHold(handleIncrement)}
                onPressOut={stopHold}
                activeOpacity={0.75}
                style={{
                  width: 62,
                  height: 62,
                  borderRadius: 31,
                  backgroundColor: COLORS.surfaceLight,
                  borderWidth: 1,
                  borderColor: COLORS.controlBorder,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ionicons name="add" size={28} color={COLORS.white} />
              </TouchableOpacity>
            )}
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
                color: COLORS.gray,
                fontSize: 12,
                textAlign: "center",
                letterSpacing: 0.5,
              }}
            >
              {sessionStatus === "preparation"
                ? "Appuie sur lecture pour commencer"
                : sessionStatus === "resting"
                  ? "Récupération avant la prochaine série"
                  : sessionStatus === "paused"
                    ? "Séance en pause"
                    : workout.mode === "duration"
                      ? "Le chronomètre tourne automatiquement"
                      : workout.mode === "sets"
                        ? "Appuie sur + à chaque répétition"
                        : workout.mode === "distance"
                          ? "Ajoute la distance parcourue"
                          : "Appuie sur + à chaque répétition"}
            </Text>
          </View>

          {/* =====================================================
              INFORMATIONS DE LA SÉANCE
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
                color={COLORS.darkestMuted}
              />

              <Text
                style={{
                  color: COLORS.darkestMuted,
                  fontSize: 11,
                  fontWeight: "600",
                  letterSpacing: 0.8,
                }}
              >
                {workout.name.toUpperCase()}
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
    </FadeInView>
  );
}
