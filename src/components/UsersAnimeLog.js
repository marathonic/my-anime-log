import React from "react";
import "../style.css";
import { OptionSelector, Selector } from "../components/primedComps";
import { useState } from "react";
import { AnimeCard, Category } from "../components/primedComps";
import { Link } from "react-router-dom";

// backtick `

//  Maybe it re-sets the selection to the default because it's reloading this component,
//    let's try putting this in Dashboard instead and see if persists after navigating to Home.

function UsersAnimeLog({userListSelector, loggedCompleted, setUserListSelector, setLoggedCompleted, updateFetchedUserLogs, fetchedUserLogs, shouldCategoryUpdate}) {

  // To render our anime:
  // -----WE could use a modified renderMapped (found in Home.js) to render our anime. 
  // However, we'll probably want to use a <div> instead of a <span>, and change the className to "log-category", or something.
  // We want to have a maximum width of 100% so we don't overflow the screen. We want to wrap around.
  // So since 2 anime take up 100% of the space, our anime will keep wrapping around the width in pairs.
  // We also want to implement pagination.

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
    if(fetchedUserLogs[`${e.target.value}`] !== null && shouldCategoryUpdate[`${e.target.value}`] === false) return; //<-- always runs on first visit.
    // if() return;

    // if(shouldCategoryUpdate[`${fetchedUserLogs[userListSelector]}`] === false) return; <-- this will be false by default. 
    // if(shouldCategoryUpdate[`${fetchedUserLogs[userListSelector]}`] === true) {...} <-- that category has been updated. Refresh log. 
    // The updateHasCategoryBeenUpdated will be passed from Appjs to Modal. Inside Modal, it will be updated to true after any changes in its respective category. This will be done when clicking the Confirm button, after checking that the information has indeed changed.
    // Then here in UsersAnimeLogjs, we'll check that value right here. If it's positive, we'll perform our desired actions, and then, at the end, we'll change update the category to false, updateHasCategoryBeenUpdated(`${userListSelector}` : false) <-- or something like that.


    if(e.target.value === 'completed') {
      // if(previouslyChecked.current-selection === false) return <--- if we already have the data, avoid further calls for this render.
      // we want to find a way to let Dashboard know that the log has been updated, so we know to allow a refresh.
      // we're here, this means we proceed with getting the data.
      // on this line, we'll get the docs where() firestore status is the current selection, e.g: 'completed'. 
      // we could do something like a modified: updateAllTopAnime({ airing: topAiring }) from Home.js;
      // that would look like: setPreviouslyChecked(previouslyChecked... current-selection: data), hmmmm...?
      // setLoggedCompleted(['completed show 1', 'completed show 2', 'completed show 3', 'etc...'])
      updateFetchedUserLogs({completed: ['completed show 1', 'completed show 2', 'completed show 3', 'etc...']})
    }

    // we could do:
    //  
    // check if current category contains anime entries. If so, save them as entries in an object.
    // 
  };

  // ---------let's try keeping the state here and see if that fixes the re-renders.--------------- 

  const testFuncOutput = (outputText) => {
    if(userListSelector === '') return;
    return `${outputText}` ; 
  }

  return (
    <div>
      <h1 style={{ color: "white", fontSize: "3rem" }}>my Log</h1>
      <hr />
      <Selector defaultValue={userListSelector} onChange={handleSelection}>
        {/* on the next line, try changing the value to value="" */}
                  <OptionSelector hidden value={userListSelector}>{userListSelector}</OptionSelector>
                  <OptionSelector value="completed">completed</OptionSelector>
                  <OptionSelector value="watching">watching</OptionSelector>
                  <OptionSelector value="plan to watch">
                    plan to watch
                  </OptionSelector>
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
            {fetchedUserLogs[`${userListSelector}`] &&
              <h2>
                {fetchedUserLogs[`${userListSelector}`]}
              </h2>
            }

    </div>
  );
}

export default UsersAnimeLog;
