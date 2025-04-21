import mongoose from "mongoose";

const bookSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Veuillez ajouter un titre"],
    },
    author: {
      type: String,
      required: [true, "Veuillez ajouter un auteur"],
    },
    description: {
      type: String,
      default: "",
    },
    genre: {
      type: String,
      default: "Non spécifié",
    },
    publishedYear: {
      type: Number,
    },
    isbn: {
      type: String,
      default: "",
    },
    coverImage: {
      type: String,
      default: "uploads/default-book-cover.png",
    },
    available: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Book", bookSchema);
