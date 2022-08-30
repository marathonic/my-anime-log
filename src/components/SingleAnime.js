import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { AnimeCard, CardThumbnail, CardDetails } from "./primedComps";
import { BsFillBookmarkPlusFill } from "react-icons/bs";

function SingleAnime({ message, isMobile }) {
  const urlID = useParams();
  const animeID = urlID.mal_id;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();
  const [myAnimeData, setMyAnimeData] = useState({});
  const API_URL = `https://api.jikan.moe/v4/anime/${animeID}`;

  useEffect(() => {
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

  if (loading) return <h1>Loading...</h1>;
  if (error) return <h2>Error</h2>;

  //   conditional font size for the title
  const myAnimeTitle = myAnimeData.title;
  const bigStyle = {
    fontSize: myAnimeTitle.length < 13 ? "3rem" : "1.6rem",
  };

  return (
    <AnimeCard isMobile={isMobile}>
      {/* <h4 style={{ color: "white" }}>{message}</h4> */}
      <div className="pic-container">
        <CardThumbnail
          src={myAnimeData.images.jpg.image_url}
          alt={myAnimeData.title}
          isMobile={isMobile}
        />
        <span className="card-title">
          <h3 style={bigStyle}>{myAnimeTitle}</h3>
        </span>
      </div>
      <CardDetails>
        <li className="card-li">Episodes: {myAnimeData.episodes}</li>
        <li className="card-li">{myAnimeData.status}</li>
        <li className="card-li">MAL Score: {myAnimeData.score}</li>
      </CardDetails>
      {/* Somewhere in this AnimeCard component,
      we want React-responsive to conditionally render
      either the "add" button, or an "update" button,
      based on whether the anime's ID is stored in the firebase object for the user.
      (Each user will have an entry in Firestore that contains 2 objects, 
      1 for Credentials <email, password> and 1 for their Log <watching, plan to watch, etc...>)  */}
      <button className="add-list-btn">
        <BsFillBookmarkPlusFill size={22} /> add
      </button>
      <span>{myAnimeData.synopsis}</span>
    </AnimeCard>
  );
}

export default SingleAnime;
