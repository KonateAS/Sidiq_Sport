import {
  WORKOUT_LIST,
  WORKOUT_CATEGORIES,
} from "../lib/workoutTypes";

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
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

import StatCard from "../components/StatCard";
import StreakBadge from "../components/StreakBadge";
import { motivationalQuotes } from "../lib/quotes";

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

  useEffect(() => {
    loadUserName();

    const randomQuote =
      motivationalQuotes[
        Math.floor(Math.random() * motivationalQuotes.length)
      ];

    setQuote(randomQuote);
  }, []);

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

  const firstLetter = userName.charAt(0).toUpperCase();

  return (
    <View style={styles.screen}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* =====================================================
            HEADER
        ===================================================== */}

        <View style={styles.header}>
  <View style={styles.headerLeft}>

    <View style={styles.brandRow}>
      <View style={styles.brandDot} />

      <Text style={styles.brand}>
        SIDIQ SPORT
      </Text>
    </View>

    <Text style={styles.greeting}>
      Bonjour {userName}
    </Text>

    <Text style={styles.title}>
      Prêt à{"\n"}
      progresser ?
    </Text>

    <View style={styles.titleAccent}>
      <View style={styles.titleAccentLine} />
      <Text style={styles.titleAccentText}>
        DISCIPLINE · FORCE · RÉGULARITÉ
      </Text>
    </View>

  </View>

  <TouchableOpacity
  onPress={() => router.push("/workout")}
  activeOpacity={0.85}
  style={styles.startButton}
>
  <LinearGradient
    colors={["#E85002", "#C10801"]}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 0 }}
    style={styles.startGradient}
  >
    <Text style={styles.startText}>
      COMMENCER
    </Text>

    <Ionicons
      name="arrow-forward"
      size={20}
      color="#F9F9F9"
    />
  </LinearGradient>
</TouchableOpacity>
</View>

        {/* =====================================================
            INDICATEUR DE RÉGULARITÉ
        ===================================================== */}

        <View style={styles.section}>
          <StreakBadge
            days={47}
            level="WARRIOR"
          />
        </View>

        {/* =====================================================
            SÉANCE PRINCIPALE
        ===================================================== */}

        <View style={styles.section}>
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
                <Text style={styles.eyebrow}>
                  PROGRAMME DU JOUR
                </Text>

                <Text style={styles.workoutTitle}>
                  200 Squats
                </Text>

                <Text style={styles.workoutSubtitle}>
                  Renforcement · 12 min
                </Text>
              </View>

              <View style={styles.workoutIcon}>
                <Ionicons
  name="fitness-outline"
  size={24}
  color="#E85002"
/>
              </View>
            </View>

            {/* PROGRESSION */}

            <View style={styles.progressArea}>
              <View style={styles.progressLabels}>
                <Text style={styles.progressSmall}>
                  PROGRESSION
                </Text>

                <Text style={styles.progressPercent}>
                  50%
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
                100 / 200 répétitions
              </Text>
            </View>

            {/* ACTION */}

            <TouchableOpacity
              onPress={() => router.push("/workout")}
              activeOpacity={0.85}
              style={styles.startButton}
            >
              <LinearGradient
  colors={["#E85002", "#C10801"]}
  start={{ x: 0, y: 0 }}
  end={{ x: 1, y: 0 }}
  style={styles.startGradient}
>
                <Text style={styles.startText}>
  COMMENCER
</Text>

<Ionicons
  name="arrow-forward"
  size={20}
  color="#F9F9F9"
