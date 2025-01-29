import React from "react";

const SortButtons = ({ handleSort }) => {
  return (
    <div className="sort-buttons">
      <button onClick={() => handleSort("id")}>Sort by ID</button>
      <button onClick={() => handleSort("name")}>Sort by Name</button>
      <button onClick={() => handleSort("email")}>Sort by Email</button>
      <button onClick={() => handleSort("city")}>Sort by City</button>
    </div>
  );
};

export default SortButtons;