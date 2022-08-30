import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { AnimeCard, CardThumbnail, CardDetails } from "./primedComps";

function SingleAnime({ message }) {
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

  return (
    <AnimeCard>
      {/* <h4 style={{ color: "white" }}>{message}</h4> */}
      <CardThumbnail
        src={myAnimeData.images.jpg.image_url}
        alt={myAnimeData.title}
      />
      <h4 style={{ color: "white" }}>{myAnimeData.title}</h4>
      <CardDetails>
        <li>Episodes: {myAnimeData.episodes}</li>
        <li>{myAnimeData.status}</li>
      </CardDetails>
    </AnimeCard>
  );
}

export default SingleAnime;
