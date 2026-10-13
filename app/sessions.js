import { View, Text, ScrollView, StyleSheet } from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { WORKOUT_LIST } from "../lib/workoutTypes";

import FadeInView from "../components/FadeInView";
import PressableScale from "../components/PressableScale";

const COLORS = {
  black: "#000000",
  surface: "#0B0B0B",
  surfaceLight: "#111111",
  border: "#242424",
  orange: "#E85002",
  white: "#F9F9F9",
  gray: "#646464",
};

const CATEGORIES = ["Force", "Cardio", "Combat", "Mobilité", "Sports"];

export default function SessionsScreen() {
  const router = useRouter();

  const openWorkout = (workoutId) => {
    router.push({
      pathname: "/workout",
      params: {
        workoutId,
      },
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <FadeInView duration={500} translateY={18} scale={0.98}>
          <View style={styles.header}>
            <Text style={styles.eyebrow}>SIDIQ SPORT</Text>

            <Text style={styles.title}>Mes séances</Text>

            <Text style={styles.subtitle}>
              Choisis ta discipline pour commencer.
            </Text>
          </View>
        </FadeInView>

        {CATEGORIES.map((category, categoryIndex) => {
          const disciplines = WORKOUT_LIST.filter(
            (workout) => workout.category === category,
          );

          if (disciplines.length === 0) {
            return null;
          }

          return (
            <FadeInView
              key={category}
              delay={100 + categoryIndex * 80}
              duration={450}
              translateY={16}
            >
              <View style={styles.category}>
                <Text style={styles.categoryTitle}>
                  {category.toUpperCase()}
                </Text>

                <View style={styles.grid}>
                  {disciplines.map((workout, index) => (
                    <FadeInView
                      key={workout.id}
                      delay={180 + categoryIndex * 80 + index * 45}
                      duration={360}
                      translateY={10}
                      scale={0.97}
                      style={styles.cardWrapper}
                    >
                      <PressableScale
                        onPress={() => openWorkout(workout.id)}
                        style={styles.card}
                      >
                        <View
                          style={[
                            styles.icon,
                            {
                              borderColor: `${workout.accent}30`,
                              backgroundColor: `${workout.accent}10`,
                            },
                          ]}
                        >
                          <Ionicons
                            name={workout.icon}
                            size={20}
                            color={workout.accent}
                          />
                        </View>

                        <View style={styles.cardInfo}>
                          <Text style={styles.cardTitle} numberOfLines={1}>
                            {workout.name}
                          </Text>

                          <Text style={styles.cardMeta}>
                            {workout.mode === "repetitions"
                              ? `${workout.target} reps`
                              : workout.mode === "distance"
                                ? `${workout.target} km`
                                : workout.mode === "sets"
                                  ? `${workout.sets} × ${workout.reps}`
                                  : `${Math.floor(workout.target / 60)} min`}
                          </Text>
                        </View>

                        <Ionicons
                          name="chevron-forward"
                          size={18}
                          color={COLORS.gray}
                        />
                      </PressableScale>
                    </FadeInView>
                  ))}
                </View>
              </View>
            </FadeInView>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 58,
    paddingBottom: 120,
  },

  header: {
    marginBottom: 32,
  },

  eyebrow: {
    color: COLORS.orange,
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 2,
    marginBottom: 8,
  },

  title: {
    color: COLORS.white,
    fontSize: 34,
    fontWeight: "900",
    letterSpacing: -1,
  },

  subtitle: {
    color: COLORS.gray,
    fontSize: 14,
    marginTop: 8,
  },

  category: {
    marginBottom: 26,
  },

  categoryTitle: {
    color: COLORS.gray,
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1.8,
    marginBottom: 10,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  cardWrapper: {
    width: "48.5%",
    marginBottom: 10,
  },

  card: {
    minHeight: 78,
    paddingHorizontal: 12,
    paddingVertical: 11,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surfaceLight,
    borderWidth: 1,
    borderColor: "#1C1C1C",
    borderRadius: 16,
  },

  icon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  cardInfo: {
    flex: 1,
    minWidth: 0,
    marginLeft: 9,
    marginRight: 4,
  },

  cardTitle: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: "800",
  },

  cardMeta: {
    color: COLORS.gray,
    fontSize: 10,
    fontWeight: "700",
    marginTop: 4,
  },
});
