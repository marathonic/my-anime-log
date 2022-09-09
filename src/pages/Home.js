import { useReducer, useState } from "react";
import { Link } from "react-router-dom";
import { Category, Sidebar } from "../components/primedComps";
import SearchBar from "../components/SearchBar";
import { AnimeCard } from "../components/primedComps";
import { initial } from "lodash";
import { MobileSkeletonTile } from "../components/LoadingSkeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Skeleton from "react-loading-skeleton";

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
      <MobileSkeletonTile></MobileSkeletonTile>
      {overall && <h3>Top anime</h3>}
      {/* !overall && isMobile && MobileSkeletonTile */}
      {/* !overall && !isMobile && DesktopSkeletonTile */}
      {topOverall}

      {/* ----------SKELETON PREVIEW!!!----------- */}
      {/* We could try and render these inside the Category itself, like in the example we saw */}
      {/* Skeleton preview */}
      {/* <h3>Loading Skeleton </h3> */}
      {/* <div className="loading-skeleton-div"> */}
      {/* <span className="loading-skeleton-span"> */}
      {/* <div className="loading-skeleton-thumbnails"> */}
      {/* <Skeleton */}
      {/* 
               height={"13.10rem"}
               width={"9.36rem"}
               highlightColor="#3f3351"
               baseColor="#42032C"
             />
  */}
      {/* </div> */}
      {/* </span> */}
      {/* </div> */}
      {popular && <h3>Top popular</h3>}
      {topPopular}
      {/* ^ Skeleton preview ^ */}
      {movies && <h3>Top movies</h3>}
      {topMovies}
    </div>
  );
}
