import React, { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ReactPaginate from "react-paginate";
import { ResultSpan, ResultThumbnail } from "../components/primedComps";
import { MoonLoader } from "react-spinners";
import { CgSmileSad } from "react-icons/cg";

function SearchResults({ isMobile }) {
  const [allResults, setAllResults] = useState([]);
  const [pagination, setPagination] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const q = useParams();
  const query = q.searchQuery;
  // Dealing with results that share a word in the title:
  // Using a regex, ask for strict matches, like items that have 'dragon ball' in the title.
  // that way, we won't be getting back 'Kobayashi-san Chi no Maid Dragon' as the first result when we're looking for Dragon Ball.
  const API_URL = `https://api.jikan.moe/v4/anime?q=${query}&order_by=scored_by&sort=desc`;
  const PER_PAGE = 10;
  const offset = PER_PAGE * currentPage;
  // pagination implemented with help from Urvashi's article on Medium(https://ihsavru.medium.com/react-paginate-implementing-pagination-in-react-f199625a5c8e)
  const resultsContainer = useRef(null);
  const currentPageData = allResults
    .slice(offset, offset + PER_PAGE)
    .map((result) => {
      return (
        <li
          style={{ color: "white" }}
          key={result.mal_id}
          className="result-list-item"
        >
          <Link to={`/anime/${result.mal_id}`} key={result.mal_id}>
            <ResultSpan isMobile={isMobile}>
              <ResultThumbnail
                src={result.images.jpg.image_url}
                alt={result.title}
                isMobile={isMobile}
              />

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

  useEffect(() => {
    fetch(API_URL).then((response) =>
      response
        .json()
        .then((responseData) => {
          // console.log(responseData.data);
          setAllResults(responseData.data);
          setPagination(responseData.pagination);
          setLoading(false);
        })
        .catch((err) => setError(err))
    );
  }, [API_URL]);

  if (loading)
    return (
      <div className="processing-query-container">
        <MoonLoader size={100} color={"white"} />
      </div>
    );
  if (error) return <h2>error</h2>;

  console.log(pagination);

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
        <CgSmileSad size={180} color="silver" style={{ width: "100%" }} />

        <span>Please note, our anime titles are in romaji</span>
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
          previousLinkClassName={"pagination__link"}
          nextLinkClassName={"pagination__link--disabled"}
          activeClassName={"pagination__link--active"}
        />
      )}
      {pagination.items.total > 0 &&
        !pagination.has_next_page &&
        fewResultsCounter}
    </div>
  );
}

export default SearchResults;
