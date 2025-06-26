import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaUpload } from "react-icons/fa";
import "./CandidateReportModal.scss";

const CandidateReportModal = ({
  isOpen,
  onClose,
  onSubmit,
  newReport,
  setNewReport,
  filterConfig,
  capacityOptions,
  isEditMode = false,
}) => {
  const [exams, setExams] = useState([]);

  useEffect(() => {
    if (isOpen) {
      // خواندن exams از localStorage
      const storedExams = JSON.parse(localStorage.getItem("exams")) || [];
      setExams(storedExams);
    }
  }, [isOpen]);

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
          className="candidate-report__modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="candidate-report__modal-content"
            initial={{ scale: 0.7, y: "-50%" }}
            animate={{ scale: 1, y: "0%" }}
            exit={{ scale: 0.7, y: "-50%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <h3>
              {isEditMode
                ? "ویرایش لیست نفرات ارزیابی تکمیلی"
                : "افزودن لیست نفرات ارزیابی تکمیلی"}
            </h3>
            <form onSubmit={onSubmit} className="modal-form">
              <div className="candidate-report__modal-form-group">
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
                    <option value="" disabled>
                      انتخاب کنید
                    </option>
                    {exams.map((exam, index) => (
                      <option key={index} value={exam.title}>
                        {exam.title}
                      </option>
                    ))}
                  </select>
                )}
              </div>
              <div className="candidate-report__modal-form-group">
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
              <div className="candidate-report__modal-form-group">
                <label>چند برابر ظرفیت</label>
                <select
                  value={newReport.capacityMultiple}
                  onChange={(e) =>
                    setNewReport({
                      ...newReport,
                      capacityMultiple: e.target.value,
                    })
                  }
                  required
                >
                  {capacityOptions.map((option, index) => (
                    <option key={index} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="candidate-report__modal-form-group">
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
              <div className="candidate-report__modal-form-actions">
                <button
                  type="submit"
                  className="candidate-report__modal-btn candidate-report__modal-btn--submit"
                >
                  {isEditMode ? "ذخیره تغییرات" : "افزودن"}
                </button>
                <button
                  type="button"
                  className="candidate-report__modal-btn candidate-report__modal-btn--cancel"
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

export default CandidateReportModal;
