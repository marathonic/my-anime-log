import React from "react";
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
} from "firebase/firestore";
import { OptionSelector, Selector } from "../components/primedComps";
import { useState, useEffect } from "react";
import { AnimeCard, Category } from "../components/primedComps";
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
}) {
  const [placeholderCategoryState, setPlaceholderCategoryState] = useState({});
  // To render our anime:
  // -----WE could use a modified renderMapped (found in Home.js) to render our anime.
  // However, we'll probably want to use a <div> instead of a <span>, and change the className to "log-category", or something.
  // We want to have a maximum width of 100% so we don't overflow the screen. We want to wrap around.
  // So since 2 anime take up 100% of the space, our anime will keep wrapping around the width in pairs.
  // We also want to implement pagination.

  const getUsersCategoryLog = async (categ) => {
    // const q = query(collection(db,"theNewUsers", user.uid, "animeLog"),
    // where("status", "==", `${userListSelector}`))
    // const q = query(collection(db,"theNewUsers", user.uid, "animeLog"),
    // where("status", "==", `${userListSelector}`))
    //    orderBy('name'), limit(3) <-- add before last ")" above.
    // const categSnap = await getDocs(q);
    // const allCategSnapData = categSnap.docs.map((d) => ({
    // id: d.id,
    // ...d.data()
    // }))
    //
    // updateFetchedUserLogs({[`${userListSelector}`] : allCategSnapData})
    //

    //--------------This works, BUT IT GETS THE WHOLE COLLECTION, UNFILTERED.---------------------------
    // const docRef = doc(
    // db,
    // "theNewUsers",
    // user?.uid,
    // "animeLog",
    // "testcompleted"
    // );
    // const docSnap = await getDoc(docRef);
    // let arrai = [];
    // if (docSnap.exists()) {
    // console.log("Document data:", docSnap.data());
    // arrai.push({ ...docSnap.data() });
    // } else {
    // console.log("no such category");
    // }
    // updateFetchedUserLogs({ [`${categ}`]: arrai });

    // change 'testplantowatchcollection' to 'categories'
    const querySnapshot = await getDocs(
      query(
        collection(
          db,
          "theNewUsers",
          user?.uid,
          "animeLog",
          "categories",
          categ
        )
      )
    );
    let arr = [];
    querySnapshot.forEach((doc) => {
      console.log(doc.id, "=>", doc.data());
      arr.push({ ...doc.data() });
    });
    updateFetchedUserLogs({ [`${categ}`]: arr });
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
              src={anime.images.jpg.image_url}
              alt={anime.title}
              className="thumbnail-category"
            />
          </Link>
        </span>
      );
    });
    return (
      <div>
        <Category isMobile={isMobile}>{mapped}</Category>
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
    if (shouldCategoryUpdate[`${e.target.value}`] === false) return; // <-- true by default, set true each time category is updated in Modal.
    // get data from firestore
    getUsersCategoryLog(e.target.value);
    // updateFetchedUserLogs({[`${e.target.value}`] : getUsersCategoryLog()})

    // should we try using getUsersCategoryLog() here instead of the useEffect?
    // getUsersCategoryLog();
    // newGetUsersCategoryLogTest(userListSelector);

    // after getting data from firestore:
    // updateFetchedUserLogs({[`${e.target.value}`] : false})
    // updateFetchedUserLogs({[`${e.target.value}`] : getUsersCategoryLog()})
    updateShouldCategoryUpdate({ [`${e.target.value}`]: false });
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

  return (
    <div>
      <h1 style={{ color: "white", fontSize: "3rem" }}>my Log</h1>
      <hr />
      <Selector defaultValue={userListSelector} onChange={handleSelection}>
        {/* on the next line, try changing the value to value="" */}
        <OptionSelector hidden value={userListSelector}>
          {userListSelector}
        </OptionSelector>
        <OptionSelector value="completed">completed</OptionSelector>
        <OptionSelector value="watching">watching</OptionSelector>
        <OptionSelector value="plan to watch">plan to watch</OptionSelector>
      </Selector>

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
