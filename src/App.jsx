import { BrowserRouter, Routes, Route } from "react-router";

import Home from "./pages/Home";
import MovieDetails from "./pages/MovieDetails";
import SeatSelection from "./pages/SeatSelection";
import Checkout from "./pages/Checkout";
import Ticket from "./pages/Ticket";
import "./styles/main.scss";
export default function App() {
  return (
    <div className="page-wrapper">
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movie/:id" element={<MovieDetails />} />
        <Route path="/movie/:id" element={<MovieDetails />} />
        <Route path="/seats/:id" element={<SeatSelection />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/ticket" element={<Ticket />} />
      </Routes>
    </BrowserRouter>
    </div>
  );
}

