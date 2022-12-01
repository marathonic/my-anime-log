import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ReactPaginate from "react-paginate";
import {
  CardThumbnail,
  ResultSpan,
  ResultThumbnail,
} from "../components/primedComps";

function SearchResults({ isMobile }) {
  // following the pluralsight tutorial, allResults is our --hits-- array
  const [allResults, setAllResults] = useState([]);
  const [pagination, setPagination] = useState([]);
  // const [pageCount, setPageCount] = useState(1);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const q = useParams();
  const query = q.searchQuery;
  // how to fix random anime that match 1 word? Let's use a regex, we'll ask for strict matches!
  // so we'll only be returning strict matches, like items that have 'dragon ball' in the title.
  // that way, we won't be getting back 'Kobayashi-san Chi no Maid Dragon', for example, when we're looking for Dragon Ball, and viceversa.
  const API_URL = `https://api.jikan.moe/v4/anime?q=${query}&order_by=scored_by&sort=desc`;
  // const API_URL = `https://api.jikan.moe/v4/anime?q=${query}&page=${currentPage}`;
  //   if above doesn't work, try:
  //   const API_URL = `https://api.jikan.moe/v4/search/anime?q=${query}&sfw`;
  const PER_PAGE = 10;
  const offset = PER_PAGE * currentPage;
  // going with Urvashi's guide, this is where we could make our currentPageData function

  const currentPageData = allResults
    .slice(offset, offset + PER_PAGE)
    .map((result) => {
      return (
        // MAKE THESE INTO <Link /> Components, each to their own URL, just like in Home.js!
        //         <Link to={`/anime/${anime.mal_id}`} key={anime.mal_id}>
        // In this case, <Link to={`anime/${result.mal_id} key={result.mal_id}`}
        <li style={{ color: "white" }} key={result.mal_id}>
          <Link to={`/anime/${result.mal_id}`} key={result.mal_id}>
            <ResultSpan>
              {/* <CardThumbnail
              src={result.images.jpg.image_url}
              alt={result.title}
            /> */}
              <ResultThumbnail
                src={result.images.jpg.image_url}
                alt={result.title}
                isMobile={isMobile}
              />

              {/* <img src={result.images.jpg.image_url} alt={result.title} /> */}
              <p className="result-title-mobile">
                {result.title.length <= 43
                  ? result.title
                  : result.title.slice(0, 43) + "..."}
              </p>
            </ResultSpan>
          </Link>
        </li>
      );
    });

  const handlePageClick = ({ selected: selectedPage }) => {
    setCurrentPage(selectedPage);
  };

  const pageCount = Math.ceil(allResults.length / PER_PAGE);

  // const handlePageChange = (selectedObject) => {
  //   setCurrentPage(selectedObject.selected);
  // };

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

  useEffect(() => {
    console.log("pagination useEffect =>", pagination);
    console.log("current page", "==>", currentPage);
  }, [currentPage]);

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
      <h3 style={{ color: "white" }}>
        {pagination.items.total > 0
          ? `Search results for: ${
              query.includes("&sfw") ? query.slice(0, -4) : query
            }`
          : `Sorry, couldn't find results for: ${
              query.includes("&sfw") ? query.slice(0, -4) : query
            }`}{" "}
      </h3>
      <ul>{currentPageData}</ul>
      {pagination.has_next_page && (
        <ReactPaginate
          previousLabel={"Prev"}
          nextLabel={currentPage < pagination.last_visible_page ? "Next" : ""}
          pageCount={pageCount}
          onPageChange={handlePageClick}
          containerClassName={"pagination"}
          previousLinkClassName={"pagionation__link"}
          nextLinkClassName={"pagination__link--disabled"}
          activeClassName={"pagination__link--active"}
        />
      )}
      {/* <ul>{myResults}</ul> */}
    </div>
  );
}

export default SearchResults;
