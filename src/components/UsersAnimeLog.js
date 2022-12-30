import React, { useReducer } from "react";
import "../style.css";
import { db } from "../firebase.js";
import {
  query,
  collection,
  getDocs,
  where,
  orderBy,
  limit,
  startAfter,
  startAt,
} from "firebase/firestore";
import { OptionSelector, Selector } from "../components/primedComps";
import { useState, useEffect, useRef } from "react";
import { AnimeCard, LogCategory } from "../components/primedComps";
import { Link } from "react-router-dom";
import { MoonLoader, BeatLoader } from "react-spinners";
import { BsAlignBottom } from "react-icons/bs";

function UsersAnimeLog({
  userListSelector,
  setUserListSelector,
  updateFetchedUserLogs,
  fetchedUserLogs,
  shouldCategoryUpdate,
  user,
  updateShouldCategoryUpdate,
  latestEntryFetched,
  updateLatestEntryFetched,
  currentCategoryLog,
  setCurrentCategoryLog,
  isAlphabReorderRequired,
  setIsAlphabReorderRequired,
  isMobile,
  categLeftoverLength,
  updateCategLeftoverLength,
  updateIsCategFullyFetched,
  isCategFullyFetched,
}) {
  const [lastEntryFetched, setLastEntryFetched] = useState(null);
  const initialFetchLengths = {
    completed: false,
    watching: false,
    "plan to watch": false,
  };
  const [isLastFetchEmpty, updateIsLastFetchEmpty] = useReducer(
    (isLastFetchEmpty, updates) => ({ ...isLastFetchEmpty, ...updates }),
    initialFetchLengths
  );
  const [isLoading, setIsLoading] = useState(false);
  const scrollBottomRef = useRef(null);

  const getUsersCategoryLog = async (categ) => {
    if (categLeftoverLength[`${categ}`] > 0) {
      let q;
      q = query(
        collection(db, "theNewUsers", user?.uid, "animeLog"),
        where("status", "==", categ),
        orderBy("name"),
        startAfter(latestEntryFetched[`${categ}`]),
        limit(5)
      );

      setIsLoading(true);
      const querySnapshot = await getDocs(q);
      setIsLoading(false);
      let arr = [];
      if (querySnapshot.empty === true) {
        updateIsLastFetchEmpty({ [`${categ}`]: true });
        updateShouldCategoryUpdate({ [`${categ}`]: false });
        return;
      }
      if (querySnapshot.empty !== true) {
        querySnapshot.forEach((doc) => {
          arr.push({ ...doc.data() });
        });
        setIsAlphabReorderRequired({ [`${categ}`]: false });
      }
      const mergedArrays = [...fetchedUserLogs[`${categ}`], ...arr];
      updateFetchedUserLogs({ [`${categ}`]: mergedArrays });
      updateLatestEntryFetched({
        [`${categ}`]: querySnapshot.docs[querySnapshot.docs.length - 1],
      });
      updateCategLeftoverLength({
        [`${categ}`]: 0,
      });
      updateShouldCategoryUpdate({ [`${categ}`]: false });
      console.log("--------------------------------");
      return;
    }

    let q;
    q = query(
      collection(db, "theNewUsers", user?.uid, "animeLog"),
      where("status", "==", categ),
      orderBy("name"),
      startAfter(latestEntryFetched[`${categ}`] || 0),
      limit(5)
    );
    if (isAlphabReorderRequired[`${categ}`] === true) {
      q = query(
        collection(db, "theNewUsers", user?.uid, "animeLog"),
        where("status", "==", categ),
        orderBy("name"),
        startAt(latestEntryFetched[`${categ}`]),
        limit(5)
      );
      setIsAlphabReorderRequired({ [`${categ}`]: false });
    }

    if (shouldCategoryUpdate[`${categ}`] && isLastFetchEmpty[`${categ}`]) {
      updateShouldCategoryUpdate({ [`${categ}`]: false });
      return;
    }

    setIsLoading(true);

    const querySnapshot = await getDocs(q);
    setIsLoading(false);

    let arr = [];
    if (querySnapshot.empty !== true) {
      querySnapshot.forEach((doc) => {
        arr.push({ ...doc.data() });
      });
    }
    if (arr.length < 1) {
      updateIsLastFetchEmpty({ [`${categ}`]: true });
      updateShouldCategoryUpdate({ [`${categ}`]: false });
      updateIsCategFullyFetched({ [`${categ}`]: true });
      return;
    } else if (arr.length >= 1) {
      updateIsLastFetchEmpty({ [`${categ}`]: false }); //<-- this still doesn't fix our 'load more' button not rendering
    }
    const mergedArrays = [...fetchedUserLogs[`${categ}`], ...arr];
    updateFetchedUserLogs({ [`${categ}`]: mergedArrays });
    updateLatestEntryFetched({
      [`${categ}`]: querySnapshot.docs[querySnapshot.docs.length - 1],
    });
  };

  const handleSelection = (e) => {
    setUserListSelector(e.target.value);

    //true by default, set true each time category is updated in Modal.
    if (shouldCategoryUpdate[`${e.target.value}`] === false) {
      return;
    }
    // get data from firestore
    if (categLeftoverLength[`${e.target.value}`] === 0) {
      getUsersCategoryLog(e.target.value);
    }
    updateShouldCategoryUpdate({ [`${e.target.value}`]: false });
  };

  function useWindowSize() {
    const [windowSize, setWindowSize] = useState({
      width: undefined,
      height: undefined,
    });
    useEffect(() => {
      function handleResize() {
        setWindowSize({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      }
      window.addEventListener("resize", handleResize);
      handleResize();
      return () => window.removeEventListener("resize", handleResize);
    }, []);
    return windowSize;
  }
  useEffect(() => {
    if (!fetchedUserLogs[`${userListSelector}`]) return;

    const categoryToMap = fetchedUserLogs[`${userListSelector}`];
    const renderLogCategory = () => {
      let mapped = categoryToMap.map((anime) => {
        return (
          <div className="test-margin" key={anime.mal_id} ref={scrollBottomRef}>
            <AnimeCard clickedAnime={anime} />
            <Link to={`/anime/${anime.mal_id}`} key={anime.mal_id}>
              <img
                src={anime.thumbnailURL}
                alt={anime.title}
                className="thumbnail-category"
              />
            </Link>
          </div>
        );
      });
      return (
        <div className="category-div">
          <LogCategory
            isMobile={isMobile}
            isLoading={isLoading}
            className="scrollbar"
            id="style-1"
          >
            {mapped}
          </LogCategory>
        </div>
      );
      // return mapped;
    };
    setCurrentCategoryLog(renderLogCategory());
    if (isMobile) {
      scrollBottomRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "nearest",
      });
    } else if (!isMobile) {
      scrollBottomRef.current?.scrollIntoView(BsAlignBottom);
    }
    // eslint-disable-next-line
  }, [fetchedUserLogs, userListSelector, isMobile]);

  // Handle the case where we leave a category selected, then update the log for that category, and come back to the dashboard.
  useEffect(() => {
    if (
      shouldCategoryUpdate[`${userListSelector}`] &&
      categLeftoverLength[`${userListSelector}`] === 0
    ) {
      getUsersCategoryLog(userListSelector);
      updateShouldCategoryUpdate({ [`${userListSelector}`]: true });
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (
      shouldCategoryUpdate[`${userListSelector}`] &&
      categLeftoverLength[`${userListSelector}`] === 0
    ) {
      getUsersCategoryLog(userListSelector);
      updateShouldCategoryUpdate({ [`${userListSelector}`]: true });
    }
    // eslint-disable-next-line
  }, [lastEntryFetched]);

  let message = (
    <div className="entries-message-div">
      {fetchedUserLogs[`${userListSelector}`]?.length > 0 && !isLoading
        ? fetchedUserLogs[`${userListSelector}`].length + " entries"
        : ""}
    </div>
  );

  return (
    <div className="centered-div">
      <h1 className="my-log-h1">my anime log</h1>
      <hr className={!isMobile ? "hr-margin-exception" : ""} />
      <Selector
        defaultValue={userListSelector}
        onChange={handleSelection}
        isBold={true}
        isMobile={isMobile}
      >
        <OptionSelector hidden value={userListSelector}>
          {userListSelector}
        </OptionSelector>
        <OptionSelector value="completed">completed</OptionSelector>
        <OptionSelector value="watching">watching</OptionSelector>
        <OptionSelector value="plan to watch">plan to watch</OptionSelector>
      </Selector>
      {isLoading && fetchedUserLogs[`${userListSelector}`]?.length === 0 && (
        <div className="loading-log-container">
          <MoonLoader size={50} color="whitesmoke" />
        </div>
      )}
      {currentCategoryLog && currentCategoryLog}
      {!currentCategoryLog &&
        shouldCategoryUpdate[`${userListSelector}`] &&
        isLastFetchEmpty[`${userListSelector}`] && (
          <div>
            <h1>
              This category is empty, go to the Explore section to find new
              anime!
            </h1>
          </div>
        )}
      {isLoading && fetchedUserLogs[`${userListSelector}`]?.length > 0 && (
        <div className="loading-more-log-container">
          <BeatLoader size={20} color="whitesmoke" />
        </div>
      )}

      {(shouldCategoryUpdate[`${userListSelector}`] &&
        isLoading === false &&
        isCategFullyFetched[`${userListSelector}`] === false &&
        fetchedUserLogs[`${userListSelector}`]?.length > 0) ||
      (isLoading === false &&
        isCategFullyFetched[`${userListSelector}`] === false &&
        !isLastFetchEmpty[`${userListSelector}`] &&
        fetchedUserLogs[`${userListSelector}`]?.length > 0) ? (
        <button
          onClick={() => getUsersCategoryLog(userListSelector)}
          className="load-more-btn"
        >
          load more
        </button>
      ) : (
        <h3>{message}</h3>
      )}
    </div>
  );
}

export default UsersAnimeLog;
