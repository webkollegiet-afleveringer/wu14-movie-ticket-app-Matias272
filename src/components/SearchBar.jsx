import { Link } from "react-router";
import { useState } from "react";
import { searchMovies } from "../tmdb";
import "./SearchBar.scss";
import Search from "../assets/icons/btnSearchInput.svg";

export default function SearchOverlay() {
  return (
    <div className="search-overlay">
      <input type="text" placeholder="Search movie..." />
      <img className="search-overlay_icon" src={Search} alt="" />
    </div>
  );
}
