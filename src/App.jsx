import { BrowserRouter, Routes, Route } from "react-router";

import Home from "./pages/Home";
import MovieDetails from "./pages/MovieDetails";
import Explore from "./pages/Explore";
import Profile from "./pages/Profile";
import "./styles/main.scss";
export default function App() {
  return (
    <div className="page-wrapper">
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/movie/:id" element={<MovieDetails />} />
      </Routes>
    </BrowserRouter>
    </div>
  );
}

