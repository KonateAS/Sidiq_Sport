import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
   Alert,
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";

import {
  getWorkoutHistory,
  clearWorkoutHistory,
} from "../lib/workoutStorage";

/*
 * ============================================================
 * COULEURS
 * ============================================================
 */

const COLORS = {
  background: "#080C09",
  card: "#101410",
  cardSoft: "#111511",
  border: "#1D241F",
  text: "#FFFFFF",
  muted: "#7F8781",
  mutedDark: "#454C47",
  primary: "#00FF87",
  primaryDark: "#00D966",
};

/*
 * ============================================================
 * Ã‰CRAN HISTORIQUE
 * ============================================================
 */

export default function HistoryScreen() {
  const router = useRouter();

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

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
   * l'Ã©cran redevient actif.
   *
   * Important :
   * aprÃ¨s une sÃ©ance terminÃ©e, si l'utilisateur
   * revient ici, la nouvelle sÃ©ance apparaÃ®t
   * immÃ©diatement.
   */

  useFocusEffect(
    useCallback(() => {
      loadHistory();
    }, [loadHistory])
  );

  /*
   * ============================================================
   * EFFACER L'HISTORIQUE
   * ============================================================
   */

  const handleClearHistory = () => {
    if (history.length === 0) {
      return;
    }

    Alert.alert(
      "Effacer l'historique ?",
      "Toutes tes séances enregistrées seront supprimées définitivement.",
      [
        {
          text: "Annuler",
          style: "cancel",
        },
        {
          text: "Effacer",
          style: "destructive",
          onPress: async () => {
            try {
              await clearWorkoutHistory();
              setHistory([]);
            } catch (error) {
              console.log(
                "Impossible d'effacer l'historique :",
                error
              );

              Alert.alert(
                "Erreur",
                "Impossible d'effacer l'historique."
              );
            }
          },
        },
      ]
    );
  };

  /*
   * ============================================================
   * FORMAT DURÃ‰E
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
          COLORS.background,
      }}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 50,
        }}
      >
        {/* ==================================================
            HEADER
        ================================================== */}

        <View
          style={{
            paddingTop: 58,
            paddingHorizontal: 24,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            onPress={() => router.back()}
            activeOpacity={0.7}
            style={{
              width: 46,
              height: 46,
              borderRadius: 15,
              backgroundColor:
                COLORS.cardSoft,
              borderWidth: 1,
              borderColor:
                COLORS.border,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons
              name="chevron-back"
              size={23}
              color={COLORS.text}
            />
          </TouchableOpacity>

          <View
            style={{
              flex: 1,
              alignItems: "center",
              marginRight: 46,
            }}
          >
            <Text
              style={{
                color: COLORS.primary,
                fontSize: 10,
                fontWeight: "900",
                letterSpacing: 2,
              }}
            >
              SIDIQ SPORT
            </Text>

            <Text
              style={{
                color: COLORS.text,
                fontSize: 20,
                fontWeight: "900",
                marginTop: 4,
              }}
            >
              Historique
            </Text>
          </View>
        </View>

        {/* ==================================================
            INTRODUCTION
        ================================================== */}

        <View
          style={{
            marginHorizontal: 24,
            marginTop: 30,
          }}
        >
          <Text
            style={{
              color: COLORS.text,
              fontSize: 28,
              fontWeight: "900",
              letterSpacing: -0.8,
            }}
          >
            Tes sÃ©ances.
          </Text>

          <Text
            style={{
              color: COLORS.muted,
              fontSize: 14,
              lineHeight: 21,
              marginTop: 6,
            }}
          >
            Chaque sÃ©ance compte. Consulte ici
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
                label="SÃ©ances"
                icon="barbell-outline"
              />

              <HistoryStat
                value={totalRepetitions.toLocaleString(
                  "fr-FR"
                )}
                label="RÃ©pÃ©titions"
                icon="repeat-outline"
              />

              <HistoryStat
                value={formatDuration(
                  totalDuration
                )}
                label="Temps"
                icon="time-outline"
              />
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
              color={COLORS.primary}
            />

            <Text
              style={{
                color: COLORS.muted,
                fontSize: 12,
                marginTop: 14,
              }}
            >
              Chargement de tes sÃ©ances...
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
                  "#12261A",
                  "#0D1510",
                ]}
                style={{
                  borderRadius: 28,
                  padding: 28,
                  borderWidth: 1,
                  borderColor:
                    "rgba(0,255,135,0.18)",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    width: 70,
                    height: 70,
                    borderRadius: 24,
                    backgroundColor:
                      "rgba(0,255,135,0.08)",
                    borderWidth: 1,
                    borderColor:
                      "rgba(0,255,135,0.18)",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Ionicons
                    name="barbell-outline"
                    size={32}
                    color={COLORS.primary}
                  />
                </View>

                <Text
                  style={{
                    color: COLORS.text,
                    fontSize: 21,
                    fontWeight: "900",
                    marginTop: 20,
                    textAlign: "center",
                  }}
                >
                  Aucune sÃ©ance
                </Text>

                <Text
                  style={{
                    color: COLORS.muted,
                    fontSize: 13,
                    lineHeight: 20,
                    marginTop: 7,
                    textAlign: "center",
                  }}
                >
                  Tes prochaines sÃ©ances
                  apparaÃ®tront ici.
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
                      COLORS.primary,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{
                      color: "#041009",
                      fontSize: 14,
                      fontWeight: "900",
                    }}
                  >
                    Commencer une sÃ©ance
                  </Text>
                </TouchableOpacity>
              </LinearGradient>
            </View>
          )}

        {/* ==================================================
            LISTE DES SÃ‰ANCES
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
                  justifyContent:
                    "space-between",
                  marginBottom: 16,
                }}
              >
                <View>
                  <Text
                    style={{
                      color: COLORS.text,
                      fontSize: 21,
                      fontWeight: "900",
                    }}
                  >
                    Tes sÃ©ances
                  </Text>

                  <Text
                    style={{
                      color: COLORS.muted,
                      fontSize: 12,
                      marginTop: 4,
                    }}
                  >
                    Les plus rÃ©centes en premier
                  </Text>
                </View>

                <View
                  style={{
                    paddingHorizontal: 11,
                    paddingVertical: 7,
                    borderRadius: 12,
                    backgroundColor:
                      "rgba(0,255,135,0.08)",
                    borderWidth: 1,
                    borderColor:
                      "rgba(0,255,135,0.15)",
                  }}
                >
                  <Text
                    style={{
                      color: COLORS.primary,
                      fontSize: 11,
                      fontWeight: "900",
                    }}
                  >
                    {history.length}
                  </Text>
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
                    formatDuration={
                      formatDuration
                    }
                  />
                )
              )}
            </View>
          )}

        {/* ==================================================
            FOOTER
        ================================================== */}

        <Text
          style={{
            color: COLORS.mutedDark,
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
            color: COLORS.mutedDark,
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
}) {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: COLORS.card,
        borderRadius: 18,
        padding: 14,
        borderWidth: 1,
        borderColor: COLORS.border,
      }}
    >
      <Ionicons
        name={icon}
        size={18}
        color={COLORS.primary}
      />

      <Text
        numberOfLines={1}
        adjustsFontSizeToFit
        style={{
          color: COLORS.text,
          fontSize: 17,
          fontWeight: "900",
          marginTop: 10,
        }}
      >
        {value}
      </Text>

      <Text
        style={{
          color: COLORS.muted,
          fontSize: 10,
          marginTop: 3,
        }}
      >
        {label}
      </Text>
    </View>
  );
}

