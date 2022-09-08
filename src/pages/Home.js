import { useState } from "react";
import { Link } from "react-router-dom";
import { Category, Sidebar } from "../components/primedComps";
import SearchBar from "../components/SearchBar";
import { AnimeCard } from "../components/primedComps";

export default function Home({
  handleSearch,
  search,
  setSearch,
  animeList,
  isMobile,
  allTopAnime,
  overall,
  movies,
}) {
  let topOverall, topMovies, topAiring, topSpecials, topPopular;
  const renderMapped = (category) => {
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
    return mapped;
  };

  // let myOverall;
  if (overall) {
    topOverall = renderMapped(overall);
    // myOverall = overall.map((anime) => {
    // return (
    // <span className="category-span" key={anime.mal_id}>
    {
      /* <AnimeCard clickedAnime={anime} /> */
    }
    {
      /* <Link to={`/anime/${anime.mal_id}`} key={anime.mal_id}> */
    }
    {
      /* <img */
    }
    // src={anime.images.jpg.image_url}
    // alt={anime.title}
    // className="thumbnail-category"
    // />
    {
      /* </Link> */
    }
    {
      /* </span> */
    }
    // );
    // });
  }

  let myMovies;
  if (movies) {
    myMovies = movies.map((anime) => {
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
      <h3>Top anime</h3>
      {/* look into lazy loading, it's exactly what we want here to polish up our presentation */}
      {/* Right now, if the images haven't loaded, the section just isn't showing. */}
      {/* We want to fix that:  */}
      {/* while the images are loading, we want to render divs that clearly indicate it, e.g: a sliding glow across each div */}
      {/* <Category isMobile={isMobile}>{topTen}</Category> */}
      {/* Test to check that we're not going insane: */}
      <Category isMobile={isMobile}>{overall && topOverall}</Category>
      <h3>Top Movies</h3>
      <Category isMobile={isMobile}>{movies && myMovies}</Category>
    </div>
  );
}
