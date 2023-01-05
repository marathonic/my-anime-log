import React from "react";
import "../styles/signout-modal-style.css";
import { FaGithub } from "react-icons/fa";

function AboutModal({ logout, setIsAboutModalOpen }) {
  return (
    <div className="blur-bg">
      <div className="about-modal">
        <h3>About this website</h3>
        <p>An anime tracker inspired by MyAnimeList.</p>
        <p>Results powered by the Jikan API.</p>
        <p>For educational purposes only.</p>
        <p>No copyright infringement intended.</p>
        <p>Developer: </p>
        <span>
          <a
            className="about-link"
            href="https://github.com/marathonic/my-anime-log"
          >
            <FaGithub size={30} />
            marathonic
          </a>
        </span>
        <div className="signout-btn-container">
          <button
            onClick={() => setIsAboutModalOpen(false)}
            className="signout-btn green"
          >
            close
          </button>
        </div>
      </div>
    </div>
  );
}

export default AboutModal;
