import mongoose from "mongoose";

const cinemaSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    city: { type: String, required: true },
    distanceKm: { type: Number, required: true },
  },
  { timestamps: true },
);

export default mongoose.model("Cinema", cinemaSchema);
