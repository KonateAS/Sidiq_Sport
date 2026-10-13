import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { setPremiumStatus } from "../lib/premiumStorage";
import PressableScale from "../components/PressableScale";

const COLORS = {
  black: "#000000",
  surface: "#0B0B0B",
  surfaceLight: "#111111",
  border: "#242424",
  orange: "#E85002",
  red: "#C10801",
  white: "#FFFFFF",
  lightGray: "#A7A7A7",
  gray: "#646464",
  heroDark: "#3A0B08",
  orangeSoft: "rgba(232,80,2,0.12)",
  orangeSubtle: "rgba(232,80,2,0.08)",
};

const ADVANTAGES = [
  {
    icon: "analytics-outline",
    title: "Progression avancée",
    text: "Analyse plus complète de tes performances.",
  },
  {
    icon: "trophy-outline",
    title: "Objectifs Premium",
    text: "Des défis supplémentaires pour progresser.",
  },
  {
    icon: "stats-chart-outline",
    title: "Statistiques détaillées",
    text: "Une vision plus précise de ta régularité.",
  },
  {
    icon: "flash-outline",
    title: "Expérience sans limites",
    text: "Accède progressivement aux nouvelles fonctions Premium.",
  },
];

export default function PremiumScreen() {
  const router = useRouter();

  const handleActivatePremium = async () => {
    const success = await setPremiumStatus(true);

    console.log("Activation Premium :", success);

    if (success) {
      router.back();
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ==================================================
            HEADER
        ================================================== */}

        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            activeOpacity={0.7}
            style={styles.backButton}
          >
            <Ionicons name="chevron-back" size={23} color={COLORS.white} />
          </TouchableOpacity>

          <View style={styles.headerTitle}>
            <Text style={styles.headerEyebrow}>SIDIQ SPORT</Text>

            <Text style={styles.headerTitleText}>Premium</Text>
          </View>
        </View>

        {/* ==================================================
            HERO PREMIUM
        ================================================== */}

        <View style={styles.heroWrapper}>
          <LinearGradient
            colors={[COLORS.red, COLORS.heroDark, COLORS.surface]}
            start={{
              x: 0,
              y: 0,
            }}
            end={{
              x: 1,
              y: 1,
            }}
            style={styles.hero}
          >
            <View style={styles.heroIcon}>
              <Ionicons name="diamond" size={30} color={COLORS.orange} />
            </View>

            <Text style={styles.heroEyebrow}>SIDIQ SPORT PREMIUM</Text>

            <Text style={styles.heroTitle}>Va plus loin.</Text>

            <Text style={styles.heroDescription}>
              Débloque une expérience plus complète pour suivre ta progression
              et renforcer ta discipline.
            </Text>
          </LinearGradient>
        </View>

        {/* ==================================================
            AVANTAGES
        ================================================== */}

        <View style={styles.advantagesSection}>
          <Text style={styles.sectionTitle}>Ce que tu débloques</Text>

          <Text style={styles.sectionSubtitle}>
            Des outils conçus pour aller plus loin.
          </Text>

          <View style={styles.advantagesList}>
            {ADVANTAGES.map((item) => (
              <View key={item.title} style={styles.advantageCard}>
                <View style={styles.advantageIcon}>
                  <Ionicons name={item.icon} size={21} color={COLORS.orange} />
                </View>

                <View style={styles.advantageContent}>
                  <Text style={styles.advantageTitle}>{item.title}</Text>

                  <Text style={styles.advantageText}>{item.text}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* ==================================================
            ACTION
        ================================================== */}

        <View style={styles.actionSection}>
          <PressableScale
            onPress={handleActivatePremium}
            style={styles.actionButton}
          >
            <Text style={styles.actionButtonText}>Activer Premium</Text>
          </PressableScale>

          <Text style={styles.actionNote}>
            Le paiement sera connecté ultérieurement.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },

  scrollContent: {
    paddingBottom: 60,
  },

  // ========================================================
  // HEADER
  // ========================================================

  header: {
    paddingTop: 58,
    paddingHorizontal: 24,
    flexDirection: "row",
    alignItems: "center",
  },

  backButton: {
    width: 46,
    height: 46,
    borderRadius: 15,
    backgroundColor: COLORS.surfaceLight,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
    justifyContent: "center",
  },

  headerTitle: {
    flex: 1,
    alignItems: "center",
    marginRight: 46,
  },

  headerEyebrow: {
    color: COLORS.orange,
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 2,
  },

  headerTitleText: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: "900",
    marginTop: 4,
  },

  // ========================================================
  // HERO
  // ========================================================

  heroWrapper: {
    marginHorizontal: 24,
    marginTop: 32,
  },

  hero: {
    borderRadius: 30,
    padding: 28,
    borderWidth: 1,
    borderColor: `${COLORS.orange}40`,
  },

  heroIcon: {
    width: 62,
    height: 62,
    borderRadius: 20,
    backgroundColor: COLORS.orangeSoft,
    borderWidth: 1,
    borderColor: `${COLORS.orange}40`,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 22,
  },

  heroEyebrow: {
    color: COLORS.orange,
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 2,
  },

  heroTitle: {
    color: COLORS.white,
    fontSize: 30,
    fontWeight: "900",
    lineHeight: 36,
    marginTop: 10,
  },

  heroDescription: {
    color: COLORS.lightGray,
    fontSize: 15,
    lineHeight: 23,
    marginTop: 10,
  },

  // ========================================================
  // AVANTAGES
  // ========================================================

  advantagesSection: {
    marginHorizontal: 24,
    marginTop: 32,
  },

  sectionTitle: {
    color: COLORS.white,
    fontSize: 21,
    fontWeight: "900",
  },

  sectionSubtitle: {
    color: COLORS.lightGray,
    fontSize: 13,
    marginTop: 5,
  },

  advantagesList: {
    marginTop: 18,
    gap: 10,
  },

  advantageCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surfaceLight,
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  advantageIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: COLORS.orangeSubtle,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },

  advantageContent: {
    flex: 1,
  },

  advantageTitle: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: "800",
  },

  advantageText: {
    color: COLORS.lightGray,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 4,
  },

  // ========================================================
  // ACTION
  // ========================================================

  actionSection: {
    marginHorizontal: 24,
    marginTop: 32,
  },

  actionButton: {
    height: 58,
    borderRadius: 19,
    backgroundColor: COLORS.orange,
    alignItems: "center",
    justifyContent: "center",
  },

  actionButtonText: {
    color: COLORS.surface,
    fontSize: 16,
    fontWeight: "900",
  },

  actionNote: {
    color: COLORS.gray,
    fontSize: 11,
    textAlign: "center",
    marginTop: 12,
    lineHeight: 17,
  },
});
