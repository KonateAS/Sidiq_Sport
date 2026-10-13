import { WORKOUT_LIST } from "../lib/workoutTypes";
import { getWorkoutHistory } from "../lib/workoutStorage";
import { getPremiumStatus } from "../lib/premiumStorage";
import { getProgression } from "../lib/progression";

import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withRepeat,
  withSequence,
} from "react-native-reanimated";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

import StatCard from "../components/StatCard";
import StreakBadge from "../components/StreakBadge";
import { motivationalQuotes } from "../lib/quotes";
import heroAthlete from "../assets/images/hero-athlete.png";
import GlowBorder from "../components/GlowBorder";
import FadeInView from "../components/FadeInView";
import PressableScale from "../components/PressableScale";

const USER_NAME_KEY = "sidiq-sport-user-name";

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

export default function HomeScreen() {
  const router = useRouter();

  const [quote, setQuote] = useState("");
  const [userName, setUserName] = useState("Sidiq");
  const [disciplinesOpen, setDisciplinesOpen] = useState(false);
  const [todayHistory, setTodayHistory] = useState([]);
  const [progression, setProgression] = useState(getProgression([]));
  const navIndicator = useSharedValue(0);
  const workoutIconPulse = useSharedValue(1);
  const progressionXP = useSharedValue(0);
  const progressionLevel = useSharedValue(0);
  const progressionCardAnimation = useSharedValue(0);
  const startButtonGlow = useSharedValue(0.35);
  const startButtonShine = useSharedValue(-1);
  const disciplinesAnimation = useSharedValue(0);
  const disciplinesChevron = useSharedValue(0);
  const heroImageOpacity = useSharedValue(0);
  const heroImageScale = useSharedValue(1.08);
  const heroImageY = useSharedValue(18);
  const heroImageFloat = useSharedValue(0);

  useEffect(() => {
    loadUserName();
    loadTodayHistory();

    progressionLevel.value = withTiming(1, {
      duration: 700,
    });

    progressionCardAnimation.value = withTiming(1, {
      duration: 700,
    });

    heroImageOpacity.value = withTiming(1, {
      duration: 1000,
    });

    heroImageScale.value = withTiming(1, {
      duration: 1200,
    });

    heroImageY.value = withTiming(0, {
      duration: 1000,
    });

    workoutIconPulse.value = withRepeat(
      withSequence(
        withTiming(1.06, { duration: 900 }),
        withTiming(1, { duration: 900 }),
      ),
      -1,
      true,
    );

    heroImageFloat.value = withRepeat(
      withSequence(
        withTiming(-5, {
          duration: 2200,
        }),
        withTiming(5, {
          duration: 2200,
        }),
      ),
      -1,
      true,
    );

    navIndicator.value = withTiming(1, {
      duration: 600,
    });

    startButtonGlow.value = withRepeat(
      withSequence(
        withTiming(1, {
          duration: 1200,
        }),
        withTiming(0.35, {
          duration: 1200,
        }),
      ),
      -1,
      true,
    );

    startButtonShine.value = withRepeat(
      withSequence(
        withTiming(1, {
          duration: 1100,
        }),
        withTiming(-1, {
          duration: 0,
        }),
        withTiming(-1, {
          duration: 1800,
        }),
      ),
      -1,
      false,
    );

    const randomQuote =
      motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];

    setQuote(randomQuote);
  }, []);

  useEffect(() => {
    progressionXP.value = withTiming(progression.levelProgress, {
      duration: 1200,
    });
  }, [progression.levelProgress]);

  const loadTodayHistory = async () => {
    try {
      const history = await getWorkoutHistory();
      setProgression(getProgression(history));

      const now = new Date();

      const todayHistory = history.filter((workout) => {
        if (!workout?.date) {
          return false;
        }

        const workoutDate = new Date(workout.date);

        return (
          workoutDate.getFullYear() === now.getFullYear() &&
          workoutDate.getMonth() === now.getMonth() &&
          workoutDate.getDate() === now.getDate()
        );
      });

      setTodayHistory(todayHistory);
    } catch (error) {
      console.log("Impossible de récupérer les séances du jour :", error);

      setTodayHistory([]);
    }
  };

  const loadUserName = async () => {
    try {
      const storedName = await AsyncStorage.getItem(USER_NAME_KEY);

      if (storedName && storedName.trim()) {
        setUserName(storedName.trim());
      }
    } catch (error) {
      console.log("Impossible de récupérer le prénom :", error);
    }
  };

  const navIndicatorStyle = useAnimatedStyle(() => ({
    opacity: navIndicator.value,
    transform: [
      {
        scaleX: navIndicator.value,
      },
    ],
  }));

  const todaySessions = todayHistory.length;

  const todayRepetitions = todayHistory.reduce((total, workout) => {
    if (workout?.sets != null) {
      return (
        total +
        (Number(workout.sets) || 0) * (Number(workout.repetitionsPerSet) || 0)
      );
    }

    if (workout?.repetitions != null) {
      return total + (Number(workout.repetitions) || 0);
    }

    return total;
  }, 0);

  const todayDistance = todayHistory.reduce(
    (total, workout) => total + (Number(workout.distance) || 0),
    0,
  );

  const todayDuration = todayHistory.reduce(
    (total, workout) => total + (Number(workout.duration) || 0),
    0,
  );

  const todayMinutes = Math.floor(todayDuration / 60);

  const progressionFillStyle = useAnimatedStyle(() => ({
    width: `${progressionXP.value * 100}%`,
  }));

  const progressionLevelStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: 0.85 + progressionLevel.value * 0.15,
      },
    ],
    opacity: progressionLevel.value,
  }));

  const progressionCardStyle = useAnimatedStyle(() => ({
    opacity: progressionCardAnimation.value,
    transform: [
      {
        translateY: 12 - progressionCardAnimation.value * 12,
      },
      {
        scale: 0.97 + progressionCardAnimation.value * 0.03,
      },
    ],
  }));

  const heroImageStyle = useAnimatedStyle(() => ({
    opacity: heroImageOpacity.value,
    transform: [
      {
        translateY: heroImageY.value + heroImageFloat.value,
      },
      {
        scale: heroImageScale.value,
      },
    ],
  }));

  const startButtonGlowStyle = useAnimatedStyle(() => ({
    opacity: 0.35 + startButtonGlow.value * 0.35,
    transform: [
      {
        scale: 0.96 + startButtonGlow.value * 0.04,
      },
    ],
  }));

  const startButtonShineStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: startButtonShine.value * 180,
      },
      {
        skewX: "-20deg",
      },
    ],
    opacity: startButtonShine.value > -0.8 ? 0.22 : 0,
  }));

  const disciplinesAnimatedStyle = useAnimatedStyle(() => ({
    opacity: disciplinesAnimation.value,
    transform: [
      {
        translateY: withTiming(disciplinesAnimation.value === 1 ? 0 : -8, {
          duration: 220,
        }),
      },
    ],
  }));

  const disciplinesChevronStyle = useAnimatedStyle(() => ({
    transform: [
      {
        rotate: `${disciplinesChevron.value * 180}deg`,
      },
    ],
  }));

  const workoutIconPulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: workoutIconPulse.value }],
  }));

  return (
    <View style={styles.screen}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* =====================================================
    HERO
===================================================== */}

        <FadeInView delay={0} translateY={24}>
          <View style={styles.hero}>
            <FadeInView delay={180} duration={500} translateY={10}>
              <View style={styles.brandRow}>
                <View style={styles.brandDot} />

                <Text style={styles.brand}>SIDIQ SPORT</Text>
              </View>
            </FadeInView>

            <View style={styles.heroImageContainer}>
              <Animated.Image
                source={heroAthlete}
                resizeMode="contain"
                style={[styles.heroImage, heroImageStyle]}
              />
            </View>

            <FadeInView delay={320} duration={650} translateY={16}>
              <View style={styles.heroText}>
                <Text style={styles.greeting}>Bonjour {userName}</Text>

                <Text style={styles.title}>
                  Prêt à {"\n"}
                  progresser ?
                </Text>

                <View style={styles.titleAccent}>
                  <View style={styles.titleAccentLine} />

                  <Text style={styles.titleAccentText}>
                    DISCIPLINE · FORCE · RÉGULARITÉ
                  </Text>
                </View>
              </View>
            </FadeInView>

            <View style={{ position: "relative" }}>
              <Animated.View
                pointerEvents="none"
                style={[styles.startButtonGlow, startButtonGlowStyle]}
              />

              <PressableScale
                onPress={() => router.push("/sessions")}
                style={styles.startButton}
              >
                <LinearGradient
                  colors={["#E85002", "#C10801"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.startGradient}
                >
                  <Animated.View
                    pointerEvents="none"
                    style={[styles.startButtonShine, startButtonShineStyle]}
                  />
                  <Text style={styles.startText}>COMMENCER</Text>

                  <Ionicons name="arrow-forward" size={20} color="#F9F9F9" />
                </LinearGradient>
              </PressableScale>
            </View>
          </View>
        </FadeInView>
        {/* =====================================================
            INDICATEUR DE RÉGULARITÉ
        ===================================================== */}

        <FadeInView delay={250} duration={650} translateY={24} scale={0.96}>
          <View style={styles.section}>
            <GlowBorder style={styles.streakGlow}>
              <StreakBadge days={47} level="WARRIOR" />
            </GlowBorder>
          </View>
        </FadeInView>

        {/* =====================================================
    SÉANCES
===================================================== */}

        <FadeInView delay={500} translateY={20}>
          <View style={styles.section}>
            <GlowBorder style={styles.workoutCard}>
              <LinearGradient
                colors={["#000000", "#160604", "#2A0A03", "#0B0B0B"]}
                locations={[0, 0.45, 0.72, 1]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.workoutCard}
              >
                {/* EN-TÊTE */}

                <View style={styles.workoutHeader}>
                  <View>
                    <Text style={styles.eyebrow}>SÉANCES</Text>

                    <Text style={styles.workoutTitle}>Choisis ta séance</Text>

                    <Text style={styles.workoutSubtitle}>
                      Force · Cardio · Combat · Mobilité · Sports
                    </Text>
                  </View>

                  <Animated.View
                    style={[styles.workoutIcon, workoutIconPulseStyle]}
                  >
                    <Ionicons
                      name="fitness-outline"
                      size={24}
                      color="#E85002"
                    />
                  </Animated.View>
                </View>

                {/* OBJECTIF */}

                <View style={styles.progressArea}>
                  <View style={styles.progressLabels}>
                    <Text style={styles.progressSmall}>
                      DISCIPLINES DISPONIBLES
                    </Text>

                    <Text style={styles.progressPercent}>
                      {WORKOUT_LIST.length}
                    </Text>
                  </View>

                  <View style={styles.progressTrack}>
                    <LinearGradient
                      colors={["#C10801", "#E85002", "#F16001"]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.progressFill}
                    />
                  </View>

                  <Text style={styles.progressInfo}>
                    Trouve l'entraînement qui te correspond.
                  </Text>
                </View>

                {/* ACTION */}

                <PressableScale
                  onPress={() => router.push("/sessions")}
                  style={styles.startButton}
                >
                  <LinearGradient
                    colors={["#E85002", "#C10801"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.startGradient}
                  >
                    <Text style={styles.startText}>VOIR LES SÉANCES</Text>

                    <Ionicons name="arrow-forward" size={20} color="#F9F9F9" />
                  </LinearGradient>
                </PressableScale>
              </LinearGradient>
            </GlowBorder>
          </View>
        </FadeInView>
        {/* =====================================================
    APERÇU ACTIVITÉ
===================================================== */}

        <View style={styles.section}>
          <FadeInView delay={620} duration={500} translateY={10}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Aujourd'hui</Text>

              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => router.push("/history")}
              >
                <Text style={styles.seeMore}>Voir plus</Text>
              </TouchableOpacity>
            </View>
          </FadeInView>

          <View style={styles.statsGrid}>
            <FadeInView delay={700} translateY={14} style={styles.statWrapper}>
              <StatCard
                value={String(todaySessions)}
                label="SÉANCES"
                color={COLORS.orange}
              />

              <StatCard
                value={todayRepetitions.toLocaleString("fr-FR")}
                label="RÉPÉTITIONS"
                color={COLORS.orange}
              />

              <StatCard
                value={todayDistance.toLocaleString("fr-FR", {
                  maximumFractionDigits: 1,
                })}
                label="KM"
                color={COLORS.orangeLight}
              />

              <StatCard
                value={String(todayMinutes)}
                label="MIN"
                color={COLORS.beige}
              />
            </FadeInView>
          </View>
        </View>

        {/* =====================================================
    PROGRESSION / NIVEAU / XP
===================================================== */}

        <FadeInView delay={1100} translateY={20}>
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Ma progression</Text>

              <Text style={styles.progressionLevelLabel}>
                NIVEAU {String(progression.level).padStart(2, "0")}
              </Text>
            </View>

            <Animated.View
              style={[styles.progressionCard, progressionCardStyle]}
            >
              <View style={styles.progressionTop}>
                <View>
                  <Text style={styles.progressionEyebrow}>NIVEAU ACTUEL</Text>

                  <Text style={styles.progressionTitle}>
                    {progression.levelName}
                  </Text>
                </View>

                <Animated.View
                  style={[styles.progressionLevelCircle, progressionLevelStyle]}
                >
                  <Text style={styles.progressionLevelNumber}>
                    {String(progression.level).padStart(2, "0")}
                  </Text>

                  <Text style={styles.progressionLevelSmall}>LVL</Text>
                </Animated.View>
              </View>

              <View style={styles.progressionXpRow}>
                <Text style={styles.progressionXpLabel}>EXPÉRIENCE</Text>

                <Text style={styles.progressionXpValue}>
                  {progression.currentXP} / {progression.nextXP} XP
                </Text>
              </View>

              <View style={styles.progressionTrack}>
                <Animated.View
                  style={[styles.progressionFill, progressionFillStyle]}
                >
                  <LinearGradient
                    colors={["#C10801", "#E85002", "#F16001"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={StyleSheet.absoluteFill}
                  />
                </Animated.View>
              </View>

              <View style={styles.progressionBottom}>
                <Text style={styles.progressionBottomText}>
                  {progression.nextXP - progression.currentXP} XP avant le
                  niveau {String(progression.level + 1).padStart(2, "0")}
                </Text>

                <Ionicons
                  name="trending-up-outline"
                  size={17}
                  color="#E85002"
                />
              </View>
            </Animated.View>
          </View>
        </FadeInView>

        {/* =====================================================
    DISCIPLINES
===================================================== */}

        <FadeInView delay={1150} duration={550} translateY={18}>
          <View style={styles.section}>
            <FadeInView delay={1250} duration={450} translateY={8}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Disciplines</Text>

                <Text style={styles.disciplineCount}>
                  {String(WORKOUT_LIST.length).padStart(2, "0")}
                </Text>
              </View>
            </FadeInView>

            <View style={styles.disciplineDropdown}>
              <TouchableOpacity
                activeOpacity={0.82}
                onPress={() => {
                  const nextState = !disciplinesOpen;

                  setDisciplinesOpen(nextState);

                  disciplinesAnimation.value = withTiming(nextState ? 1 : 0, {
                    duration: 220,
                  });

                  disciplinesChevron.value = withTiming(nextState ? 1 : 0, {
                    duration: 220,
                  });
                }}
                style={styles.disciplineDropdownHeader}
              >
                <View>
                  <Text style={styles.disciplineDropdownTitle}>
                    Toutes les disciplines
                  </Text>

                  <Text style={styles.disciplineDropdownSubtitle}>
                    {WORKOUT_LIST.length} disciplines disponibles
                  </Text>
                </View>

                <Animated.View style={disciplinesChevronStyle}>
                  <Ionicons
                    name="chevron-down-outline"
                    size={20}
                    color="#F9F9F9"
                  />
                </Animated.View>
              </TouchableOpacity>

              {disciplinesOpen && (
                <Animated.View
                  style={[styles.disciplinesList, disciplinesAnimatedStyle]}
                >
                  <ScrollView
                    nestedScrollEnabled
                    showsVerticalScrollIndicator={false}
                    style={styles.disciplinesScroll}
                    contentContainerStyle={styles.disciplinesScrollContent}
                  >
                    {["Force", "Cardio", "Combat", "Mobilité", "Sports"].map(
                      (category) => {
                        const categoryDisciplines = WORKOUT_LIST.filter(
                          (discipline) => discipline.category === category,
                        );

                        if (categoryDisciplines.length === 0) {
                          return null;
                        }

                        return (
                          <View
                            key={category}
                            style={styles.disciplineCategory}
                          >
                            <Text style={styles.disciplineCategoryTitle}>
                              {category.toUpperCase()}
                            </Text>

                            <View style={styles.disciplineGrid}>
                              {categoryDisciplines.map((discipline, index) => (
                                <FadeInView
                                  key={discipline.id}
                                  delay={index * 35}
                                  duration={280}
                                  translateY={6}
                                  style={styles.disciplineGridItem}
                                >
                                  <TouchableOpacity
                                    activeOpacity={0.82}
                                    onPress={() => {
                                      setDisciplinesOpen(false);

                                      disciplinesAnimation.value = withTiming(
                                        0,
                                        {
                                          duration: 180,
                                        },
                                      );

                                      disciplinesChevron.value = withTiming(0, {
                                        duration: 180,
                                      });

                                      router.push({
                                        pathname: "/workout",
                                        params: {
                                          workoutId: discipline.id,
                                        },
                                      });
                                    }}
                                    style={styles.disciplineDropdownItem}
                                  >
                                    <View
                                      style={[
                                        styles.disciplineDropdownIcon,
                                        {
                                          borderColor: `${discipline.accent}30`,
                                          backgroundColor: `${discipline.accent}10`,
                                        },
                                      ]}
                                    >
                                      <Ionicons
                                        name={discipline.icon}
                                        size={19}
                                        color={discipline.accent}
                                      />
                                    </View>

                                    <View style={styles.disciplineDropdownInfo}>
                                      <Text
                                        style={styles.disciplineDropdownName}
                                        numberOfLines={1}
                                      >
                                        {discipline.name}
                                      </Text>
                                    </View>
                                  </TouchableOpacity>
                                </FadeInView>
                              ))}
                            </View>
                          </View>
                        );
                      },
                    )}
                  </ScrollView>
                </Animated.View>
              )}
            </View>
          </View>
        </FadeInView>
        {/* =====================================================
    CITATION
===================================================== */}

        <FadeInView delay={1350} duration={700} translateY={18} scale={0.97}>
          <View style={styles.quoteCard}>
            <View style={styles.quoteMark}>
              <Ionicons
                name="chatbox-ellipses-outline"
                size={20}
                color="#E85002"
              />
            </View>

            <Text style={styles.quoteLabel}>POUR AUJOURD'HUI</Text>

            <Text style={styles.quote}>"{quote}"</Text>
          </View>
        </FadeInView>
      </ScrollView>

      {/* =====================================================
                NAVIGATION
            ===================================================== */}

      <View style={styles.bottomNav}>
        <Animated.View
          pointerEvents="none"
          style={[styles.navIndicator, navIndicatorStyle]}
        />

        <TouchableOpacity
          onPress={() => router.push("/")}
          style={styles.navItem}
        >
          <Ionicons name="home-outline" size={22} color="#E85002" />

          <Text style={[styles.navText, { color: "#E85002" }]}>Accueil</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/history")}
          style={styles.navItem}
        >
          <Ionicons name="stats-chart-outline" size={22} color="#66736B" />

          <Text style={styles.navText}>Activité</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/sessions")}
          style={styles.navItem}
        >
          <Ionicons name="barbell-outline" size={22} color="#66736B" />

          <Text style={styles.navText}>Séances</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/profile")}
          style={styles.navItem}
        >
          <Ionicons name="person-outline" size={22} color="#66736B" />

          <Text style={styles.navText}>Profil</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

/* =============================================================
   STYLES
============================================================= */

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.black,
  },

  scrollContent: {
    paddingBottom: 120,
  },

  /* HEADER */

  /* HERO */

  hero: {
    paddingHorizontal: 24,
    paddingTop: 58,
    paddingBottom: 30,
  },

  heroImageContainer: {
    width: "100%",
    height: 370,
    marginTop: 0,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },

  heroImage: {
    width: "100%",
    height: "100%",
  },

  heroText: {
    marginTop: 4,
  },

  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },

  brandDot: {
    width: 7,
    height: 7,
    borderRadius: 999,
    backgroundColor: "#E85002",
    marginRight: 8,
  },

  brand: {
    color: "#E85002",
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 3,
  },

  greeting: {
    color: "#A7A7A7",
    fontSize: 14,
    marginBottom: 7,
  },

  title: {
    color: "#F9F9F9",
    fontSize: 36,
    lineHeight: 39,
    fontWeight: "900",
    letterSpacing: -1.2,
  },

  titleAccent: {
    marginTop: 15,
    flexDirection: "row",
    alignItems: "center",
  },

  titleAccentLine: {
    width: 28,
    height: 2,
    backgroundColor: "#E85002",
    marginRight: 9,
  },

  titleAccentText: {
    color: "#646464",
    fontSize: 8,
    fontWeight: "800",
    letterSpacing: 1.2,
  },

  startButtonGlow: {
    position: "absolute",
    left: -4,
    right: -4,
    top: 2,
    bottom: 2,
    borderRadius: 18,
    backgroundColor: "#E85002",
    opacity: 0.3,
  },

  startButtonShine: {
    position: "absolute",
    top: -10,
    bottom: -10,
    left: "50%",
    width: 28,
    backgroundColor: "rgba(255,255,255,0.9)",
  },

  /* SECTIONS */

  section: {
    paddingHorizontal: 24,
    marginBottom: 28,
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },

  sectionTitle: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: -0.4,
  },

  seeMore: {
    color: COLORS.orange,
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },

  /* WORKOUT */

  workoutCard: {
    borderRadius: 28,
    padding: 22,
    borderWidth: 1,
    borderColor: "rgba(232,80,2,0.28)",
  },

  workoutHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  eyebrow: {
    color: COLORS.orange,
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 2,
    marginBottom: 8,
  },

  workoutTitle: {
    color: COLORS.white,
    fontSize: 30,
    fontWeight: "800",
    letterSpacing: -0.8,
  },

  workoutSubtitle: {
    color: COLORS.lightGray,
    fontSize: 13,
    marginTop: 5,
  },

  workoutIcon: {
    width: 46,
    height: 46,
    borderRadius: 15,
    backgroundColor: "rgba(232,80,2,0.10)",
    borderWidth: 1,
    borderColor: "rgba(232,80,2,0.25)",
    alignItems: "center",
    justifyContent: "center",
  },

  progressArea: {
    marginTop: 28,
  },

  progressLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 9,
  },

  progressSmall: {
    color: "#646464",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.5,
  },

  progressPercent: {
    color: "#E85002",
    fontSize: 13,
    fontWeight: "800",
  },

  progressTrack: {
    height: 7,
    backgroundColor: "#222222",
    borderRadius: 999,
    overflow: "hidden",
  },

  progressFill: {
    width: "100%",
    height: "100%",
    borderRadius: 999,
  },

  progressInfo: {
    color: "#646464",
    fontSize: 11,
    marginTop: 8,
  },

  startButton: {
    marginTop: 22,
    borderRadius: 15,
    overflow: "hidden",
  },

  startGradient: {
    height: 54,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },

  startText: {
    color: "#F9F9F9",
    fontSize: 14,
    fontWeight: "900",
    letterSpacing: 1.5,
  },

  /* STATS */

  statsGrid: {
    flexDirection: "row",
    gap: 8,
  },

  statWrapper: {
    flex: 1,
  },

  /* DISCIPLINES */

  disciplineCount: {
    color: "#526058",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1,
  },

  disciplineDropdown: {
    marginTop: 4,
    backgroundColor: "#0A0A0A",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#222222",
    overflow: "hidden",
  },

  disciplineDropdownHeader: {
    minHeight: 74,
    paddingHorizontal: 18,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  disciplineDropdownTitle: {
    color: "#F9F9F9",
    fontSize: 15,
    fontWeight: "900",
    letterSpacing: -0.2,
  },

  disciplineDropdownSubtitle: {
    color: "#666666",
    fontSize: 10,
    fontWeight: "600",
    marginTop: 5,
    letterSpacing: 0.2,
  },

  disciplinesList: {
    borderTopWidth: 1,
    borderTopColor: "#222222",
    maxHeight: 300,
  },

  disciplinesScroll: {
    maxHeight: 300,
  },

  disciplinesScrollContent: {
    paddingHorizontal: 14,
    paddingTop: 16,
    paddingBottom: 14,
  },

  disciplineCategory: {
    marginBottom: 18,
  },

  disciplineCategoryTitle: {
    color: "#646464",
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 1.8,
    marginBottom: 9,
    paddingHorizontal: 2,
  },

  disciplineGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  disciplineGridItem: {
    width: "48.5%",
    marginBottom: 8,
  },

  disciplineDropdownItem: {
    minHeight: 58,
    paddingHorizontal: 10,
    paddingVertical: 9,

    flexDirection: "row",
    alignItems: "center",

    backgroundColor: "#0F0F0F",

    borderWidth: 1,
    borderColor: "#1B1B1B",
    borderRadius: 14,
  },

  disciplineDropdownIcon: {
    width: 36,
    height: 36,
    borderRadius: 11,

    borderWidth: 1,

    alignItems: "center",
    justifyContent: "center",

    flexShrink: 0,
  },

  disciplineDropdownInfo: {
    flex: 1,
    marginLeft: 9,
    minWidth: 0,
  },

  disciplineDropdownName: {
    color: "#F9F9F9",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: -0.1,
  },

  disciplineDropdownMeta: {
    display: "none",
  },

  /* PROGRESSION */

  progressionLevelLabel: {
    color: COLORS.orange,
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1.2,
  },

  progressionCard: {
    backgroundColor: "#0B0B0B",
    borderRadius: 24,
    padding: 22,
    borderWidth: 1,
    borderColor: "#242424",
  },

  progressionTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  progressionEyebrow: {
    color: "#646464",
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 1.8,
    marginBottom: 7,
  },

  progressionTitle: {
    color: COLORS.white,
    fontSize: 25,
    fontWeight: "900",
    letterSpacing: -0.6,
  },

  progressionLevelCircle: {
    width: 58,
    height: 58,
    borderRadius: 20,
    backgroundColor: "rgba(232,80,2,0.08)",
    borderWidth: 1,
    borderColor: "rgba(232,80,2,0.28)",
    alignItems: "center",
    justifyContent: "center",
  },

  progressionLevelNumber: {
    color: COLORS.orange,
    fontSize: 20,
    fontWeight: "900",
    lineHeight: 22,
  },

  progressionLevelSmall: {
    color: "#646464",
    fontSize: 7,
    fontWeight: "900",
    letterSpacing: 1,
  },

  progressionXpRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 25,
    marginBottom: 9,
  },

  progressionXpLabel: {
    color: "#646464",
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 1.5,
  },

  progressionXpValue: {
    color: COLORS.white,
    fontSize: 11,
    fontWeight: "800",
  },

  progressionTrack: {
    height: 8,
    backgroundColor: "#222222",
    borderRadius: 999,
    overflow: "hidden",
  },

  progressionFill: {
    width: "74%",
    height: "100%",
    borderRadius: 999,
  },

  progressionBottom: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 12,
  },

  progressionBottomText: {
    color: "#646464",
    fontSize: 10,
    fontWeight: "600",
  },

  /* QUOTE */

  quoteCard: {
    marginHorizontal: 24,
    marginBottom: 25,
    padding: 24,

    backgroundColor: "#0A0A0A",
    borderRadius: 24,

    borderWidth: 1,
    borderColor: "#222222",
  },

  quoteMark: {
    width: 42,
    height: 42,
    borderRadius: 14,

    backgroundColor: "rgba(232,80,2,0.10)",

    alignItems: "center",
    justifyContent: "center",

    marginBottom: 17,
  },

  quoteLabel: {
    color: COLORS.orange,
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 2.2,

    marginBottom: 10,
  },

  quote: {
    color: "#F2F2F2",
    fontSize: 18,
    lineHeight: 27,
    fontWeight: "700",
    letterSpacing: -0.2,
  },

  /* NAVIGATION */

  bottomNav: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,

    height: 82,

    backgroundColor: "#050505",

    borderTopWidth: 1,
    borderTopColor: COLORS.border,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",

    paddingHorizontal: 10,
  },

  navIndicator: {
    position: "absolute",
    top: 0,

    width: 28,
    height: 3,

    borderRadius: 999,

    backgroundColor: COLORS.orange,
  },

  navItem: {
    flex: 1,
    height: 62,

    alignItems: "center",
    justifyContent: "center",

    position: "relative",
  },

  navActive: {
    color: COLORS.orange,

    fontSize: 9,
    fontWeight: "900",

    marginTop: 6,
    letterSpacing: 0.8,

    textTransform: "uppercase",
  },

  navText: {
    color: "#5F625F",

    fontSize: 9,
    fontWeight: "800",

    marginTop: 6,
    letterSpacing: 0.7,

    textTransform: "uppercase",
  },
});
