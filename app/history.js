import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  Animated,
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";

import {
  getWorkoutHistory,
  clearWorkoutHistory,
  deleteWorkout,
} from "../lib/workoutStorage";

/*
 * ============================================================
 * COULEURS
 * ============================================================
 */

const COLORS = {
  black: "#000000",
  orange: "#E85002",
  red: "#C10801",
  orangeLight: "#F16001",
  beige: "#D9C3AB",

  white: "#F9F9F9",
  lightGray: "#A7A7A7",
  gray: "#646464",
  darkGray: "#333333",

  surface: "#0B0B0B",
  surfaceLight: "#111111",
  border: "#242424",
};

/*
 * ============================================================
 * ÉCRAN HISTORIQUE
 * ============================================================
 */

export default function HistoryScreen() {
  const router = useRouter();

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedWorkout, setSelectedWorkout] =
    useState(null);

  const [showClearConfirm, setShowClearConfirm] =
  useState(false); 

  const modalOpacity =
    useRef(new Animated.Value(0)).current;

  const modalScale =
    useRef(new Animated.Value(0.92)).current;

  const modalTranslateY =
    useRef(new Animated.Value(40)).current;

  const cardAnimations =
    useRef(
      Array.from(
        { length: 30 },
        () => ({
          opacity: new Animated.Value(0),
          translateY: new Animated.Value(24),
          scale: new Animated.Value(0.97),
        })
      )
    ).current;

  const openWorkoutDetails = (workout) => {
    setSelectedWorkout(workout);

    modalOpacity.setValue(0);
    modalScale.setValue(0.88);
    modalTranslateY.setValue(55);

    requestAnimationFrame(() => {
      Animated.parallel([
        Animated.timing(modalOpacity, {
          toValue: 1,
          duration: 280,
          useNativeDriver: true,
        }),

        Animated.spring(modalScale, {
          toValue: 1,
          friction: 7,
          tension: 75,
          useNativeDriver: true,
        }),

        Animated.spring(modalTranslateY, {
          toValue: 0,
          friction: 8,
          tension: 70,
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  const closeWorkoutDetails = () => {
    Animated.parallel([
      Animated.timing(modalOpacity, {
        toValue: 0,
        duration: 210,
        useNativeDriver: true,
      }),

      Animated.timing(modalScale, {
        toValue: 0.94,
        duration: 210,
        useNativeDriver: true,
      }),

      Animated.timing(modalTranslateY, {
        toValue: 35,
        duration: 210,
        useNativeDriver: true,
      }),
    ]).start(({ finished }) => {
      if (finished) {
        setSelectedWorkout(null);

        modalScale.setValue(0.88);
        modalTranslateY.setValue(55);
      }
    });
  };
  /*
   * ============================================================
   * CHARGEMENT DE L'HISTORIQUE
   * ============================================================
   */

  const loadHistory = useCallback(async () => {
    try {
      setLoading(true);

      const storedHistory =
        await getWorkoutHistory();

      setHistory(
        Array.isArray(storedHistory)
          ? storedHistory
          : []
      );
    } catch (error) {
      console.log(
        "Impossible de charger l'historique :",
        error
      );

      setHistory([]);
    } finally {
      setLoading(false);
    }
  }, []);

  /*
   * Recharge l'historique chaque fois que
   * l'écran redevient actif.
   *
   * Important :
   * après une séance terminée, si l'utilisateur
   * revient ici, la nouvelle séance apparaît
   * immédiatement.
   */

  useFocusEffect(
    useCallback(() => {
      loadHistory();
    }, [loadHistory])
  );
  useEffect(() => {
    if (history.length === 0) {
      return;
    }

    const animations = cardAnimations.slice(
      0,
      history.length
    );

    animations.forEach((animation) => {
      animation.opacity.setValue(0);
      animation.translateY.setValue(28);
      animation.scale.setValue(0.96);
    });

    Animated.stagger(70,
      animations.map((animation) =>
        Animated.parallel([
          Animated.timing(animation.opacity, {
          toValue: 1,
          duration: 520,
            useNativeDriver: true,
          }),

          Animated.spring(animation.translateY, {
            toValue: 0,
            tension: 70,
            friction: 9,
            useNativeDriver: true,
          }),

          Animated.spring(animation.scale, {
            toValue: 1,
            tension: 70,
            friction: 9,
            useNativeDriver: true,
          }),
        ])
      )
    ).start();
  }, [history]);

  /*
 * ============================================================
 * EFFACER L'HISTORIQUE
 * ============================================================
 */

const handleClearHistory = () => {
  console.log("EFFACER CLIQUÉ");

  if (history.length === 0) {
    return;
  }

  setShowClearConfirm(true);
};

const confirmClearHistory = async () => {
  try {
    await clearWorkoutHistory();
    setHistory([]);
    setShowClearConfirm(false);
  } catch (error) {
    console.log(
      "Impossible d'effacer l'historique :",
      error
    );
  }
};

const handleDeleteWorkout = async (workoutId) => {
  try {
    if (!workoutId) {
      return;
    }

    await deleteWorkout(workoutId);

    setHistory((currentHistory) =>
      currentHistory.filter(
        (workout) =>
          String(workout.id) !==
          String(workoutId)
      )
    );

    setSelectedWorkout(null);
  } catch (error) {
    console.log(
      "Impossible de supprimer la séance :",
      error
    );
  }
};
  /*
   * ============================================================
   * FORMAT DURÉE
   * ============================================================
   */

  const formatDuration = (seconds) => {
    const totalSeconds =
      Number(seconds) || 0;

    const minutes = Math.floor(
      totalSeconds / 60
    );

    const remainingSeconds =
      totalSeconds % 60;

    if (minutes >= 60) {
      const hours = Math.floor(
        minutes / 60
      );

      const remainingMinutes =
        minutes % 60;

      return `${String(hours).padStart(
        2,
        "0"
      )}:${String(
        remainingMinutes
      ).padStart(2, "0")}:${String(
        remainingSeconds
      ).padStart(2, "0")}`;
    }

    return `${String(minutes).padStart(
      2,
      "0"
    )}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  };

  /*
   * ============================================================
   * FORMAT DATE
   * ============================================================
   */

  const formatDate = (dateString) => {
    if (!dateString) {
      return "Date inconnue";
    }

    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
      return "Date inconnue";
    }

    return date.toLocaleDateString(
      "fr-FR",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  /*
   * ============================================================
   * FORMAT HEURE
   * ============================================================
   */

  const formatTime = (dateString) => {
    if (!dateString) {
      return "--:--";
    }

    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
      return "--:--";
    }

    return date.toLocaleTimeString(
      "fr-FR",
      {
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  /*
   * ============================================================
   * STATISTIQUES RAPIDES
   * ============================================================
   */

  const totalSessions = history.length;

  const totalRepetitions =
    history.reduce(
      (total, workout) =>
        total +
        (Number(workout.repetitions) || 0),
      0
    );

  const totalDuration =
    history.reduce(
      (total, workout) =>
        total +
        (Number(workout.duration) || 0),
      0
    );

  /*
   * ============================================================
   * AFFICHAGE
   * ============================================================
   */

  return (
    <View
      style={{
        flex: 1,
        backgroundColor:
          COLORS.black,
      }}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 50,
        }}
      >
        <View
  style={{
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 24,
    marginTop: 18,
    marginBottom: 10,
  }}
>
  <TouchableOpacity
    onPress={() => router.back()}
    activeOpacity={0.8}
    style={{
      width: 40,
      height: 40,
      borderRadius: 14,
      backgroundColor: COLORS.surfaceLight,
      borderWidth: 1,
      borderColor: COLORS.border,
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <Ionicons
      name="arrow-back"
      size={18}
      color={COLORS.white}
    />
  </TouchableOpacity>

  <View
    style={{
      marginLeft: 13,
    }}
  >
    <Text
      style={{
        color: COLORS.lightGray,
        fontSize: 10,
        fontWeight: "900",
        letterSpacing: 1.5,
      }}
    >
      SIDIQ SPORT
    </Text>

    <Text
      style={{
        color: COLORS.white,
        fontSize: 13,
        fontWeight: "900",
        marginTop: 3,
        letterSpacing: 0.6,
      }}
    >
      HISTORIQUE
    </Text>
  </View>
</View>
        {/* ==================================================
            INTRODUCTION
        ================================================== */}

        <View
  style={{
    marginHorizontal: 24,
    marginTop: 28,
  }}
>
  <Text
    style={{
      color: COLORS.white,
      fontSize: 32,
      fontWeight: "900",
      letterSpacing: -1.3,
    }}
  >
    Tes séances.
  </Text>

  <View
    style={{
      width: 34,
      height: 3,
      borderRadius: 3,
      backgroundColor: COLORS.orange,
      marginTop: 12,
      marginBottom: 10,
    }}
  />

  <Text
    style={{
      color: COLORS.lightGray,
      fontSize: 13,
      lineHeight: 20,
      maxWidth: 330,
    }}
  >
    Chaque séance compte. Consulte ici
    tout ce que tu as accompli.
  </Text>
</View>

        {/* ==================================================
            STATISTIQUES
        ================================================== */}

        {!loading &&
          history.length > 0 && (
            <View
              style={{
                flexDirection: "row",
                gap: 10,
                marginHorizontal: 24,
                marginTop: 24,
              }}
            >
              <HistoryStat
                value={String(
                  totalSessions
                )}
                label="séances"
                icon="barbell-outline"
              
                delay={0}/>

              <HistoryStat
                value={totalRepetitions.toLocaleString(
                  "fr-FR"
                )}
                label="Répétitions"
                icon="repeat-outline"
              
                delay={90}/>

              <HistoryStat
                value={formatDuration(
                  totalDuration
                )}
                label="Temps"
                icon="time-outline"
              
                delay={180}/>
            </View>
          )}

        {/* ==================================================
            CHARGEMENT
        ================================================== */}

        {loading && (
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              paddingVertical: 80,
            }}
          >
            <ActivityIndicator
              size="small"
              color={COLORS.orange}
            />

            <Text
              style={{
                color: COLORS.lightGray,
                fontSize: 12,
                marginTop: 14,
              }}
            >
              Chargement de tes séances...
            </Text>
          </View>
        )}

        {/* ==================================================
            HISTORIQUE VIDE
        ================================================== */}

        {!loading &&
          history.length === 0 && (
            <View
              style={{
                marginHorizontal: 24,
                marginTop: 30,
              }}
            >
              <LinearGradient
                colors={[
                  COLORS.surfaceLight,
                  COLORS.surface,
                ]}
                style={{
                  borderRadius: 28,
                  padding: 28,
                  borderWidth: 1,
                  borderColor:
                    "rgba(232,80,2,0.18)",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    width: 70,
                    height: 70,
                    borderRadius: 24,
                    backgroundColor:
                      "rgba(232,80,2,0.08)",
                    borderWidth: 1,
                    borderColor:
                      "rgba(232,80,2,0.18)",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Ionicons
                    name="barbell-outline"
                    size={32}
                    color={COLORS.orange}
                  />
                </View>

                <Text
                  style={{
                    color: COLORS.white,
                    fontSize: 21,
                    fontWeight: "900",
                    marginTop: 20,
                    textAlign: "center",
                  }}
                >
                  Aucune séance
                </Text>

                <Text
                  style={{
                    color: COLORS.lightGray,
                    fontSize: 13,
                    lineHeight: 20,
                    marginTop: 7,
                    textAlign: "center",
                  }}
                >
                  Tes prochaines séances
                  apparaîtront ici.
                </Text>

                <TouchableOpacity
                  onPress={() =>
                    router.push("/workout")
                  }
                  activeOpacity={0.85}
                  style={{
                    marginTop: 22,
                    height: 52,
                    paddingHorizontal: 24,
                    borderRadius: 17,
                    backgroundColor:
                      COLORS.orange,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{
                      color: COLORS.black,
                      fontSize: 14,
                      fontWeight: "900",
                    }}
                  >
                    Commencer une séance
                  </Text>
                </TouchableOpacity>
              </LinearGradient>
            </View>
          )}

        {/* ==================================================
            LISTE DES SÉANCES
        ================================================== */}
        {!loading &&
          history.length > 0 && (
            <View
              style={{
                marginHorizontal: 24,
                marginTop: 30,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 16,
                }}
              >
                <View>
                  <Text
                    style={{
                      color: COLORS.white,
                      fontSize: 21,
                      fontWeight: "900",
                    }}
                  >
                    Tes séances
                  </Text>

                  <Text
                    style={{
                      color: COLORS.lightGray,
                      fontSize: 12,
                      marginTop: 4,
                    }}
                  >
                    Les plus récentes en premier
                  </Text>
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <View
                    style={{
                      paddingHorizontal: 11,
                      paddingVertical: 7,
                      borderRadius: 12,
                      backgroundColor:
                        "rgba(232,80,2,0.08)",
                      borderWidth: 1,
                      borderColor:
                        "rgba(232,80,2,0.15)",
                    }}
                  >
                    <Text
                      style={{
                        color: COLORS.orange,
                        fontSize: 11,
                        fontWeight: "900",
                      }}
                    >
                      {history.length}
                    </Text>
                  </View>

                  <TouchableOpacity
  onPress={() => {
    console.log("CORBEILLE PRESSEE");
    handleClearHistory();
  }}
                    activeOpacity={0.75}
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: 12,
                      backgroundColor:
                        "rgba(193,8,1,0.08)",
                      borderWidth: 1,
                      borderColor:
                        "rgba(193,8,1,0.18)",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Ionicons
  name="trash-outline"
  size={17}
  color={COLORS.red}
/>
                  </TouchableOpacity>
                </View>
              </View>

              {history.map(
(workout, index) => (
<WorkoutCard
key={
workout.id ||
`${workout.date}-${index}`
}
workout={workout}
formatDate={formatDate}
formatTime={formatTime}
formatDuration={formatDuration}
animation={cardAnimations[index]}
onPress={() =>
openWorkoutDetails(workout)
}
onDelete={() => {
  handleDeleteWorkout(workout.id);
}}
/>
)
)}
            </View>
          )}

        {/* ==================================================
            FOOTER
        ================================================== */}

        {/* ==================================================
            MODAL — DÉTAILS DE LA SÉANCE
        ================================================== */}

        <Modal
  visible={!!selectedWorkout}
  transparent
  animationType="none"
  onRequestClose={closeWorkoutDetails}
>
  <View
    style={{
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 20,
      backgroundColor: "rgba(0,0,0,0.78)",
    }}
  >
    <Animated.View
      style={{
        width: "100%",
        maxWidth: 420,
        backgroundColor: COLORS.surfaceLight,
        borderRadius: 28,
        borderWidth: 1,
        borderColor: COLORS.border,
        padding: 22,
        opacity: modalOpacity,
        transform: [
          {
            scale: modalScale,
          },
          {
            translateY: modalTranslateY,
          },
        ],
        overflow: "hidden",
      }}
    >
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 22,
          right: 22,
          height: 3,
          borderBottomLeftRadius: 3,
          borderBottomRightRadius: 3,
          backgroundColor: COLORS.orange,
        }}
      />

      {/* EN-TÊTE */}

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 22,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            flex: 1,
            minWidth: 0,
          }}
        >
          <View
            style={{
              width: 48,
              height: 48,
              borderRadius: 16,
              backgroundColor: "rgba(232,80,2,0.09)",
              borderWidth: 1,
              borderColor: "rgba(232,80,2,0.18)",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons
              name="barbell-outline"
              size={23}
              color={COLORS.orange}
            />
          </View>

          <View
            style={{
              marginLeft: 12,
              flex: 1,
              minWidth: 0,
            }}
          >
            <Text
              numberOfLines={1}
              style={{
                color: COLORS.white,
                fontSize: 18,
                fontWeight: "900",
                letterSpacing: -0.3,
              }}
            >
              {selectedWorkout?.type || "Squats"}
            </Text>

            <Text
              style={{
                color: COLORS.lightGray,
                fontSize: 10,
                fontWeight: "800",
                marginTop: 4,
                letterSpacing: 1.1,
              }}
            >
              DÉTAILS DE LA SÉANCE
            </Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={closeWorkoutDetails}
          activeOpacity={0.75}
          style={{
            width: 40,
            height: 40,
            borderRadius: 14,
            backgroundColor: "rgba(255,255,255,0.05)",
            borderWidth: 1,
            borderColor: COLORS.border,
            alignItems: "center",
            justifyContent: "center",
            marginLeft: 12,
          }}
        >
          <Ionicons
            name="close"
            size={20}
            color={COLORS.lightGray}
          />
        </TouchableOpacity>
      </View>

      {/* STATISTIQUES */}

      <View
        style={{
          flexDirection: "row",
          gap: 10,
        }}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: COLORS.black,
            borderRadius: 19,
            padding: 16,
            borderWidth: 1,
            borderColor: COLORS.border,
          }}
        >
          <View
            style={{
              width: 34,
              height: 34,
              borderRadius: 11,
              backgroundColor: "rgba(232,80,2,0.09)",
              borderWidth: 1,
              borderColor: "rgba(232,80,2,0.16)",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons
              name="repeat-outline"
              size={17}
              color={COLORS.orange}
            />
          </View>

          <Text
            style={{
              color: COLORS.orange,
              fontSize: 25,
              fontWeight: "900",
              marginTop: 12,
              letterSpacing: -0.6,
            }}
          >
            {Number(selectedWorkout?.repetitions) || 0}
          </Text>

          <Text
            style={{
              color: COLORS.gray,
              fontSize: 9,
              fontWeight: "800",
              marginTop: 4,
              letterSpacing: 0.8,
            }}
          >
            RÉPÉTITIONS
          </Text>
        </View>

        <View
          style={{
            flex: 1,
            backgroundColor: COLORS.black,
            borderRadius: 19,
            padding: 16,
            borderWidth: 1,
            borderColor: COLORS.border,
          }}
        >
          <View
            style={{
              width: 34,
              height: 34,
              borderRadius: 11,
              backgroundColor: "rgba(232,80,2,0.09)",
              borderWidth: 1,
              borderColor: "rgba(232,80,2,0.16)",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons
              name="time-outline"
              size={17}
              color={COLORS.orange}
            />
          </View>

          <Text
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.75}
            style={{
              color: COLORS.white,
              fontSize: 21,
              fontWeight: "900",
              marginTop: 13,
              letterSpacing: -0.5,
            }}
          >
            {formatDuration(selectedWorkout?.duration)}
          </Text>

          <Text
            style={{
              color: COLORS.gray,
              fontSize: 9,
              fontWeight: "800",
              marginTop: 4,
              letterSpacing: 0.8,
            }}
          >
            DURÉE
          </Text>
        </View>
      </View>

      {/* DATE */}

      <View
        style={{
          backgroundColor: COLORS.black,
          borderRadius: 19,
          padding: 16,
          marginTop: 10,
          borderWidth: 1,
          borderColor: COLORS.border,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <View
            style={{
              width: 32,
              height: 32,
              borderRadius: 10,
              backgroundColor: "rgba(232,80,2,0.09)",
              borderWidth: 1,
              borderColor: "rgba(232,80,2,0.16)",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons
              name="calendar-outline"
              size={16}
              color={COLORS.orange}
            />
          </View>

          <Text
            style={{
              color: COLORS.lightGray,
              fontSize: 9,
              fontWeight: "800",
              marginLeft: 9,
              letterSpacing: 0.9,
            }}
          >
            DATE DE LA SÉANCE
          </Text>
        </View>

        <Text
          style={{
            color: COLORS.white,
            fontSize: 15,
            fontWeight: "900",
            marginTop: 12,
          }}
        >
          {formatDate(selectedWorkout?.date)}
        </Text>

        <Text
          style={{
            color: COLORS.gray,
            fontSize: 11,
            fontWeight: "700",
            marginTop: 4,
          }}
        >
          {formatTime(selectedWorkout?.date)}
        </Text>
      </View>

      {/* ACTIONS */}

      <View
        style={{
          flexDirection: "row",
          gap: 10,
          marginTop: 18,
        }}
      >
        <TouchableOpacity
          onPress={closeWorkoutDetails}
          activeOpacity={0.8}
          style={{
            flex: 1,
            height: 52,
            borderRadius: 17,
            backgroundColor: "rgba(255,255,255,0.04)",
            borderWidth: 1,
            borderColor: COLORS.border,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              color: COLORS.white,
              fontSize: 11,
              fontWeight: "900",
              letterSpacing: 0.8,
            }}
          >
            FERMER
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            if (!selectedWorkout?.id) {
              return;
            }

            handleDeleteWorkout(selectedWorkout.id);
          }}
          activeOpacity={0.8}
          style={{
            flex: 1,
            height: 52,
            borderRadius: 17,
            backgroundColor: "rgba(193,8,1,0.08)",
            borderWidth: 1,
            borderColor: "rgba(193,8,1,0.18)",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "row",
          }}
        >
          <Ionicons
            name="trash-outline"
            size={16}
            color={COLORS.red}
          />

          <Text
            style={{
              color: COLORS.red,
              fontSize: 11,
              fontWeight: "900",
              letterSpacing: 0.7,
              marginLeft: 7,
            }}
          >
            SUPPRIMER
          </Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  </View>
</Modal>

{/* ==================================================
    MODAL — CONFIRMATION SUPPRESSION
================================================== */}

<Modal
  visible={showClearConfirm}
  transparent
  animationType="fade"
  onRequestClose={() =>
    setShowClearConfirm(false)
  }
>
  <View
    style={{
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 24,
      backgroundColor: "rgba(0,0,0,0.76)",
    }}
  >
    <View
      style={{
        width: "100%",
        maxWidth: 390,
        backgroundColor: COLORS.surfaceLight,
        borderRadius: 26,
        borderWidth: 1,
        borderColor: COLORS.border,
        padding: 24,
      }}
    >
      <View
        style={{
          width: 52,
          height: 52,
          borderRadius: 17,
          backgroundColor:
            "rgba(193,8,1,0.08)",
          borderWidth: 1,
          borderColor:
            "rgba(193,8,1,0.18)",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 18,
        }}
      >
        <Ionicons
          name="trash-outline"
          size={24}
          color={COLORS.red}
        />
      </View>

      <Text
        style={{
          color: COLORS.white,
          fontSize: 21,
          fontWeight: "900",
        }}
      >
        Effacer l’historique ?
      </Text>

      <Text
        style={{
          color: COLORS.lightGray,
          fontSize: 13,
          lineHeight: 20,
          marginTop: 8,
        }}
      >
        Toutes tes séances enregistrées seront
        supprimées définitivement.
      </Text>

      <View
        style={{
          flexDirection: "row",
          gap: 10,
          marginTop: 24,
        }}
      >
        <TouchableOpacity
          onPress={() =>
            setShowClearConfirm(false)
          }
          activeOpacity={0.8}
          style={{
            flex: 1,
            height: 50,
            borderRadius: 16,
            backgroundColor:
              "rgba(255,255,255,0.05)",
            borderWidth: 1,
            borderColor: COLORS.border,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              color: COLORS.white,
              fontSize: 13,
              fontWeight: "800",
            }}
          >
            Annuler
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={confirmClearHistory}
          activeOpacity={0.8}
          style={{
            flex: 1,
            height: 50,
            borderRadius: 16,
            backgroundColor: COLORS.red,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              color: "#FFFFFF",
              fontSize: 13,
              fontWeight: "900",
            }}
          >
            Effacer
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
</Modal>

        <Text
          style={{
            color: COLORS.gray,
            fontSize: 10,
            textAlign: "center",
            marginTop: 40,
            letterSpacing: 1,
          }}
        >
          SIDIQ SPORT
        </Text>

        
        <Text
          style={{
            color: COLORS.gray,
            fontSize: 10,
            textAlign: "center",
            marginTop: 5,
          }}
        >
          Discipline. Progression. Constance.
        </Text>
      </ScrollView>
    </View>
  );
}

/*
 * ============================================================
 * STATISTIQUE
 * ============================================================
 */

function HistoryStat({
  value,
  label,
  icon,
  delay = 0,
}) {
  const statOpacity =
    useRef(new Animated.Value(0)).current;

  const statScale =
    useRef(new Animated.Value(0.92)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(statOpacity, {
          toValue: 1,
          duration: 420,
          useNativeDriver: true,
        }),

        Animated.spring(statScale, {
          toValue: 1,
          friction: 7,
          tension: 65,
          useNativeDriver: true,
        }),
      ]).start();
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <Animated.View
      style={{
        flex: 1,
        minHeight: 118,
        backgroundColor: COLORS.surfaceLight,
        borderRadius: 20,
        padding: 15,
        borderWidth: 1,
        borderColor: COLORS.border,
        opacity: statOpacity,
        transform: [
          {
            scale: statScale,
          },
        ],
        overflow: "hidden",
      }}
    >
      {/* Accent supérieur */}
      <View
        style={{
          width: 24,
          height: 3,
          borderRadius: 3,
          backgroundColor: COLORS.orange,
          marginBottom: 14,
        }}
      />

      {/* Icône */}
      <View
        style={{
          width: 32,
          height: 32,
          borderRadius: 11,
          backgroundColor: "rgba(232,80,2,0.10)",
          borderWidth: 1,
          borderColor: "rgba(232,80,2,0.18)",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Ionicons
          name={icon}
          size={16}
          color={COLORS.orange}
        />
      </View>

      {/* Valeur */}
      <Text
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.7}
        style={{
          color: COLORS.white,
          fontSize: 20,
          fontWeight: "900",
          marginTop: 12,
          letterSpacing: -0.4,
        }}
      >
        {value}
      </Text>

      {/* Label */}
      <Text
        numberOfLines={1}
        style={{
          color: COLORS.gray,
          fontSize: 9,
          fontWeight: "800",
          marginTop: 4,
          letterSpacing: 0.6,
          textTransform: "uppercase",
        }}
      >
        {label}
      </Text>
    </Animated.View>
  );
}

/*
 * ============================================================
 * CARTE DE SÉANCE
 * ============================================================
 */

function WorkoutCard({
  workout,
  formatDate,
  formatTime,
  formatDuration,
  onPress,
  onDelete,
  animation,
}) {
  const pressScale =
    useRef(new Animated.Value(1)).current;

  const repetitions =
    Number(workout.repetitions) || 0;

  const handlePressIn = () => {
    Animated.spring(pressScale, {
      toValue: 0.965,
      friction: 8,
      tension: 180,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(pressScale, {
      toValue: 1,
      friction: 7,
      tension: 180,
      useNativeDriver: true,
    }).start();
  };

  return (
    <TouchableOpacity
      activeOpacity={0.82}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={{
        marginBottom: 12,
      }}
    >
      <Animated.View
        style={{
          backgroundColor: COLORS.surfaceLight,
          borderRadius: 22,
          padding: 18,
          borderWidth: 1,
          borderColor: COLORS.border,
          opacity: animation?.opacity,
          transform: [
            {
              translateY: animation?.translateY,
            },
            {
              scale: animation
                ? Animated.multiply(
                    animation.scale,
                    pressScale
                  )
                : pressScale,
            },
          ],
          overflow: "hidden",
        }}
      >
        {/* EN-TÊTE */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <View
            style={{
              width: 48,
              height: 48,
              borderRadius: 16,
              backgroundColor:
                "rgba(232,80,2,0.08)",
              borderWidth: 1,
              borderColor:
                "rgba(232,80,2,0.16)",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons
              name="barbell-outline"
              size={22}
              color={COLORS.orange}
            />
          </View>

          <View
            style={{
              flex: 1,
              marginLeft: 14,
              minWidth: 0,
            }}
          >
            <Text
              numberOfLines={1}
              style={{
                color: COLORS.white,
                fontSize: 16,
                fontWeight: "900",
                letterSpacing: -0.2,
              }}
            >
              {workout.type || "Squats"}
            </Text>

            <Text
              numberOfLines={1}
              style={{
                color: COLORS.gray,
                fontSize: 10,
                fontWeight: "700",
                marginTop: 5,
                letterSpacing: 0.2,
              }}
            >
              {formatDate(workout.date)}
              {" · "}
              {formatTime(workout.date)}
            </Text>
          </View>

          <View
            style={{
              alignItems: "flex-end",
              marginLeft: 10,
            }}
          >
            <Text
              numberOfLines={1}
              style={{
                color: COLORS.orange,
                fontSize: 18,
                fontWeight: "900",
                letterSpacing: -0.4,
              }}
            >
              {repetitions.toLocaleString(
                "fr-FR"
              )}
            </Text>

            <Text
              style={{
                color: COLORS.gray,
                fontSize: 9,
                fontWeight: "800",
                marginTop: 3,
                letterSpacing: 0.5,
                textTransform: "uppercase",
              }}
            >
              Répétitions
            </Text>
          </View>
        </View>

        {/* SÉPARATION */}
        <View
          style={{
            height: 1,
            backgroundColor: COLORS.border,
            marginVertical: 16,
          }}
        />

        {/* DURÉE */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Ionicons
              name="time-outline"
              size={15}
              color={COLORS.gray}
            />

            <Text
              style={{
                color: COLORS.gray,
                fontSize: 10,
                fontWeight: "800",
                marginLeft: 7,
                letterSpacing: 0.4,
                textTransform: "uppercase",
              }}
            >
              Durée
            </Text>
          </View>

          <Text
            style={{
              color: COLORS.white,
              fontSize: 12,
              fontWeight: "900",
            }}
          >
            {formatDuration(
              workout.duration
            )}
          </Text>
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
}