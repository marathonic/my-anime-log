import React, { useEffect, useState, useRef, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { debounce } from "lodash";
import useListWhenVisible from "../utils/useListWhenVisible";
import { DebounceInput } from "react-debounce-input";

const SearchBar = ({ isFetchInProgress, setIsFetchInProgress }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [predictions, setPredictions] = useState([]);
  const [inputFocus, setInputFocus] = useState(false);
  const [filteredPreds, setFilteredPreds] = useState([]);
  const navigate = useNavigate();

  const wait = (ms) => {
    return new Promise((r) => setTimeout(r, ms));
  };

  const getPredictionsFromAPI = async () => {
    // CONTINUE HERE: We want to know if the query is valid or not. Find the regex for it! If it's not valid, return instantly.

    const normalString = /^[a-zA-Z0-9 ]+$/i;
    let filteredStr = null;

    if (!normalString.test(searchQuery)) {
      filteredStr = searchQuery.replace(/[\W_]+/g, " ");
      if (!normalString.test(filteredStr) || !filteredStr.trim()) return;
    }
    //if (!normalString.test(searchQuery)) {
    //  const filteredString = searchQuery.replace(/[\W_]+/g, " ");
    //  setIsFetchInProgress(true);
    //  const res = await fetch(
    //    `https://api.jikan.moe/v4/anime?q=${filteredString}&order_by=scored_by&sort=desc&limit=3`
    //  );
    //  const resData = await res.json();
    //  setPredictions(resData.data);
    //  await new Promise((resolve) => setTimeout(resolve, 1200));
    //  setIsFetchInProgress(false);
    //  return;
    //}
    setIsFetchInProgress(true);
    const res = await fetch(
      `https://api.jikan.moe/v4/anime?q=${
        filteredStr || searchQuery
      }&order_by=scored_by&sort=desc&limit=3`
    );
    const resData = await res.json();
    setPredictions(resData.data);
    // We could wait 1000ms here, so that the input isn't made available instantly after an API call, which could throw err 428.
    await new Promise((resolve) => setTimeout(resolve, 1200));
    // We could wait 1000ms here, so that the input isn't made available instantly after an API call, which could throw err 428.
    setIsFetchInProgress(false);
  };

  const handleText = debounce((text) => {
    // setIsFetchInProgress(true);
    console.log("run: handleText");

    setSearchQuery(text);
  }, 1000);

  const handleDebouncedPredictions = debounce(() => {
    getPredictionsFromAPI();
  }, 1100);

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
    // if (isFetchInProgress) {
    // console.log("debouncing...");
    // handleDebouncedPredictions();
    // return;
    // } else {
    // getPredictionsFromAPI();
    // return;
    // }
    // getPredictionsFromAPI();
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

  // console.log(isFetchInProgress);

  return (
    // we could give it position: sticky; top:0, so we can still search when we're scrolled down.
    <form onSubmit={handleSubmit} className="searchbar-form">
      <input
        className="search-bar"
        type="search"
        placeholder={isFetchInProgress ? "please wait..." : "search..."}
        onChange={(e) => handleText(e.target.value)}
        disabled={isFetchInProgress}
        id="searchbar-input"
        autoComplete="off"
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
