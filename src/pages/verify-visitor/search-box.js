import React from "react";
import { TextBox } from "devextreme-react";

const SearchBox = ({ searchText, setSearchText }) => {
  const handleSearchChange = (e) => {
    setSearchText(e.value ? e.value.toLowerCase() : "");
  };

  return (
    <div className="search-section">
      <div className="box" title={"Search"}>
        <i className="ri-search-line"></i>
        <TextBox
          stylingMode="outlined"
          placeholder="Search Visitors by Name"
          valueChangeEvent="keyup"
          onValueChanged={handleSearchChange}
          width={300}
          showClearButton={true}
        />
      </div>
    </div>
  );
};

export default SearchBox;
