import mongoose from "mongoose";
const bookShema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true, //supprimer space before and after chaine caractere
  },
  author: {
    type: String,
    required: true,
    trim: true,
  },
  available: {
    type: Boolean,
    default: true,
  },
  borrowedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  borrowDate: Date,
  returnDate: Date,
});
export default mongoose.model("book", bookShema);
