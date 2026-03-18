import { BrowserRouter, Routes, Route } from "react-router";

import { BookingProvider } from "./context/BookingContext";
import Home from "./pages/Home";
import MovieDetails from "./pages/MovieDetails";
import Explore from "./pages/Explore";
import Profile from "./pages/Profile";
import CinemaPicker from "./pages/CinemaPicker";
import Checkout from "./pages/Checkout";
import Ticket from "./pages/Ticket";
import "./styles/main.scss";

export default function App() {
  return (
    <BookingProvider>
      <main className="page-wrapper">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/movie/:id" element={<MovieDetails />} />
            <Route path="/booking/:movieId/cinema" element={<CinemaPicker />} />
            <Route path="/booking/:movieId/seats" element={<CinemaPicker />} />
            <Route path="/booking/:movieId/checkout" element={<Checkout />} />
            <Route path="/booking/ticket" element={<Ticket />} />
          </Routes>
        </BrowserRouter>
      </main>
    </BookingProvider>
  );
}
