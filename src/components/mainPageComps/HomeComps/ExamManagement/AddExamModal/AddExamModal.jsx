import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import TimePicker from "react-time-picker"; // اضافه شده
import "react-time-picker/dist/TimePicker.css"; // اضافه شده
import "./AddExamModal.scss";

const persianToLatinDigits = (str) => {
  if (!str) return str;
  const persianDigits = [
    /۰/g,
    /۱/g,
    /۲/g,
    /۳/g,
    /۴/g,
    /۵/g,
    /۶/g,
    /۷/g,
    /۸/g,
    /۹/g,
  ];
  let result = str;
  for (let i = 0; i < 10; i++) {
    result = result.replace(persianDigits[i], i);
  }
  return result;
};

const AddExamModal = ({ isOpen, onClose, onSubmit, filterConfig }) => {
  const [newExam, setNewExam] = useState({
    title: "",
    status: "در انتظار",
    organizer: "",
    startDate: null,
    endDate: null,
    extensionDate: null,
    examDate: null,
    examTime: "00:00",
    cardReceiptDate: null,
    cost: "",
  });

  const handleInputChange = (field, value) => {
    setNewExam((prev) => ({ ...prev, [field]: value }));
  };

  const handleCostChange = (value) => {
    if (!/^\d*$/.test(value)) return;
    handleInputChange("cost", value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newExam.title || !newExam.organizer || !newExam.examDate) {
      alert("لطفاً عنوان، مجری و تاریخ برگزاری را وارد کنید.");
      return;
    }
    onSubmit({
      ...newExam,
      status: "در انتظار",
      startDate: newExam.startDate
        ? persianToLatinDigits(newExam.startDate.format("YYYY/MM/DD"))
        : "",
      endDate: newExam.endDate
        ? persianToLatinDigits(newExam.endDate.format("YYYY/MM/DD"))
        : "",
      extensionDate: newExam.extensionDate
        ? persianToLatinDigits(newExam.extensionDate.format("YYYY/MM/DD"))
        : "",
      examDate: newExam.examDate
        ? persianToLatinDigits(newExam.examDate.format("YYYY/MM/DD"))
        : "",
      cardReceiptDate: newExam.cardReceiptDate
        ? persianToLatinDigits(newExam.cardReceiptDate.format("YYYY/MM/DD"))
        : "",
    });
    setNewExam({
      title: "",
      status: "در انتظار",
      organizer: "",
      startDate: null,
      endDate: null,
      extensionDate: null,
      examDate: null,
      examTime: "00:00",
      cardReceiptDate: null,
      cost: "",
    });
  };

  const organizerOptions =
    filterConfig
      .find((f) => f.key === "organizer")
      ?.options.filter((opt) => opt.value !== "") || [];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="add-exam-modal__overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="add-exam-modal__content"
            initial={{ scale: 0.7, y: "-50%" }}
            animate={{ scale: 1, y: "0%" }}
            exit={{ scale: 0.7, y: "-50%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <h3 className="add-exam-modal__title">افزودن آزمون جدید</h3>
            <form onSubmit={handleSubmit} className="add-exam-modal__form">
              <div className="add-exam-modal__form-group">
                <label className="add-exam-modal__label">عنوان آزمون</label>
                <input
                  type="text"
                  value={newExam.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  className="add-exam-modal__input"
                  required
                />
              </div>
              <div className="add-exam-modal__form-group">
                <label className="add-exam-modal__label">مجری</label>
                <select
                  value={newExam.organizer}
                  onChange={(e) =>
                    handleInputChange("organizer", e.target.value)
                  }
                  className="add-exam-modal__select"
                  required
                >
                  <option value="">انتخاب کنید</option>
                  {organizerOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="add-exam-modal__form-group">
                <label className="add-exam-modal__label">
                  تاریخ شروع ثبت‌نام
                </label>
                <DatePicker
                  value={newExam.startDate}
                  onChange={(date) => handleInputChange("startDate", date)}
                  calendar={persian}
                  locale={persian_fa}
                  format="YYYY/MM/DD"
                  inputClass="add-exam-modal__input"
                  placeholder="انتخاب تاریخ"
                />
              </div>
              <div className="add-exam-modal__form-group">
                <label className="add-exam-modal__label">
                  تاریخ پایان ثبت‌نام
                </label>
                <DatePicker
                  value={newExam.endDate}
                  onChange={(date) => handleInputChange("endDate", date)}
                  calendar={persian}
                  locale={persian_fa}
                  format="YYYY/MM/DD"
                  inputClass="add-exam-modal__input"
                  placeholder="انتخاب تاریخ"
                />
              </div>
              <div className="add-exam-modal__form-group">
                <label className="add-exam-modal__label">تاریخ تمدید</label>
                <DatePicker
                  value={newExam.extensionDate}
                  onChange={(date) => handleInputChange("extensionDate", date)}
                  calendar={persian}
                  locale={persian_fa}
                  format="YYYY/MM/DD"
                  inputClass="add-exam-modal__input"
                  placeholder="انتخاب تاریخ"
                />
              </div>
              <div className="add-exam-modal__form-group">
                <label className="add-exam-modal__label">تاریخ برگزاری</label>
                <DatePicker
                  value={newExam.examDate}
                  onChange={(date) => handleInputChange("examDate", date)}
                  calendar={persian}
                  locale={persian_fa}
                  format="YYYY/MM/DD"
                  inputClass="add-exam-modal__input"
                  placeholder="انتخاب تاریخ"
                  required
                />
              </div>
              <div className="add-exam-modal__form-group">
                <label className="add-exam-modal__label">ساعت برگزاری</label>
                <TimePicker
                  onChange={(value) =>
                    handleInputChange("examTime", value || "00:00")
                  }
                  value={newExam.examTime}
                  format="HH:mm"
                  disableClock={true}
                  locale="fa-IR"
                  className="add-exam-modal__time-picker"
                  clearIcon={null}
                  maxDetail="minute"
                  placeholder="انتخاب زمان (مثال: 14:30)"
                />
              </div>
              <div className="add-exam-modal__form-group">
                <label className="add-exam-modal__label">
                  تاریخ دریافت کارت
                </label>
                <DatePicker
                  value={newExam.cardReceiptDate}
                  onChange={(date) =>
                    handleInputChange("cardReceiptDate", date)
                  }
                  calendar={persian}
                  locale={persian_fa}
                  format="YYYY/MM/DD"
                  inputClass="add-exam-modal__input"
                  placeholder="انتخاب تاریخ"
                />
              </div>
              <div className="add-exam-modal__form-group">
                <label className="add-exam-modal__label">هزینه (ریال)</label>
                <input
                  type="text"
                  value={newExam.cost}
                  onChange={(e) => handleCostChange(e.target.value)}
                  className="add-exam-modal__input"
                />
              </div>
              <div className="add-exam-modal__buttons">
                <button type="submit" className="add-exam-modal__submit-btn">
                  ثبت
                </button>
                <button
                  type="button"
                  className="add-exam-modal__cancel-btn"
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

export default AddExamModal;
