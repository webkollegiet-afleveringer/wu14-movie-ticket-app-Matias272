import "./SeatPicker.scss";

const ROWS = ["A", "B", "C", "D", "E", "F"];

export default function SeatPicker({ seats, selectedSeats, onSeatsChange }) {
  const toggle = (seat) => {
    if (seat.status === "reserved") return;
    const isSelected = selectedSeats.includes(seat.seatNumber);
    onSeatsChange(
      isSelected
        ? selectedSeats.filter((s) => s !== seat.seatNumber)
        : [...selectedSeats, seat.seatNumber],
    );
  };

  const getStatus = (seat) => {
    if (seat.status === "reserved") return "reserved";
    if (selectedSeats.includes(seat.seatNumber)) return "selected";
    return "available";
  };

  const seatsInRow = (row, colRange) =>
    seats.filter(
      (s) =>
        s.seatNumber.startsWith(row) && colRange(Number(s.seatNumber.slice(1))),
    );

  return (
    <div className="seat-picker">
      <div className="seat-picker_screen">
        <div className="screen-curve" />
        <p>Screen</p>
      </div>

      <div className="seat-picker_grid">
        {ROWS.map((row) => (
          <div key={row} className="seat-row">
            <span className="row-label">{row}</span>

            <div className="row-group">
              {seatsInRow(row, (c) => c <= 5).map((seat) => (
                <button
                  key={seat.seatNumber}
                  className={`seat ${getStatus(seat)}`}
                  onClick={() => toggle(seat)}
                  aria-label={`Seat ${seat.seatNumber}`}
                  disabled={seat.status === "reserved"}
                />
              ))}
            </div>

            <div className="aisle" />

            <div className="row-group">
              {seatsInRow(row, (c) => c > 5).map((seat) => (
                <button
                  key={seat.seatNumber}
                  className={`seat ${getStatus(seat)}`}
                  onClick={() => toggle(seat)}
                  aria-label={`Seat ${seat.seatNumber}`}
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
