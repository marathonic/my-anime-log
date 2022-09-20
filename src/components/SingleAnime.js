import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { AnimeCard, CardThumbnail, CardDetails } from "./primedComps";
import { BsFillBookmarkPlusFill } from "react-icons/bs";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import YoutubeEmbed from "./YoutubeTrailer";
import { FaQuestion, FaQuestionCircle } from "react-icons/fa";
import Synopsis from "./Synopsis";
import Modal from "./Modal";

const lowOpacity = {
  opacity: 1,
};

const loadingSkeletonSingleAnime = (
  // There's a slight Flash because of the contrast. We may wish to go with the darker palette after all.
  <>
    ;
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

function SingleAnime({ message, isMobile, setIsModalOpen, isModalOpen }) {
  const urlID = useParams();
  const animeID = urlID.mal_id;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();
  const [myAnimeData, setMyAnimeData] = useState({});
  const API_URL = `https://api.jikan.moe/v4/anime/${animeID}`;

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

  return (
    <>
      <AnimeCard isMobile={isMobile}>
        {/* <h4 style={{ color: "white" }}>{message}</h4> */}
        <div className="pic-container">
          <CardThumbnail
            src={myAnimeData.images.jpg.image_url}
            alt={myAnimeData.title}
            isMobile={isMobile}
          />

          <span className="card-title">
            {/* Commenting out while beginning styling for desktop: 
          <h3 style={bigStyle}>{myAnimeTitle}</h3> */}
            {isMobile && <h3>{myAnimeTitle}</h3>}
          </span>
        </div>
        {/* CONDITION: Render either layout depending on whether device is mobile or desktop */}
        {isMobile ? (
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
        ) : (
          <div className="details-section">
            <span className="desktop-title">
              <h2>{myAnimeTitle}</h2>
            </span>

            <CardDetails>
              <li className="card-li">Episodes: {myAnimeData.episodes}</li>
              <li className="card-li">{myAnimeData.status}</li>
              <li className="card-li">MAL Score: {myAnimeData.score}</li>
            </CardDetails>
            {/* testing placement */}
            {/* {!isMobile && (
              <YoutubeEmbed embedId={myAnimeData.trailer.embed_url} />
            )} */}
          </div>
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
            <BsFillBookmarkPlusFill size={22} /> add
          </button>
        )}
        {isModalOpen && <Modal setIsModalOpen={setIsModalOpen} />}
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
        />
      )}
      <Synopsis animeSynopsis={myAnimeData.synopsis} />
    </>
  );
}

export default SingleAnime;