/*
 * ============================================================
 * CARTE DE SÃ‰ANCE
 * ============================================================
 */

function WorkoutCard({
  workout,
  formatDate,
  formatTime,
  formatDuration,
}) {
  const repetitions =
    Number(workout.repetitions) || 0;

  return (
    <View
      style={{
        backgroundColor: COLORS.card,
        borderRadius: 22,
        padding: 18,
        marginBottom: 12,
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
            width: 48,
            height: 48,
            borderRadius: 16,
            backgroundColor:
              "rgba(0,255,135,0.08)",
            borderWidth: 1,
            borderColor:
              "rgba(0,255,135,0.12)",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons
            name="barbell-outline"
            size={23}
            color={COLORS.primary}
          />
        </View>

        <View
          style={{
            flex: 1,
            marginLeft: 14,
          }}
        >
          <Text
            style={{
              color: COLORS.text,
              fontSize: 16,
              fontWeight: "900",
            }}
          >
            {workout.type || "Squats"}
          </Text>

          <Text
            style={{
              color: COLORS.muted,
              fontSize: 11,
              marginTop: 4,
            }}
          >
            {formatDate(workout.date)}
            {" Â· "}
            {formatTime(workout.date)}
          </Text>
        </View>

        <View
          style={{
            alignItems: "flex-end",
          }}
        >
          <Text
            style={{
              color: COLORS.primary,
              fontSize: 17,
              fontWeight: "900",
            }}
          >
            {repetitions.toLocaleString(
              "fr-FR"
            )}
          </Text>

          <Text
            style={{
              color: COLORS.muted,
              fontSize: 10,
              marginTop: 2,
            }}
          >
            rÃ©pÃ©titions
          </Text>
        </View>
      </View>

      <View
        style={{
          height: 1,
          backgroundColor: COLORS.border,
          marginVertical: 16,
        }}
      />

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent:
            "space-between",
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
            color={COLORS.muted}
          />

          <Text
            style={{
              color: COLORS.muted,
              fontSize: 11,
              marginLeft: 6,
            }}
          >
            DurÃ©e
          </Text>
        </View>

        <Text
          style={{
            color: COLORS.text,
            fontSize: 12,
            fontWeight: "800",
          }}
        >
          {formatDuration(
            workout.duration
          )}
        </Text>
      </View>
    </View>
  );
}

