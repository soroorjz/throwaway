import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaUpload } from "react-icons/fa";
import "./SelectionCandidateReportModal.scss";

const SelectionCandidateReportModal = ({
  isOpen,
  onClose,
  onSubmit,
  newReport,
  setNewReport,
  filterConfig,
  examOptions,
  jobOptions,
  isEditMode = false,
}) => {
  const handleFileChange = (e, key, labelKey) => {
    const file = e.target.files[0];
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      setNewReport((prev) => ({
        ...prev,
        [key]: fileUrl,
        [labelKey]: file.name,
      }));
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="selection-candidate-report__modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="selection-candidate-report__modal-content"
            initial={{ scale: 0.7, y: "-50%" }}
            animate={{ scale: 1, y: "0%" }}
            exit={{ scale: 0.7, y: "-50%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <h3>{isEditMode ? "ویرایش گزارش گزینش" : "افزودن گزارش گزینش"}</h3>
            <form onSubmit={onSubmit} className="modal-form">
              <div className="selection-candidate-report__modal-form-group">
                <label>آزمون</label>
                {isEditMode ? (
                  <p className="modal-text">{newReport.examName}</p>
                ) : (
                  <select
                    value={newReport.examName}
                    onChange={(e) =>
                      setNewReport({ ...newReport, examName: e.target.value })
                    }
                    required
                  >
                    {examOptions.map((option, index) => (
                      <option key={index} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                )}
              </div>
              <div className="selection-candidate-report__modal-form-group">
                <label>دستگاه</label>
                <select
                  value={newReport.organization}
                  onChange={(e) =>
                    setNewReport({ ...newReport, organization: e.target.value })
                  }
                  required
                >
                  {filterConfig
                    .find((f) => f.key === "organization")
                    .options.map((option, index) => (
                      <option key={index} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                </select>
              </div>
              <div className="selection-candidate-report__modal-form-group">
                <label>شغل</label>
                <select
                  value={newReport.job}
                  onChange={(e) =>
                    setNewReport({ ...newReport, job: e.target.value })
                  }
                  required
                >
                  {jobOptions.map((option, index) => (
                    <option key={index} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="selection-candidate-report__modal-form-group">
                <label>تعداد داوطلبان</label>
                <input
                  type="number"
                  value={newReport.participantCount}
                  onChange={(e) =>
                    setNewReport({
                      ...newReport,
                      participantCount: e.target.value,
                    })
                  }
                  required
                  min="1"
                />
              </div>
              <div className="selection-candidate-report__modal-form-group">
                <label>لیست نفرات</label>
                <div className="file-upload-wrapper">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) =>
                      handleFileChange(e, "candidateFile", "candidateFileName")
                    }
                    required={!isEditMode}
                  />
                  <span className="file-upload-label">
                    {newReport.candidateFileName}
                  </span>
                  <FaUpload className="file-upload-icon" />
                </div>
              </div>
              <div className="selection-candidate-report__modal-form-actions">
                <button
                  type="submit"
                  className="selection-candidate-report__modal-btn selection-candidate-report__modal-btn--submit"
                >
                  {isEditMode ? "ذخیره تغییرات" : "افزودن"}
                </button>
                <button
                  type="button"
                  className="selection-candidate-report__modal-btn selection-candidate-report__modal-btn--cancel"
                  onClick={onClose}
                >
                  انصراف
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SelectionCandidateReportModal;
