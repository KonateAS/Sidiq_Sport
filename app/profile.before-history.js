import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Animated,
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getWorkoutHistory } from "../lib/workoutStorage";
import { getPremiumStatus } from "../lib/premiumStorage";

const USER_NAME_KEY = "sidiq-sport-user-name";

const COLORS = {
  background: "#080C09",
  card: "#101712",
  cardSoft: "#0D140F",
  primary: "#00FF87",
  primaryDark: "#00D966",
  text: "#F0FFF0",
  muted: "#7A8A7E",
  mutedDark: "#526058",
  border: "rgba(255,255,255,0.07)",
};

export default function ProfileScreen() {
  const router = useRouter();

  const [userName, setUserName] = useState("Sidiq");
  const [draftName, setDraftName] = useState("Sidiq");
  const [editing, setEditing] = useState(false);

  const [isPremium, setIsPremium] = useState(false);

  const [workoutHistory, setWorkoutHistory] = useState([]);
  const [workoutStats, setWorkoutStats] = useState({
    sessions: 0,
    repetitions: 0,
    duration: 0,
    activeDays: 0,
  });

    /*
   * ============================================================
   * ACTIVITÃ‰ DES 7 DERNIERS JOURS
   * ============================================================
   */

  const weeklyData = useMemo(() => {
    const today = new Date();

    const days = Array.from(
      { length: 7 },
      (_, index) => {
        const date = new Date(today);

        date.setHours(0, 0, 0, 0);

        date.setDate(
          today.getDate() - (6 - index)
        );

        return date;
      }
    );

    const values = days.map((day) => {
      const dayKey = day
        .toISOString()
        .split("T")[0];

      const repetitions = workoutHistory
        .filter((workout) => {
          if (!workout.date) {
            return false;
          }

          return (
            new Date(workout.date)
              .toISOString()
              .split("T")[0] === dayKey
          );
        })
        .reduce(
          (total, workout) =>
            total +
            Number(
              workout.repetitions || 0
            ),
          0
        );

      return {
        day: day.toLocaleDateString(
          "fr-FR",
          {
            weekday: "narrow",
          }
        ).toUpperCase(),
        repetitions,
      };
    });

    const maxRepetitions = Math.max(
      ...values.map(
        (item) => item.repetitions
      ),
      1
    );

    return values.map((item) => ({
      day: item.day,
      value:
        item.repetitions === 0
          ? 4
          : Math.max(
              Math.round(
                (item.repetitions /
                  maxRepetitions) *
                  100
              ),
              8
            ),
      repetitions: item.repetitions,
    }));
  }, [workoutHistory]);


    /*
   * ============================================================
   * RÃ‰SUMÃ‰ DE L'ACTIVITÃ‰ HEBDOMADAIRE
   * ============================================================
   */

  const weeklySummary = useMemo(() => {
    const activeDays = weeklyData.filter(
      (item) => item.repetitions > 0
    ).length;

    const totalRepetitions = weeklyData.reduce(
      (total, item) =>
        total + item.repetitions,
      0
    );

    const maxPossibleDays = 7;

    const activityPercent = Math.round(
      (activeDays / maxPossibleDays) * 100
    );

    return {
      activeDays,
      totalRepetitions,
      activityPercent,
    };
  }, [weeklyData]);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.96)).current;

  

  /*
   * ============================================================
   * CHARGEMENT DU NOM
   * ============================================================
   */

  useEffect(() => {
    loadUserName();

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 450,
        useNativeDriver: true,
      }),

      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 70,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const loadUserName = async () => {
    try {
      const storedName =
        await AsyncStorage.getItem(USER_NAME_KEY);

      if (storedName && storedName.trim()) {
        const cleanName = storedName.trim();

        setUserName(cleanName);
        setDraftName(cleanName);
      }
    } catch (error) {
      console.log(
        "Impossible de rÃ©cupÃ©rer le prÃ©nom :",
        error
      );
    }
  };

  /*
 * ============================================================
 * CHARGEMENT DE L'HISTORIQUE DES SÃ‰ANCES
 * ============================================================
 */

