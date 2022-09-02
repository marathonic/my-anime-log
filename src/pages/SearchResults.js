import React from "react";
import { useParams } from "react-router-dom";

function SearchResults() {
  const q = useParams();
  const query = q.searchQuery;

  console.log(query);
  return (
    <div>
      <h4 style={{ color: "white" }}>{query}</h4>
    </div>
  );
}

export default SearchResults;
