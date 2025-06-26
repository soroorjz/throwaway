import React, { useState } from "react";
import "./SelectionResultStatusModal.scss";
import { motion } from "framer-motion";

const SelectionResultStatusModal = ({ isOpen, onClose, onSubmit, result }) => {
  const [status, setStatus] = useState(result.status === "تأیید شده");

  const handleSubmit = () => {
    onSubmit(result.id, status ? "تأیید شده" : "عدم تأیید");
  };

  if (!isOpen) return null;

  return (
    <motion.div
      className="selection-result-status-modal__overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="selection-result-status-modal__content"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h3>تغییر وضعیت نتیجه گزینش</h3>
        <div className="selection-result-status-modal__form">
          <div className="selection-result-status-modal__form-group">
            <label className="selection-result-status-modal__label">
              وضعیت:
            </label>
            <div className="selection-result-status-modal__switch-container">
              <span
                className={`selection-result-status-modal__switch-label ${
                  status
                    ? ""
                    : "selection-result-status-modal__switch-label--reject"
                }`}
              >
                عدم تأیید
              </span>
              <label className="selection-result-status-modal__switch">
                <input
                  type="checkbox"
                  checked={status}
                  onChange={() => setStatus(!status)}
                />
                <span className="selection-result-status-modal__slider" />
              </label>
              <span
                className={`selection-result-status-modal__switch-label ${
                  status
                    ? "selection-result-status-modal__switch-label--approve"
                    : ""
                }`}
              >
                تأیید شده
              </span>
            </div>
          </div>
          <div className="selection-result-status-modal__buttons">
            <button
              className="selection-result-status-modal__submit-btn"
              onClick={handleSubmit}
            >
              تأیید
            </button>
            <button
              className="selection-result-status-modal__cancel-btn"
              onClick={onClose}
            >
              لغو
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SelectionResultStatusModal;