useEffect(() => {
  const loadWorkoutHistory = async () => {
    try {
      const history = await getWorkoutHistory();

      setWorkoutHistory(history);

      const sessions = history.length;

      const repetitions = history.reduce(
        (total, workout) =>
          total + Number(workout.repetitions || 0),
        0
      );

      const duration = history.reduce(
        (total, workout) =>
          total + Number(workout.duration || 0),
        0
      );

      const uniqueDays = new Set(
        history.map((workout) =>
          new Date(workout.date).toISOString().split("T")[0]
        )
      );

      setWorkoutStats({
        sessions,
        repetitions,
        duration,
        activeDays: uniqueDays.size,
      });
    } catch (error) {
      console.log(
        "Impossible de charger l'historique :",
        error
      );
    }
  };

  loadWorkoutHistory();

  const loadPremiumStatus = async () => {
    try {
      const premium = await getPremiumStatus();

      setIsPremium(premium);
    } catch (error) {
      console.log(
        "Impossible de charger le statut Premium :",
        error
      );
    }
  };

  loadPremiumStatus();
}, []);

  /*
   * ============================================================
   * SAUVEGARDE DU NOM
   * ============================================================
   */

  const saveName = async () => {
    const cleanName = draftName.trim();

    if (!cleanName) {
      setDraftName(userName);
      setEditing(false);
      return;
    }

    try {
      await AsyncStorage.setItem(
        USER_NAME_KEY,
        cleanName
      );

      setUserName(cleanName);
      setDraftName(cleanName);
      setEditing(false);
    } catch (error) {
      console.log(
        "Impossible de sauvegarder le prÃ©nom :",
        error
      );
    }
  };

  /*
   * ============================================================
   * INITIAL
   * ============================================================
   */

  const initial =
    userName.charAt(0).toUpperCase() || "S";

  /*
   * ============================================================
   * NIVEAU
   * ============================================================
   */

  /*
   * ============================================================
   * PROGRESSION XP
   * ============================================================
   */

  const totalXP = workoutHistory.reduce(
    (total, workout) => {
      const repetitions = Number(
        workout.repetitions || 0
      );

      const durationSeconds = Number(
        workout.duration || 0
      );

      const durationMinutes = Math.floor(
        durationSeconds / 60
      );

      return (
        total +
        repetitions +
        durationMinutes * 2
      );
    },
    0
  );

  const level = Math.floor(
    totalXP / 1000
  ) + 1;

  const levelNames = [
    "DEBUTANT",
    "REGULIER",
    "DISCIPLINE",
    "ATHLETE",
    "GUERRIER",
    "VETERAN",
    "ELITE",
  ];

  const levelName =
    levelNames[
      Math.min(
        level - 1,
        levelNames.length - 1
      )
    ];

  const currentXP =
    totalXP % 1000;

  const nextXP = 1000;

  const levelProgress =
    currentXP / nextXP;

  return (
    <KeyboardAvoidingView
      style={{
        flex: 1,
        backgroundColor: COLORS.background,
      }}
      behavior={
        Platform.OS === "ios"
          ? "padding"
          : undefined
      }
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{
          flex: 1,
          backgroundColor: COLORS.background,
        }}
        contentContainerStyle={{
          paddingBottom: 120,
        }}
      >
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [
              {
                scale: scaleAnim,
              },
            ],
          }}
        >
          {/* ==================================================
              HEADER
          ================================================== */}

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
                backgroundColor: COLORS.card,
                borderWidth: 1,
                borderColor: COLORS.border,
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
                alignItems: "center",
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
                  fontSize: 17,
                  fontWeight: "800",
                  marginTop: 3,
                }}
              >
                Profil
              </Text>
            </View>

            <View
              style={{
                width: 46,
                height: 46,
              }}
            />
          </View>

          {/* ==================================================
              IDENTITÃ‰
          ================================================== */}

          <View
            style={{
              alignItems: "center",
              paddingHorizontal: 24,
              marginTop: 34,
            }}
          >
            <View
              style={{
                width: 100,
                height: 100,
                borderRadius: 34,
                backgroundColor: "#122018",
                borderWidth: 1,
                borderColor:
                  "rgba(0,255,135,0.30)",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <LinearGradient
                colors={[
                  "rgba(0,255,135,0.18)",
                  "rgba(0,217,102,0.05)",
                ]}
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  top: 0,
                  bottom: 0,
                  borderRadius: 34,
                }}
              />

              <Text
                style={{
                  color: COLORS.primary,
                  fontSize: 40,
                  fontWeight: "900",
                }}
              >
                {initial}
              </Text>
            </View>

            {editing ? (
              <View
                style={{
                  width: "100%",
                  marginTop: 20,
                }}
              >
                <TextInput
                  value={draftName}
                  onChangeText={setDraftName}
                  autoFocus
                  maxLength={24}
                  placeholder="Ton prÃ©nom"
                  placeholderTextColor={
                    COLORS.mutedDark
                  }
                  style={{
                    backgroundColor: COLORS.card,
                    borderWidth: 1,
                    borderColor:
                      "rgba(0,255,135,0.35)",
                    borderRadius: 16,
                    paddingHorizontal: 18,
                    paddingVertical: 15,
                    color: COLORS.text,
                    fontSize: 17,
                    fontWeight: "700",
                    textAlign: "center",
                  }}
                  onSubmitEditing={saveName}
                  returnKeyType="done"
                />

                <View
                  style={{
                    flexDirection: "row",
                    gap: 10,
                    marginTop: 10,
                  }}
                >
                  <TouchableOpacity
                    onPress={() => {
                      setDraftName(userName);
                      setEditing(false);
                    }}
                    activeOpacity={0.7}
                    style={{
                      flex: 1,
                      paddingVertical: 13,
                      borderRadius: 14,
                      backgroundColor:
                        COLORS.cardSoft,
                      borderWidth: 1,
                      borderColor:
                        COLORS.border,
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        color: COLORS.muted,
                        fontWeight: "800",
                      }}
                    >
                      Annuler
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={saveName}
                    activeOpacity={0.8}
                    style={{
                      flex: 1,
                      borderRadius: 14,
                      overflow: "hidden",
                    }}
                  >
                    <LinearGradient
                      colors={[
                        COLORS.primary,
                        COLORS.primaryDark,
                      ]}
                      style={{
                        paddingVertical: 13,
                        alignItems: "center",
                      }}
                    >
                      <Text
                        style={{
                          color: "#071009",
                          fontWeight: "900",
                        }}
                      >
                        Enregistrer
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <>
                <Text
                  style={{
                    color: COLORS.text,
                    fontSize: 30,
                    fontWeight: "900",
                    marginTop: 18,
                  }}
                >
                  {userName}
                </Text>

                <Text
                  style={{
                    color: COLORS.muted,
                    fontSize: 13,
                    marginTop: 5,
                  }}
                >
                  Membre SIDIQ SPORT
                </Text>

                <TouchableOpacity
                  onPress={() => {
                    setDraftName(userName);
                    setEditing(true);
                  }}
                  activeOpacity={0.7}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginTop: 16,
                    paddingVertical: 9,
                    paddingHorizontal: 14,
                    borderRadius: 12,
                    backgroundColor: COLORS.card,
                    borderWidth: 1,
                    borderColor: COLORS.border,
                  }}
                >
                  <Ionicons
                    name="create-outline"
                    size={15}
                    color={COLORS.primary}
                  />

                  <Text
                    style={{
                      color: COLORS.primary,
                      fontSize: 12,
                      fontWeight: "800",
                      marginLeft: 7,
                    }}
                  >
                    Modifier le prÃ©nom
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>

          {/* ==================================================
              NIVEAU
          ================================================== */}

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
              start={{
                x: 0,
                y: 0,
              }}
              end={{
                x: 1,
                y: 1,
              }}
              style={{
                borderRadius: 24,
                padding: 22,
                borderWidth: 1,
                borderColor:
                  "rgba(0,255,135,0.20)",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent:
                    "space-between",
                  alignItems: "center",
                }}
              >
                <View>
                  <Text
                    style={{
                      color: COLORS.muted,
                      fontSize: 10,
                      fontWeight: "900",
                      letterSpacing: 2,
                    }}
                  >
                    NIVEAU {level}
                  </Text>

                  <Text
                    style={{
                      color: COLORS.text,
                      fontSize: 25,
                      fontWeight: "900",
                      marginTop: 5,
                    }}
                  >
                    {levelName}
                  </Text>
                </View>

                <View
                  style={{
                    width: 54,
                    height: 54,
                    borderRadius: 18,
                    backgroundColor:
                      "rgba(0,255,135,0.10)",
                    borderWidth: 1,
                    borderColor:
                      "rgba(0,255,135,0.25)",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{
                      color: COLORS.primary,
                      fontSize: 18,
                      fontWeight: "900",
                    }}
                  >
                    {level}
                  </Text>
                </View>
              </View>

              <View
                style={{
                  height: 7,
                  borderRadius: 999,
                  backgroundColor: "#17221B",
                  overflow: "hidden",
                  marginTop: 20,
                }}
              >
                <View
                  style={{
                    height: "100%",
                    width: `${
                      levelProgress * 100
                    }%`,
                    backgroundColor:
                      COLORS.primary,
                    borderRadius: 999,
                  }}
                />
              </View>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent:
                    "space-between",
                  marginTop: 8,
                }}
              >
                <Text
                  style={{
                    color: COLORS.muted,
                    fontSize: 11,
                  }}
                >
                  {currentXP} XP
                </Text>

                <Text
                  style={{
                    color: COLORS.muted,
                    fontSize: 11,
                  }}
                >
                  {nextXP} XP
                </Text>
              </View>
            </LinearGradient>
          </View>

          {/* ==================================================
              STATISTIQUES
          ================================================== */}

          <View
            style={{
              paddingHorizontal: 24,
              marginTop: 30,
            }}
          >
            <Text
              style={{
                color: COLORS.text,
                fontSize: 21,
                fontWeight: "900",
              }}
            >
              Statistiques
            </Text>

            <Text
              style={{
                color: COLORS.muted,
                fontSize: 13,
                marginTop: 4,
              }}
            >
              Ta progression sur les derniÃ¨res sÃ©ances
            </Text>

            <View
              style={{
                flexDirection: "row",
                gap: 10,
                marginTop: 18,
              }}
            >
              <StatBox
  value={String(workoutStats.sessions)}
  label="SÃ©ances"
  icon="barbell-outline"
