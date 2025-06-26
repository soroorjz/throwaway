import React from "react";

const Legend = () => (
  <div className="legend">
    <div className="legend-item">
      <span
        className="legend-color"
        style={{ backgroundColor: "#04364a" }}
      ></span>
      <span className="legend-text">ساماندهی ‌نشده</span>
    </div>
    <div className="legend-item">
      <span
        className="legend-color"
        style={{ backgroundColor: "#e55604" }}
      ></span>
      <span className="legend-text">ساماندهی  ناقص</span>
    </div>
    <div className="legend-item">
      <span
        className="legend-color"
        style={{
          backgroundColor: "#578e7e",
        }}
      ></span>
      <span className="legend-text">ساماندهی ‌شده</span>
    </div>
  </div>
);

export default Legend;
