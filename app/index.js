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
            <Text style={styles.brand}>SIDIQ SPORT</Text>

            <Text style={styles.greeting}>
              Bonjour {userName}
            </Text>

            <Text style={styles.title}>
              Prêt à progresser ?
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => router.push("/profile")}
            activeOpacity={0.8}
            style={styles.avatarButton}
          >
            <Text style={styles.avatarText}>
              {firstLetter}
            </Text>
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
            colors={["#13271B", "#0D1710"]}
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
                  color="#00FF87"
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
                  colors={["#00FF87", "#65FFB5"]}
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
                colors={["#00FF87", "#00D966"]}
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
                  color="#07100A"
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
              color="#00FF87"
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
              06
            </Text>
          </View>

          <View style={styles.disciplineGrid}>
            {[
              {
                name: "Course",
                icon: "walk-outline",
                meta: "Endurance",
              },
              {
                name: "Pompes",
                icon: "fitness-outline",
                meta: "Haut du corps",
              },
              {
                name: "Squats",
                icon: "body-outline",
                meta: "Jambes",
              },
              {
                name: "Tractions",
                icon: "barbell-outline",
                meta: "Dos",
              },
              {
                name: "Boxe",
                icon: "hand-left-outline",
                meta: "Cardio",
              },
              {
                name: "HIIT",
                icon: "timer-outline",
                meta: "Intensité",
              },
            ].map((discipline, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => router.push("/workout")}
                activeOpacity={0.8}
                style={styles.disciplineCard}
              >
                <View style={styles.disciplineTop}>
                  <View style={styles.disciplineIcon}>
                    <Ionicons
                      name={discipline.icon}
                      size={23}
                      color="#00FF87"
                    />
                  </View>

                  <Ionicons
                    name="arrow-up-right"
                    size={17}
                    color="#59675D"
                  />
                </View>

                <Text style={styles.disciplineName}>
                  {discipline.name}
                </Text>

                <Text style={styles.disciplineMeta}>
                  {discipline.meta}
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
              color="#00FF87"
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
            color="#00FF87"
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
    backgroundColor: "#080D09",
  },

  scrollContent: {
    paddingBottom: 120,
  },

  /* HEADER */

  header: {
    paddingHorizontal: 24,
    paddingTop: 58,
    paddingBottom: 28,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  headerLeft: {
    flex: 1,
  },

  brand: {
    color: "#00FF87",
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 3,
    marginBottom: 10,
  },

  greeting: {
    color: "#78847C",
    fontSize: 14,
    marginBottom: 4,
  },

  title: {
    color: "#F3F7F4",
    fontSize: 34,
    fontWeight: "800",
    letterSpacing: -1,
  },

  avatarButton: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: "#101A13",
    borderWidth: 1,
    borderColor: "rgba(0,255,135,0.25)",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 14,
  },

  avatarText: {
    color: "#00FF87",
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
    color: "#F3F7F4",
    fontSize: 21,
    fontWeight: "800",
    letterSpacing: -0.3,
  },

  seeMore: {
    color: "#00FF87",
    fontSize: 12,
    fontWeight: "700",
  },

  /* WORKOUT */

  workoutCard: {
    borderRadius: 28,
    padding: 22,
    borderWidth: 1,
    borderColor: "rgba(0,255,135,0.18)",
  },

  workoutHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  eyebrow: {
    color: "#00FF87",
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 2,
    marginBottom: 8,
  },

  workoutTitle: {
    color: "#F3F7F4",
    fontSize: 30,
    fontWeight: "800",
    letterSpacing: -0.8,
  },

  workoutSubtitle: {
    color: "#78847C",
    fontSize: 13,
    marginTop: 5,
  },

  workoutIcon: {
    width: 46,
    height: 46,
    borderRadius: 15,
    backgroundColor: "rgba(0,255,135,0.08)",
    borderWidth: 1,
    borderColor: "rgba(0,255,135,0.15)",
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
    color: "#69766E",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.5,
  },

  progressPercent: {
    color: "#00FF87",
    fontSize: 13,
    fontWeight: "800",
  },

  progressTrack: {
    height: 7,
    backgroundColor: "#172119",
    borderRadius: 999,
    overflow: "hidden",
  },

  progressFill: {
    width: "50%",
    height: "100%",
    borderRadius: 999,
  },

  progressInfo: {
    color: "#69766E",
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
    color: "#07100A",
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
    backgroundColor: "#0E1510",
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#17231A",
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
    color: "#F0F5F2",
    fontSize: 16,
    fontWeight: "800",
  },

  disciplineMeta: {
    color: "#637068",
    fontSize: 11,
    marginTop: 4,
  },

  /* QUOTE */

  quoteCard: {
    marginHorizontal: 24,
    marginBottom: 25,
    padding: 22,
    backgroundColor: "#0D1510",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#17231A",
  },

  quoteMark: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "rgba(0,255,135,0.07)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },

  quoteLabel: {
    color: "#00FF87",
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 2,
    marginBottom: 9,
  },

  quote: {
    color: "#DDE6DF",
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
    backgroundColor: "rgba(10,16,11,0.98)",
    borderTopWidth: 1,
    borderTopColor: "#18231B",
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
    color: "#00FF87",
    fontSize: 10,
    fontWeight: "800",
    marginTop: 5,
  },

  navText: {
    color: "#66736B",
    fontSize: 10,
    fontWeight: "600",
    marginTop: 5,
  },
});