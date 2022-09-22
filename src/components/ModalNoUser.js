import React from "react";
import { Link } from "react-router-dom";
import "../styles/modal-style.css";
import { GoBook } from "react-icons/go";

function ModalNoUser({ setIsModalOpen }) {
  return (
    <>
      <div className="darkBG">
        <div className="centered">
          <div className="modal">
            <div className="modalHeader">
              {/* <h1>Modal</h1> */}
              <h5 className="heading">Oops!</h5>
              <button
                className="closeBtn"
                onClick={() => setIsModalOpen(false)}
              >
                X
              </button>
            </div>
            <div className="modalContent">
              <span>
                <GoBook color="#cdcccc" size={100} />
                <p className="no-user-txt">
                  You need to be logged in to track your anime
                </p>
              </span>
              <Link to="/login">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="no-user-btn"
                >
                  <h3 className="no-user-btn-h3">Go to login</h3>
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ModalNoUser;
