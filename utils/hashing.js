import bcrypt from "bcryptjs";

// Fonction de hachage
export const doHash = async (value, saltValue) => {
  try {
    const result = await bcrypt.hash(value, saltValue);
    return result;
  } catch (error) {
    throw new Error("Erreur lors du hachage : " + error.message);
  }
};

export const doHashValidation = async (value, hashedValue) => {
  const isValidPassword = await bcrypt.compare(value, hashedValue);
  return isValidPassword;
};
