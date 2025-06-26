import React, { useRef, useEffect } from "react";
import "./FilterDropdown.scss";

const FilterDropdown = ({
  isOpen,
  onClose,
  filters,
  onFilterChange,
  filterConfig,
}) => {
  const dropdownRef = useRef(null); 

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="filter-dropdown" ref={dropdownRef}>
      {filterConfig.map((filter, index) => (
        <div key={index} className="filter-item">
          <span>{filter.label}</span>
          <select
            value={filters[filter.key] || ""}
            onChange={(e) => onFilterChange(filter.key, e.target.value)}
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
  );
};

export default FilterDropdown;
