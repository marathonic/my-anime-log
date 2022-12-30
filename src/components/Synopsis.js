import React, { useEffect, useState } from "react";
import { AnimeSynopsis } from "./primedComps";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

const Synopsis = ({
  animeSynopsis,
  isModalOpen,
  setShowSynopsis,
  showSynopsis,
  isMobile,
}) => {
  const formattedSynopsis = animeSynopsis?.replaceAll(". ", ".\n\n");
  const [hasSynopsisBeenClicked, setHasSynopsisBeenClicked] = useState(false);

  const handleSynopsis = () => {
    setShowSynopsis(!showSynopsis);
    if (!hasSynopsisBeenClicked) {
      setHasSynopsisBeenClicked(true);
    }
  };

  useEffect(() => {
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
    // eslint-disable-next-line
  }, [showSynopsis]);

  return (
    <section className={isModalOpen ? "synopsis-hidden" : "synopsis-section"}>
      {formattedSynopsis && (
        <span className="centered-span synopsis-bar" id="synopsis-autoscroll">
          <h1>Synopsis</h1>
          <button onClick={handleSynopsis} className="synopsis-chevron">
            {showSynopsis ? <FiChevronUp /> : <FiChevronDown />}
          </button>
        </span>
      )}
      <AnimeSynopsis showSynopsis={showSynopsis} isMobile={isMobile}>
        <span className="synopsis-span">
          <p className="synopsis-text">{formattedSynopsis}</p>
        </span>
      </AnimeSynopsis>
    </section>
  );
};

export default Synopsis;
