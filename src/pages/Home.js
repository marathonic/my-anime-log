import { Link } from "react-router-dom";
import { useState } from "react";
import { Category, Sidebar } from "../components/primedComps";
import SearchBar from "../components/SearchBar";
import { AnimeCard } from "../components/primedComps";
import { MobileSkeletonTile } from "../components/LoadingSkeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Skeleton from "react-loading-skeleton";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { BsFillInfoCircleFill } from "react-icons/bs";
import AboutModal from "../components/AboutModal";

export default function Home({
  isMobile,
  overall,
  movies,
  airing,
  popular,
  upcoming,
  currentView,
  setCurrentView,
  isFetchInProgress,
  setIsFetchInProgress,
}) {
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  let topOverall, topMovies, topPopular, topAiring, topUpcoming;
  let propsIsMobile = isMobile;

  const renderMapped = (category, isMobile) => {
    let mapped = category.map((anime) => {
      return (
        <span className="category-span" key={anime.mal_id}>
          <AnimeCard clickedAnime={anime} />
          <Link to={`/anime/${anime.mal_id}`} key={anime.mal_id}>
            <img
              src={anime.images.jpg.image_url}
              alt={anime.title}
              className="thumbnail-category-main"
            />
          </Link>
        </span>
      );
    });
    return (
      <div>
        <Category isMobile={propsIsMobile}>{mapped}</Category>
      </div>
    );
  };

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

  airing
    ? (topAiring = renderMapped(airing, (isMobile = { isMobile })))
    : (topAiring = loadingSkeletonStrip);

  upcoming
    ? (topUpcoming = renderMapped(upcoming, (isMobile = { isMobile })))
    : (topUpcoming = loadingSkeletonStrip);

  overall
    ? (topOverall = renderMapped(overall, (isMobile = { isMobile })))
    : (topOverall = loadingSkeletonStrip);

  popular
    ? (topPopular = renderMapped(popular, (isMobile = { isMobile })))
    : (topPopular = loadingSkeletonStrip);

  movies
    ? (topMovies = renderMapped(movies, (isMobile = { isMobile })))
    : (topMovies = loadingSkeletonStrip);

  return (
    <div className={!isMobile ? "desktop-placement-container" : ""}>
      {currentView === "search" && (
        <div className="landing-searchbar-container">
          {isAboutModalOpen && (
            <AboutModal setIsAboutModalOpen={setIsAboutModalOpen} />
          )}
          <div
            className="question-mark-div"
            onClick={() => setIsAboutModalOpen(true)}
          >
            <BsFillInfoCircleFill size={25} style={{ pointerEvents: "none" }} />
          </div>
          <h1 className="myAnimeLogo">myAnimeLog</h1>
          <SearchBar
            isFetchInProgress={isFetchInProgress}
            setIsFetchInProgress={setIsFetchInProgress}
            isMobile={isMobile}
          />

          <div className="centered-div landing-chevron">
            <span className="landing-down-chevron">
              <button
                onClick={() => setCurrentView("explore")}
                className="synopsis-chevron"
              >
                <FiChevronDown style={{ pointerEvents: "none" }} />
              </button>
            </span>
            <span className="offset-span landing-down-text chevr-down">
              explore
            </span>
          </div>
        </div>
      )}

      {currentView === "explore" && (
        <div>
          <div
            className="centered-div"
            onClick={() => setCurrentView("search")}
          >
            <button className="synopsis-chevron">
              <FiChevronUp style={{ pointerEvents: "none" }} />
            </button>
            <span className="offset-span chevr-up">search</span>
          </div>
          <span className="centered-span">
            <h1>Explore</h1>
          </span>
          <Sidebar></Sidebar>
          <MobileSkeletonTile></MobileSkeletonTile>
          {airing && <h3 className="categ-head">Airing this season</h3>}
          {topAiring}
          {upcoming && <h3 className="categ-head">Top Upcoming</h3>}
          {topUpcoming}
          {overall && <h3 className="categ-head">Top Rated</h3>}
          {topOverall}
          {popular && <h3 className="categ-head">Most Popular</h3>}
          {topPopular}

          {movies && <h3 className="categ-head">Top Movies</h3>}
          {topMovies}
        </div>
      )}
    </div>
  );
}
