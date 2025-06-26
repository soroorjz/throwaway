import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./StimulsoftViewer.scss";

const StimulsoftViewer = ({ examId, onClose }) => {
  const viewerRef = useRef(null);

  useEffect(() => {
    const loadReport = () => {
      if (!window.Stimulsoft) {
        console.error(
          "Stimulsoft is not loaded. Please add the Stimulsoft scripts to your project."
        );
        return;
      }

      if (window.Stimulsoft.Base && window.Stimulsoft.Base.StiLicense) {
        window.Stimulsoft.Base.StiLicense.key =
          "6vJhGtLLLz2GNviWmUTrhSqnOItdDwjBylQzQcAOiHkgpgFGkUl79uxVs8X+uspx6K+tqdtOB5G1S6PFPRrlVNvMUiSiNYl724EZbrUAWwAYHlGLRbvxMviMExTh2l9xZJ2xc4K1z3ZVudRpQpuDdFq+fe0wKXSKlB6okl0hUd2ikQHfyzsAN8fJltqvGRa5LI8BFkA/f7tffwK6jzW5xYYhHxQpU3hy4fmKo/BSg6yKAoUq3yMZTG6tWeKnWcI6ftCDxEHd30EjMISNn1LCdLN0/4YmedTjM7x+0dMiI2Qif/yI+y8gmdbostOE8S2ZjrpKsgxVv2AAZPdzHEkzYSzx81RHDzZBhKRZc5mwWAmXsWBFRQol9PdSQ8BZYLqvJ4Jzrcrext+t1ZD7HE1RZPLPAqErO9eo+7Zn9Cvu5O73+b9dxhE2sRyAv9Tl1lV2WqMezWRsO55Q3LntawkPq0HvBkd9f8uVuq9zk7VKegetCDLb0wszBAs1mjWzN+ACVHiPVKIk94/QlCkj31dWCg8YTrT5btsKcLibxog7pv1+2e4yocZKWsposmcJbgG0";
      }

      const examPermitDetails =
        JSON.parse(localStorage.getItem("examPermitDetails")) || [];
      const examDetail = examPermitDetails.find(
        (item) => item.examId === examId
      );

      if (!examDetail) {
        console.error("Exam data not found for ID:", examId);
        return;
      }

      const report = new window.Stimulsoft.Report.StiReport();
      report.loadFile("/stimulsoft/Booklet.mrt");
      report.dictionary.databases.clear();

      const dataSet = new window.Stimulsoft.System.Data.DataSet("exampermits");
      dataSet.readJson([examDetail]);

      report.regData("permissions", "permissions", dataSet);

      const options = new window.Stimulsoft.Viewer.StiViewerOptions();
      options.appearance.fullScreenMode = false;
      options.appearance.scrollbarsMode = true;
      options.appearance.zoom = 100;
      options.appearance.autoScale = true;
      options.appearance.showPageControl = true;

      const viewer = new window.Stimulsoft.Viewer.StiViewer(
        options,
        "stimulsoftViewer",
        false
      );
      viewer.report = report;
      viewer.renderHtml("stimulsoftViewer");

      viewerRef.current = viewer;
    };

    loadReport();

    return () => {
      if (viewerRef.current) {
        const container = document.getElementById("stimulsoftViewer");
        if (container) container.innerHTML = "";
        viewerRef.current = null;
      }
    };
  }, [examId]);

  return (
    <AnimatePresence>
      {examId && (
        <motion.div
          className="stimulsoft-viewer-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="stimulsoft-viewer-modal__content"
            initial={{ scale: 0.8, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, y: 50 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <button
              className="stimulsoft-viewer-modal__close-btn"
              onClick={onClose}
            >
              بستن
            </button>
            <div
              id="stimulsoftViewer"
              className="stimulsoft-viewer-modal__viewer"
            ></div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default StimulsoftViewer;
