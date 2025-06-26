import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import "react-multi-date-picker/styles/layouts/mobile.css";
import { FaUpload, FaEdit } from "react-icons/fa";
import "./AddSupplementaryResultModal.scss";

const AddSupplementaryResultModal = ({
  isOpen,
  onClose,
  onSubmit,
  isEditMode = false,
  result,
}) => {
  const [newResult, setNewResult] = useState({
    assessmentName: "",
    job: "",
    organization: "",
    date: "",
    resultDate: "",
    resultFile: null,
    status: "تأیید شده",
  });
  const [isOrganizationEditable, setIsOrganizationEditable] = useState(false);
  const [exams, setExams] = useState([]);

  // خواندن exams از localStorage
  useEffect(() => {
    if (isOpen) {
      const storedExams = JSON.parse(localStorage.getItem("exams")) || [];
      setExams(storedExams);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isEditMode && result) {
      setNewResult({
        assessmentName: result.assessmentName || "",
        job: result.job || "",
        organization: result.organization || "",
        date: result.date || "",
        resultDate: result.resultDate || "",
        resultFile: result.resultFile ? { name: result.resultFile } : null,
        status: result.status || "تأیید شده",
      });
      setIsOrganizationEditable(false);
    } else {
      resetForm();
    }
  }, [isEditMode, result]);

  const handleChange = (key, value) => {
    setNewResult((prev) => {
      const updated = { ...prev, [key]: value };
      // تنظیم job به "حسابدار دولتی" هنگام تغییر assessmentName
      if (key === "assessmentName" && value && !isEditMode) {
        updated.job = "حسابدار دولتی";
      }
      return updated;
    });
  };

  const handleDateChange = (key, date) => {
    if (date) {
      handleChange(key, date.format("YYYY/MM/DD"));
    } else {
      handleChange(key, "");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formattedResult = {
      ...newResult,
      date: newResult.date || "",
      resultDate: newResult.resultDate || "",
      id: isEditMode ? result.id : undefined,
    };
    onSubmit(formattedResult);
    resetForm();
    onClose();
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setNewResult({
      assessmentName: "",
      job: "",
      organization: "",
      date: "",
      resultDate: "",
      resultFile: null,
      status: "تأیید شده",
    });
    setIsOrganizationEditable(false);
    document.querySelectorAll('input[type="file"]').forEach((input) => {
      input.value = "";
    });
  };

  const organizationOptions = [
    { value: "", label: "انتخاب کنید" },
    { value: "وزارت آموزش و پرورش", label: "وزارت آموزش و پرورش" },
    { value: "وزارت بهداشت", label: "وزارت بهداشت" },
    { value: "وزارت نیرو", label: "وزارت نیرو" },
    { value: "قوه قضاییه", label: "قوه قضاییه" },
    { value: "وزارت نفت", label: "وزارت نفت" },
    { value: "شهرداری تهران", label: "شهرداری تهران" },
    { value: "بانک مرکزی", label: "بانک مرکزی" },
    { value: "وزارت راه", label: "وزارت راه" },
    { value: "سازمان محیط زیست", label: "سازمان محیط زیست" },
    { value: "وزارت اقتصاد", label: "وزارت اقتصاد" },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="add-supplementary-result-modal__overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="add-supplementary-result-modal__content"
            initial={{ scale: 0.7, y: "-50%" }}
            animate={{ scale: 1, y: "0%" }}
            exit={{ scale: 0.7, y: "-50%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <h3 className="add-supplementary-result-modal__title">
              {isEditMode ? "ویرایش نتیجه ارزیابی" : "افزودن نتیجه ارزیابی"}
            </h3>
            <form
              onSubmit={handleSubmit}
              className="add-supplementary-result-modal__form"
            >
              <div className="add-supplementary-result-modal__form-group">
                <label className="add-supplementary-result-modal__label">
                  عنوان آزمون
                </label>
                {isEditMode ? (
                  <span className="add-supplementary-result-modal__text">
                    {newResult.assessmentName}
                  </span>
                ) : (
                  <select
                    value={newResult.assessmentName}
                    onChange={(e) =>
                      handleChange("assessmentName", e.target.value)
                    }
                    className="add-supplementary-result-modal__select"
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
              <div className="add-supplementary-result-modal__form-group">
                <label className="add-supplementary-result-modal__label">
                  شغل
                </label>
                <input
                  type="text"
                  value={newResult.job}
                  onChange={(e) => handleChange("job", e.target.value)}
                  className="add-supplementary-result-modal__input"
                  required
                />
              </div>
              <div className="add-supplementary-result-modal__form-group">
                <label className="add-supplementary-result-modal__label">
                  دستگاه
                </label>
                {isEditMode && !isOrganizationEditable ? (
                  <div className="add-supplementary-result-modal__organization-wrapper">
                    <span className="add-supplementary-result-modal__text">
                      {newResult.organization}
                    </span>
                    <button
                      type="button"
                      className="add-supplementary-result-modal__edit-btn"
                      onClick={() => setIsOrganizationEditable(true)}
                    >
                      <FaEdit /> ویرایش
                    </button>
                  </div>
                ) : (
                  <select
                    value={newResult.organization}
                    onChange={(e) =>
                      handleChange("organization", e.target.value)
                    }
                    className="add-supplementary-result-modal__select"
                    required
                  >
                    {organizationOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                )}
              </div>
              <div className="add-supplementary-result-modal__form-group">
                <label className="add-supplementary-result-modal__label">
                  تاریخ برگزاری
                </label>
                <DatePicker
                  value={newResult.date}
                  onChange={(date) => handleDateChange("date", date)}
                  calendar={persian}
                  locale={persian_fa}
                  className="add-supplementary-result-modal__datePicker"
                  format="YYYY/MM/DD"
                  placeholder="انتخاب تاریخ (مثال: 1403/12/15)"
                  calendarPosition="bottom-right"
                  required
                />
              </div>
              <div className="add-supplementary-result-modal__form-group">
                <label className="add-supplementary-result-modal__label">
                  تاریخ انتشار نتایج
                </label>
                <DatePicker
                  value={newResult.resultDate}
                  onChange={(date) => handleDateChange("resultDate", date)}
                  calendar={persian}
                  locale={persian_fa}
                  className="add-supplementary-result-modal__datePicker"
                  format="YYYY/MM/DD"
                  placeholder="انتخاب تاریخ (مثال: 1403/12/15)"
                  calendarPosition="bottom-right"
                  required
                />
              </div>
              <div className="add-supplementary-result-modal__form-group">
                <label className="add-supplementary-result-modal__label">
                  فایل نتایج
                </label>
                <div className="add-supplementary-result-modal__file-upload-wrapper">
                  <label className="add-supplementary-result-modal__file-upload-label">
                    <FaUpload className="add-supplementary-result-modal__file-upload-icon" />
                    <span>
                      {newResult.resultFile
                        ? newResult.resultFile.name
                        : "انتخاب فایل"}
                    </span>
                    <input
                      type="file"
                      onChange={(e) =>
                        handleChange("resultFile", e.target.files[0])
                      }
                      className="add-supplementary-result-modal__file-upload-input"
                      accept=".pdf,.doc,.docx"
                    />
                  </label>
                </div>
              </div>
              <div className="add-supplementary-result-modal__buttons">
                <button
                  type="submit"
                  className="add-supplementary-result-modal__submit-btn"
                >
                  {isEditMode ? "ذخیره تغییرات" : "افزودن"}
                </button>
                <button
                  type="button"
                  className="add-supplementary-result-modal__cancel-btn"
                  onClick={handleClose}
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

export default AddSupplementaryResultModal;
