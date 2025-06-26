import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import "react-multi-date-picker/styles/layouts/mobile.css";
import { FaUpload } from "react-icons/fa";
import "./AddSelectionResultModal.scss";

const AddSelectionResultModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  organizationOptions = [],
  user,
}) => {
  const [formData, setFormData] = useState({
    examName: "",
    job: "",
    organization:
      user?.role === "وزارت نیرو"
        ? user?.organization || "وزارت آموزش و پرورش"
        : "",
    date: "",
    candidateFile: null,
    status: "در انتظار ثبت نتایج",
  });

  const [examOptions, setExamOptions] = useState([]);

  // دریافت exams از localStorage و تنظیم examOptions
  useEffect(() => {
    const storedExams = JSON.parse(localStorage.getItem("exams")) || [];
    // فرض می‌کنیم هر exam یک شیء با کلید title است
    const formattedExams = storedExams.map((exam) => ({
      value: exam.title || exam.id.toString(), // استفاده از title یا id به‌عنوان value
      label: exam.title || `آزمون ${exam.id}`, // استفاده از title یا یک نام پیش‌فرض
    }));
    setExamOptions(formattedExams);
  }, []);

  // تنظیم مقدار اولیه فرم در حالت ویرایش
  useEffect(() => {
    if (initialData) {
      setFormData({
        examName: initialData.examName || "",
        job: initialData.job || "",
        organization:
          user?.role === "وزارت نیرو"
            ? user?.organization || "وزارت آموزش و پرورش"
            : initialData.organization || "",
        date: initialData.date || "",
        candidateFile: initialData.candidateFile || null,
        status: initialData.status || "در انتظار تأیید نتایج",
      });
    }
  }, [initialData, user]);

  // تغییر مقدار آزمون و تنظیم شغل به "حسابدار دولتی"
  const handleExamChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      examName: value,
      job: "حسابدار دولتی",
    }));
  };

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleDateChange = (date) => {
    handleChange("date", date ? date.format("YYYY/MM/DD") : "");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const submittedData = {
      ...formData,
      candidateFile: formData.candidateFile
        ? typeof formData.candidateFile === "string"
          ? formData.candidateFile
          : formData.candidateFile.name
        : "",
    };
    onSubmit(submittedData);
    resetForm();
    onClose();
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setFormData({
      examName: "",
      job: "",
      organization:
        user?.role === "وزارت نیرو"
          ? user?.organization || "وزارت آموزش و پرورش"
          : "",
      date: "",
      candidateFile: null,
      status: "در انتظار ثبت نتایج",
    });
    document.querySelectorAll('input[type="file"]').forEach((input) => {
      input.value = "";
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="add-selection-result-modal__overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="add-selection-result-modal__content"
            initial={{ scale: 0.7, y: "-50%" }}
            animate={{ scale: 1, y: "0%" }}
            exit={{ scale: 0.7, y: "-50%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <h3 className="add-selection-result-modal__title">
              {initialData ? "ویرایش نتیجه گزینش" : "افزودن نتیجه گزینش"}
            </h3>
            <form
              onSubmit={handleSubmit}
              className="add-selection-result-modal__form"
            >
              <div className="add-selection-result-modal__form-group">
                <label className="add-selection-result-modal__label">
                  اسم آزمون
                </label>
                {initialData ? (
                  <input
                    type="text"
                    value={formData.examName}
                    disabled
                    className="add-selection-result-modal__input disabled"
                  />
                ) : (
                  <select
                    value={formData.examName}
                    onChange={(e) => handleExamChange(e.target.value)}
                    className="add-selection-result-modal__select"
                    required
                  >
                    <option value="" disabled>
                      انتخاب آزمون
                    </option>
                    {examOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                )}
              </div>
              <div className="add-selection-result-modal__form-group">
                <label className="add-selection-result-modal__label">شغل</label>
                <input
                  type="text"
                  value={formData.job}
                  onChange={(e) => handleChange("job", e.target.value)}
                  className="add-selection-result-modal__input"
                  required
                />
              </div>
              {user?.role !== "وزارت نیرو" && (
                <div className="add-selection-result-modal__form-group">
                  <label className="add-selection-result-modal__label">
                    دستگاه
                  </label>
                  <select
                    value={formData.organization}
                    onChange={(e) =>
                      handleChange("organization", e.target.value)
                    }
                    className="add-selection-result-modal__select"
                    required
                  >
                    <option value="" disabled>
                      انتخاب دستگاه
                    </option>
                    {organizationOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <div className="add-selection-result-modal__form-group">
                <label className="add-selection-result-modal__label">
                  تاریخ برگزاری
                </label>
                <DatePicker
                  value={formData.date}
                  onChange={handleDateChange}
                  calendar={persian}
                  locale={persian_fa}
                  format="YYYY/MM/DD"
                  placeholder="انتخاب تاریخ (مثال: 1403/12/15)"
                  inputClassName="add-selection-result-modal__date-picker"
                  calendarPosition="bottom-right"
                  required
                />
              </div>
              <div className="add-selection-result-modal__form-group">
                <label className="add-selection-result-modal__label">
                  نتایج گزینش
                </label>
                <div className="add-selection-result-modal__file-upload-wrapper">
                  <label className="add-selection-result-modal__file-upload-label">
                    <FaUpload className="add-selection-result-modal__file-upload-icon" />
                    <span>
                      {formData.candidateFile
                        ? typeof formData.candidateFile === "string"
                          ? formData.candidateFile
                          : formData.candidateFile.name
                        : "انتخاب فایل"}
                    </span>
                    <input
                      type="file"
                      onChange={(e) =>
                        handleChange("candidateFile", e.target.files[0])
                      }
                      className="add-selection-result-modal__file-upload-input"
                      accept=".pdf,.doc,.docx"
                    />
                  </label>
                </div>
              </div>
              <div className="add-selection-result-modal__buttons">
                <button
                  type="submit"
                  className="add-selection-result-modal__submit-btn"
                >
                  {initialData ? "ذخیره تغییرات" : "افزودن"}
                </button>
                <button
                  type="button"
                  className="add-selection-result-modal__cancel-btn"
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

export default AddSelectionResultModal;
