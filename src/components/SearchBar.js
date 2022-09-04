import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { DebounceInput } from "react-debounce-input";

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [predictions, setPredictions] = useState([]);
  const [filteredPreds, setFilteredPreds] = useState([]);
  const navigate = useNavigate();

  const getPredictions = async () => {
    const res = await fetch(
      `https://api.jikan.moe/v4/anime?q=${searchQuery}&sfw`
    );
    const resData = await res.json();
    setPredictions(resData.data);
  };

  useEffect(() => {
    // const matched = `/${searchQuery}/gi`;
    const filteredArr = predictions.filter((result) =>
      result.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredPreds(filteredArr);
  }, [predictions, searchQuery]);
  // const handleQueryChange = (e) => {
  //   setSearchQuery(e.target.value);

  //   if (searchQuery && searchQuery.length > 1) {
  //     console.log("1st condition met");
  //     // only update every 2 letters, to save API calls
  //     if (searchQuery.length % 2 === 0) {
  //       console.log("2nd condition met, length === " + searchQuery.length);
  //       getPredictions();
  //     }
  //   }
  // };

  const handleQueryUpdate = (e) => {
    setSearchQuery(e.target.value);
    getPredictions();
  };

  if (filteredPreds.length) {
    console.log(filteredPreds);
  }

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

  return (
    <form onSubmit={handleSubmit}>
      <DebounceInput
        className="search-bar"
        type="search"
        placeholder="search..."
        minLength={1}
        debounceTimeout={500}
        onChange={handleQueryUpdate}
      />
      {searchQuery && filteredPreds.length > 0 && (
        <Suggestions results={filteredPreds} />
      )}
      <h5>{searchQuery}</h5>
      <button>OK</button>
    </form>
  );
};

export default SearchBar;
