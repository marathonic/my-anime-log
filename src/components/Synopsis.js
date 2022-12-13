import React, { useEffect, useState } from "react";
import { AnimeSynopsis } from "./primedComps";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { useRef } from "react";

const Synopsis = ({
  animeSynopsis,
  isModalOpen,
  setShowSynopsis,
  showSynopsis,
  isMobile,
  isTrailerAvailable,
}) => {
  const formattedSynopsis = animeSynopsis.replaceAll(". ", ".\n\n");
  const [hasSynopsisBeenClicked, setHasSynopsisBeenClicked] = useState(false);

  const handleSynopsis = () => {
    setShowSynopsis(!showSynopsis);
    if (!hasSynopsisBeenClicked) {
      setHasSynopsisBeenClicked(true);
    }
  };

  useEffect(() => {
    if (!isTrailerAvailable && !hasSynopsisBeenClicked && !isMobile) {
      setShowSynopsis(true);
      return;
    }
    if (!hasSynopsisBeenClicked) return;
    if (!showSynopsis) {
      window.scrollTo(0, 0);
      return;
    }
    let synopsisId = document.querySelector("#synopsis-autoscroll");
    synopsisId?.scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "nearest",
    });
  }, [showSynopsis]);

  return (
    <section className={isModalOpen ? "synopsis-hidden" : "synopsis-section"}>
      <span className="centered-span synopsis-bar" id="synopsis-autoscroll">
        <h1>Synopsis</h1>
        <button
          onClick={handleSynopsis}
          className="synopsis-chevron chevron-margin-exception"
        >
          {showSynopsis ? <FiChevronUp /> : <FiChevronDown />}
        </button>
      </span>
      <AnimeSynopsis showSynopsis={showSynopsis} isMobile={isMobile}>
        <span className="synopsis-span">
          <p className="synopsis-text">{formattedSynopsis}</p>
        </span>
      </AnimeSynopsis>
    </section>
  );
};

export default Synopsis;
