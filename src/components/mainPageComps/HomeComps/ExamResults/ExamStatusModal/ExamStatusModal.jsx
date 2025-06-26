import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../../../../AuthContext";
import "./ExamStatusModal.scss";

const ExamStatusModal = ({ isOpen, onClose, onSubmit, result, source }) => {
  const { user } = useAuth();

  const getInitialSwitchState = () => {
    if (source === "ExamResults") {
      return user?.role === "کاربر سازمان اداری و استخدامی" &&
        result?.status === "تأیید شده"
        ? true
        : false;
    } else if (source === "SupplementaryAssessmentResults") {
      if (user?.role === "کاربر سازمان اداری و استخدامی") {
        console.log(
          "Setting switch for کاربر سازمان اداری و استخدامی, status:",
          result?.status
        );
        return result?.status === "تأیید سازمان اداری و استخدامی"
          ? true
          : false;
      } else if (user?.role === "وزارت نیرو") {
        console.log("Setting switch for دستگاه ستادی, status:", result?.status);
        return result?.status === "تأیید نهایی" ? true : false;
      }
      return false;
    } else if (source === "SelectionResults") {
      return user?.role === "کاربر سازمان اداری و استخدامی" &&
        result?.status === "استخدام"
        ? true
        : false;
    }
    console.warn(`Unknown source: ${source}. Defaulting to ExamResults logic.`);
    return user?.role === "کاربر سازمان اداری و استخدامی" &&
      result?.status === "تأیید شده"
      ? true
      : false;
  };

  const [isApproved, setIsApproved] = useState(getInitialSwitchState());

  useEffect(() => {
    console.log(
      "useEffect triggered. Result status:",
      result?.status,
      "User role:",
      user?.role
    );
    setIsApproved(getInitialSwitchState());
  }, [result, user, source]);

  const titleText =
    source === "SupplementaryAssessmentResults"
      ? "تغییر وضعیت نتایج ارزیابی تکمیلی"
      : source === "SelectionResults"
      ? "تغییر وضعیت نتایج گزینش"
      : "تغییر وضعیت نتایج آزمون";
  const labelText =
    source === "SupplementaryAssessmentResults"
      ? "وضعیت نتایج ارزیابی تکمیلی"
      : source === "SelectionResults"
      ? "وضعیت نتایج گزینش"
      : "وضعیت نتایج آزمون";

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!result || !user) {
      console.error("Result or user is undefined");
      onClose();
      return;
    }

    let newStatus = result?.status || "در حال بررسی";
    console.log(
      "handleSubmit called. isApproved:",
      isApproved,
      "Current status:",
      newStatus
    );

    if (source === "ExamResults") {
      if (user?.role === "کاربر سازمان اداری و استخدامی") {
        newStatus = isApproved ? "تأیید شده" : "عدم تأیید";
      }
    } else if (source === "SupplementaryAssessmentResults") {
      if (user?.role === "کاربر سازمان اداری و استخدامی") {
        if (result?.status === "ارسال به سازمان اداری و استخدامی") {
          newStatus = isApproved ? "تأیید سازمان اداری و استخدامی" : "رد شده";
        } else if (result?.status === "تأیید سازمان اداری و استخدامی") {
          newStatus = isApproved
            ? "تأیید سازمان اداری و استخدامی"
            : "ارسال به سازمان اداری و استخدامی";
        }
      } else if (user?.role === "وزارت نیرو") {
        if (result?.status === "تأیید سازمان اداری و استخدامی") {
          newStatus = isApproved ? "تأیید نهایی" : "رد شده";
        } else if (result?.status === "تأیید نهایی") {
          newStatus = isApproved
            ? "تأیید نهایی"
            : "تأیید سازمان اداری و استخدامی";
        }
      }
    } else if (source === "SelectionResults") {
      if (user?.role === "کاربر سازمان اداری و استخدامی") {
        newStatus = isApproved ? "استخدام" : "ثبت شده";
      }
    } else {
      console.warn(
        `Unknown source: ${source}. Defaulting to ExamResults logic.`
      );
      if (user?.role === "کاربر سازمان اداری و استخدامی") {
        newStatus = isApproved ? "تأیید شده" : "عدم تأیید";
      }
    }

    console.log(
      `Submitting status change for result ID ${result?.id} to: ${newStatus}`
    );
    onSubmit(result?.id, newStatus);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="exam-status-modal__overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="exam-status-modal__content"
            initial={{ scale: 0.7, y: "-50%" }}
            animate={{ scale: 1, y: "0%" }}
            exit={{ scale: 0.7, y: "-50%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <h3 className="exam-status-modal__title">{titleText}</h3>
            <form onSubmit={handleSubmit} className="exam-status-modal__form">
              <div className="exam-status-modal__form-group">
                <label className="exam-status-modal__label">{labelText}</label>
                <div className="exam-status-modal__switch-container">
                  <span className="exam-status-modal__switch-label exam-status-modal__switch-label--approve">
                    تأیید
                  </span>
                  <label className="exam-status-modal__switch">
                    <input
                      type="checkbox"
                      checked={isApproved}
                      onChange={() => setIsApproved(!isApproved)}
                    />
                    <span className="exam-status-modal__slider"></span>
                  </label>
                  <span className="exam-status-modal__switch-label exam-status-modal__switch-label--reject">
                    عدم تأیید
                  </span>
                </div>
              </div>
              <div className="exam-status-modal__buttons">
                <button type="submit" className="exam-status-modal__submit-btn">
                  تأیید
                </button>
                <button
                  type="button"
                  className="exam-status-modal__cancel-btn"
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

export default ExamStatusModal;
