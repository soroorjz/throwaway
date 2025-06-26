import React, { useState, useEffect, useRef } from "react";
import { FaFilter, FaSortAmountUpAlt } from "react-icons/fa";


const ExamActions = ({
  filters,
  onFilterChange,
  filterConfig,
  sortOptions,
  searchTerm,
  setSearchTerm,
  // setCurrentPage,
}) => {
  return (
    <div className="exam-management__actions">
      <div className="exam-management__controls">
        <div className="exam-management__filter">
          <FaFilter className="filter__icon" />
          <div className="filter-selects">
            {filterConfig.map((filter) => (
              <div key={filter.key} className="filter-select-wrapper">
                <label className="filter-select-label">{filter.label}</label>
                <select
                  value={filters[filter.key]}
                  onChange={(e) => onFilterChange(filter.key, e.target.value)}
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
        </div>
        <div className="exam-management__sort-container">
          <div className="exam-management__sort">
            <FaSortAmountUpAlt className="sort__icon" />
            <div className="sort-options">
              {sortOptions.map((option) => (
                <div
                  key={option.value}
                  className={`sort-item ${
                    filters.sort === option.value ? "active" : ""
                  }`}
                  onClick={() => {
                    onFilterChange("sort", option.value);
                    // setCurrentPage(0);
                  }}
                >
                  {option.label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <input
        type="text"
        placeholder="جستجو در آزمون‌ها..."
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          // setCurrentPage(0);
        }}
        className="exam-management__search-input"
      />
    </div>
  );
};

export default ExamActions;