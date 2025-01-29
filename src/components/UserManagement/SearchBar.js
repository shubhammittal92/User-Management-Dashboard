import React from "react";

const SearchBar = ({ searchQuery, handleSearch }) => {
  return (
    <input
      type="text"
      placeholder="Search by Name or Email"
      value={searchQuery}
      onChange={handleSearch}
      className="search-input"
    />
  );
};

export default SearchBar;