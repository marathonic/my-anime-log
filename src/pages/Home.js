import { useState } from "react";
import { Category, Sidebar } from "../components/primedComps";

export default function Home({ setSearch, topAnime }) {
  const topTen = topAnime.map((anime) => {
    return (
      <span className="category-span">
        <img
          src={anime.images.jpg.image_url}
          alt={anime.title}
          className="thumbnail-category"
        />
      </span>
    );
  });

  return (
    <div>
      <h1>Home</h1>
      <Sidebar></Sidebar>
      <h3>Top anime</h3>
      <Category>{topTen}</Category>
    </div>
  );
}
