import jsonwebtoken from "jsonwebtoken";
import { signinSchema, signupSchema } from "../middlewares/validator.js";
import User from "../models/usersModels.js";
import { doHash, doHashValidation } from "../utils/hashing.js";

export const signupController = async (req, res) => {
  const { email, password } = req.body;
  try {
    const { error, value } = signupSchema.validate({ email, password });
    if (error) {
      return res.status(401).json({
        success: false,
        message: error.details[0].message,
      });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(401)
        .json({ success: false, message: "L'adresse email existe déjà." });
    }

    const hashedPassword = await doHash(password, 12);
    const newUser = new User({
      email,
      password: hashedPassword,
    });
    const result = await newUser.save();
    result.password = undefined;
    res.status(201).json({
      success: true,
      message: "Ton compte a été crée avec succès",
      result,
    });
  } catch (error) {
    console.log(error);
  }
};

export const signinController = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Validation des données
    const { error, value } = signinSchema.validate({ email, password });
    if (error) {
      return res
        .status(401)
        .json({ success: false, message: error.details[0].message });
    }

    //  Vérification de l'utilisateur
    const existingUser = await User.findOne({ email }).select("+password");
    if (!existingUser) {
      return res.status(401).json({
        success: false,
        message: "L'utilisateur n'existe pas",
      });
    }

    // Vérification de l'utilisateur
    const isValidPassword = await doHashValidation(
      password,
      existingUser.password
    );
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: "informations d'identification invalides",
      });
    }
    const token = jsonwebtoken.sign(
      {
        userId: existingUser._id,
        email: existingUser.email,
      },
      process.env.TOKEN_SECRET,
      { expiresIn: "08h" }
    );
    res
      .cookie("Authorization", "Bearer" + token, {
        expires: new Date(Date.now() + 8 * 3600000),
        httpOnly: process.env.NODE_ENV === "production",
        secure: process.env.NODE_ENV === "production",
      })
      .json({
        success: true,
        token,
        message: "connecté avec succès",
      });
  } catch (error) {
    console.log("Erreur lors de la connexion ", error);
    res.status(500).json({
      success: false,
      message: "erreur interne du serveur",
    });
  }
};