/>
              </LinearGradient>
            </TouchableOpacity>
          </LinearGradient>
        </View>

        {/* =====================================================
            APERÇU ACTIVITÉ
        ===================================================== */}

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              Aujourd'hui
            </Text>

            <TouchableOpacity>
              <Text style={styles.seeMore}>
                Voir plus
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.statsGrid}>
            <StatCard
              icon="flame-outline"
              value="328"
              unit="kcal"
              label="Calories"
              color="#E85002"
            />

            <StatCard
              icon="heart-outline"
              value="142"
              unit="bpm"
              label="Cardio"
              color="#FF6B6B"
            />

            <StatCard
              icon="walk-outline"
              value="3.2"
              unit="km"
              label="Distance"
              color="#7DD3FC"
            />

            <StatCard
              icon="time-outline"
              value="48"
              unit="min"
              label="Actif"
              color="#C4B5FD"
            />
          </View>
        </View>

                {/* =====================================================
            DISCIPLINES
        ===================================================== */}

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              Disciplines
            </Text>

            <Text style={styles.disciplineCount}>
              {String(WORKOUT_LIST.length).padStart(2, "0")}
            </Text>
          </View>

          <View style={styles.disciplineGrid}>
            {WORKOUT_LIST.map((discipline) => (
              <TouchableOpacity
                key={discipline.id}
                onPress={() =>
                  router.push({
                    pathname: "/workout",
                    params: {
                      workoutId: discipline.id,
                    },
                  })
                }
                activeOpacity={0.82}
                style={styles.disciplineCard}
              >
                <View style={styles.disciplineTop}>
                  <View
                    style={[
                      styles.disciplineIcon,
                      {
                        borderColor: `${discipline.accent}30`,
                        backgroundColor: `${discipline.accent}10`,
                      },
                    ]}
                  >
                    <Ionicons
                      name={discipline.icon}
                      size={23}
                      color={discipline.accent}
                    />
                  </View>

                  <Ionicons
                    name="arrow-forward-outline"
                    size={17}
                    color="#59675D"
                  />
                </View>

                <Text style={styles.disciplineName}>
                  {discipline.name}
                </Text>

                <Text style={styles.disciplineMeta}>
                  {discipline.category}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        {/* =====================================================
            CITATION
        ===================================================== */}

        <View style={styles.quoteCard}>
          <View style={styles.quoteMark}>
            <Ionicons
              name="chatbox-ellipses-outline"
              size={20}
              color="#E85002"
            />
          </View>

          <Text style={styles.quoteLabel}>
            POUR AUJOURD'HUI
          </Text>

          <Text style={styles.quote}>
            "{quote}"
          </Text>
        </View>

      </ScrollView>

      {/* =====================================================
          NAVIGATION
      ===================================================== */}

      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons
            name="home"
            size={22}
            color="#E85002"
          />

          <Text style={styles.navActive}>
            Accueil
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <Ionicons
            name="stats-chart-outline"
            size={22}
            color="#66736B"
          />

          <Text style={styles.navText}>
            Activité
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/workout")}
          style={styles.navItem}
        >
          <Ionicons
            name="barbell-outline"
            size={22}
            color="#66736B"
          />

          <Text style={styles.navText}>
            Séances
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/profile")}
          style={styles.navItem}
        >
          <Ionicons
            name="person-outline"
            size={22}
            color="#66736B"
          />

          <Text style={styles.navText}>
            Profil
          </Text>
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

  header: {
  paddingHorizontal: 24,
  paddingTop: 58,
  paddingBottom: 30,
  flexDirection: "row",
  alignItems: "flex-start",
  justifyContent: "space-between",
},

headerLeft: {
  flex: 1,
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

avatarButton: {
  width: 48,
  height: 48,
  borderRadius: 16,
  backgroundColor: "#0B0B0B",
  borderWidth: 1,
  borderColor: "rgba(232,80,2,0.4)",
  alignItems: "center",
  justifyContent: "center",
  marginLeft: 14,
},

avatarText: {
  color: "#E85002",
  fontSize: 17,
  fontWeight: "900",
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
    marginBottom: 15,
  },

  sectionTitle: {
  color: COLORS.white,
  fontSize: 21,
  fontWeight: "800",
  letterSpacing: -0.3,
},

seeMore: {
  color: COLORS.orange,
  fontSize: 12,
  fontWeight: "700",
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
  width: "50%",
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
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  /* DISCIPLINES */

  disciplineCount: {
    color: "#526058",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1,
  },

  disciplineGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  disciplineCard: {
  width: "48%",
  minHeight: 130,
  backgroundColor: "#0B0B0B",
  borderRadius: 20,
  padding: 16,
  marginBottom: 12,
  borderWidth: 1,
  borderColor: "#242424",
},

  disciplineTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
  },

  disciplineIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: "rgba(0,255,135,0.07)",
    alignItems: "center",
    justifyContent: "center",
  },

  disciplineName: {
  color: COLORS.white,
  fontSize: 16,
  fontWeight: "800",
},

  disciplineMeta: {
  color: COLORS.gray,
  fontSize: 11,
  marginTop: 4,
},

  /* QUOTE */

  quoteCard: {
  marginHorizontal: 24,
  marginBottom: 25,
  padding: 22,
  backgroundColor: "#0B0B0B",
  borderRadius: 22,
  borderWidth: 1,
  borderColor: "#242424",
},

  quoteMark: {
  width: 38,
  height: 38,
  borderRadius: 12,
  backgroundColor: "rgba(232,80,2,0.10)",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: 14,
},

  quoteLabel: {
  color: COLORS.orange,
  fontSize: 10,
  fontWeight: "900",
  letterSpacing: 2,
  marginBottom: 9,
},

  quote: {
  color: "#E8E8E8",
  fontSize: 17,
  lineHeight: 25,
  fontWeight: "600",
},

  /* NAVIGATION */

  bottomNav: {
  position: "absolute",
  left: 0,
  right: 0,
  bottom: 0,
  height: 78,
  backgroundColor: "rgba(0,0,0,0.98)",
  borderTopWidth: 1,
  borderTopColor: "#242424",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-around",
  paddingHorizontal: 8,
},

  navItem: {
    alignItems: "center",
    justifyContent: "center",
    minWidth: 70,
  },

  navActive: {
  color: COLORS.orange,
  fontSize: 10,
  fontWeight: "800",
  marginTop: 5,
},

  navText: {
  color: "#646464",
  fontSize: 10,
  fontWeight: "600",
  marginTop: 5,
},
});








