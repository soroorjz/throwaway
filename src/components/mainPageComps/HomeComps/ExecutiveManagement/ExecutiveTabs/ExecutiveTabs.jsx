import React, { useState, useMemo } from "react";
import "./ExecutiveTabs.scss";

const ExecutiveTabs = ({ executives, onTabChange }) => {
  const organizerNames = useMemo(() => {
    const uniqueOrganizerNames = [
      ...new Set(executives.map((executive) => executive.organizerName)),
    ];
    return ["همه", ...uniqueOrganizerNames]; 
  }, [executives]);

  const [selectedTab, setSelectedTab] = useState("همه"); 

  const handleTabChange = (tab) => {
    setSelectedTab(tab);
    onTabChange(tab);
  };

  return (
    <div className="executive-tabs">
      {organizerNames.map((organizer) => (
        <button
          key={organizer}
          className={`executive-tabs__tab ${
            selectedTab === organizer ? "executive-tabs__tab--active" : ""
          }`}
          onClick={() => handleTabChange(organizer)}
        >
          {organizer}
        </button>
      ))}
    </div>
  );
};

export default ExecutiveTabs;
