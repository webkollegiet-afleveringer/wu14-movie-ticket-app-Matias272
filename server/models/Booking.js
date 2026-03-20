import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    bookingId: { type: String, required: true, unique: true },
    movieId: { type: String, required: true },
    movieTitle: { type: String, required: true },
    moviePoster: { type: String, default: "" },
    cinemaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cinema",
      required: true,
    },
    showtimeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Showtime",
      required: true,
    },
    showtime: {
      date: { type: String, required: true },
      time: { type: String, required: true },
    },
    seats: [{ type: String, required: true }],
    user: {
      name: { type: String, required: true },
      email: { type: String, required: true },
    },
    amount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["paid"],
      default: "paid",
    },
  },
  { timestamps: true },
);

export default mongoose.model("Booking", bookingSchema);
