import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [predictions, setPredictions] = useState([]);
  const navigate = useNavigate();
  const handleQueryChange = (e) => {
    setSearchQuery(e.target.value);
    // We could move this into a useEffect, probably
    if (searchQuery && searchQuery.length >= 2) {
      console.log("1st condition met");
      // only update every 2 letters, to save API calls
      if (searchQuery.length % 2 === 0) {
        console.log("2nd condition met, length === " + searchQuery.length);
        getPredictions();
      }
      // do we need this here ?
      else if (searchQuery.length === 0) {
      }
    }
  };

  const getPredictions = async () => {
    if (!searchQuery.length) {
      console.log("no length, resetting predictions");
      setPredictions([]);
      return;
    }
    const res = await fetch(
      `https://api.jikan.moe/v4/anime?q=${searchQuery}&order_by=scored_by&sort=desc`
    );
    const resData = await res.json();
    setPredictions(resData.data);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const isAlphanumeric = /^[a-z0-9]+$/i;
    if (!isAlphanumeric.test(searchQuery)) {
      const modQuery = searchQuery.replace(/[\W_]+/g, " ");
      // no empty strings
      if (modQuery.trim().length === 0) return;
      console.log(modQuery);
      // render sfw results only; querying 'ok' includes a nsfw result otherwise lol
      navigate(`/anime/search/${modQuery}&sfw`);
      return;
    }
    navigate(`/anime/search/${searchQuery}&sfw`);
  };

  // We could write our Suggestions logic here
  const Suggestions = ({ results }) => {
    const allPredictions = results.map((result) => {
      return <li key={result.mal_id}>{result.title}</li>;
    });
    return allPredictions;
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        className="search-bar"
        type="search"
        placeholder="search..."
        value={searchQuery}
        onChange={handleQueryChange}
      />
      {searchQuery && <Suggestions results={predictions} />}
      <button>OK</button>
    </form>
  );
};

export default SearchBar;
