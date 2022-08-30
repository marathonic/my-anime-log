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
      <button className="add-list-btn">
        <BsFillBookmarkPlusFill /> log
      </button>
      <span>{myAnimeData.synopsis}</span>
    </AnimeCard>
  );
}

export default SingleAnime;
