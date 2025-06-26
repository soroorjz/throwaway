import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FaUpload } from "react-icons/fa";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import "react-multi-date-picker/styles/layouts/mobile.css";
import "./CurrentEvaluationsModal.scss";

const CurrentEvaluationsModal = ({
  isModalOpen,
  isAddSuccessModalOpen,
  setIsModalOpen,
  setIsAddSuccessModalOpen,
  handleEvaluationSubmit,
  handleFormChange,
  newEvaluation,
  isEditMode,
  filterConfig,
}) => {
  return (
    <>
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className="current-evaluations-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="current-evaluations-modal__content"
              initial={{ scale: 0.7, y: "-50%" }}
              animate={{ scale: 1, y: "0%" }}
              exit={{ scale: 0.7, y: "-50%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <h3>{isEditMode ? "ویرایش ارزیابی" : "افزودن ارزیابی جدید"}</h3>
              <form
                onSubmit={handleEvaluationSubmit}
                className="current-evaluations-modal__form"
              >
                <div className="current-evaluations-modal__form-group">
                  <label>عنوان آزمون</label>
                  {isEditMode ? (
                    <p className="modal-text">{newEvaluation.examTitle}</p>
                  ) : (
                    <input
                      type="text"
                      value={newEvaluation.examTitle}
                      onChange={(e) =>
                        handleFormChange("examTitle", e.target.value)
                      }
                      required
                    />
                  )}
                </div>
                <div className="current-evaluations-modal__form-group">
                  <label>نام مجری</label>
                  <select
                    value={newEvaluation.organizer}
                    onChange={(e) =>
                      handleFormChange("organizer", e.target.value)
                    }
                    required
                  >
                    <option value="">انتخاب کنید</option>
                    {filterConfig[0].options
                      .filter((opt) => opt.value !== "")
                      .map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                  </select>
                </div>
                <div className="current-evaluations-modal__form-group">
                  <label>تاریخ ثبت</label>
                  <DatePicker
                    value={newEvaluation.registrationDate}
                    onChange={(date) =>
                      handleFormChange("registrationDate", date)
                    }
                    calendar={persian}
                    locale={persian_fa}
                    format="YYYY/MM/DD"
                    inputClass="form-control"
                    placeholder="انتخاب تاریخ"
                    required
                  />
                </div>
                <div className="current-evaluations-modal__form-group">
                  <label>مستندات</label>
                  <div className="file-upload-wrapper">
                    <label className="file-upload-label">
                      <FaUpload className="file-upload-icon" />
                      <span>
                        {newEvaluation.documents
                          ? newEvaluation.documents.name ||
                            newEvaluation.documents
                          : "انتخاب فایل"}
                      </span>
                      <input
                        type="file"
                        onChange={(e) =>
                          handleFormChange("documents", e.target.files[0])
                        }
                        className="file-upload-input"
                        accept=".pdf,.doc,.docx"
                      />
                    </label>
                  </div>
                </div>
                <div className="current-evaluations-modal__form-actions">
                  <button
                    type="submit"
                    className="current-evaluations-modal__btn current-evaluations-modal__btn--submit"
                  >
                    {isEditMode ? "ذخیره تغییرات" : "افزودن"}
                  </button>
                  <button
                    type="button"
                    className="current-evaluations-modal__btn current-evaluations-modal__btn--cancel"
                    onClick={() => setIsModalOpen(false)}
                  >
                    انصراف
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isAddSuccessModalOpen && (
          <>
            <motion.div
              className="current-evaluations-modal__success-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            />
            <motion.div
              className="current-evaluations-modal__success"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
            >
              <p>ارزیابی با موفقیت {isEditMode ? "ویرایش" : "اضافه"} شد!</p>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default CurrentEvaluationsModal;
