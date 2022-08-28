import React from "react";
import { useParams } from "react-router-dom";

function AnimeCard({ anime }) {
  let animay = useParams();
  return (
    <div>
      <img src={animay.image_url} alt="testing..." />
      <h3 style={{ color: "white" }}> {animay.title} </h3>
    </div>
  );
}

export default AnimeCard;
