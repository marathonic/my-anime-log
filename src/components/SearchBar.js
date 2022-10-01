import React, { useEffect, useState, useRef, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { debounce } from "lodash";
import useListWhenVisible from "../utils/useListWhenVisible";
import { DebounceInput } from "react-debounce-input";

const SearchBar = ({ isFetchInProgress }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [predictions, setPredictions] = useState([]);
  const [inputFocus, setInputFocus] = useState(false);
  const [filteredPreds, setFilteredPreds] = useState([]);
  const navigate = useNavigate();

  const getPredictionFromsAPI = async () => {
    const res = await fetch(
      `https://api.jikan.moe/v4/anime?q=${searchQuery}&order_by=scored_by&sort=desc&limit=3`
    );
    const resData = await res.json();
    setPredictions(resData.data);
  };

  const handleText = debounce((text) => {
    setSearchQuery(text);
  }, 700);

  const handleInputFocus = (e) => {
    setInputFocus(true);
  };

  const handleInputBlur = (e) => {
    // We could handle this from Home.js, and getElementById
    // Our element will be the form, which is the parent element
    // for both the input and the suggestions list.
    // That way, we'd only hide it if the click is outside of the form element (which includes its own children).
    // console.log(e);
    // if (!e.currentTarget.contains(e.target)) {
    // }
    setInputFocus(false);
  };

  useEffect(() => {
    if (!searchQuery.length) {
      return;
    }
    getPredictionFromsAPI();
    //eslint-disable-next-line
  }, [searchQuery]);

  // We could write our Suggestions logic here
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
      <div ref={ref}>
        {isComponentVisible && <Suggestions results={predictions} />}
      </div>
    );
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

  console.log(isFetchInProgress);

  return (
    // we could give it position: sticky; top:0, so we can still search when we're scrolled down.
    <form onSubmit={handleSubmit} className="searchbar-form">
      <input
        className="search-bar"
        type="search"
        placeholder="search..."
        onChange={(e) => handleText(e.target.value)}
        // onFocus={(e) => handleInputFocus()}
        // onBlur={handleInputBlur}
      />
      {searchQuery && predictions.length > 0 && (
        <ul className="suggestions-ul">
          <DropdownList />
          {/* <Suggestions results={predictions} /> */}
        </ul>
      )}
      <button className="search-bar-btn" disabled={isFetchInProgress}>
        GO
      </button>
    </form>
  );
};

export default SearchBar;
