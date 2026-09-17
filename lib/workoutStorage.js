import AsyncStorage from "@react-native-async-storage/async-storage";

const WORKOUT_HISTORY_KEY =
  "sidiq-sport-workout-history";

/*
 * ============================================================
 * RÉCUPÉRER L'HISTORIQUE
 * ============================================================
 */

export const getWorkoutHistory = async () => {
  try {
    const storedHistory =
      await AsyncStorage.getItem(
        WORKOUT_HISTORY_KEY
      );

    if (!storedHistory) {
      return [];
    }

    const parsedHistory =
      JSON.parse(storedHistory);

    return Array.isArray(parsedHistory)
      ? parsedHistory
      : [];
  } catch (error) {
    console.log(
      "Impossible de récupérer l'historique :",
      error
    );

    return [];
  }
};

/*
 * ============================================================
 * SAUVEGARDER UNE SÉANCE
 * ============================================================
 */

export const saveWorkout = async ({
  repetitions = null,
  distance = null,
  duration = null,
  type = "Squats",
  workoutId = "squats",
  category = "Force",
  unit = "reps",
}) => {
  try {
    const history =
      await getWorkoutHistory();

    const workout = {
      id: `${Date.now()}`,

      type,
      workoutId,
      category,

      repetitions,
      distance,
      duration,

      unit,

      date: new Date().toISOString(),
    };

    const updatedHistory = [
      workout,
      ...history,
    ];

    await AsyncStorage.setItem(
      WORKOUT_HISTORY_KEY,
      JSON.stringify(updatedHistory)
    );

    return workout;
  } catch (error) {
    console.log(
      "Impossible de sauvegarder la séance :",
      error
    );

    return null;
  }
};

/*
 * ============================================================
 * SUPPRIMER UNE SÉANCE
 * ============================================================
 */

export const deleteWorkout = async (workoutId) => {
  try {
    const history =
      await getWorkoutHistory();

    const updatedHistory =
      history.filter(
        (workout) =>
          String(workout.id) !==
          String(workoutId)
      );

    await AsyncStorage.setItem(
      WORKOUT_HISTORY_KEY,
      JSON.stringify(updatedHistory)
    );

    return updatedHistory;
  } catch (error) {
    console.log(
      "Impossible de supprimer la séance :",
      error
    );

    return null;
  }
};

/*
 * ============================================================
 * SUPPRIMER L'HISTORIQUE
 * ============================================================
 */

export const clearWorkoutHistory = async () => {
  try {
    await AsyncStorage.removeItem(
      WORKOUT_HISTORY_KEY
    );
  } catch (error) {
    console.log(
      "Impossible de supprimer l'historique :",
      error
    );
  }
};
