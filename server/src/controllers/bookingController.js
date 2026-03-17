import Cinema from "../../models/Cinema.js";
import Showtime from "../../models/Showtime.js";
import Booking from "../../models/Booking.js";

const DEFAULT_CINEMAS = [
  { name: "CineMax Downtown", city: "New York", distanceKm: 0.8 },
  { name: "StarPlex Uptown", city: "New York", distanceKm: 2.3 },
  { name: "Galaxy Cinema", city: "Brooklyn", distanceKm: 5.1 },
  { name: "Regal Moviehouse", city: "Queens", distanceKm: 7.4 },
  { name: "Cinepolis Grand", city: "Manhattan", distanceKm: 3.2 },
];

const SHOW_TIMES = ["10:00", "12:30", "15:00", "17:45", "20:15", "22:30"];
const TICKET_PRICE = 12.99;

function toDateStr(date) {
  return date.toISOString().split("T")[0];
}

function hashString(input) {
  let hash = 5381;
  for (let i = 0; i < input.length; i += 1) {
    hash = ((hash << 5) + hash + input.charCodeAt(i)) & 0x7fffffff;
  }
  return hash;
}

function seededRandom(seed) {
  let s = seed >>> 0;
  return () => {
    s = (Math.imul(1664525, s) + 1013904223) >>> 0;
    return s / 0xffffffff;
  };
}

function buildSeatLayout(showtimeSeed) {
  const rows = ["A", "B", "C", "D", "E", "F"];
  const cols = Array.from({ length: 10 }, (_, i) => i + 1);
  const rand = seededRandom(hashString(showtimeSeed));

  return rows.flatMap((row) =>
    cols.map((col) => {
      const seatNumber = `${row}${col}`;
      const preReserved = rand() < 0.22;
      return {
        seatNumber,
        status: preReserved ? "reserved" : "available",
      };
    }),
  );
}

async function ensureCinemasSeeded() {
  const count = await Cinema.countDocuments();
  if (count > 0) return;
  await Cinema.insertMany(DEFAULT_CINEMAS);
}

async function ensureMovieShowtimes(movieId) {
  await ensureCinemasSeeded();
  const cinemas = await Cinema.find().sort({ createdAt: 1 });
  const today = new Date();

  for (let dayOffset = 0; dayOffset < 3; dayOffset += 1) {
    const currentDate = new Date(today);
    currentDate.setDate(today.getDate() + dayOffset);
    const date = toDateStr(currentDate);

    for (const cinema of cinemas) {
      const seed = hashString(
        `${movieId}-${cinema._id.toString()}-${dayOffset}`,
      );
      const indices = new Set();
      let s = seed;

      while (indices.size < 3) {
        s = (s * 1664525 + 1013904223) & 0x7fffffff;
        indices.add(s % SHOW_TIMES.length);
      }

      for (const idx of [...indices].sort((a, b) => a - b)) {
        const time = SHOW_TIMES[idx];
        const existing = await Showtime.findOne({
          movieId: String(movieId),
          cinemaId: cinema._id,
          date,
          time,
        });
        if (!existing) {
          await Showtime.create({
            movieId: String(movieId),
            cinemaId: cinema._id,
            date,
            time,
            seats: buildSeatLayout(
              `${movieId}-${cinema._id.toString()}-${date}-${time}`,
            ),
          });
        }
      }
    }
  }
}

function validatePayment(payment) {
  if (!payment) return "Payment info is required";

  const name = (payment.name || "").trim();
  const email = (payment.email || "").trim();
  const cardNumber = String(payment.cardNumber || "").replace(/\s/g, "");
  const expiry = String(payment.expiry || "").trim();
  const cvv = String(payment.cvv || "").trim();

  if (!name) return "Name is required";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Invalid email";
  if (!/^\d{16}$/.test(cardNumber)) return "Card number must be 16 digits";
  if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry)) return "Expiry must use MM/YY";
  if (!/^\d{3,4}$/.test(cvv)) return "CVV must be 3 or 4 digits";

  return null;
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
