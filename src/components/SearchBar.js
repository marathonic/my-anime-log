import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const handleQueryChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log(searchQuery);
    navigate(`/anime/search/${searchQuery}`);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        className="search-bar"
        type="search"
        placeholder="search..."
        value={searchQuery}
        onChange={handleQueryChange}
      />
      <button>OK</button>
    </form>
  );
};

export default SearchBar;
