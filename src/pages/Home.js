import { useReducer, useState } from "react";
import { Link } from "react-router-dom";
import { Category, Sidebar } from "../components/primedComps";
import SearchBar from "../components/SearchBar";
import { AnimeCard } from "../components/primedComps";
import { initial } from "lodash";
import { MobileSkeletonTile } from "../components/LoadingSkeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Skeleton from "react-loading-skeleton";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

export default function Home({
  handleSearch,
  search,
  setSearch,
  animeList,
  isMobile,
  allTopAnime,
  overall,
  movies,
  airing,
  popular,
  currentView,
  setCurrentView,
  isFetchInProgress,
  setIsFetchInProgress,
}) {
  let topOverall, topMovies, topSpecials, topPopular, topAiring;
  // to make it easier to FIND anime we don't know about, make it instead be:
  // topAiring, topUpcoming...

  const renderMapped = (category, isMobile) => {
    let mapped = category.map((anime) => {
      return (
        <span className="category-span" key={anime.mal_id}>
          {/* what does AnimeCard do here? */}
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

  const loadingSkeletonStrip = (
    <>
      <h3>
        <Skeleton
          height={30}
          width={130}
          baseColor="#42032C"
          highlightColor="#3f3351"
        />
      </h3>
      {""}
      <div className="loading-skeleton-div">
        <span className="loading-skeleton-span">
          <div className="loading-skeleton-thumbnails">
            <Skeleton
              height={"13.10rem"}
              width={"9.36rem"}
              highlightColor="#3f3351"
              baseColor="#42032C"
            />
          </div>
        </span>
        <span className="loading-skeleton-span">
          <div className="loading-skeleton-thumbnails">
            <Skeleton
              height={"13.10rem"}
              width={"9.36rem"}
              highlightColor="#3f3351"
              baseColor="#42032C"
            />
          </div>
        </span>
        <span className="loading-skeleton-span">
          <div className="loading-skeleton-thumbnails">
            <Skeleton
              height={"13.10rem"}
              width={"9.36rem"}
              highlightColor="#3f3351"
              baseColor="#42032C"
            />
          </div>
        </span>
        <span className="loading-skeleton-span">
          <div className="loading-skeleton-thumbnails">
            <Skeleton
              height={"13.10rem"}
              width={"9.36rem"}
              highlightColor="#3f3351"
              baseColor="#42032C"
            />
          </div>
        </span>
        <span className="loading-skeleton-span">
          <div className="loading-skeleton-thumbnails">
            <Skeleton
              height={"13.10rem"}
              width={"9.36rem"}
              highlightColor="#3f3351"
              baseColor="#42032C"
            />
          </div>
        </span>
        <span className="loading-skeleton-span">
          <div className="loading-skeleton-thumbnails">
            <Skeleton
              height={"13.10rem"}
              width={"9.36rem"}
              highlightColor="#3f3351"
              baseColor="#42032C"
            />
          </div>
        </span>
        <span className="loading-skeleton-span">
          <div className="loading-skeleton-thumbnails">
            <Skeleton
              height={"13.10rem"}
              width={"9.36rem"}
              highlightColor="#3f3351"
              baseColor="#42032C"
            />
          </div>
        </span>
      </div>
    </>
  );

  // if (overall) {
  // topOverall = renderMapped(overall, (isMobile = { isMobile }));
  // }

  overall
    ? (topOverall = renderMapped(overall, (isMobile = { isMobile })))
    : (topOverall = loadingSkeletonStrip);
  // if (movies) {
  // topMovies = renderMapped(movies, (isMobile = { isMobile }));
  // }

  movies
    ? (topMovies = renderMapped(movies, (isMobile = { isMobile })))
    : (topMovies = loadingSkeletonStrip);

  // if (popular) {
  // topPopular = renderMapped(popular, (isMobile = { isMobile }));
  // }

  popular
    ? (topPopular = renderMapped(popular, (isMobile = { isMobile })))
    : (topPopular = loadingSkeletonStrip);

  airing
    ? (topAiring = renderMapped(airing, (isMobile = { isMobile })))
    : (topAiring = loadingSkeletonStrip);

  // const loadingStrip = () => {
  //   for(let i = 0; i < 7; i++){
  //     <div className="loading-skeleton-thumbnails">
  //     <Skeleton
  //       height={"13.10rem"}
  //       width={"9.36rem"}
  //       highlightColor="#3f3351"
  //       baseColor="#42032C"
  //     />
  //   </div>
  //   }
  // }

  /* 
   const topTen = allTopAnime.map((anime) => {
   
   });
  */
  console.log(currentView);
  return (
    <div>
      {currentView === "search" && (
        <div className="landing-searchbar-container">
          <h1>myAnimeLog</h1>
          <SearchBar
            isFetchInProgress={isFetchInProgress}
            setIsFetchInProgress={setIsFetchInProgress}
          />

          <span className="landing-down-chevron">
            <button onClick={() => setCurrentView("explore")}>
              <FiChevronDown style={{ pointerEvents: "none" }} />
            </button>
          </span>
        </div>
      )}

      {/* Chevron down: EXPLORE <-- the page ends here, a chevron will
      conditionally render an Explore section.

      In the Explore section, a Chevron up will conditionally
      render the SearchBar
    */}
      {currentView === "explore" && (
        <div>
          <button onClick={() => setCurrentView("search")}>
            <FiChevronUp style={{ pointerEvents: "none" }} />
          </button>
          <span className="centered-span">
            <h3>Explore</h3>
          </span>
          <Sidebar></Sidebar>
          {/* look into lazy loading, it's exactly what we want here to polish up our presentation */}
          {/* Right now, if the images haven't loaded, the section just isn't showing. */}
          {/* We want to fix that:  */}
          {/* while the images are loading, we want to render divs that clearly indicate it, e.g: a sliding glow across each div */}
          {/* <Category isMobile={isMobile}>{topTen}</Category> */}
          <MobileSkeletonTile></MobileSkeletonTile>
          {overall && <h3>Top anime</h3>}
          {topOverall}
          {popular && <h3>Top popular</h3>}
          {topPopular}
          {airing && <h3>Airing this week</h3>}
          {topAiring}
          {movies && <h3>Top movies</h3>}
          {topMovies}
        </div>
      )}
    </div>
  );
}
