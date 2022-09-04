import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { debounce } from "lodash";
import { DebounceInput } from "react-debounce-input";

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [predictions, setPredictions] = useState([]);
  const [filteredPreds, setFilteredPreds] = useState([]);
  const navigate = useNavigate();

  const getPredictions = async () => {
    const res = await fetch(
      `https://api.jikan.moe/v4/anime?q=${searchQuery}&order_by=scored_by&page=0`
    );
    const resData = await res.json();
    setPredictions(resData.data);
  };

  // const handleQueryUpdate = (e) => {
  //   setSearchQuery(e.target.value);
  //   getPredictions();
  // };

  // const doAnimeFilter = (query) => {
  //   if (!query) return setFilteredPreds([]);
  //   setFilteredPreds(
  //     predictions.filter((result) =>
  //       result.title.toLowerCase().includes(query.toLowerCase())
  //     )
  //   );
  // };

  // follow tutorial
  const updateQuery = (e) => {
    setSearchQuery(e?.target?.value);
    getPredictions();
  };

  const debouncedOnChange = debounce(updateQuery, 600);

  // We could write our Suggestions logic here
  const Suggestions = ({ results }) => {
    const allPredictions = results.map((result) => {
      return (
        <Link to={`/anime/${result.mal_id}`} key={result.mal_id}>
          <span>
            <img src={result.images.jpg.small_image_url} alt={result.title} />
            <li key={result.mal_id}>{result.title}</li>;
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
        onChange={debouncedOnChange}
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
