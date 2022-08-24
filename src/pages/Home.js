import { useState } from "react";
import { Category, Sidebar } from "../components/primedComps";

export default function Home({ setSearch, topAnime, isMobile }) {
  const topTen = topAnime.map((anime) => {
    return (
      <span className="category-span" key={anime.mal_id}>
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
      <Category isMobile={isMobile}>{topTen}</Category>
    </div>
  );
}
