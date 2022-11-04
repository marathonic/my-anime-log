import React from "react";
import "../style.css";
import { OptionSelector, Selector } from "../components/primedComps";
import { useState } from "react";

//  Maybe it re-sets the selection to the default because it's reloading this component,
//    let's try putting this in Dashboard instead and see if persists after navigating to Home.

function UsersAnimeLog({userListSelector, loggedCompleted, setUserListSelector, setLoggedCompleted, updateFetchedUserLogs}) {

  // To render our anime:
  // -----WE could use a modified renderMapped (found in Home.js) to render our anime. 
  // However, we'll probably want to use a <div> instead of a <span>, and change the className to "log-category", or something.
  // We want to have a maximum width of 100% so we don't overflow the screen. We want to wrap around.
  // So since 2 anime take up 100% of the space, our anime will keep wrapping around the width in pairs.
  // We also want to implement pagination.


  // const [userListSelector, setUserListSelector] = useState('');
  // const handleSelection = (e) => {
    // setUserListSelector(e.target.value);
  // };



  const handleSelection = (e) => {
    setUserListSelector(e.target.value);
    // if(e.target.value === 'category') {
    //   setLoggedCompleted(null);
    // }
    if(e.target.value !== 'completed') {
      setLoggedCompleted(null);
    }
    if(e.target.value === 'completed') {
      // if(previouslyChecked.current-selection === false) return <--- if we already have the data, avoid further calls for this render.
      // we want to find a way to let Dashboard know that the log has been updated, so we know to allow a refresh.
      // we're here, this means we proceed with getting the data.
      // on this line, we'll get the docs where() firestore status is the current selection, e.g: 'completed'. 
      // we could do something like a modified: updateAllTopAnime({ airing: topAiring }) from Home.js;
      // that would look like: setPreviouslyChecked(previouslyChecked... current-selection: data), hmmmm...?
      setLoggedCompleted(['completed show 1', 'completed show 2', 'completed show 3', 'etc...'])
      updateFetchedUserLogs({completed: ['completed show 1', 'completed show 2', 'completed show 3', 'etc...']})
    }

    // we could do:
    //  
    // check if current category contains anime entries. If so, save them as entries in an object.
    // 
  };

  // ---------let's try keeping the state here and see if that fixes the re-renders.--------------- 

  return (
    <div>
      <h1 style={{ color: "white", fontSize: "3rem" }}>my Log</h1>
      <hr />
      <Selector defaultValue={userListSelector} onChange={handleSelection}>
        {/* on the next line, try changing the value to value="" */}
                  <OptionSelector hidden value={userListSelector}>category</OptionSelector>
                  <OptionSelector value="completed">Completed</OptionSelector>
                  <OptionSelector value="watching">Watching</OptionSelector>
                  <OptionSelector value="plan-to-watch">
                    Plan to watch
                  </OptionSelector>
                </Selector>
                
                {/* 
                {loggedCompleted && 
            <h2>
                {testFuncOutput(loggedCompleted)}
                  </h2>
                }
            */}
    </div>
  );
}

export default UsersAnimeLog;
