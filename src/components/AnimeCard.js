import React from "react";
import { useParams } from "react-router-dom";

function AnimeCard({ message }) {
  const anime = useParams();
  console.log(anime); //accurate anime id
  return (
    <div>
      <img src={anime.image_url} alt="testing..." />
      <h3> {anime.title} </h3>
      <h4 style={{ color: "white" }}>{message}</h4>
      {/* we now have the anime id from useParams */}
      {/* we want to request that anime with API call */}
    </div>
  );
}

export default AnimeCard;
