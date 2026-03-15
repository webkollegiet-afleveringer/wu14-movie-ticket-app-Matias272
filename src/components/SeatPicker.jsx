import { useEffect, useState } from "react";
import { generateSeats } from "../data/seats";
import "./SeatPicker.scss";

const ROWS = ["A", "B", "C", "D", "E", "F"];

export default function SeatPicker({
  showtimeId,
  selectedSeats,
  onSeatsChange,
}) {
  const [seats, setSeats] = useState([]);

  useEffect(() => {
    if (showtimeId) setSeats(generateSeats(showtimeId));
  }, [showtimeId]);

  const toggle = (seat) => {
    if (seat.status === "reserved") return;
    const isSelected = selectedSeats.includes(seat.id);
    onSeatsChange(
      isSelected
        ? selectedSeats.filter((s) => s !== seat.id)
        : [...selectedSeats, seat.id],
    );
  };

  const getStatus = (seat) => {
    if (seat.status === "reserved") return "reserved";
    if (selectedSeats.includes(seat.id)) return "selected";
    return "available";
  };

  const seatsInRow = (row, colRange) =>
    seats.filter((s) => s.row === row && colRange(s.col));

  return (
    <div className="seat-picker">
      <div className="seat-picker_screen">
        <div className="screen-curve" />
        <p>SCREEN</p>
      </div>

      <div className="seat-picker_grid">
        {ROWS.map((row) => (
          <div key={row} className="seat-row">
            <span className="row-label">{row}</span>

            <div className="row-group">
              {seatsInRow(row, (c) => c <= 5).map((seat) => (
                <button
                  key={seat.id}
                  className={`seat ${getStatus(seat)}`}
                  onClick={() => toggle(seat)}
                  aria-label={`Seat ${seat.id}`}
                  disabled={seat.status === "reserved"}
                />
              ))}
            </div>

            <div className="aisle" />

            <div className="row-group">
              {seatsInRow(row, (c) => c > 5).map((seat) => (
                <button
                  key={seat.id}
                  className={`seat ${getStatus(seat)}`}
                  onClick={() => toggle(seat)}
                  aria-label={`Seat ${seat.id}`}
                  disabled={seat.status === "reserved"}
                />
              ))}
            </div>

            <span className="row-label">{row}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
