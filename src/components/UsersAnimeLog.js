import React from "react";
import "../style.css";
import { OptionSelector, Selector } from "../components/primedComps";
import { useState } from "react";

//  Maybe it re-sets the selection to the default because it's reloading this component,
//    let's try putting this in Dashboard instead and see if persists after navigating to Home.

function UsersAnimeLog({handleSelection, listSelector, setListSelector, loggedCompleted, setLoggedCompleted, testFuncOutput}) {
  // const [listSelector, setListSelector] = useState('');
  // const handleSelection = (e) => {
    // setListSelector(e.target.value);
  // };


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
                
                {loggedCompleted && loggedCompleted}
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
