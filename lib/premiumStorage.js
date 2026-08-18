import AsyncStorage from "@react-native-async-storage/async-storage";

const PREMIUM_KEY = "sidiq-sport-premium";

export const getPremiumStatus = async () => {
  try {
    const storedValue =
      await AsyncStorage.getItem(PREMIUM_KEY);

    return storedValue === "true";
  } catch (error) {
    console.log(
      "Impossible de récupérer le statut Premium :",
      error
    );

    return false;
  }
};

export const setPremiumStatus = async (isPremium) => {
  try {
    await AsyncStorage.setItem(
      PREMIUM_KEY,
      isPremium ? "true" : "false"
    );

    return true;
  } catch (error) {
    console.log(
      "Impossible de sauvegarder le statut Premium :",
      error
    );

    return false;
  }
};

export const clearPremiumStatus = async () => {
  try {
    await AsyncStorage.removeItem(
      PREMIUM_KEY
    );
  } catch (error) {
    console.log(
      "Impossible de supprimer le statut Premium :",
      error
    );
  }
};
