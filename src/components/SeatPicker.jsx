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

  const isHiddenEdgeSeat = (row, col) =>
    (row === ROWS[0] || row === ROWS[ROWS.length - 1]) &&
    (col === 1 || col === 10);

  const seatsInRow = (row, colRange) =>
    seats.filter(
      (s) => {
        if (!s.seatNumber.startsWith(row)) return false;
        const col = Number(s.seatNumber.slice(1));
        if (isHiddenEdgeSeat(row, col)) return false;
        return colRange(col);
      },
    );

  return (
    <div className="seat-picker">
     

      <div className="seat-picker_grid">
        {ROWS.map((row) => (
          <div key={row} className="seat-row">
            <div className="row-group">
              {seatsInRow(row, (c) => c <= 4).map((seat) => (
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
              {seatsInRow(row, (c) => c > 6).map((seat) => (
                <button
                  key={seat.seatNumber}
                  className={`seat ${getStatus(seat)}`}
                  onClick={() => toggle(seat)}
                  aria-label={`Seat ${seat.seatNumber}`}
                  disabled={seat.status === "reserved"}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
