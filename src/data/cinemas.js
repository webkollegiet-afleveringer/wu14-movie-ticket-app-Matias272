export const cinemas = [
  { id: "c1", name: "CineMax Downtown", city: "New York", distance: "0.8 km" },
  { id: "c2", name: "StarPlex Uptown", city: "New York", distance: "2.3 km" },
  { id: "c3", name: "Galaxy Cinema", city: "Brooklyn", distance: "5.1 km" },
  { id: "c4", name: "Regal Moviehouse", city: "Queens", distance: "7.4 km" },
  { id: "c5", name: "Cinepolis Grand", city: "Manhattan", distance: "3.2 km" },
];

const SHOW_TIMES = ["10:00", "12:30", "15:00", "17:45", "20:15", "22:30"];

function simpleHash(str) {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash + str.charCodeAt(i)) & 0x7fffffff;
  }
  return hash;
}

/**
 * Generates deterministic showtimes for a given movie across all cinemas
 * for the next 3 days. The same movieId always yields the same schedule.
 */
export function generateShowtimes(movieId) {
  const today = new Date();
  const showtimes = [];

  for (let dayOffset = 0; dayOffset < 3; dayOffset++) {
    const date = new Date(today);
    date.setDate(today.getDate() + dayOffset);
    const dateStr = date.toISOString().split("T")[0];

    cinemas.forEach((cinema) => {
      const seed = simpleHash(String(movieId) + cinema.id + String(dayOffset));
      // Pick 3 distinct time-slot indices for each cinema / day
      const indices = new Set();
      let s = seed;
      while (indices.size < 3) {
        s = (s * 1664525 + 1013904223) & 0x7fffffff;
        indices.add(s % SHOW_TIMES.length);
      }
      [...indices]
        .sort((a, b) => a - b)
        .forEach((ti) => {
          showtimes.push({
            id: `st-${movieId}-${cinema.id}-${dayOffset}-${ti}`,
            movieId: String(movieId),
            cinemaId: cinema.id,
            date: dateStr,
            time: SHOW_TIMES[ti],
          });
        });
    });
  }

  return showtimes;
}
