import AsyncStorage from "@react-native-async-storage/async-storage";

const WORKOUT_HISTORY_KEY = "sidiq-sport-workout-history";

export const getWorkoutHistory = async () => {
  try {
    const storedHistory = await AsyncStorage.getItem(
      WORKOUT_HISTORY_KEY
    );

    if (!storedHistory) {
      return [];
    }

    const parsedHistory = JSON.parse(storedHistory);

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

export const saveWorkout = async ({
  repetitions,
  duration,
  type = "Squats",
}) => {
  try {
    const history = await getWorkoutHistory();

    const workout = {
      id: `${Date.now()}`,
      type,
      repetitions,
      duration,
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
