import React, { useState } from "react";
import "../styles/modal-style.css";
import { OptionSelector, Selector } from "./primedComps";
import { AiFillPlusCircle } from "react-icons/ai";

function Modal({ setIsModalOpen, episodesAired, animeID }) {
  const [listSelector, setListSelector] = useState("watching");
  const [watchedEpisodes, setWatchedEpisodes] = useState(0);

  const handleSelection = (e) => {
    setListSelector(e.target.value);
  };

  const handleWatchedInputChange = (e) => {
    setWatchedEpisodes(e.target.value);
  };

  const handleIncreaseWatchedBtn = () => {
    setWatchedEpisodes((watchedEpisodes) => watchedEpisodes + 1);
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
                      value={watchedEpisodes}
                      onChange={handleWatchedInputChange}
                    ></input>

                    <button
                      className="ep-count"
                      onClick={handleIncreaseWatchedBtn}
                    >
                      <AiFillPlusCircle
                        size={27}
                        style={{ pointerEvents: "none" }}
                      />
                    </button>
                    {/* </div> */}
                  </span>

                  <span className="details-span watching">
                    <p>My score: </p>
                    <input
                      type="number"
                      className="score-input"
                      max={10}
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
