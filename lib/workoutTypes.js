/*
 * ============================================================
 * SIDIQ SPORT — TYPES D'ACTIVITÉS
 * ============================================================
 */

export const WORKOUT_TYPES = {

  // ==========================================================
  // FORCE
  // ==========================================================

  pompes: {
    id: "pompes",
    name: "Pompes",
    category: "Force",
    icon: "fitness-outline",
    mode: "repetitions",
    target: 100,
    unit: "reps",
    accent: "#00FF87",
  },

  squats: {
    id: "squats",
    name: "Squats",
    category: "Force",
    icon: "body-outline",
    mode: "repetitions",
    target: 100,
    unit: "reps",
    accent: "#00FF87",
  },

  abdos: {
    id: "abdos",
    name: "Abdos",
    category: "Force",
    icon: "fitness-outline",
    mode: "repetitions",
    target: 80,
    unit: "reps",
    accent: "#00FF87",
  },

  tractions: {
    id: "tractions",
    name: "Tractions",
    category: "Force",
    icon: "barbell-outline",
    mode: "repetitions",
    target: 30,
    unit: "reps",
    accent: "#00FF87",
  },

  musculation: {
    id: "musculation",
    name: "Musculation",
    category: "Force",
    icon: "barbell-outline",
    mode: "sets",
    sets: 4,
    reps: 12,
    target: 4,
    unit: "sets",
    accent: "#00FF87",
  },

  planche: {
    id: "planche",
    name: "Planche",
    category: "Force",
    icon: "timer-outline",
    mode: "duration",
    target: 120,
    unit: "sec",
    accent: "#00FF87",
  },

  // ==========================================================
  // CARDIO
  // ==========================================================

  course: {
    id: "course",
    name: "Course",
    category: "Cardio",
    icon: "walk-outline",
    mode: "distance",
    target: 5,
    unit: "km",
    accent: "#00C8FF",
  },

  marche: {
    id: "marche",
    name: "Marche",
    category: "Cardio",
    icon: "walk-outline",
    mode: "distance",
    target: 5,
    unit: "km",
    accent: "#00C8FF",
  },

  velo: {
    id: "velo",
    name: "Vélo",
    category: "Cardio",
    icon: "bicycle-outline",
    mode: "distance",
    target: 10,
    unit: "km",
    accent: "#00C8FF",
  },

  natation: {
    id: "natation",
    name: "Natation",
    category: "Cardio",
    icon: "water-outline",
    mode: "distance",
    target: 2,
    unit: "km",
    accent: "#00C8FF",
  },

  corde: {
    id: "corde",
    name: "Corde à sauter",
    category: "Cardio",
    icon: "pulse-outline",
    mode: "duration",
    target: 600,
    unit: "sec",
    accent: "#00C8FF",
  },

  // ==========================================================
  // COMBAT
  // ==========================================================

  boxe: {
    id: "boxe",
    name: "Boxe",
    category: "Combat",
    icon: "hand-left-outline",
    mode: "duration",
    target: 1200,
    unit: "sec",
    accent: "#FF5C5C",
  },

  hiit: {
    id: "hiit",
    name: "HIIT",
    category: "Combat",
    icon: "flame-outline",
    mode: "duration",
    target: 1200,
    unit: "sec",
    accent: "#FF5C5C",
  },

  // ==========================================================
  // MOBILITÉ
  // ==========================================================

  etirements: {
    id: "etirements",
    name: "Étirements",
    category: "Mobilité",
    icon: "body-outline",
    mode: "duration",
    target: 600,
    unit: "sec",
    accent: "#B58CFF",
  },

  yoga: {
    id: "yoga",
    name: "Yoga",
    category: "Mobilité",
    icon: "leaf-outline",
    mode: "duration",
    target: 1200,
    unit: "sec",
    accent: "#B58CFF",
  },

  // ==========================================================
  // SPORTS
  // ==========================================================

  football: {
    id: "football",
    name: "Football",
    category: "Sports",
    icon: "football-outline",
    mode: "duration",
    target: 3600,
    unit: "sec",
    accent: "#FFD166",
  },

  basketball: {
    id: "basketball",
    name: "Basketball",
    category: "Sports",
    icon: "basketball-outline",
    mode: "duration",
    target: 1800,
    unit: "sec",
    accent: "#FFD166",
  },

  tennis: {
    id: "tennis",
    name: "Tennis",
    category: "Sports",
    icon: "tennisball-outline",
    mode: "duration",
    target: 3600,
    unit: "sec",
    accent: "#FFD166",
  },

  badminton: {
    id: "badminton",
    name: "Badminton",
    category: "Sports",
    icon: "fitness-outline",
    mode: "duration",
    target: 1800,
    unit: "sec",
    accent: "#FFD166",
  },
};

export const WORKOUT_LIST =
  Object.values(WORKOUT_TYPES);

export const WORKOUT_CATEGORIES = [
  {
    id: "force",
    name: "Force",
    icon: "barbell-outline",
  },
  {
    id: "cardio",
    name: "Cardio",
    icon: "heart-outline",
  },
  {
    id: "combat",
    name: "Combat",
    icon: "flame-outline",
  },
  {
    id: "mobilite",
    name: "Mobilité",
    icon: "body-outline",
  },
  {
    id: "sports",
    name: "Sports",
    icon: "trophy-outline",
  },
];

export const getWorkoutType = (id) => {
  return WORKOUT_TYPES[id] || WORKOUT_TYPES.squats;
};

