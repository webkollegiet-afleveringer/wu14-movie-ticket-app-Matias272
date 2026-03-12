import { Link } from "react-router";
import { useState } from "react";
import { searchMovies } from "../tmdb";
import "./SearchBar.scss";

export default function SearchOverlay() {
  

  return (
    <div className="search-overlay">
      <input
        type="text"
        placeholder="Search movie..."
      
      />

      
    </div>
  );
}
