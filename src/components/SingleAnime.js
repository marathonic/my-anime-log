import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { auth } from "../firebase.js";
import { AnimeCard, CardThumbnail, CardDetails } from "./primedComps";
import { BsFillBookmarkPlusFill } from "react-icons/bs";
import Skeleton from "react-loading-skeleton";
import YoutubeEmbed from "./YoutubeTrailer";
import Synopsis from "./Synopsis";
import Modal from "./Modal";
import { useAuthState } from "react-firebase-hooks/auth";
import ModalNoUser from "./ModalNoUser.js";

const lowOpacity = {
  opacity: 1,
};

const loadingSkeletonSingleAnime = (
  <>
    <AnimeCard isMobile={true}>
      <div className="pic-container">
        <Skeleton
          duration={0.6}
          height={"18.22rem"}
          width={"11.71rem"}
          highlightColor="#3f3351"
          baseColor="#42032C"
          style={lowOpacity}
        />
        <br />
        <span className="card-title">
          <h3>
            <Skeleton
              duration={0.6}
              height={30}
              width={187}
              baseColor="#42032C"
              highlightColor="#3f3351"
              style={lowOpacity}
            />
          </h3>
        </span>
        <br />
      </div>
      <Skeleton
        duration={0.6}
        height={"6.55rem"}
        width={"11.71rem"}
        highlightColor="#3f3351"
        baseColor="#42032C"
        style={lowOpacity}
      />
      <hr />
    </AnimeCard>
    <span className="centered-span">
      <h3>
        <Skeleton
          duration={0.6}
          height={30}
          width={130}
          baseColor="#42032C"
          highlightColor="#3f3351"
          style={lowOpacity}
        />
      </h3>
    </span>
  </>
);

function SingleAnime({
  isMobile,
  setIsModalOpen,
  isModalOpen,
  updateShouldCategoryUpdate,
  setThumbnailURL,
  fetchedUserLogs,
  latestEntryFetched,
  updateLatestEntryFetched,
  setIsAlphabReorderRequired,
  updateFetchedUserLogs,
  categLeftoverLength,
  updateCategLeftoverLength,
  updateIsCategFullyFetched,
}) {
  const urlID = useParams();
  const animeID = urlID.mal_id;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();
  const [myAnimeData, setMyAnimeData] = useState({});
  const [user] = useAuthState(auth);
  const API_URL = `https://api.jikan.moe/v4/anime/${animeID}`;
  const [isFetchLocked, setIsFetchLocked] = useState(false);
  const [animeDataFromLog, setAnimeDataFromLog] = useState({});
  const [animeExistsInLog, setAnimeExistsInLog] = useState(false);
  const [showSynopsis, setShowSynopsis] = useState(false);

  const toggleVisible = {
    visibility: isModalOpen ? "hidden" : "visible",
  };

  useEffect(() => {
    setLoading(true);
    fetch(API_URL).then((response) =>
      response
        .json()
        .then((resData) => {
          setMyAnimeData(resData.data);
          setLoading(false);
        })
        .catch((err) => setError(err))
    );
  }, [API_URL]);

  if (loading) return loadingSkeletonSingleAnime;
  if (error) return <h2>Error</h2>;

  const myAnimeTitle = myAnimeData.title;

  return (
    <>
      <AnimeCard isMobile={isMobile}>
        {!isMobile && (
          <div className="overview-splash">
            <div className="pic-container">
              <CardThumbnail
                src={myAnimeData.images.jpg.image_url}
                alt={myAnimeData.title}
                isMobile={isMobile}
              />
            </div>
            <div className="big-splash-container">
              <span className="desktop-title">
                <h2>{myAnimeTitle}</h2>
              </span>
              <CardDetails>
                <li className="card-li">Episodes: {myAnimeData.episodes}</li>
                <li className="card-li">{myAnimeData.status}</li>
                <li className="card-li">MAL Score: {myAnimeData.score}</li>
              </CardDetails>
              <span className="desktop-btn-container">
                <button
                  className="add-list-btn"
                  onClick={() => setIsModalOpen(true)}
                  style={toggleVisible}
                >
                  <BsFillBookmarkPlusFill size={52} />
                  log
                </button>
              </span>
            </div>
          </div>
        )}

        {/* Render either layout depending on whether device is mobile or desktop */}
        {isMobile && (
          <>
            <CardThumbnail
              src={myAnimeData.images.jpg.image_url}
              alt={myAnimeData.title}
              isMobile={isMobile}
            />
            <span className="card-title">
              <h3>{myAnimeTitle}</h3>
            </span>

            <span className="synopsis-btn-span"></span>
            <CardDetails isMobile={isMobile}>
              <li className="card-li">Episodes: {myAnimeData.episodes}</li>
              <li className="card-li">{myAnimeData.status}</li>
              <li className="card-li">MAL Score: {myAnimeData.score}</li>
            </CardDetails>
          </>
        )}

        {isMobile && (
          <button
            className="add-list-btn"
            onClick={() => setIsModalOpen(true)}
            style={toggleVisible}
          >
            <BsFillBookmarkPlusFill size={22} /> log
          </button>
        )}
        {isModalOpen && !user && (
          <ModalNoUser setIsModalOpen={setIsModalOpen} />
        )}

        {isModalOpen && user && (
          <Modal
            setIsModalOpen={setIsModalOpen}
            episodesAired={myAnimeData.episodes}
            animeID={animeID}
            isFetchLocked={isFetchLocked}
            setIsFetchLocked={setIsFetchLocked}
            animeTitle={myAnimeData.title}
            animeDataFromLog={animeDataFromLog}
            setAnimeDataFromLog={setAnimeDataFromLog}
            animeExistsInLog={animeExistsInLog}
            setAnimeExistsInLog={setAnimeExistsInLog}
            updateShouldCategoryUpdate={updateShouldCategoryUpdate}
            animeThumbnailURL={myAnimeData.images.webp.image_url}
            setThumbnailURL={setThumbnailURL}
            fetchedUserLogs={fetchedUserLogs}
            latestEntryFetched={latestEntryFetched}
            updateLatestEntryFetched={updateLatestEntryFetched}
            setIsAlphabReorderRequired={setIsAlphabReorderRequired}
            updateFetchedUserLogs={updateFetchedUserLogs}
            categLeftoverLength={categLeftoverLength}
            updateCategLeftoverLength={updateCategLeftoverLength}
            updateIsCategFullyFetched={updateIsCategFullyFetched}
          />
        )}
        {isMobile && <hr />}
      </AnimeCard>
      {myAnimeData.trailer.embed_url !== null && (
        <YoutubeEmbed
          embedId={myAnimeData.trailer.embed_url}
          isMobile={isMobile}
          isModalOpen={isModalOpen}
        />
      )}
      <Synopsis
        isMobile={isMobile}
        animeSynopsis={myAnimeData.synopsis}
        isModalOpen={isModalOpen}
        showSynopsis={showSynopsis}
        setShowSynopsis={setShowSynopsis}
        isTrailerAvailable={myAnimeData.trailer.embed_url}
      />
    </>
  );
}

export default SingleAnime;
