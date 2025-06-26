import React, { useCallback } from "react";
import "./ExamTabs.scss";

const ExamTabs = ({ years, activeYear, setActiveYear, sectionRefs }) => {
  const handleTabClick = useCallback(
    (year) => {
      console.log(`Tab clicked for year ${year}`);
      setActiveYear(year);
      const section = sectionRefs.current[year];
      if (section) {
        console.log(`Scrolling to section for year ${year}`);
        section.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        console.warn(`No section found for year ${year} when clicking tab`);
      }
    },
    [setActiveYear, sectionRefs]
  );

  return (
    <div className="exam-management__tabs">
      {years.map((year) => (
        <button
          key={year}
          className={`exam-management__tab ${
            activeYear === year ? "exam-management__tab--active" : ""
          }`}
          onClick={() => handleTabClick(year)}
        >
          {year}
        </button>
      ))}
    </div>
  );
};

export default ExamTabs;