import React, { useState } from "react";
import "../styles/modal-style.css";
import { OptionSelector, Selector } from "./primedComps";
import { AiFillPlusCircle, AiFillTrophy } from "react-icons/ai";

function Modal({ setIsModalOpen, episodesAired, animeID }) {
  const [listSelector, setListSelector] = useState("watching");
  const [episodesWatched, setEpisodesWatched] = useState(0);
  const [myScore, setMyScore] = useState("");

  const handleSelection = (e) => {
    setListSelector(e.target.value);
  };

  const preventDecimalWatched = (e) => {
    if (e.key === ".") {
      e.preventDefault();
      return;
    }
  };

  const handleWatchedInputChange = (e) => {
    const { value } = e.target;
    if (!value || value <= 0) {
      setEpisodesWatched(0);
      //OR: setEpisodesWatched(value); <--- experiment with this
      return;
    }
    if (value === episodesAired) return;
    if (value > episodesAired) return;
    if (value.toString().length > episodesAired.toString().length + 1) return;
    setEpisodesWatched(parseInt(value, 10));
  };

  const handleIncreaseWatchedBtn = () => {
    if (episodesWatched === episodesAired) return;
    if (episodesWatched > episodesAired) return;

    setEpisodesWatched(Number(episodesWatched) + 1);
  };

  const preventMinus = (e) => {
    if (e.key === "-") {
      e.preventDefault();
      return;
    }
    console.log(myScore);
    if (Number(myScore) === 10) {
      if (e.key === ".") {
        e.preventDefault();
        return;
      }
    }
  };

  const preventPasteNegative = (e) => {
    e.preventDefault();
    return;
  };

  const handleScoreInputChange = (e) => {
    // --------------BUG!!!
    //User can input - subtraction sign right after a number.
    // After which, user can link a lot of numbers, like so:
    // 1-1.0167.957-301, etc...
    // This is very alarming, solve ASAP.

    const { value } = e.target;
    if (Number(value) === "-") return;
    if (!value) {
      setMyScore(value);
      return;
    }

    // no decimals allowed if input is less than 1
    if (value + myScore < 1) return;

    // idea: if value.length >= 3 and there's no decimal point...
    // other idea: if there is at least one leading zero and there is a decimal point, remove all leading zeroes (slice(n position that isnt zero))

    if (value === "1") {
      console.log("check for 10");
      console.log(e.key);
      if (e.key === ".") return;
    }

    if (value.length >= 3 && Number(value - 10 === 0)) {
      console.log("Should be 10");
      setMyScore(value.slice(0, 2));
      return;
    }

    if (value.toString().length > 3) {
      setMyScore(value.slice(0, 3));
      return;
    }
    if (value > 10) return;
    // score is a float number, for greater user experience.
    // console.log(typeof value);
    setMyScore(parseFloat(value, 10));
  };

  return (
    <>
      <div className="darkBG">
        <div className="centered">
          <div className="modal">
            <div className="modalHeader">
              {/* <h1>Modal</h1> */}
              <h5 className="heading">Add to my log</h5>
              <button
                className="closeBtn"
                onClick={() => setIsModalOpen(false)}
              >
                X
              </button>
            </div>
            {/* delete? */}
            {/* WE COULD TURN THIS INTO A FUNCTION:
            We can put the function in our utils folder
            In that document, we will make 3 other functions:
            registerWatching, registerCompleted, registerPlanToWatch.
            The function we will be exporting is our main function: 
            That main function takes 3 parameters: (selector, epsAired, epsWatched);
            // Inside the function, perform a switch statement.
            // switch(selector), case x: registerWatching() break; case y: registerCompleted etc...
            To call it here, pass (listSelector, episodesAired, episodesWatched).
            In case of x  */}
            <div className="modalContent">
              {listSelector === "watching" && (
                <div className="watching-container">
                  <span className="details-span watching">
                    <p className="sky-blue">Episodes: {episodesAired}</p>
                  </span>
                  <span className="details-span watching">
                    <p>Watched: </p>
                    {/* <div className="eps-input-div"> */}
                    {/* might want to experiment with a green + circle just off the top right corner of the input */}
                    <input
                      type="number"
                      min={1}
                      max={2000}
                      value={episodesWatched}
                      onChange={handleWatchedInputChange}
                      onKeyDown={preventDecimalWatched}
                    ></input>
                    {episodesWatched < episodesAired && (
                      <button
                        className="ep-count"
                        onClick={handleIncreaseWatchedBtn}
                      >
                        <AiFillPlusCircle
                          size={27}
                          style={{ pointerEvents: "none" }}
                        />
                      </button>
                    )}
                    {/* </div> */}
                  </span>

                  <span className="details-span watching">
                    <p>My score: </p>
                    <input
                      type="number"
                      className="score-input"
                      value={myScore}
                      onKeyDown={preventMinus}
                      onPaste={preventPasteNegative}
                      onChange={handleScoreInputChange}
                      placeholder="1 to 10"
                    ></input>
                  </span>
                </div>
              )}
              {listSelector === "completed" && (
                <AiFillTrophy size={100} color="gold" />
              )}
              {/* END ------------------^^^^^^^^^^^  */}
              {/* ------------------^^^^^^^^^^^  */}
              <Selector value={listSelector} onChange={handleSelection}>
                <OptionSelector value="plan-to-watch">
                  Plan to watch
                </OptionSelector>
                <OptionSelector value="watching">Watching</OptionSelector>
                <OptionSelector value="completed">Completed</OptionSelector>
                {/* <option ></option> */}
                {/* <option ></option> */}
                {/* <option ></option> */}
              </Selector>
            </div>
            {/* Save should also close the modal when clicked */}
            <div className="actionsContainer">
              <button
                className="cancelBtn"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="confirmBtn"
                onClick={() => setIsModalOpen(false)}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Modal;
