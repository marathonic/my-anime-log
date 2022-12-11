import React, { useReducer } from "react";
import "../style.css";
import { auth, db, logout } from "../firebase.js";
import {
  query,
  collection,
  getDocs,
  where,
  onSnapshot,
  doc,
  getDoc,
  orderBy,
  limit,
  startAfter,
  startAt,
} from "firebase/firestore";
import {
  LogCategoryDesktop,
  OptionSelector,
  Selector,
} from "../components/primedComps";
import { useState, useEffect, useRef } from "react";
import { AnimeCard, Category, LogCategory } from "../components/primedComps";
import { Link } from "react-router-dom";
import { MoonLoader, FadeLoader, BeatLoader } from "react-spinners";
import {
  BsAlignBottom,
  BsAlignCenter,
  BsAlignEnd,
  BsAlignMiddle,
  BsAlignStart,
  BsAlignTop,
} from "react-icons/bs";

// backtick `

//  Maybe it re-sets the selection to the default because it's reloading this component,
//    let's try putting this in Dashboard instead and see if persists after navigating to Home.

function UsersAnimeLog({
  userListSelector,
  loggedCompleted,
  setUserListSelector,
  setLoggedCompleted,
  updateFetchedUserLogs,
  fetchedUserLogs,
  shouldCategoryUpdate,
  user,
  updateShouldCategoryUpdate,
  animeThumbnailURL,
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
  const [placeholderCategoryState, setPlaceholderCategoryState] = useState({});
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
  const size = useWindowSize();

  // To render our anime:
  // -----WE could use a modified renderMapped (found in Home.js) to render our anime.
  // However, we'll probably want to use a <div> instead of a <span>, and change the className to "log-category", or something.
  // We want to have a maximum width of 100% so we don't overflow the screen. We want to wrap around.
  // So since 2 anime take up 100% of the space, our anime will keep wrapping around the width in pairs.
  // We also want to implement pagination.

  const getUsersCategoryLog = async (categ) => {
    console.log("categLeftoverLength ==> ", categLeftoverLength[`${categ}`]);
    console.log("shouldCategoryUpdate ==> ", shouldCategoryUpdate[`${categ}`]);

    // this condition doesn't work because shouldCategoryUpdate is listening for MODAL changes.
    // if (
    //   categLeftoverLength[`${categ}`] === 0 &&
    //   shouldCategoryUpdate[`${categ}`] === false
    // ) {
    //   return;
    // }
    // CONTINUE HERE: In case categLeftoverLength... <----------------------------------CONTINUE HERE
    // ---
    // What we want to do is look at how many have been fetched and how many are in the array.

    if (categLeftoverLength[`${categ}`] > 0) {
      console.log(
        "Special condition activated line 76.........................."
      );
      let q;
      q = query(
        collection(db, "theNewUsers", user?.uid, "animeLog"),
        where("status", "==", categ),
        orderBy("name"),
        startAfter(latestEntryFetched[`${categ}`]),
        limit(5)
      );

      setIsLoading(true);
      console.log("<--------querying firestore------>...");
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
          console.log(doc.id, "fetching from firestore =>", doc.data());
          arr.push({ ...doc.data() });
        });
        setIsAlphabReorderRequired({ [`${categ}`]: false });
      }
      const mergedArrays = [...fetchedUserLogs[`${categ}`], ...arr];
      updateFetchedUserLogs({ [`${categ}`]: mergedArrays });
      // setLastEntryFetched(querySnapshot.docs[querySnapshot.docs.length - 1]);
      updateLatestEntryFetched({
        [`${categ}`]: querySnapshot.docs[querySnapshot.docs.length - 1],
      });
      updateCategLeftoverLength({
        [`${categ}`]: 0,
      });
      updateShouldCategoryUpdate({ [`${categ}`]: false });
      console.log("--------------------------------");
      // console.log(categLeftoverLength[`${categ}`] - 5);
      return;
    }

    //
    let q;
    q = query(
      collection(db, "theNewUsers", user?.uid, "animeLog"),
      where("status", "==", categ),
      orderBy("name"),
      startAfter(latestEntryFetched[`${categ}`] || 0),
      limit(5)
    );
    // this condition runs automatically on useEffect:
    if (isAlphabReorderRequired[`${categ}`] === true) {
      console.log("<<<<<<<<<<<alphab reorder required>>>>>>>>>>>>>>");
      q = query(
        collection(db, "theNewUsers", user?.uid, "animeLog"),
        where("status", "==", categ),
        orderBy("name"),
        startAt(latestEntryFetched[`${categ}`]),
        limit(5)
      );
      setIsAlphabReorderRequired({ [`${categ}`]: false });
      // return;
    }
    console.log(
      "should category update",
      "==>",
      shouldCategoryUpdate[`${categ}`]
    );
    console.log("is last fetch empty", "==>", isLastFetchEmpty[`${categ}`]);
    if (shouldCategoryUpdate[`${categ}`] && isLastFetchEmpty[`${categ}`]) {
      console.log("<<<<<<<RETURNING BEFORE FETCH>>>>>>>");
      updateShouldCategoryUpdate({ [`${categ}`]: false });
      return;
    }

    console.log("<--------querying firestore------>...");
    setIsLoading(true);

    const querySnapshot = await getDocs(q);
    setIsLoading(false);

    let arr = [];
    if (querySnapshot.empty !== true) {
      querySnapshot.forEach((doc) => {
        console.log(doc.id, "fetching from firestore =>", doc.data());
        arr.push({ ...doc.data() });
      });
    }
    if (arr.length < 1) {
      updateIsLastFetchEmpty({ [`${categ}`]: true });
      console.log("_______Last fetch empty");
      // let lastCategDiv = Array.from(
      //   document.querySelectorAll(".thumbnail-category")
      // ).pop();

      // lastCategDiv?.scrollIntoView(false);
      updateShouldCategoryUpdate({ [`${categ}`]: false });
      updateIsCategFullyFetched({ [`${categ}`]: true });
      return;
    } else if (arr.length >= 1) {
      updateIsLastFetchEmpty({ [`${categ}`]: false }); //<-- this still doesn't fix our 'load more' button not rendering
    }
    // ---------------EDIT: BREAKS WHEN SWITCHING CATEGORIES------------------------------------------/////////.
    const mergedArrays = [...fetchedUserLogs[`${categ}`], ...arr];
    updateFetchedUserLogs({ [`${categ}`]: mergedArrays });
    // setLastEntryFetched(querySnapshot.docs[querySnapshot.docs.length - 1]);
    updateLatestEntryFetched({
      [`${categ}`]: querySnapshot.docs[querySnapshot.docs.length - 1],
    });
  };

  console.log("is Mobile ------> ", isMobile);

  // updates: updateFetchedUserLogs({ category: response.data })

  const handleSelection = (e) => {
    setUserListSelector(e.target.value);

    if (shouldCategoryUpdate[`${e.target.value}`] === false) {
      console.log(
        "shouldCategoryUpdate is false, returning before fetching data..."
      );
      console.log(shouldCategoryUpdate);
      return;
    } // <-- true by default, set true each time category is updated in Modal.
    // get data from firestore
    console.log("current selection", " ===> ", e.target.value);
    if (categLeftoverLength[`${e.target.value}`] === 0) {
      getUsersCategoryLog(e.target.value);
    }
    // updateFetchedUserLogs({[`${e.target.value}`] : getUsersCategoryLog()})

    // should we try using getUsersCategoryLog() here instead of the useEffect?
    // getUsersCategoryLog();
    // newGetUsersCategoryLogTest(userListSelector);

    // after getting data from firestore:
    // updateFetchedUserLogs({[`${e.target.value}`] : false})
    // updateFetchedUserLogs({[`${e.target.value}`] : getUsersCategoryLog()})
    // ------------------TEST----------------------------------------
    updateShouldCategoryUpdate({ [`${e.target.value}`]: false });
    // ------------------TEST----------------------------------------

    // if(shouldCategoryUpdate[`${fetchedUserLogs[userListSelector]}`] === false) return; <-- this will be false by default.
    // if(shouldCategoryUpdate[`${fetchedUserLogs[userListSelector]}`] === true) {...} <-- that category has been updated. Refresh log.
    // The updateHasCategoryBeenUpdated will be passed from Appjs to Modal. Inside Modal, it will be updated to true after any changes in its respective category. This will be done when clicking the Confirm button, after checking that the information has indeed changed.
    // Then here in UsersAnimeLogjs, we'll check that value right here. If it's positive, we'll perform our desired actions, and then, at the end, we'll change update the category to false, updateHasCategoryBeenUpdated(`${userListSelector}` : false) <-- or something like that.

    // if(e.target.value === 'completed') {
    // if(previouslyChecked.current-selection === false) return <--- if we already have the data, avoid further calls for this render.
    // we want to find a way to let Dashboard know that the log has been updated, so we know to allow a refresh.
    // we're here, this means we proceed with getting the data.
    // on this line, we'll get the docs where() firestore status is the current selection, e.g: 'completed'.
    // we could do something like a modified: updateAllTopAnime({ airing: topAiring }) from Home.js;
    // that would look like: setPreviouslyChecked(previouslyChecked... current-selection: data), hmmmm...?
    // setLoggedCompleted(['completed show 1', 'completed show 2', 'completed show 3', 'etc...'])

    // next line was the only one that was not commented out before commenting out this scope
    // updateFetchedUserLogs({completed: ['completed show 1', 'completed show 2', 'completed show 3', 'etc...']})
    // }

    // we could do:
    //
    // check if current category contains anime entries. If so, save them as entries in an object.
    //
  };

  // ---------let's try keeping the state here and see if that fixes the re-renders.---------------

  const testFuncOutput = (outputText) => {
    if (userListSelector === "") return;
    return `${outputText}`;
  };

  console.log(fetchedUserLogs);

  // useEffect(() => {
  // getUsersCategoryLog();
  // }, [userListSelector]);

  // useEffect(() => {
  // updateFetchedUserLogs({
  // [`${userListSelector}`]: placeholderCategoryState,
  // });
  // }, [userListSelector]);

  // useEffect(() => {
  // newGetUsersCategoryLogTest();
  // }, [userListSelector]);

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
    console.log("TESTING------------------------------------------");
    // --------------"TESTING" above logs to console when visiting log again after adding a new entry, so this whole thing runs!
    // ---BUT WAIT!!! WE DON'T WANT TO DO ANYTHING HERE, WE WANT IT TO HAPPEN WHEN WE CLICK THE "load more" BUTTON!
    if (
      categLeftoverLength[`${userListSelector}`] >
      fetchedUserLogs[`${userListSelector}`].length
    ) {
      console.log(
        "THERE IS STILL LEFTOVER LENGTH, MAKE A FIRESTORE QUERY TO GET THE REST? "
      );
    }
    // ---------------End of test on line above -------------------EDIT: DO THIS FOR THE BUTTON, NOT THE useEffect
    const categoryToMap = fetchedUserLogs[`${userListSelector}`];
    // setCurrentCategoryLog(category);
    const renderLogCategory = () => {
      let mapped = categoryToMap.map((anime) => {
        return (
          <div className="test-margin" key={anime.mal_id} ref={scrollBottomRef}>
            {/* what does AnimeCard do here? */}
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
      return mapped;
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
  }, []); // <--- try with empty dependencies array []

  useEffect(() => {
    if (
      shouldCategoryUpdate[`${userListSelector}`] &&
      categLeftoverLength[`${userListSelector}`] === 0
    ) {
      getUsersCategoryLog(userListSelector);
      updateShouldCategoryUpdate({ [`${userListSelector}`]: true });
    }
  }, [lastEntryFetched]);

  // const renderCurrentCateg = () => {
  // if (fetchedUserLogs[`${userListSelector}`]) {
  // const category = fetchedUserLogs[`${userListSelector}`];
  //
  // console.log(category);
  // }
  // };

  let message = (
    <div className="entries-message-div">
      {fetchedUserLogs[`${userListSelector}`]?.length > 0 && !isLoading
        ? fetchedUserLogs[`${userListSelector}`].length + " entries"
        : ""}
    </div>
  );

  console.log(size);

  return (
    <div className="centered-div">
      <h1 style={{ color: "white", fontSize: "3rem" }}>my Log</h1>
      <p>H: {size.height}</p>
      <p>W: {size.width}</p>
      <hr className={!isMobile ? "hr-margin-exception" : ""} />
      <Selector
        defaultValue={userListSelector}
        onChange={handleSelection}
        isBold={true}
        isMobile={isMobile}
      >
        {/* on the next line, try changing the value to value="" */}
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

      {/* BUG: This doesn't work when we have logged exactly 5 (or however much is our limit) entries, it renders the button.
      But I thought that in theory, it wouldn't render again after pressing it once, because it should update, but ohhh, yeah, we might need one more state for that.  */}
      {/* BUG: Under the following rules, the category log updates with new entries as soon as its userListSelector is selected,
      instead of waiting for a button press to fetch the next entries. This is most likely happening due to a useEffect.
      THAT MEANS that there may be a conflict with our useEffect that's causing it to conflict with our 'load more' button click  */}
      {(shouldCategoryUpdate[`${userListSelector}`] &&
        isLoading === false &&
        isCategFullyFetched[`${userListSelector}`] === false &&
        fetchedUserLogs[`${userListSelector}`]?.length > 0) ||
      // °°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°FOUND IT!!!  WHEN WE'VE JUST SPLIT THE LOG FOR ALPHABET REORDER, WE HAVE 12 ENTRIES AT THAT MOMENT!!!°°°°°°
      // AND THEN ON THE NEXT FETCH WE HAVE 17 ENTRIES IN THE LOG.
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

      {/* 
                {loggedCompleted && 
            <h2>
                {testFuncOutput(loggedCompleted)}
                  </h2>
                }
            */}

      {/* 
            {fetchedUserLogs.completed && userListSelector === "completed" && 
            <h2>
              {testFuncOutput(fetchedUserLogs.completed)}
            </h2>
            }
            */}

      {/* Display the user log for the selected category: */}
      {/* 
            {fetchedUserLogs[`${userListSelector}`] &&
              <h2>
                {fetchedUserLogs[`${userListSelector}`]}
              </h2>
            }
              */}
    </div>
  );
}

export default UsersAnimeLog;
