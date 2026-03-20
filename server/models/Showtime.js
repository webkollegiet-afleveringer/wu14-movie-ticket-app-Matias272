import mongoose from "mongoose";

const seatSchema = new mongoose.Schema(
  {
    seatNumber: { type: String, required: true },
    status: {
      type: String,
      enum: ["available", "reserved"],
      default: "available",
    },
    reservedAt: { type: Date },
  },
  { _id: false },
);

const showtimeSchema = new mongoose.Schema(
  {
    movieId: { type: String, required: true },
    cinemaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cinema",
      required: true,
    },
    date: { type: String, required: true },
    time: { type: String, required: true },
    seats: [seatSchema],
  },
  { timestamps: true },
);

showtimeSchema.index(
  { movieId: 1, cinemaId: 1, date: 1, time: 1 },
  { unique: true },
);

export default mongoose.model("Showtime", showtimeSchema);
