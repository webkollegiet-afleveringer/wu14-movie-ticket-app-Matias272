import express from "express";
import {
  getCinemas,
  getShowtimes,
  getShowtimeSeats,
  checkoutBooking,
  getTicket,
} from "../controllers/bookingController.js";

const router = express.Router();

router.get("/cinemas", getCinemas);
router.get("/showtimes", getShowtimes);
router.get("/showtimes/:showtimeId/seats", getShowtimeSeats);
router.post("/checkout", checkoutBooking);
router.get("/ticket/:bookingId", getTicket);

export default router;
