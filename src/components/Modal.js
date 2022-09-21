import React, { useState } from "react";
import "../styles/modal-style.css";
import { OptionSelector, Selector } from "./primedComps";
import { AiFillPlusCircle } from "react-icons/ai";

function Modal({ setIsModalOpen, episodesAired, animeID }) {
  const [listSelector, setListSelector] = useState("watching");
  const [episodesWatched, setEpisodesWatched] = useState(0);
  const [myScore, setMyScore] = useState("");

  const handleSelection = (e) => {
    setListSelector(e.target.value);
  };

  const handleWatchedInputChange = (e) => {
    const { value } = e.target;
    if (!value || value <= 0) {
      setEpisodesWatched(0);
      return;
    }
    if (value === episodesAired) return;
    if (value > episodesAired) return;
    // if (!Number(value)) return;
    // if (value.toString().substr(0) === "0") {
    // console.log("FIRST DIGIT IS ZERO");
    // const noTrailingZero = value.slice(0);
    // setEpisodesWatched(+noTrailingZero);
    // return;
    // setEpisodesWatched(parseInt(noTrailingZero, 10));
    // }
    if (value.toString().length > episodesAired.toString().length + 1) return;
    setEpisodesWatched(parseInt(value, 10));
  };

  const handleIncreaseWatchedBtn = () => {
    if (episodesWatched === episodesAired) return;
    if (episodesWatched > episodesAired) return;

    setEpisodesWatched(Number(episodesWatched) + 1);
  };

  // make a function to handle remove all zeroes under 10:
  // on a line above runnig this, handle number > 10;
  const removeRedundantZeroes = (numStr) => {
    // -------CONTINUE HERE--------------
    // We already solved the whole decimal < 1 thing with if(val < 1) ...
    // Let's instead just remove the 0s to the left here.
    // We want to match the first number that isn't 0,
    // And slice it so the string starts at that number instead, removing all 0s before it.
    // Then, setMyScore() to be that new number.
    //-----READ ABOVE, discard code below:
    // let num = parseFloat(numStr, 10);
    // if (num === 10) return 10;
    // Number is not 10, is there a period?
    // if (!num.match(/\./)) return num;
    // We've reached here, so there is a period, find its index:
    // let isPeriod = num.match(/\./);
    // let index = num.indexOf(isPeriod);
    // let leftOfPeriod = index - 1;
    // let startLeftOfPeriod = index.slice(leftOfPeriod);
    // setMyScore(startLeftOfPeriod);
    // return;
  };

  const handleScoreInputChange = (e) => {
    const { value } = e.target;
    if (!value) {
      setMyScore(value);
      return;
    }

    // no decimals allowed if input is less than 1
    if (value + myScore < 1) return;

    // idea: if value.length >= 3 and there's no decimal point...
    // other idea: if there is at least one leading zero and there is a decimal point, remove all leading zeroes (slice(n position that isnt zero))

    if (value.length >= 3 && Number(value - 10 === 0)) {
      console.log("Should be 10");
      setMyScore(value.slice(1));
      return;
    }

    // testing further reduction of leading 0s
    // if (value.length === 3 && Number(value < 10)) {
    // const notZero = /^[1-9]$/;
    // const indexOfDecimal = value.indexOf(".");
    // const noDecimalPoint = /[1-9]+\./;
    // setMyScore(value.replace(noDecimalPoint));
    // return;
    // }

    if (value.toString().length > 4) return;
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
                      type="text"
                      className="score-input"
                      max={10}
                      maxLength={3}
                      value={myScore}
                      onChange={handleScoreInputChange}
                      placeholder="1 to 10"
                    ></input>
                  </span>
                </div>
              )}
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
