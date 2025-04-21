import mongoose from "mongoose";
const userShema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Le nom est requis"],
      trim: true
    },
    email: {
      type: String,
      required: [true, "L'email est requis"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Format d'email invalide"],
    },
    password: {
      type: String,
      required: [true, "Le mot de passe est requis"],
      minlength: [6, "Le mot de passe doit contenir au moins 6 caractères"],
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    avatar: {
      type: String,
      default: "default-avatar.png"
    },
    bio: {
      type: String,
      default: ""
    },
    borrowedBooks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Borrowing"
      }
    ],
    resetPasswordToken: String,
    resetPasswordExpire: Date
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", userShema);
