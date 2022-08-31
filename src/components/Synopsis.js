import React from "react";

const Synopsis = ({ animeSynopsis }) => {
  const formattedSynopsis = animeSynopsis.replaceAll(". ", ".\n\n");

  return (
    <section className="synopsis-section">
      <span className="centered-span">
        <h1>Synopsis</h1>
      </span>
      <div className="synopsis-div">
        <span className="synopsis-span">
          <p className="synopsis-text">{formattedSynopsis}</p>
        </span>
      </div>
    </section>
  );
};

export default Synopsis;
