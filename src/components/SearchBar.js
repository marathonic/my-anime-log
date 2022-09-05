import React, { useEffect, useState, useRef, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { debounce } from "lodash";
import { DebounceInput } from "react-debounce-input";

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [predictions, setPredictions] = useState([]);
  const [filteredPreds, setFilteredPreds] = useState([]);
  const navigate = useNavigate();

  const getPredictionFromsAPI = async () => {
    const res = await fetch(
      `https://api.jikan.moe/v4/anime?q=${searchQuery}&order_by=scored_by&sort=desc&limit=3`
    );
    const resData = await res.json();
    setPredictions(resData.data);
  };

  const deb = useCallback(
    debounce((text) => setSearchQuery(text), 700),
    []
  );

  const handleText = (text) => {
    deb(text);
  };

  useEffect(() => {
    getPredictionFromsAPI();
    //eslint-disable-next-line
  }, [searchQuery]);

  // We could write our Suggestions logic here
  const Suggestions = ({ results }) => {
    const allPredictions = results.map((result) => {
      return (
        <Link to={`/anime/${result.mal_id}`} key={result.mal_id}>
          <span>
            <img src={result.images.jpg.small_image_url} alt={result.title} />
            <li key={result.mal_id}>{result.title}</li>
          </span>
        </Link>
      );
    });
    return allPredictions;
  };

  // Submission functionality
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

  return (
    <form onSubmit={handleSubmit}>
      <input
        className="search-bar"
        type="search"
        placeholder="search..."
        onChange={(e) => handleText(e.target.value)}
      />
      {searchQuery && predictions.length > 0 && (
        <Suggestions results={predictions} />
      )}
      <h5>{searchQuery}</h5>
      <button>OK</button>
    </form>
  );
};

export default SearchBar;
