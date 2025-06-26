import React, { useEffect, useRef } from "react";

const StimulsoftDesigner = ({ onSave, onClose }) => {
  const designerRef = useRef(null);

  useEffect(() => {
    if (!window.Stimulsoft) {
      console.error(
        "Stimulsoft is not loaded. Make sure stimulsoft.reports.js and stimulsoft.designer.js are included in public/index.html"
      );
      return;
    }

    // Create a new report instance
    const report = new window.Stimulsoft.Report.StiReport();
    
    // Create designer options
    const options = new window.Stimulsoft.Designer.StiDesignerOptions();
    
    // Create the designer instance
    const designer = new window.Stimulsoft.Designer.StiDesigner(
      options,
      "stimulsoftDesigner",
      false
    );

    // Optional: Set report to edit (or create new)
    // report.loadFile("path/to/existing/report.mrt", () => {
    //   designer.report = report;
    // });
    
    // Or create a new blank report
    designer.report = report;

    // Render the designer
    designer.renderHtml("stimulsoftDesigner");
    designerRef.current = designer;

    // Add event handlers if needed
    designer.onSaveReport = (args) => {
      if (onSave) {
        onSave(args.report);
      }
    };

    // Cleanup on unmount
    return () => {
      const container = document.getElementById("stimulsoftDesigner");
      if (container) {
        container.innerHTML = ""; // Clear designer content
      }
      if (designerRef.current) {
        designerRef.current.destroy();
      }
    };
  }, []);

  return (
    <div style={{ position: "relative", height: "100vh", width: "100%" }}>
      <div
        id="stimulsoftDesigner"
        style={{ height: "90vh", width: "100%" }}
      />
      <button 
        onClick={onClose}
        style={{
          position: "absolute",
          bottom: "10px",
          right: "10px",
          padding: "8px 16px",
          backgroundColor: "#f44336",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer"
        }}
      >
        Close Designer
      </button>
    </div>
  );
};

export default StimulsoftDesigner;