/>

<StatBox
  value={workoutStats.repetitions.toLocaleString("fr-FR")}
  label="RÃ©pÃ©titions"
  icon="repeat-outline"
/>
            </View>

            <View
              style={{
                flexDirection: "row",
                gap: 10,
                marginTop: 10,
              }}
            >
              <StatBox
  value={`${Math.floor(workoutStats.duration / 3600)} h`}
  label="Temps actif"
  icon="time-outline"
/>

<StatBox
  value={String(workoutStats.activeDays)}
  label="Jours actifs"
  icon="calendar-outline"
/>
            </View>
          </View>

          {/* ==================================================
              ACTIVITÃ‰ HEBDOMADAIRE
          ================================================== */}

          <View
            style={{
              marginHorizontal: 24,
              marginTop: 30,
              backgroundColor: COLORS.card,
              borderRadius: 24,
              padding: 22,
              borderWidth: 1,
              borderColor: COLORS.border,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent:
                  "space-between",
                alignItems: "center",
              }}
            >
              <View>
                <Text
                  style={{
                    color: COLORS.text,
                    fontSize: 18,
                    fontWeight: "900",
                  }}
                >
                  ActivitÃ©
                </Text>

                <Text
                  style={{
                    color: COLORS.muted,
                    fontSize: 12,
                    marginTop: 4,
                  }}
                >
                Cette semaine
                </Text>
              </View>

              <Text
                style={{
                  color: COLORS.primary,
                  fontSize: 13,
                  fontWeight: "900",
                }}
              >
                {weeklySummary.activityPercent} %
              </Text>
            </View>

            {/* BARRES */}

            <View
              style={{
                height: 150,
                flexDirection: "row",
                alignItems: "flex-end",
                justifyContent:
                  "space-between",
                marginTop: 24,
              }}
            >
              {weeklyData.map((item, index) => (
                <View
                  key={index}
                  style={{
                    alignItems: "center",
                    flex: 1,
                  }}
                >
                  <View
                    style={{
                      width: 22,
                      height: 112,
                      justifyContent:
                        "flex-end",
                      backgroundColor:
                        "#141E17",
                      borderRadius: 8,
                      overflow: "hidden",
                    }}
                  >
                    <View
                      style={{
                        width: "100%",
                        height: `${item.value}%`,
                        backgroundColor:
                          index === 5
                            ? COLORS.primary
                            : "#31513E",
                        borderRadius: 8,
                      }}
                    />
                  </View>

                  <Text
                    style={{
                      color:
                        index === 5
                          ? COLORS.primary
                          : COLORS.muted,
                      fontSize: 10,
                      fontWeight: "800",
                      marginTop: 8,
                    }}
                  >
                    {item.day}
                  </Text>
                </View>
              ))}
            </View>
          </View>
          {/* ==================================================
              PREMIUM
          ================================================== */}

          <TouchableOpacity
            activeOpacity={0.88}
            onPress={() => router.push("/premium")}
            style={{
              marginHorizontal: 24,
              marginTop: 30,
            }}
          >
            <LinearGradient
              colors={
                isPremium
                  ? ["#12351F", "#0B1510"]
                  : ["#151515", "#0B0B0B"]
              }
              start={{
                x: 0,
                y: 0,
              }}
              end={{
                x: 1,
                y: 1,
              }}
              style={{
                borderRadius: 24,
                padding: 22,
                borderWidth: 1,
                borderColor: isPremium
                  ? "rgba(0,255,135,0.30)"
                  : COLORS.border,
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
                    backgroundColor: isPremium
                      ? "rgba(0,255,135,0.12)"
                      : "#1A1A1A",
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: 14,
                  }}
                >
                  <Ionicons
                    name={
                      isPremium
                        ? "diamond"
                        : "diamond-outline"
                    }
                    size={23}
                    color={
                      isPremium
                        ? COLORS.primary
                        : COLORS.muted
                    }
                  />
                </View>

                <View
                  style={{
                    flex: 1,
                  }}
                >
                  <Text
                    style={{
                      color: isPremium
                        ? COLORS.primary
                        : COLORS.text,
                      fontSize: 11,
                      fontWeight: "900",
                      letterSpacing: 1.5,
                    }}
                  >
                    {isPremium
                      ? "SIDIQ SPORT PREMIUM"
                      : "SIDIQ SPORT"}
                  </Text>

                  <Text
                    style={{
                      color: COLORS.text,
                      fontSize: 18,
                      fontWeight: "900",
                      marginTop: 5,
                    }}
                  >
                    {isPremium
                      ? "Accès Premium actif"
                      : "Passe au niveau supérieur"}
                  </Text>

                  <Text
                    style={{
                      color: COLORS.muted,
                      fontSize: 12,
                      marginTop: 5,
                      lineHeight: 18,
                    }}
                  >
                    {isPremium
                      ? "Ton abonnement Premium est actif."
                      : "Débloque les fonctionnalités Premium."}
                  </Text>
                </View>

                <View
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: 14,
                    backgroundColor: isPremium
                      ? "rgba(0,255,135,0.10)"
                      : "#171717",
                    alignItems: "center",
                    justifyContent: "center",
                    marginLeft: 12,
                  }}
                >
                  <Ionicons
                    name={
                      isPremium
                        ? "checkmark"
                        : "chevron-forward"
                    }
                    size={20}
                    color={
                      isPremium
                        ? COLORS.primary
                        : COLORS.text
                    }
                  />
                </View>
              </View>
            </LinearGradient>
          </TouchableOpacity>


          {/* ==================================================
              RÃ‰GULARITÃ‰
          ================================================== */}

          <View
            style={{
              marginHorizontal: 24,
              marginTop: 14,
              backgroundColor: COLORS.card,
              borderRadius: 24,
              padding: 22,
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
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ionicons
                  name="trending-up-outline"
                  size={23}
                  color={COLORS.primary}
                />
              </View>

              <View
                style={{
                  marginLeft: 14,
                  flex: 1,
                }}
              >
                <Text
                  style={{
                    color: COLORS.text,
                    fontSize: 16,
                    fontWeight: "900",
                  }}
                >
                  Bonne rÃ©gularitÃ©
                </Text>

                <Text
                  style={{
                    color: COLORS.muted,
                    fontSize: 12,
                    marginTop: 3,
                  }}
                >
                  {weeklySummary.activeDays}{" "}
{weeklySummary.activeDays > 1
  ? "jours"
  : "jour"} actifs cette semaine
                </Text>
              </View>

              <Text
                style={{
                  color: COLORS.primary,
                  fontSize: 18,
                  fontWeight: "900",
                }}
              >
                {weeklySummary.activityPercent} %
              </Text>
            </View>
          </View>

          {/* ==================================================
              OBJECTIF
          ================================================== */}

          <View
            style={{
              marginHorizontal: 24,
              marginTop: 14,
              backgroundColor: COLORS.card,
              borderRadius: 24,
              padding: 22,
              borderWidth: 1,
              borderColor: COLORS.border,
            }}
          >
            <Text
              style={{
                color: COLORS.muted,
                fontSize: 10,
                fontWeight: "900",
                letterSpacing: 2,
              }}
            >
              OBJECTIF ACTUEL
            </Text>

            <Text
              style={{
                color: COLORS.text,
                fontSize: 22,
                fontWeight: "900",
                marginTop: 7,
              }}
            >
              Construire une routine solide
            </Text>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 18,
              }}
            >
              <View
                style={{
                  flex: 1,
                  height: 8,
                  borderRadius: 999,
                  backgroundColor:
                    "#18221B",
                  overflow: "hidden",
                }}
              >
                <View
                  style={{
                    width: "72%",
                    height: "100%",
                    backgroundColor:
                      COLORS.primary,
                    borderRadius: 999,
                  }}
                />
              </View>

              <Text
                style={{
                  color: COLORS.primary,
                  fontSize: 12,
                  fontWeight: "900",
                  marginLeft: 12,
                }}
              >
                78 %
              </Text>
            </View>
          </View>

          {/* ==================================================
              PIED DE PAGE
          ================================================== */}

          <Text
            style={{
              color: COLORS.mutedDark,
              fontSize: 10,
              textAlign: "center",
              marginTop: 34,
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
        </Animated.View>
      </ScrollView>

      {/* ======================================================
          NAVIGATION BASSE
      ====================================================== */}

      <View
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 82,
          backgroundColor: "#0D140F",
          borderTopWidth: 1,
          borderTopColor:
            "rgba(255,255,255,0.06)",
          flexDirection: "row",
          justifyContent: "space-around",
          alignItems: "center",
          paddingBottom: Platform.OS === "ios" ? 10 : 0,
        }}
      >
        <BottomTab
          icon="home-outline"
          label="Accueil"
          onPress={() => router.replace("/")}
        />

        <BottomTab
          icon="stats-chart-outline"
          label="ActivitÃ©"
          active
        />

        <BottomTab
          icon="barbell-outline"
          label="SÃ©ances"
          onPress={() =>
            router.push("/workout")
          }
        />

        <BottomTab
          icon="person"
          label="Profil"
          active
        />
      </View>
    </KeyboardAvoidingView>
  );
}

/*
 * ============================================================
 * STAT BOX
 * ============================================================
 */

function StatBox({
  value,
  label,
  icon,
}) {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: COLORS.card,
        borderRadius: 20,
        padding: 17,
        borderWidth: 1,
        borderColor: COLORS.border,
      }}
    >
      <Ionicons
        name={icon}
        size={19}
        color={COLORS.primary}
      />

      <Text
        style={{
          color: COLORS.text,
          fontSize: 23,
          fontWeight: "900",
          marginTop: 12,
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
 * BOTTOM TAB
 * ============================================================
 */

function BottomTab({
  icon,
  label,
  active = false,
  onPress,
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={{
        alignItems: "center",
        justifyContent: "center",
        minWidth: 65,
      }}
    >
      <Ionicons
        name={icon}
        size={22}
        color={
          active
            ? COLORS.primary
            : COLORS.muted
        }
      />

      <Text
        style={{
          color: active
            ? COLORS.primary
            : COLORS.muted,
          fontSize: 10,
          fontWeight: active
            ? "800"
            : "600",
          marginTop: 5,
        }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}






