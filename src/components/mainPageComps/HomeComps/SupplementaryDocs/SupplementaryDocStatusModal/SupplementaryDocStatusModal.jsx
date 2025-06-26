import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../../../../AuthContext";
import "./SupplementaryDocStatusModal.scss";

const SupplementaryDocStatusModal = ({ isOpen, onClose, onSubmit, result }) => {
  const { user } = useAuth();

  const getInitialSwitchState = () => {
    if (user?.role === "کاربر سازمان اداری و استخدامی") {
      return result?.status === "تأیید شده" ? true : false;
    }
    return false;
  };

  const [isApproved, setIsApproved] = useState(getInitialSwitchState());

  useEffect(() => {
    setIsApproved(getInitialSwitchState());
  }, [result, user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    let newStatus = result?.status || "ارزیابی تکمیلی";

    if (user?.role === "کاربر سازمان اداری و استخدامی") {
      newStatus = isApproved ? "تأیید شده" : "عدم تأیید";
    }

    console.log(
      `Submitting status change for document ID ${result?.id} to: ${newStatus}`
    );
    onSubmit(result?.id, newStatus);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="supplementary-doc-status-modal__overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="supplementary-doc-status-modal__content"
            initial={{ scale: 0.7, y: "-50%" }}
            animate={{ scale: 1, y: "0%" }}
            exit={{ scale: 0.7, y: "-50%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <h3 className="supplementary-doc-status-modal__title">
              تغییر وضعیت مستندات ارزیابی تکمیلی
            </h3>
            <form
              onSubmit={handleSubmit}
              className="supplementary-doc-status-modal__form"
            >
              <div className="supplementary-doc-status-modal__form-group">
                <label className="supplementary-doc-status-modal__label">
                  وضعیت مستندات
                </label>
                <div className="supplementary-doc-status-modal__switch-container">
                  <span className="supplementary-doc-status-modal__switch-label supplementary-doc-status-modal__switch-label--reject">
                    تأیید
                  </span>
                  <label className="supplementary-doc-status-modal__switch">
                    <input
                      type="checkbox"
                      checked={isApproved}
                      onChange={() => setIsApproved(!isApproved)}
                    />
                    <span className="supplementary-doc-status-modal__slider"></span>
                  </label>
                  <span className="supplementary-doc-status-modal__switch-label supplementary-doc-status-modal__switch-label--approve">
                    عدم تأیید
                  </span>
                </div>
              </div>
              <div className="supplementary-doc-status-modal__buttons">
                <button
                  type="submit"
                  className="supplementary-doc-status-modal__submit-btn"
                >
                  تأیید
                </button>
                <button
                  type="button"
                  className="supplementary-doc-status-modal__cancel-btn"
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

export default SupplementaryDocStatusModal;
