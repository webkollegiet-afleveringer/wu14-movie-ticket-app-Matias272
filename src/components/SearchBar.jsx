import { useState } from "react";
import { searchMovies } from "../tmdb";
import MovieCard from "./MovieCard";
import "./SearchBar.scss";
export default function SearchBar() {



  return (
    <div className="search-overlay">

      <input
        type="text"
        placeholder="Search movie..."
      />

     

    </div>
  );
}