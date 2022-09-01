import React, { useState } from "react";
import { AnimeSynopsis } from "./primedComps";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

const Synopsis = ({ animeSynopsis }) => {
  const [showSynopsis, setShowSynopsis] = useState(false);
  const formattedSynopsis = animeSynopsis.replaceAll(". ", ".\n\n");

  const handleSynopsis = () => {
    setShowSynopsis(!showSynopsis);
  };

  return (
    <section className="synopsis-section">
      <span className="centered-span synopsis-bar">
        <h1>Synopsis</h1>
        <button onClick={handleSynopsis} className="synopsis-chevron">
          {showSynopsis ? <FiChevronUp /> : <FiChevronDown />}
        </button>
      </span>
      <AnimeSynopsis showSynopsis={showSynopsis}>
        <span className="synopsis-span">
          <p className="synopsis-text">{formattedSynopsis}</p>
        </span>
      </AnimeSynopsis>
    </section>
  );
};

export default Synopsis;
