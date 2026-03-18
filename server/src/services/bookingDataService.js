import Cinema from "../../models/Cinema.js";
import Showtime from "../../models/Showtime.js";

const DEFAULT_CINEMAS = [
  { name: "CineMex Downtown", city: "New York", distanceKm: 0.8 },
  { name: "Cinepolis Uptown", city: "New York", distanceKm: 2.3 },
  { name: "Galaxy Cinema", city: "Brooklyn", distanceKm: 5.1 },
  { name: "Regal Moviehouse", city: "Queens", distanceKm: 7.4 },
  { name: "Cinepolis Grand", city: "Manhattan", distanceKm: 3.2 },
];

const SHOW_TIMES = ["10:00", "12:30", "15:00", "17:45", "20:15", "22:30"];

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

export async function ensureCinemasSeeded() {
  const count = await Cinema.countDocuments();
  if (count > 0) return;
  await Cinema.insertMany(DEFAULT_CINEMAS);
}

export async function ensureMovieShowtimes(movieId) {
  await ensureCinemasSeeded();
  const cinemas = await Cinema.find().sort({ createdAt: 1 });
  const today = new Date();

  for (let dayOffset = 0; dayOffset < 3; dayOffset += 1) {
    const currentDate = new Date(today);
    currentDate.setDate(today.getDate() + dayOffset);
    const date = toDateStr(currentDate);

    for (const cinema of cinemas) {
      const seed = hashString(`${movieId}-${cinema._id.toString()}-${dayOffset}`);
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
