import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import { auth, db, logout } from "../firebase.js";
import { AnimeCard, CardThumbnail, CardDetails } from "./primedComps";
import { BsFillBookmarkPlusFill } from "react-icons/bs";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import YoutubeEmbed from "./YoutubeTrailer";
import { FaQuestion, FaQuestionCircle } from "react-icons/fa";
import Synopsis from "./Synopsis";
import Modal from "./Modal";
import { useAuthState } from "react-firebase-hooks/auth";
import ModalNoUser from "./ModalNoUser.js";
import { useRef } from "react";

const lowOpacity = {
  opacity: 1,
};

const loadingSkeletonSingleAnime = (
  // There's a slight Flash because of the contrast. We may wish to go with the darker palette after all.
  <>
    {/* ; <--- this ";" was here, commenting it out to see if that's the thing that we were seeing be active during loading which we though was a ":" */}
    <AnimeCard isMobile={true}>
      <div className="pic-container">
        <Skeleton
          duration={0.6}
          height={"18.22rem"}
          width={"11.71rem"}
          highlightColor="#3f3351" //previously: silver
          baseColor="#42032C" //previously: darkgrey
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
          // baseColor="#42032C" cool but a little hard to see if page loads too fast
          // highlightColor="#3f3351"
          style={lowOpacity}
        />
      </h3>
    </span>
  </>
);

// END LOADINGSKELETONSINGLEANIME

function SingleAnime({
  message,
  isMobile,
  setIsModalOpen,
  isModalOpen,
  updateShouldCategoryUpdate,
  setThumbnailURL,
  fetchedUserLogs,
  latestEntryFetched,
  updateLatestEntryFetched,
  isAlphabReorderRequired,
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

  // if (loading) return <h1>Loading...</h1>;
  if (loading) return loadingSkeletonSingleAnime;
  if (error) return <h2>Error</h2>;

  //   conditional font size for the title
  const myAnimeTitle = myAnimeData.title;
  const bigStyle = {
    fontSize: myAnimeTitle.length < 13 ? "3rem" : "1.6rem",
  };

  const scrollToSynopsis = () => {
    let synopsisId = document.querySelector("#synopsis-autoscroll");
    synopsisId?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <AnimeCard isMobile={isMobile}>
        {!isMobile && (
          <span className="overview-splash">
            <div className="pic-container">
              <CardThumbnail
                src={myAnimeData.images.jpg.image_url}
                alt={myAnimeData.title}
                isMobile={isMobile}
              />
            </div>
            <div className="big-splash-container">
              <div>
                <span className="card-title">
                  {/* Commenting out while beginning styling for desktop: 
        <h3 style={bigStyle}>{myAnimeTitle}</h3> */}
                  {isMobile && <h3>{myAnimeTitle}</h3>}
                </span>
              </div>
              <div className="details-section">
                <span className="desktop-title">
                  <h2>{myAnimeTitle}</h2>
                </span>
              </div>
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
          </span>
        )}
        {/* <h4 style={{ color: "white" }}>{message}</h4> */}

        {/* CONDITION: Render either layout depending on whether device is mobile or desktop */}
        {isMobile && (
          <>
            <span className="synopsis-btn-span">
              <button className="synopsis-btn">
                <FaQuestionCircle color="lightgreen" />
              </button>
            </span>
            <CardDetails isMobile={isMobile}>
              <li className="card-li">Episodes: {myAnimeData.episodes}</li>
              <li className="card-li">{myAnimeData.status}</li>
              <li className="card-li">MAL Score: {myAnimeData.score}</li>
            </CardDetails>
          </>
        )}
        {/* Somewhere in this AnimeCard component,
      we want React-responsive to conditionally render
      either the "add" button, or an "update" button,
      based on whether the anime's ID is stored in the firebase object for the user.
      (Each user will have an entry in Firestore that contains 2 objects, 
      1 for Credentials <email, password> and 1 for their Log <watching, plan to watch, etc...>)  */}

        {/* Commenting The following lines while beginning styling for desktop: */}
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
        {/* <span>{myAnimeData.synopsis}</span> */}
        {/* Anime trailer */}
        {/* <h5>{myAnimeData.trailer.youtube_id}</h5> */}
        {isMobile && <hr />}
        {/* {isMobile && <YoutubeEmbed embedId={myAnimeData.trailer.embed_url} />} */}
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
      />
    </>
  );
}

export default SingleAnime;
