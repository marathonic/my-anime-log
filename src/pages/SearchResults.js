import React, { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ReactPaginate from "react-paginate";
import {
  CardThumbnail,
  ResultSpan,
  ResultThumbnail,
} from "../components/primedComps";
import { MoonLoader } from "react-spinners";
import { IoSadOutline } from "react-icons/io5";

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
  const resultsContainer = useRef(null);
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
    resultsContainer.current?.scrollIntoView({ behavior: "smooth" });
  };

  const pageCount = Math.ceil(allResults.length / PER_PAGE);

  // const handlePageChange = (selectedObject) => {
  //   setCurrentPage(selectedObject.selected);
  // };

  useEffect(() => {
    console.log("=====fetching data======");
    fetch(API_URL).then((response) =>
      response
        .json()
        .then((responseData) => {
          console.log(responseData.data);
          setAllResults(responseData.data);
          setPagination(responseData.pagination);
          setLoading(false);
        })
        .catch((err) => setError(err))
    );
  }, [API_URL]);

  // useEffect(() => {
  // console.log("pagination useEffect =>", pagination);
  // console.log("current page", "==>", currentPage);
  // }, [currentPage]);

  if (loading)
    return (
      <div className="processing-query-container">
        <MoonLoader size={100} color={"white"} />
      </div>
    );
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

  let noResultsMessage = (
    <div className="no-results-container">
      <h1>Whoops!</h1>
      <span>
        <h3>We couldn't find any results for: </h3>
        {query.includes("&sfw") ? (
          <p style={{ color: "orange" }}>{query.slice(0, -4)}</p>
        ) : (
          <p style={{ color: "orange" }}>query</p>
        )}
      </span>
      <span>
        {/* <IoSadOutline size={200} /> */}
        <img
          src="https://media.tenor.com/jaVORWcTiyEAAAAC/cute-fingers.gif"
          alt="cat twiddling fingers gif"
          style={{ width: "100%" }}
        ></img>

        <span>Please note, we use Romaji for the titles</span>
        {/* <p>instead of </p> */}
        {/* <p style={{ textDecoration: "line-through", color: "crimson" }}>
          'Attack on Titan'
        </p>
        <p style={{ color: "lightgreen" }}>'Shingeki no Kyojin'</p> */}
      </span>
    </div>
  );

  let fewResultsCounter = (
    <div className="few-results-container">
      <p>{pagination.items.total} results</p>
    </div>
  );

  return (
    <div ref={resultsContainer}>
      <h3 style={{ color: "white" }}>
        {pagination.items.total > 0
          ? `Search results for: ${
              query.includes("&sfw") ? query.slice(0, -4) : query
            }`
          : noResultsMessage}{" "}
      </h3>
      <ul>{currentPageData}</ul>
      {pagination.has_next_page && (
        <ReactPaginate
          previousLabel={currentPage > 0 ? "Prev" : ""}
          nextLabel={currentPage < pagination.last_visible_page ? "Next" : ""}
          pageCount={pageCount}
          onPageChange={handlePageClick}
          containerClassName={"pagination"}
          previousLinkClassName={"pagionation__link"}
          nextLinkClassName={"pagination__link--disabled"}
          activeClassName={"pagination__link--active"}
        />
      )}
      {pagination.items.total > 0 &&
        !pagination.has_next_page &&
        fewResultsCounter}
      {/* <ul>{myResults}</ul> */}
    </div>
  );
}

export default SearchResults;
