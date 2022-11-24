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
import { OptionSelector, Selector } from "../components/primedComps";
import { useState, useEffect } from "react";
import { AnimeCard, Category, LogCategory } from "../components/primedComps";
import { Link } from "react-router-dom";

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

  // To render our anime:
  // -----WE could use a modified renderMapped (found in Home.js) to render our anime.
  // However, we'll probably want to use a <div> instead of a <span>, and change the className to "log-category", or something.
  // We want to have a maximum width of 100% so we don't overflow the screen. We want to wrap around.
  // So since 2 anime take up 100% of the space, our anime will keep wrapping around the width in pairs.
  // We also want to implement pagination.

  const getUsersCategoryLog = async (categ) => {
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

    // console.log("lastEntryFetched, or startAfter", " ==> ", lastEntryFetched);
    return;
    // ------------------------------------------------------------------------------------------------

    // const animeLogRef = collection(db, "theNewUsers", user.uid, "animeLog");
    // const q = query(animeLogRef, where("status", "==", "completed"));
    // const querySnapshot = await getDocs(q);
    // querySnapshot.forEach((doc) => {
    // console.log(doc.id, "==>", doc.data());
    // });
    // const q = query(
    // collection(db, "theNewUsers", user.uid, "animeLog"),
    // where("status", "==", "completed")
    // );
    // const querySnapshot = await getDocs(q);
    // querySnapshot.docs.forEach((doc) => {
    // console.log(doc.data());
    // });
    // const myDocs = querySnapshot.docs.map((doc) => doc.data());
    // console.log(myDocs);

    // querySnapshot.forEach((doc) => {
    // console.log(doc.id, " => ", doc.data());
    // });
    // setPlaceholderCategoryState(querySnapshot);
    // console.log("testing aaaaaa");
    //categSnap.forEach((anime) => {
    //  console.log(anime.id, "=>", anime.data());
    //  // console.log(anime.data());
    //})
    // console.log("categSnap:")
    // console.log(categSnap.data())
    // trying out loaned ideas from Modaljs
    // const categResponse = categSnap.data();
    // const categLogObj = categResponse[`${userListSelector}`]
    // console.log(categLogObj);
    // return categLogObj;
    // updateFetchedUserLogs({[`${e.target.value}`] : categLogObj})
  };

  //  const newGetUsersCategoryLogTest = async () => {
  //    const categRef = query(
  //      collection(db, "theNewUsers", user.uid, "animeLog"),
  //      where("status", "==", "completed")
  //    );
  //    onSnapshot(categRef, (snapshot) => {
  //      // Maps the documents and sets them to the `msgs` state.
  //      updateFetchedUserLogs({
  //        completed: snapshot.docs.map((doc) => ({
  //          id: doc.id,
  //          data: doc.data(),
  //        })),
  //      });
  //    });
  //  };

  const renderLogCategory = (category, isMobile) => {
    let mapped = category.map((anime) => {
      return (
        <span className="category-span" key={anime.mal_id}>
          {/* what does AnimeCard do here? */}
          <AnimeCard clickedAnime={anime} />
          <Link to={`/anime/${anime.mal_id}`} key={anime.mal_id}>
            <img
              src={anime.thumbnailURL}
              alt={anime.title}
              className="thumbnail-category"
            />
          </Link>
        </span>
      );
    });
    return (
      <div>
        <LogCategory isMobile={isMobile}>{mapped}</LogCategory>
      </div>
    );
    return mapped;
  };

  // updates: updateFetchedUserLogs({ category: response.data })

  const handleSelection = (e) => {
    setUserListSelector(e.target.value);
    // if(e.target.value === 'category') {
    //   setLoggedCompleted(null);
    // }

    //if(e.target.value !== 'completed') {
    //  setLoggedCompleted(null);
    //}

    // PLACEHOLDER. Make sure to change the line below. We want to --return-- based on a stateful parameter that tells us whether the log has been updated since we last loaded it.
    // To accomplish the above, we'll want to always let this function run the first time, when fetchedUserLogs values are null.
    // Once a value is no longer null, the next line will check our stateful variable.
    // if(fetchedUserLogs[`${e.target.value}`] !== null && shouldCategoryUpdate[`${e.target.value}`] === false) return; //<-- always runs on first visit.
    // alternatively, if category in log hasn't been checked before, OR if ... hmmm, I think shouldC-U- should be true at first.
    // if(fetchedUserLogs[`${e.target.value}`] === null || shouldCategoryUpdate[`${e.target.value}`] === true)
    if (shouldCategoryUpdate[`${e.target.value}`] === false) {
      console.log(
        "shouldCategoryUpdate is false, returning before fetching data..."
      );
      console.log(shouldCategoryUpdate);
      return;
    } // <-- true by default, set true each time category is updated in Modal.
    // get data from firestore
    console.log("current selection", " ===> ", e.target.value);
    getUsersCategoryLog(e.target.value);
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

  useEffect(() => {
    if (!fetchedUserLogs[`${userListSelector}`]) return;
    console.log("TESTING------------------------------------------");
    // --------------"TESTING" above logs to console when visiting log again after adding a new entry, so this whole thing runs!
    // ---BUT WAIT!!! WE DON'T WANT TO DO ANYTHING HERE, WE WANT IT TO HAPPEN WHEN WE CLICK THE "load more" BUTTON!
    if (categLeftoverLength > fetchedUserLogs[`${userListSelector}`].length) {
      console.log(
        "THERE IS STILL LEFTOVER LENGTH, MAKE A FIRESTORE QUERY TO GET THE REST? "
      );
    }
    // ---------------End of test on line above -------------------EDIT: DO THIS FOR THE BUTTON, NOT THE useEffect
    const categoryToMap = fetchedUserLogs[`${userListSelector}`];
    // setCurrentCategoryLog(category);
    const renderLogCategory = (isMobile) => {
      let mapped = categoryToMap.map((anime) => {
        return (
          <div className="test-margin" key={anime.mal_id}>
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
          <LogCategory isMobile={isMobile}>{mapped}</LogCategory>
        </div>
      );
      return mapped;
    };
    setCurrentCategoryLog(renderLogCategory((isMobile = { isMobile })));
  }, [fetchedUserLogs, userListSelector]);

  // Handle the case where we leave a category selected, then update the log for that category, and come back to the dashboard.
  useEffect(() => {
    if (shouldCategoryUpdate[`${userListSelector}`]) {
      getUsersCategoryLog(userListSelector);
      updateShouldCategoryUpdate({ [`${userListSelector}`]: true });
    }
  }, []); // <--- try with empty dependencies array []

  useEffect(() => {
    if (shouldCategoryUpdate[`${userListSelector}`]) {
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

  let message =
    fetchedUserLogs[`${userListSelector}`]?.length > 0 ? "end of log" : "";

  return (
    <div className="centered-div">
      <h1 style={{ color: "white", fontSize: "3rem" }}>my Log</h1>
      <hr />
      <Selector
        defaultValue={userListSelector}
        onChange={handleSelection}
        isBold={true}
      >
        {/* on the next line, try changing the value to value="" */}
        <OptionSelector hidden value={userListSelector}>
          {userListSelector}
        </OptionSelector>
        <OptionSelector value="completed">completed</OptionSelector>
        <OptionSelector value="watching">watching</OptionSelector>
        <OptionSelector value="plan to watch">plan to watch</OptionSelector>
      </Selector>
      {isLoading && <h2>loading...</h2>}
      {currentCategoryLog && currentCategoryLog}

      {/* BUG: This doesn't work when we have logged exactly 5 (or however much is our limit) entries, it renders the button.
      But I thought that in theory, it wouldn't render again after pressing it once, because it should update, but ohhh, yeah, we might need one more state for that.  */}
      {/* BUG: Under the following rules, the category log updates with new entries as soon as its userListSelector is selected,
      instead of waiting for a button press to fetch the next entries. This is most likely happening due to a useEffect.
      THAT MEANS that there may be a conflict with our useEffect that's causing it to conflict with our 'load more' button click  */}
      {(shouldCategoryUpdate[`${userListSelector}`] && isLoading === false) ||
      (fetchedUserLogs[`${userListSelector}`]?.length % 5 === 0 &&
        isLoading === false &&
        !isLastFetchEmpty[`${userListSelector}`]) ? (
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
