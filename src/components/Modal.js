import React, { useState } from "react";
import "../styles/modal-style.css";
import { OptionSelector, Selector } from "./primedComps";
// import {} from "react-icons/";

function Modal({ setIsModalOpen }) {
  const [listSelector, setListSelector] = useState("watching");
  const handleSelection = (e) => {
    setListSelector(e.target.value);
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
                Cancel
              </button>
            </div>
            {/* delete? */}
            <div className="modalContent">
              {listSelector === "watching" && (
                <div className="watching-container">
                  <span className="details-span watching">
                    <p>Watched: </p>
                    <div className="eps-input-div">
                      {/* might want to experiment with a green + circle just off the top right corner of the input */}
                      <input type="number" min={1} max={2000}></input>
                      <span className="ep-count">/100</span>
                    </div>
                  </span>
                  <span className="details-span">
                    <p>Score: </p>
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
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Modal;
