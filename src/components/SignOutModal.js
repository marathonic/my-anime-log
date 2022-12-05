import React from "react";
import "../styles/signout-modal-style.css";
import { GoAlert } from "react-icons/go";

function SignOutModal({ logout, setIsSignoutModalOpen }) {
  return (
    <div className="blur-bg">
      <div className="signout-modal">
        <GoAlert color="goldenrod" size={60} />
        <p>Sign out</p>
        <p>Are you sure?</p>
        <div className="signout-btn-container">
          <button onClick={logout} className="signout-btn red">
            Yes
          </button>
          <button
            onClick={() => setIsSignoutModalOpen(false)}
            className="signout-btn green"
          >
            Nope
          </button>
        </div>
      </div>
    </div>
  );
}

export default SignOutModal;
