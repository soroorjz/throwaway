import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DatePicker from "react-multi-date-picker";
import TimePicker from "react-multi-date-picker/plugins/time_picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import "react-multi-date-picker/styles/layouts/mobile.css";
import { FaUpload } from "react-icons/fa";
import "./AddEvaluationModal.scss";

const AddEvaluationModal = ({
  isOpen,
  onClose,
  onSubmit,
  isEditMode = false,
  evaluation,
}) => {
  const [newEvaluation, setNewEvaluation] = useState({
    examTitle: "",
    job: "",
    organization: "",
    examDate: "",
    examTime: "",
    group: "",
    location: "",
    examinees: null,
    evaluators: null,
    status: "در انتظار اجرا", // اصلاح stauss به status
  });
  const [exams, setExams] = useState([]);

  // خواندن exams از localStorage
  useEffect(() => {
    if (isOpen) {
      const storedExams = JSON.parse(localStorage.getItem("exams")) || [];
      setExams(storedExams);
    }
  }, [isOpen]);

  // پر کردن فرم در حالت ویرایش
  useEffect(() => {
    if (isEditMode && evaluation) {
      // پردازش examTime برای اطمینان از فرمت HH:mm
      let formattedExamTime = evaluation.examTime || "";
      if (formattedExamTime && !/^\d{2}:\d{2}$/.test(formattedExamTime)) {
        const timeParts = formattedExamTime.match(/(\d{1,2}):(\d{2})/);
        if (timeParts) {
          formattedExamTime = `${timeParts[1].padStart(2, "0")}:${
            timeParts[2]
          }`;
        } else {
          formattedExamTime = "";
        }
      }

      setNewEvaluation({
        examTitle: evaluation.examTitle || "",
        job: evaluation.job || "",
        organization: evaluation.organization || "",
        examDate: evaluation.examDate || "",
        examTime: formattedExamTime,
        group: evaluation.group || "",
        location: evaluation.location || "",
        examinees: evaluation.examinees ? { name: evaluation.examinees } : null,
        evaluators: evaluation.evaluators
          ? { name: evaluation.evaluators }
          : null,
        status: evaluation.status || "در انتظار اجرا", // اصلاح stauss به status
      });
    } else {
      // ریست فرم در حالت افزودن
      resetForm();
    }
  }, [isEditMode, evaluation]);

  const handleChange = (key, value) => {
    setNewEvaluation((prev) => {
      const updated = { ...prev, [key]: value };
      // تنظیم job به "حسابدار دولتی" هنگام تغییر examTitle
      if (key === "examTitle" && value && !isEditMode) {
        updated.job = "حسابدار دولتی";
      }
      return updated;
    });
  };

  const handleDateChange = (date) => {
    if (date) {
      handleChange("examDate", date.format("YYYY/MM/DD"));
    } else {
      handleChange("examDate", "");
    }
  };

  const handleTimeChange = (time) => {
    if (time) {
      handleChange("examTime", time.format("HH:mm"));
    } else {
      handleChange("examTime", "");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formattedEvaluation = {
      ...newEvaluation,
      examDate: newEvaluation.examDate || "",
      examTime: newEvaluation.examTime || "",
      id: isEditMode ? evaluation.id : undefined, // برای ویرایش، id را حفظ می‌کنیم
    };
    onSubmit(formattedEvaluation);
    resetForm();
    onClose();
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setNewEvaluation({
      examTitle: "",
      job: "",
      organization: "",
      examDate: "",
      examTime: "",
      group: "",
      location: "",
      examinees: null,
      evaluators: null,
      status: "در انتظار اجرا", // اصلاح stauss به status
    });
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
  ];

  const groupOptions = [
    { value: "", label: "انتخاب کنید" },
    { value: "گروه الف", label: "گروه الف" },
    { value: "گروه ب", label: "گروه ب" },
    { value: "گروه ج", label: "گروه ج" },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="add-evaluation-modal__overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="add-evaluation-modal__content"
            initial={{ scale: 0.7, y: "-50%" }}
            animate={{ scale: 1, y: "0%" }}
            exit={{ scale: 0.7, y: "-50%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <h3 className="add-evaluation-modal__title">
              {isEditMode ? "ویرایش ارزیابی" : "افزودن ارزیابی جدید"}
            </h3>
            <form
              onSubmit={handleSubmit}
              className="add-evaluation-modal__form"
            >
              <div className="add-evaluation-modal__form-group">
                <label className="add-evaluation-modal__label">
                  عنوان آزمون
                </label>
                {isEditMode ? (
                  <span className="add-evaluation-modal__text">
                    {newEvaluation.examTitle}
                  </span>
                ) : (
                  <select
                    value={newEvaluation.examTitle}
                    onChange={(e) => handleChange("examTitle", e.target.value)}
                    className="add-evaluation-modal__select"
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
              <div className="add-evaluation-modal__form-group">
                <label className="add-evaluation-modal__label">شغل</label>
                <input
                  type="text"
                  value={newEvaluation.job}
                  onChange={(e) => handleChange("job", e.target.value)}
                  className="add-evaluation-modal__input"
                  required
                />
              </div>
              <div className="add-evaluation-modal__form-group">
                <label className="add-evaluation-modal__label">دستگاه</label>
                <select
                  value={newEvaluation.organization}
                  onChange={(e) => handleChange("organization", e.target.value)}
                  className="add-evaluation-modal__select"
                  required
                >
                  {organizationOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="add-evaluation-modal__form-group">
                <label className="add-evaluation-modal__label">
                  تاریخ برگزاری
                </label>
                <DatePicker
                  value={newEvaluation.examDate}
                  onChange={handleDateChange}
                  calendar={persian}
                  locale={persian_fa}
                  className="add-evaluation-modal__datePicker"
                  format="YYYY/MM/DD"
                  placeholder="انتخاب تاریخ (مثال: 1403/12/15)"
                  calendarPosition="bottom-right"
                  required
                />
              </div>
              <div className="add-evaluation-modal__form-group">
                <label className="add-evaluation-modal__label">
                  ساعت برگزاری
                </label>
                <DatePicker
                  disableDayPicker
                  plugins={[<TimePicker position="bottom" hideSeconds />]}
                  format="HH:mm"
                  value={newEvaluation.examTime || ""}
                  onChange={handleTimeChange}
                  calendar={persian}
                  locale={persian_fa}
                  inputClassName="add-evaluation-modal__time-picker"
                  calendarPosition="bottom-right"
                  required
                />
              </div>
              <div className="add-evaluation-modal__form-group">
                <label className="add-evaluation-modal__label">گروه</label>
                <select
                  value={newEvaluation.group}
                  onChange={(e) => handleChange("group", e.target.value)}
                  className="add-evaluation-modal__select"
                  required
                >
                  {groupOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="add-evaluation-modal__form-group">
                <label className="add-evaluation-modal__label">محل</label>
                <input
                  type="text"
                  value={newEvaluation.location}
                  onChange={(e) => handleChange("location", e.target.value)}
                  className="add-evaluation-modal__input"
                  required
                />
              </div>
              <div className="add-evaluation-modal__form-group">
                <label className="add-evaluation-modal__label">
                  لیست ارزیابی‌شوندگان
                </label>
                <div className="add-evaluation-modal__file-upload-wrapper">
                  <label className="add-evaluation-modal__file-upload-label">
                    <FaUpload className="add-evaluation-modal__file-upload-icon" />
                    <span>
                      {newEvaluation.examinees
                        ? newEvaluation.examinees.name
                        : "انتخاب فایل"}
                    </span>
                    <input
                      type="file"
                      onChange={(e) =>
                        handleChange("examinees", e.target.files[0])
                      }
                      className="add-evaluation-modal__file-upload-input"
                      accept=".pdf,.doc,.docx"
                    />
                  </label>
                </div>
              </div>
              <div className="add-evaluation-modal__form-group">
                <label className="add-evaluation-modal__label">
                  لیست ارزیابان
                </label>
                <div className="add-evaluation-modal__file-upload-wrapper">
                  <label className="add-evaluation-modal__file-upload-label">
                    <FaUpload className="add-evaluation-modal__file-upload-icon" />
                    <span>
                      {newEvaluation.evaluators
                        ? newEvaluation.evaluators.name
                        : "انتخاب فایل"}
                    </span>
                    <input
                      type="file"
                      onChange={(e) =>
                        handleChange("evaluators", e.target.files[0])
                      }
                      className="add-evaluation-modal__file-upload-input"
                      accept=".pdf,.doc,.docx"
                    />
                  </label>
                </div>
              </div>
              <div className="add-evaluation-modal__buttons">
                <button
                  type="submit"
                  className="add-evaluation-modal__submit-btn"
                >
                  {isEditMode ? "ذخیره تغییرات" : "افزودن"}
                </button>
                <button
                  type="button"
                  className="add-evaluation-modal__cancel-btn"
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

export default AddEvaluationModal;
