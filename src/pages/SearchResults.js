import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function SearchResults() {
  const [allResults, setAllResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const q = useParams();
  const query = q.searchQuery;
  const API_URL = `https://api.jikan.moe/v4/anime?q=${query}&page=1`;
  //   if above doesn't work, try:
  //   const API_URL = `https://api.jikan.moe/v4/search/anime?q=${query}&sfw`;

  useEffect(() => {
    fetch(API_URL).then((response) =>
      response
        .json()
        .then((responseData) => {
          setAllResults(responseData.data);
          setLoading(false);
        })
        .catch((err) => setError(err))
    );
  }, [API_URL]);

  if (loading) return <h1>Loading...</h1>;
  if (error) return <h2>error</h2>;

  //   const getResults = () => {
  //  pasted into useEffect
  //   };

  console.log(query);

  const myResults = allResults.map((result) => {
    return <li style={{ color: "white" }}>{result.title}</li>;
  });

  return (
    <div>
      <h3 style={{ color: "white" }}>Search results for: {query}</h3>
      <ul>{myResults}</ul>
    </div>
  );
}

export default SearchResults;
