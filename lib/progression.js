const XP_PER_REPETITION = 1;
const XP_PER_MINUTE = 2;
const XP_PER_LEVEL = 1000;

const LEVEL_NAMES = [
  "DÉBUTANT",
  "RÉGULIER",
  "DISCIPLINÉ",
  "ATHLÈTE",
  "GUERRIER",
  "VÉTÉRAN",
  "ÉLITE",
];

export const getWorkoutXP = (workout) => {
  if (!workout) return 0;

  let xp = 0;

  if (workout.sets != null) {
    const sets = Number(workout.sets) || 0;
    const repetitionsPerSet = Number(workout.repetitionsPerSet) || 0;

    xp += sets * repetitionsPerSet * XP_PER_REPETITION;
  } else if (workout.repetitions != null) {
    xp += (Number(workout.repetitions) || 0) * XP_PER_REPETITION;
  }

  if (workout.duration != null) {
    const durationSeconds = Number(workout.duration) || 0;

    const durationMinutes = Math.floor(durationSeconds / 60);

    xp += durationMinutes * XP_PER_MINUTE;
  }

  return xp;
};

export const getTotalXP = (workoutHistory = []) => {
  if (!Array.isArray(workoutHistory)) {
    return 0;
  }

  return workoutHistory.reduce(
    (total, workout) => total + getWorkoutXP(workout),
    0,
  );
};

export const getProgression = (workoutHistory = []) => {
  const totalXP = getTotalXP(workoutHistory);

  const level = Math.floor(totalXP / XP_PER_LEVEL) + 1;

  const levelIndex = Math.min(level - 1, LEVEL_NAMES.length - 1);

  const levelName = LEVEL_NAMES[levelIndex];

  const currentXP = totalXP % XP_PER_LEVEL;

  const levelProgress = currentXP / XP_PER_LEVEL;

  return {
    totalXP,
    level,
    levelName,
    currentXP,
    nextXP: XP_PER_LEVEL,
    levelProgress,
  };
};
