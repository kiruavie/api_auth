import mongoose from "mongoose";

const { Schema } = mongoose;

const usersSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, "L'addresse email est néccessaire"],
      trim: true,
      unique: [true, "L'addresse Email est unique"],
      lower: true,
    },
    password: {
      type: String,
      required: [true, "Le mot de passe est réquis"],
      trim: true,
      select: true,
    },

    verified: {
      type: Boolean,
      default: false,
    },
    verificationCode: {
      type: Number,
      select: false,
    },
    verificationCodeValidation: {
      type: Number,
      select: false,
    },
    forgotPasswordCode: {
      type: String,
      select: false,
    },
    forgotPasswordCodeValidation: {
      type: Number,
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", usersSchema);

export default User;
