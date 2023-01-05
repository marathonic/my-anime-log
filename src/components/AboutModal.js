import React from "react";
import "../styles/about-modal-style.css";
import { FaGithub } from "react-icons/fa";

function AboutModal({ logout, setIsAboutModalOpen }) {
  return (
    <div className="blur-bg">
      <div className="about-modal">
        <h3 className="about-title">About this website</h3>
        <ul className="about-ul">
          <li>Free anime tracker, inspired by MyAnimeList.</li>
          <li>Results powered by the Jikan API.</li>
          <li>For educational purposes only.</li>
          <li>No copyright infringement intended.</li>
        </ul>
        <span className="about-dev-title">
          <h4>Developer</h4>
        </span>
        <span className="about-dev-links">
          <a
            className="about-link-text"
            href="https://github.com/marathonic/my-anime-log"
          >
            <FaGithub size={30} />
            marathonic
          </a>
        </span>
        <div className="signout-btn-container">
          <button
            onClick={() => setIsAboutModalOpen(false)}
            className="close-btn green"
          >
            close
          </button>
        </div>
      </div>
    </div>
  );
}

export default AboutModal;
