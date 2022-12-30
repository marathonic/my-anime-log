import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { debounce } from "lodash";
import useListWhenVisible from "../utils/useListWhenVisible";

const SearchBar = ({ isFetchInProgress, setIsFetchInProgress }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [predictions, setPredictions] = useState([]);
  const navigate = useNavigate();

  const wait = (ms) => {
    return new Promise((r) => setTimeout(r, ms));
  };

  const getPredictionsFromAPI = async () => {
    // If request is not valid, return.

    const normalString = /^[a-zA-Z0-9 ]+$/i;
    let filteredStr = null;

    if (!normalString.test(searchQuery)) {
      filteredStr = searchQuery.replace(/[\W_]+/g, " ");
      if (!normalString.test(filteredStr) || !filteredStr.trim()) return;
    }

    setIsFetchInProgress(true);
    const res = await fetch(
      `https://api.jikan.moe/v4/anime?q=${
        filteredStr || searchQuery
      }&order_by=scored_by&sort=desc&limit=3`
    );
    const resData = await res.json();
    setPredictions(resData.data);
    // If API limits change in the future, we could wait() here, so that the input isn't made available instantly after an API call, which could throw err 428.
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setIsFetchInProgress(false);
  };

  const handleText = debounce((text) => {
    setSearchQuery(text);
  }, 1000);

  const handleDebouncedPredictions = debounce(() => {
    getPredictionsFromAPI();
  }, 1100);

  useEffect(() => {
    if (document.querySelector("#searchbar-input").value.length >= 69) {
      setSearchQuery(searchQuery.substring(0, 69));
      let barText = document.querySelector("#searchbar-input");
      let val = barText.value;
      barText.value = val.substring(0, 69);
      return;
    }
    if (!searchQuery.length) {
      return;
    }

    handleDebouncedPredictions();
    // eslint-disable-next-line
  }, [searchQuery]);

  const Suggestions = ({ results }) => {
    const allPredictions = results.map((result) => {
      return (
        <li key={result.mal_id}>
          <Link to={`/anime/${result.mal_id}`}>
            <span className="suggestion-span">
              <img
                src={result.images.jpg.small_image_url}
                alt={result.title}
                className="suggestion-img"
              />
              <span key={result.mal_id} className="suggestion-text">
                {result.title}
              </span>
            </span>
          </Link>
        </li>
      );
    });
    return allPredictions;
  };

  const DropdownList = () => {
    const { ref, isComponentVisible } = useListWhenVisible(true);

    return (
      <div ref={ref} className="suggestions-container">
        {isComponentVisible && <Suggestions results={predictions} />}
      </div>
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const isAlphanumeric = /^[a-z0-9]+$/i;
    if (!isAlphanumeric.test(searchQuery)) {
      const modQuery = searchQuery.replace(/[\W_]+/g, " ");
      // no empty strings
      if (modQuery.trim().length === 0) return;
      navigate(`/anime/search/${modQuery}&sfw`);
      return;
    }
    // get sfw results only lol
    navigate(`/anime/search/${searchQuery}&sfw`);
  };

  return (
    <form onSubmit={handleSubmit} className="searchbar-form">
      <div className="search-bar-container">
        <input
          className="search-bar"
          type="search"
          placeholder={isFetchInProgress ? "please wait..." : "search..."}
          onChange={(e) => handleText(e.target.value)}
          disabled={isFetchInProgress}
          id="searchbar-input"
          autoComplete="off"
        />
        <button className="search-bar-btn" disabled={isFetchInProgress}>
          GO
        </button>
      </div>

      {searchQuery && predictions.length > 0 && (
        <ul className="suggestions-ul">
          <DropdownList />
        </ul>
      )}
    </form>
  );
};

export default SearchBar;
