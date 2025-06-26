import React from "react";
import { FaFilter, FaSortAmountUpAlt } from "react-icons/fa";

const DesignerControls = ({
  filters,
  setFilters,
  searchTerm,
  setSearchTerm,
  setCurrentPage,
  sortOptions,
  provinces,
  statuses,
}) => {
  const filterConfig = [
    {
      label: "استان محل سکونت",
      key: "province",
      options: provinces,
    },
    {
      label: "وضعیت طراح",
      key: "status",
      options: statuses,
    },
  ];

  const handleFilterChange = (key, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [key]: value,
    }));
    setCurrentPage(0);
  };

  return (
    <div className="question-designer-management__controls">
      <div className="question-designer-management__filter-container">
        
        <div className="filter-selects">
          <FaFilter className="question-designer-management__filter-icon" />
          {filterConfig.map((filter) => (
            <div key={filter.key} className="filter-select-wrapper">
              <label className="filter-select-label">{filter.label}</label>
              <select
                value={filters[filter.key]}
                onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                className="filter-select"
              >
                {filter.options.map((option, optIndex) => (
                  <option key={optIndex} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
        <div className="question-designer-management__sort-container">
          <div className="question-designer-management__sort">
            <FaSortAmountUpAlt className="question-designer-management__sort-icon" />
            <div className="sort-options">
              {sortOptions.map((option) => (
                <div
                  key={option.value}
                  className={`sort-item ${
                    filters.sort === option.value ? "active" : ""
                  }`}
                  onClick={() => {
                    setFilters((prev) => ({ ...prev, sort: option.value }));
                    setCurrentPage(0);
                  }}
                >
                  {option.label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="question-designer-management__search">
        <input
          type="text"
          placeholder="جستجو در طراحان سوال..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(0);
          }}
        />
      </div>
    </div>
  );
};

export default DesignerControls;
