import { createContext, useContext, useState } from "react";

const BookingContext = createContext(null);

export function BookingProvider({ children }) {
  const [booking, setBooking] = useState(() => {
    try {
      const saved = sessionStorage.getItem("booking_state");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const updateBooking = (data) => {
    setBooking((prev) => {
      const next = { ...prev, ...data };
      sessionStorage.setItem("booking_state", JSON.stringify(next));
      return next;
    });
  };

  const clearBooking = () => {
    sessionStorage.removeItem("booking_state");
    setBooking({});
  };

  return (
    <BookingContext.Provider value={{ booking, updateBooking, clearBooking }}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error("useBooking must be used inside <BookingProvider>");
  return ctx;
}
