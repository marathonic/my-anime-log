import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useState } from "react";

function AnimeCard({ message }) {
  const [animeName, setAnimeName] = useState("Naruto");
  const urlID = useParams();
  const animeID = urlID.mal_id;
  console.log(animeID); //accurate anime id
  // FOllowing tutorial :
  // const API_URL = "https://dog.ceo/api/breeds/image/random";
  const [dogData, setDogData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();
  // _________________________________________LET'S GO:
  const API_URL = `https://api.jikan.moe/v4/anime/${animeID}`;
  const [myAnimeData, setMyAnimeData] = useState({});

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
  // const getAnime = async () => {
  //   const res = await fetch(`
  //   https://api.jikan.moe/v4/anime?q=${animeName}&sfw`);
  //   const resData = res.json();
  //   setAnimeName(resData.data);
  // };

  // useEffect(() => {
  //   getAnime();
  // }, [animeName]);

  return (
    <div>
      {/*following tutorial */}
      {/* <img src={dogData.message} alt="cute doggy" /> */}

      {/* <img src={anime.image_url} alt="testing..." />
      <h3> {anime.title} </h3> */}
      <h4 style={{ color: "white" }}>{message}</h4>
      {/* {animeName && <h4 style={{ color: "white" }}>{animeName.title}</h4>} */}
      {/* we now have the anime id from useParams */}
      {/* we want to request that anime with API call */}

      {/* ___________________________LET'S GO________________________________ */}
      <img src={myAnimeData.images.jpg.image_url} alt={myAnimeData.title} />
      <h4 style={{ color: "white" }}>{myAnimeData.title}</h4>
    </div>
  );
}

export default AnimeCard;
