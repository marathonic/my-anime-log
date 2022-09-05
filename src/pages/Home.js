import { useState } from "react";
import { Link } from "react-router-dom";
import { Category, Sidebar } from "../components/primedComps";
import SearchBar from "../components/SearchBar";

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
        <SearchBar />
        <span className="centered-span">
          <h3>Explore</h3>
        </span>
      </h1>
      <Sidebar></Sidebar>
      <h3>Top anime</h3>
      {/* look into lazy loading, it's exactly what we want here to polish up our presentation */}
      {/* Right now, if the images haven't loaded, the section just isn't showing. */}
      {/* We want to fix that:  */}
      {/* while the images are loading, we want to render divs that clearly indicate it, e.g: a sliding glow across each div */}
      <Category isMobile={isMobile}>{topTen}</Category>
    </div>
  );
}
