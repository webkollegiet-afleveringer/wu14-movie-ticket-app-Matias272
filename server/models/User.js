import mongoose from "mongoose";

const bookmarkSchema = new mongoose.Schema(
  {
    movieId: { type: String, required: true },
    title: { type: String, required: true },
    posterPath: { type: String, default: "" },
    backdropPath: { type: String, default: "" },
    releaseDate: { type: String, default: "" },
    voteAverage: { type: Number, default: 0 },
  },
  { _id: false },
);

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    bookmarks: {
      type: [bookmarkSchema],
      default: [],
    },
  },
  { timestamps: true },
);

export default mongoose.model("User", userSchema);
