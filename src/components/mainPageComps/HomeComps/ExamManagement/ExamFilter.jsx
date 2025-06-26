import React, { useState, useEffect, useRef } from "react";
import { FaFilter, FaSortAmountUpAlt } from "react-icons/fa";
import FilterDropdown from "../FilterDropdown/FilterDropdown";

const ExamFilter = ({ filters, onFilterChange, filterConfig, sortOptions }) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const filterRef = useRef(null);
  const sortRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setIsFilterOpen(false);
      }
      if (sortRef.current && !sortRef.current.contains(event.target)) {
        setIsSortOpen(false);
      }
    };
    if (isFilterOpen || isSortOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isFilterOpen, isSortOpen]);

  return (
    <div className="exam-filter">
      <div className="exam-filter__controls">
        <div className="exam-filter__filter" ref={filterRef}>
          <FaFilter
            className="filter__icon"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          />
          <FilterDropdown
            isOpen={isFilterOpen}
            onClose={() => setIsFilterOpen(false)}
            filters={filters}
            onFilterChange={onFilterChange}
            filterConfig={filterConfig}
          />
        </div>
        <div className="exam-filter__sort" ref={sortRef}>
          <FaSortAmountUpAlt
            className="sort__icon"
            onClick={() => setIsSortOpen(!isSortOpen)}
          />
          {isSortOpen && (
            <div className="sort-dropdown">
              {sortOptions.map((option, index) => (
                <div
                  key={index}
                  className={`sort-item ${
                    filters.sort === option.value ? "active" : ""
                  }`}
                  onClick={() => {
                    onFilterChange("sort", option.value);
                    setIsSortOpen(false);
                  }}
                >
                  {option.label}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExamFilter;