import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function SearchResults() {
  // following the pluralsight tutorial, allResults is our --hits-- array
  const [allResults, setAllResults] = useState([]);
  const [pagination, setPagination] = useState([]);
  const [pageCount, setPageCount] = useState(1);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const q = useParams();
  const query = q.searchQuery;
  const API_URL = `https://api.jikan.moe/v4/anime?q=${query}`;
  // const API_URL = `https://api.jikan.moe/v4/anime?q=${query}&page=${currentPage}`;
  //   if above doesn't work, try:
  //   const API_URL = `https://api.jikan.moe/v4/search/anime?q=${query}&sfw`;

  useEffect(() => {
    fetch(API_URL).then((response) =>
      response
        .json()
        .then((responseData) => {
          setAllResults(responseData.data);
          setPagination(responseData.pagination);
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

  console.log(pagination);

  const myResults = allResults.map((result) => {
    return (
      <li style={{ color: "white" }} key={result.mal_id}>
        {result.title}
      </li>
    );
  });

  return (
    <div>
      <h3 style={{ color: "white" }}>Search results for: {query}</h3>
      <ul>{myResults}</ul>
    </div>
  );
}

export default SearchResults;
