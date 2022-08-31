import React, { useState } from "react";
import { AnimeSynopsis } from "./primedComps";

const Synopsis = ({ animeSynopsis }) => {
  const [showSynopsis, setShowSynopsis] = useState(false);
  const formattedSynopsis = animeSynopsis.replaceAll(". ", ".\n\n");

  const handleSynopsis = () => {
    setShowSynopsis(!showSynopsis);
  };

  return (
    <section className="synopsis-section">
      <span className="centered-span synopsis-bar">
        <button onClick={handleSynopsis}>
          {showSynopsis ? "close" : "read"}
        </button>
        <h1>Synopsis</h1>
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
