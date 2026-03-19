import Cinema from "../../models/Cinema.js";
import Showtime from "../../models/Showtime.js";
import Booking from "../../models/Booking.js";
import {
  ensureCinemasSeeded,
  ensureMovieShowtimes,
} from "../services/bookingDataService.js";
import validatePayment from "../utils/validatePayment.js";
const TICKET_PRICE = 12.99;

async function normalizeLegacyReservedSeats(showtime) {
  const paidBookings = await Booking.find({
    showtimeId: showtime._id,
    status: "paid",
  })
    .select("seats")
    .lean();

  const bookedSeats = new Set(paidBookings.flatMap((booking) => booking.seats));
  let changed = false;

  showtime.seats = showtime.seats.map((seat) => {
    const shouldBeReserved = bookedSeats.has(seat.seatNumber);

    if (shouldBeReserved && seat.status !== "reserved") {
      changed = true;
      return {
        ...seat.toObject(),
        status: "reserved",
        reservedAt: seat.reservedAt || new Date(),
      };
    }

    if (!shouldBeReserved && seat.status === "reserved") {
      changed = true;
      return {
        ...seat.toObject(),
        status: "available",
        reservedAt: undefined,
      };
    }

    return seat;
  });

  if (changed) {
    await showtime.save();
  }
}

function generateBookingId() {
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  const t = Date.now().toString(36).slice(-4).toUpperCase();
  return `BK${rand}${t}`;
}

export async function getCinemas(req, res) {
  try {
    await ensureCinemasSeeded();
    const cinemas = await Cinema.find().sort({ distanceKm: 1 });
    res.json(cinemas);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to load cinemas", error: error.message });
  }
}

export async function getShowtimes(req, res) {
  try {
    const { movieId, date } = req.query;
    if (!movieId) {
      return res
        .status(400)
        .json({ message: "movieId query param is required" });
    }

    await ensureMovieShowtimes(movieId);

    const query = { movieId: String(movieId) };
    if (date) query.date = date;

    const showtimes = await Showtime.find(query)
      .populate("cinemaId", "name city distanceKm")
      .sort({ date: 1, time: 1 });

    res.json(
      showtimes.map((s) => ({
        id: s._id,
        movieId: s.movieId,
        cinema: s.cinemaId,
        date: s.date,
        time: s.time,
      })),
    );
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to load showtimes", error: error.message });
  }
}

export async function getShowtimeSeats(req, res) {
  try {
    const { showtimeId } = req.params;
    const showtime = await Showtime.findById(showtimeId).populate(
      "cinemaId",
      "name city distanceKm",
    );
    if (!showtime)
      return res.status(404).json({ message: "Showtime not found" });

    await normalizeLegacyReservedSeats(showtime);

    res.json({
      id: showtime._id,
      movieId: showtime.movieId,
      cinema: showtime.cinemaId,
      date: showtime.date,
      time: showtime.time,
      seats: showtime.seats,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to load seats", error: error.message });
  }
}

export async function checkoutBooking(req, res) {
  try {
    const { movieId, movieTitle, moviePoster, showtimeId, seats, payment } =
      req.body;

    if (
      !movieId ||
      !movieTitle ||
      !showtimeId ||
      !Array.isArray(seats) ||
      seats.length === 0
    ) {
      return res
        .status(400)
        .json({ message: "Missing required booking fields" });
    }

    const paymentError = validatePayment(payment);
    if (paymentError) {
      return res.status(400).json({ message: paymentError });
    }

    const showtime = await Showtime.findById(showtimeId).populate(
      "cinemaId",
      "name city distanceKm",
    );
    if (!showtime)
      return res.status(404).json({ message: "Showtime not found" });

    await normalizeLegacyReservedSeats(showtime);

    const unavailable = seats.filter((seat) => {
      const seatRef = showtime.seats.find((s) => s.seatNumber === seat);
      return !seatRef || seatRef.status === "reserved";
    });

    if (unavailable.length > 0) {
      return res.status(409).json({
        message: "Some seats are already reserved",
        unavailable,
      });
    }

    showtime.seats = showtime.seats.map((seat) =>
      seats.includes(seat.seatNumber)
        ? { ...seat.toObject(), status: "reserved", reservedAt: new Date() }
        : seat,
    );
    await showtime.save();

    const booking = await Booking.create({
      bookingId: generateBookingId(),
      movieId: String(movieId),
      movieTitle,
      moviePoster: moviePoster || "",
      cinemaId: showtime.cinemaId._id,
      showtimeId: showtime._id,
      showtime: {
        date: showtime.date,
        time: showtime.time,
      },
      seats,
      user: {
        name: payment.name.trim(),
        email: payment.email.trim(),
      },
      amount: Number((seats.length * TICKET_PRICE).toFixed(2)),
      status: "paid",
    });

    res.status(201).json({ bookingId: booking.bookingId });
  } catch (error) {
    res.status(500).json({ message: "Checkout failed", error: error.message });
  }
}

export async function getTicket(req, res) {
  try {
    const { bookingId } = req.params;
    const booking = await Booking.findOne({ bookingId })
      .populate("cinemaId", "name city distanceKm")
      .populate("showtimeId", "date time");

    if (!booking) return res.status(404).json({ message: "Ticket not found" });

    res.json({
      bookingId: booking.bookingId,
      movie: {
        id: booking.movieId,
        title: booking.movieTitle,
        poster: booking.moviePoster,
      },
      cinema: booking.cinemaId,
      showtime: {
        date: booking.showtime.date,
        time: booking.showtime.time,
      },
      seats: booking.seats,
      user: booking.user,
      amount: booking.amount,
      status: booking.status,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to load ticket", error: error.message });
  }
}
