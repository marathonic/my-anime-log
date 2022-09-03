import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SearchBar = () => {
  // MAKE SURE TO CHECK THAT THE searchQuery IS NOT EMPTY!
  // We can use .trim() to check if it's just empty space, and also a Regex to handle non-alphanumeric chars
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const handleQueryChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const isAlphanumeric = /^[a-z0-9]+$/i;
    if (!isAlphanumeric.test(searchQuery)) {
      const modQuery = searchQuery.replace(/[\W_]+/g, " ");
      // no empty strings
      if (modQuery.trim().length === 0) return;
      console.log(modQuery);
      // render sfw results only; querying 'ok' includes a nsfw result otherwise lol
      navigate(`/anime/search/${modQuery}&sfw`);
      return;
    }
    navigate(`/anime/search/${searchQuery}&sfw`);
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
