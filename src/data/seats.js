const ROWS = ["A", "B", "C", "D", "E", "F"];
const COLS = Array.from({ length: 10 }, (_, i) => i + 1);

function seededRandom(seed) {
  let s = seed >>> 0;
  return () => {
    s = (Math.imul(1664525, s) + 1013904223) >>> 0;
    return s / 0xffffffff;
  };
}

/**
 * Generates a deterministic seat map for a given showtime.
 * ~35% of seats are randomly pre-reserved so each screening looks realistic.
 */
export function generateSeats(showtimeId) {
  const seed = showtimeId
    .split("")
    .reduce((a, c) => ((a << 5) + a + c.charCodeAt(0)) & 0x7fffffff, 5381);
  const rand = seededRandom(seed);

  return ROWS.flatMap((row) =>
    COLS.map((col) => ({
      id: `${row}${col}`,
      row,
      col,
      status: rand() < 0.35 ? "reserved" : "available",
    })),
  );
}
