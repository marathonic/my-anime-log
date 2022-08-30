import { useState } from "react";
import { Link } from "react-router-dom";
import { Category, Sidebar } from "../components/primedComps";

export default function Home({
  handleSearch,
  search,
  setSearch,
  topAnime,
  animeList,
  isMobile,
}) {
  const topTen = topAnime.map((anime) => {
    return (
      <span className="category-span" key={anime.mal_id}>
        {/* This img goes inside a <Link> <img/> </Link>! */}
        {/* <AnimeCard clickedAnime={anime} /> */}
        <Link to={`/anime/${anime.mal_id}`} key={anime.mal_id}>
          <img
            src={anime.images.jpg.image_url}
            alt={anime.title}
            className="thumbnail-category"
          />
        </Link>
      </span>
    );
  });

  return (
    <div>
      <h1>
        <span className="centered-span">
          <h3>Explore</h3>
        </span>
      </h1>
      <Sidebar></Sidebar>
      <h3>Top anime</h3>
      <Category isMobile={isMobile}>{topTen}</Category>
    </div>
  );
}
