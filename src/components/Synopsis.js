import React, { useEffect, useState } from "react";
import { AnimeSynopsis } from "./primedComps";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { useRef } from "react";

const Synopsis = ({
  animeSynopsis,
  isModalOpen,
  setShowSynopsis,
  showSynopsis,
}) => {
  const formattedSynopsis = animeSynopsis.replaceAll(". ", ".\n\n");

  const handleSynopsis = () => {
    setShowSynopsis(!showSynopsis);
  };

  useEffect(() => {
    let synopsisId = document.querySelector("#synopsis-autoscroll");
    synopsisId?.scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "nearest",
    });
  }, [showSynopsis]);

  return (
    <section className={isModalOpen ? "synopsis-hidden" : "synopsis-section"}>
      <span className="centered-span synopsis-bar">
        <h1>Synopsis</h1>
        <button onClick={handleSynopsis} className="synopsis-chevron">
          {showSynopsis ? <FiChevronUp /> : <FiChevronDown />}
        </button>
      </span>
      <AnimeSynopsis showSynopsis={showSynopsis}>
        <span className="synopsis-span">
          <p className="synopsis-text" id="synopsis-autoscroll">
            {formattedSynopsis}
          </p>
        </span>
      </AnimeSynopsis>
    </section>
  );
};

export default Synopsis;
