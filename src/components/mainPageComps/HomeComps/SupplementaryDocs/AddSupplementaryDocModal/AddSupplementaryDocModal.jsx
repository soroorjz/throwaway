import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaUpload } from "react-icons/fa";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import DateObject from "react-date-object";
import "react-multi-date-picker/styles/layouts/mobile.css";
import "./AddSupplementaryDocModal.scss";

const AddSupplementaryDocModal = ({
  isOpen,
  onClose,
  onSubmit,
  organizerOptions,
  organizationOptions,
  jobOptions,
  initialData,
  isEditMode = false,
}) => {
  const [formData, setFormData] = useState({
    examName: "",
    organizer: "",
    organization: "",
    job: "",
    MultipleCapacity: "",
    examDate: null,
    Province: "",
    detailsFile: null,
    documentFile: null,
  });
  const [exams, setExams] = useState([]);

  // خواندن exams از localStorage
  useEffect(() => {
    if (isOpen) {
      const storedExams = JSON.parse(localStorage.getItem("exams")) || [];
      setExams(storedExams);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isEditMode && initialData) {
      console.log("initialData.examDate:", initialData.examDate);

      let examDateValue = null;
      if (initialData.examDate && typeof initialData.examDate === "string") {
        try {
          examDateValue = new DateObject({
            calendar: persian,
            locale: persian_fa,
            date: initialData.examDate,
            format: "YYYY/MM/DD", // فرمت ورودی را مشخص کنید
          });
          console.log("Parsed examDateValue:", examDateValue);
        } catch (error) {
          console.error("Error parsing examDate:", error);
          examDateValue = null;
        }
      } else if (initialData.examDate instanceof DateObject) {
        examDateValue = initialData.examDate;
      }

      setFormData({
        examName: initialData.examName || "",
        organizer: initialData.organizer || "",
        organization: initialData.organization || "",
        job: initialData.job || "",
        MultipleCapacity: initialData.MultipleCapacity?.toString() || "",
        examDate: examDateValue,
        Province: initialData.Province || "",
        detailsFile: null,
        documentFile: null,
      });
    } else {
      // ریست فرم در حالت افزودن
      setFormData({
        examName: "",
        organizer: "",
        organization: "",
        job: "",
        MultipleCapacity: "",
        examDate: null,
        Province: "",
        detailsFile: null,
        documentFile: null,
      });
    }
  }, [initialData, isEditMode]);

  const handleChange = (key, value) => {
    setFormData((prev) => {
      const updated = { ...prev, [key]: value };
      // تنظیم job به "حسابدار دولتی" هنگام تغییر examName
      if (key === "examName" && value && !isEditMode) {
        updated.job = "حسابدار دولتی";
      }
      return updated;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("formData.examDate on submit:", formData.examDate);

    // بررسی اینکه examDate یک DateObject معتبر است
    const formattedExamDate =
      formData.examDate && formData.examDate.format
        ? formData.examDate.format("YYYY/MM/DD")
        : null;

    onSubmit({
      ...formData,
      examDate: formattedExamDate,
    });

    // ریست فرم پس از ارسال
    setFormData({
      examName: "",
      organizer: "",
      organization: "",
      job: "",
      MultipleCapacity: "",
      examDate: null,
      Province: "",
      detailsFile: null,
      documentFile: null,
    });
  };

  const provinces = [
    { value: "", label: "انتخاب کنید" },
    { value: "تهران", label: "تهران" },
    { value: "اصفهان", label: "اصفهان" },
    { value: "فارس", label: "فارس" },
    { value: "خوزستان", label: "خوزستان" },
    { value: "مازندران", label: "مازندران" },
    { value: "آذربایجان شرقی", label: "آذربایجان شرقی" },
    { value: "آذربایجان غربی", label: "آذربایجان غربی" },
    { value: "کرمان", label: "کرمان" },
    { value: "سیستان و بلوچستان", label: "سیستان و بلوچستان" },
    { value: "البرز", label: "البرز" },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="supplementary-doc-modal__overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="supplementary-doc-modal__content"
            initial={{ scale: 0.7, y: "-50%" }}
            animate={{ scale: 1, y: "0%" }}
            exit={{ scale: 0.7, y: "-50%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <h3 className="supplementary-doc-modal__title">
              {isEditMode ? "ویرایش مستندات" : "افزودن مستندات جدید"}
            </h3>
            <form
              onSubmit={handleSubmit}
              className="supplementary-doc-modal__form"
            >
              <div className="supplementary-doc-modal__form-group">
                <label className="supplementary-doc-modal__label">
                  نام آزمون
                </label>
                {isEditMode ? (
                  <p className="supplementary-doc-modal__display-text">
                    {formData.examName}
                  </p>
                ) : (
                  <select
                    value={formData.examName}
                    onChange={(e) => handleChange("examName", e.target.value)}
                    className="supplementary-doc-modal__select"
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
              <div className="supplementary-doc-modal__form-group">
                <label className="supplementary-doc-modal__label">مجری</label>
                <select
                  value={formData.organizer}
                  onChange={(e) => handleChange("organizer", e.target.value)}
                  className="supplementary-doc-modal__select"
                  required
                >
                  <option value="">انتخاب کنید</option>
                  {organizerOptions
                    .filter((opt) => opt.value !== "")
                    .map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                </select>
              </div>
              <div className="supplementary-doc-modal__form-group">
                <label className="supplementary-doc-modal__label">دستگاه</label>
                <select
                  value={formData.organization}
                  onChange={(e) => handleChange("organization", e.target.value)}
                  className="supplementary-doc-modal__select"
                  required
                >
                  <option value="">انتخاب کنید</option>
                  {organizationOptions
                    .filter((opt) => opt.value !== "")
                    .map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                </select>
              </div>
              <div className="supplementary-doc-modal__form-group">
                <label className="supplementary-doc-modal__label">شغل</label>
                <input
                  type="text"
                  value={formData.job}
                  onChange={(e) => handleChange("job", e.target.value)}
                  className="supplementary-doc-modal__input"
                  required
                />
              </div>
              <div className="supplementary-doc-modal__form-group">
                <label className="supplementary-doc-modal__label">
                  چند برابر ظرفیت
                </label>
                <div className="supplementary-doc-modal__capacity-input-wrapper">
                  <input
                    type="number"
                    min="1"
                    value={formData.MultipleCapacity}
                    onChange={(e) =>
                      handleChange("MultipleCapacity", e.target.value)
                    }
                    className="supplementary-doc-modal__input supplementary-doc-modal__input--number"
                    required
                  />
                  <span className="supplementary-doc-modal__capacity-unit">
                    برابر
                  </span>
                </div>
              </div>
              <div className="supplementary-doc-modal__form-group">
                <label className="supplementary-doc-modal__label">
                  تاریخ برگزاری
                </label>
                <DatePicker
                  value={formData.examDate}
                  onChange={(date) => handleChange("examDate", date)}
                  calendar={persian}
                  locale={persian_fa}
                  format="YYYY/MM/DD"
                  inputClass="supplementary-doc-modal__input"
                  placeholder="انتخاب تاریخ"
                  required
                />
              </div>
              <div className="supplementary-doc-modal__form-group">
                <label className="supplementary-doc-modal__label">استان</label>
                <select
                  value={formData.Province}
                  onChange={(e) => handleChange("Province", e.target.value)}
                  className="supplementary-doc-modal__select"
                  required
                >
                  {provinces.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="supplementary-doc-modal__form-group supplementary-doc-modal__file-upload-group">
                <label className="supplementary-doc-modal__label">
                  جزئیات نتایج
                </label>
                <div className="supplementary-doc-modal__file-upload-wrapper">
                  <label className="supplementary-doc-modal__file-upload-label">
                    <FaUpload className="supplementary-doc-modal__file-upload-icon" />
                    <span>
                      {formData.detailsFile
                        ? formData.detailsFile.name
                        : "انتخاب فایل"}
                    </span>
                    <input
                      type="file"
                      onChange={(e) =>
                        handleChange("detailsFile", e.target.files[0])
                      }
                      className="supplementary-doc-modal__file-upload-input"
                      accept=".pdf,.doc,.docx"
                    />
                  </label>
                </div>
              </div>
              <div className="supplementary-doc-modal__form-group supplementary-doc-modal__file-upload-group">
                <label className="supplementary-doc-modal__label">
                  سند ارزیابی
                </label>
                <div className="supplementary-doc-modal__file-upload-wrapper">
                  <label className="supplementary-doc-modal__file-upload-label">
                    <FaUpload className="supplementary-doc-modal__file-upload-icon" />
                    <span>
                      {formData.documentFile
                        ? formData.documentFile.name
                        : "انتخاب فایل"}
                    </span>
                    <input
                      type="file"
                      onChange={(e) =>
                        handleChange("documentFile", e.target.files[0])
                      }
                      className="supplementary-doc-modal__file-upload-input"
                      accept=".pdf,.doc,.docx"
                    />
                  </label>
                </div>
              </div>
              <div className="supplementary-doc-modal__buttons">
                <button
                  type="submit"
                  className="supplementary-doc-modal__submit-btn"
                >
                  {isEditMode ? "به‌روزرسانی" : "تأیید"}
                </button>
                <button
                  type="button"
                  className="supplementary-doc-modal__cancel-btn"
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

export default AddSupplementaryDocModal;
