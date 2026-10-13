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
    structure: "sets_reps",
    target: 100,
    reps: 20,
    rest: 60,
    unit: "reps",
    accent: "#E85002",
  },

  squats: {
    id: "squats",
    name: "Squats",
    category: "Force",
    icon: "body-outline",
    mode: "repetitions",
    structure: "sets_reps",
    target: 100,
    reps: 20,
    rest: 60,
    unit: "reps",
    accent: "#E85002",
  },

  abdos: {
    id: "abdos",
    name: "Abdos",
    category: "Force",
    icon: "fitness-outline",
    mode: "repetitions",
    structure: "sets_reps",
    target: 80,
    reps: 20,
    rest: 45,
    unit: "reps",
    accent: "#E85002",
  },

  tractions: {
    id: "tractions",
    name: "Tractions",
    category: "Force",
    icon: "barbell-outline",
    mode: "repetitions",
    structure: "sets_reps",
    target: 30,
    reps: 10,
    rest: 60,
    unit: "reps",
    accent: "#E85002",
  },

  musculation: {
    id: "musculation",
    name: "Musculation",
    category: "Force",
    icon: "barbell-outline",
    mode: "sets",
    structure: "sets_reps",
    sets: 4,
    reps: 12,
    rest: 60,
    target: 4,
    unit: "sets",
    accent: "#E85002",
  },

  planche: {
    id: "planche",
    name: "Planche",
    category: "Force",
    icon: "timer-outline",
    mode: "duration",
    target: 120,
    unit: "sec",
    accent: "#E85002",
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
    accent: "#F16001",
  },

  marche: {
    id: "marche",
    name: "Marche",
    category: "Cardio",
    icon: "walk-outline",
    mode: "distance",
    target: 5,
    unit: "km",
    accent: "#F16001",
  },

  velo: {
    id: "velo",
    name: "Vélo",
    category: "Cardio",
    icon: "bicycle-outline",
    mode: "distance",
    target: 10,
    unit: "km",
    accent: "#F16001",
  },

  natation: {
    id: "natation",
    name: "Natation",
    category: "Cardio",
    icon: "water-outline",
    mode: "distance",
    target: 2,
    unit: "km",
    accent: "#F16001",
  },

  corde: {
    id: "corde",
    name: "Corde à sauter",
    category: "Cardio",
    icon: "pulse-outline",
    mode: "duration",
    target: 600,
    unit: "sec",
    accent: "#F16001",
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
    accent: "#C10801",
  },

  hiit: {
    id: "hiit",
    name: "HIIT",
    category: "Combat",
    icon: "flame-outline",
    mode: "duration",
    target: 1200,
    unit: "sec",
    accent: "#C10801",
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
    accent: "#D9C3AB",
  },

  yoga: {
    id: "yoga",
    name: "Yoga",
    category: "Mobilité",
    icon: "leaf-outline",
    mode: "duration",
    target: 1200,
    unit: "sec",
    accent: "#D9C3AB",
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
    accent: "#E85002",
  },

  basketball: {
    id: "basketball",
    name: "Basketball",
    category: "Sports",
    icon: "basketball-outline",
    mode: "duration",
    target: 1800,
    unit: "sec",
    accent: "#E85002",
  },

  tennis: {
    id: "tennis",
    name: "Tennis",
    category: "Sports",
    icon: "tennisball-outline",
    mode: "duration",
    target: 3600,
    unit: "sec",
    accent: "#E85002",
  },

  badminton: {
    id: "badminton",
    name: "Badminton",
    category: "Sports",
    icon: "fitness-outline",
    mode: "duration",
    target: 1800,
    unit: "sec",
    accent: "#E85002",
  },
};

export const WORKOUT_LIST = Object.values(WORKOUT_TYPES);

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
  return WORKOUT_TYPES[id] || null;
};
