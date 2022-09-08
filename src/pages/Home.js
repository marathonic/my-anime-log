import { useReducer, useState } from "react";
import { Link } from "react-router-dom";
import { Category, Sidebar } from "../components/primedComps";
import SearchBar from "../components/SearchBar";
import { AnimeCard } from "../components/primedComps";
import { initial } from "lodash";

export default function Home({
  handleSearch,
  search,
  setSearch,
  animeList,
  isMobile,
  allTopAnime,
  overall,
  movies,
  popular,
}) {
  let topOverall, topMovies, topSpecials, topPopular;

  const renderMapped = (category, isMobile) => {
    let mapped = category.map((anime) => {
      return (
        <span className="category-span" key={anime.mal_id}>
          <AnimeCard clickedAnime={anime} />
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
        <Category isMobile={isMobile}>{mapped}</Category>
      </div>
    );
    return mapped;
  };

  // let myOverall;

  if (overall) {
    console.log("fulfilled.overall is false");
    topOverall = renderMapped(overall, (isMobile = { isMobile }));
  }

  if (movies) {
    topMovies = renderMapped(movies, (isMobile = { isMobile }));
  }

  if (popular) {
    topPopular = renderMapped(popular, (isMobile = { isMobile }));
  }

  /* 
   const topTen = allTopAnime.map((anime) => {
   
   });
  */
  return (
    <div>
      <h1>
        <SearchBar />
        <span className="centered-span">
          <h3>Explore</h3>
        </span>
      </h1>
      <Sidebar></Sidebar>
      {/* look into lazy loading, it's exactly what we want here to polish up our presentation */}
      {/* Right now, if the images haven't loaded, the section just isn't showing. */}
      {/* We want to fix that:  */}
      {/* while the images are loading, we want to render divs that clearly indicate it, e.g: a sliding glow across each div */}
      {/* <Category isMobile={isMobile}>{topTen}</Category> */}
      <h3>Top anime</h3>
      {overall && topOverall}
      <h3>Top popular</h3>
      {popular && topPopular}
      <h3>Top movies</h3>
      {movies && topMovies}
    </div>
  );
}
