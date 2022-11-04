import React from "react";
import "../style.css";
import { OptionSelector, Selector } from "../components/primedComps";
import { useState } from "react";

//  Maybe it re-sets the selection to the default because it's reloading this component,
//    let's try putting this in Dashboard instead and see if persists after navigating to Home.

function UsersAnimeLog({listSelector, loggedCompleted, setListSelector, setLoggedCompleted, setStoredLogs}) {
  // const [listSelector, setListSelector] = useState('');
  // const handleSelection = (e) => {
    // setListSelector(e.target.value);
  // };



  const handleSelection = (e) => {
    setListSelector(e.target.value);
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
      setStoredLogs({completed: ['completed show 1', 'completed show 2', 'completed show 3', 'etc...']})
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
      <Selector defaultValue={listSelector} onChange={handleSelection}>
                  <OptionSelector hidden value={listSelector}>category</OptionSelector>
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
