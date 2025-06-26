import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import "./ExamEditModal.scss";

const ExamEditModal = ({ exam, buttonPosition, onUpdate, onClose }) => {
  const [formData, setFormData] = useState({ ...exam });
  const [openDatePicker, setOpenDatePicker] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const datePickerRefs = useRef({});

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowForm(true);
    }, 600); 
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (name, date) => {
    setFormData((prev) => ({
      ...prev,
      [name]: date
        ? date.format("YYYY/MM/DD", { calendar: persian, locale: persian_fa })
        : "",
    }));
    setOpenDatePicker(null);
  };

  const handleTimeChange = (field, value) => {
    if (!/^\d*$/.test(value)) return;
    const numValue = parseInt(value) || 0;

    if (field === "hour") {
      if (numValue > 23) return;
      setFormData((prev) => ({
        ...prev,
        examTime: `${value.padStart(2, "0")}:${
          prev.examTime.split(":")[1] || "00"
        }`,
      }));
    } else if (field === "minute") {
      if (numValue > 59) return;
      setFormData((prev) => ({
        ...prev,
        examTime: `${prev.examTime.split(":")[0] || "00"}:${value.padStart(
          2,
          "0"
        )}`,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(formData);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (openDatePicker) {
        const currentPicker = datePickerRefs.current[openDatePicker];
        const isClickInsidePicker = currentPicker?.container?.contains(
          e.target
        );
        const isClickOnInput = currentPicker?.input?.contains(e.target);

        if (!isClickInsidePicker && !isClickOnInput) {
          currentPicker?.closeCalendar();
          setOpenDatePicker(null);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openDatePicker]);

  const organizerOptions = [
    "سازمان سنجش",
    "دانشگاه علوم پزشکی",
    "شرکت برق منطقه‌ای",
    "شرکت ملی نفت",
    "شهرداری تهران",
    "بانک مرکزی",
    "سازمان راهداری",
    "سازمان محیط زیست",
  ];

  // const statusOptions = [
  //   "در حال برگزاری",
  //   "در انتظار",
  //   "لغو شده",
  //   "پایان یافته",
  // ];

  const initialPosition = buttonPosition
    ? {
        position: "absolute",
        top: buttonPosition.top,
        left: buttonPosition.left,
        width: buttonPosition.width,
        height: buttonPosition.height,
        rotate: 0,
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
        opacity: 1,
      }
    : { scale: 0.5, opacity: 0 };

  const floatPosition = buttonPosition
    ? {
        position: "absolute",
        top: buttonPosition.top - 20, 
        left: buttonPosition.left,
        width: buttonPosition.width * 1.5,
        height: buttonPosition.height * 1.5,
        rotate: 5,
        boxShadow: "0 10px 20px rgba(0, 0, 0, 0.15)",
        opacity: 1,
      }
    : { scale: 0.5, opacity: 0 };

  const finalPosition = {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "90%",
    maxWidth: "900px",
    height: "auto",
    maxHeight: "70vh",
    rotate: 0,
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
    opacity: 1,
  };

  const exitPosition = buttonPosition
    ? {
        position: "absolute",
        top: buttonPosition.top,
        left: buttonPosition.left,
        width: buttonPosition.width,
        height: buttonPosition.height,
        rotate: 0,
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
        opacity: 0,
      }
    : { scale: 0.5, opacity: 0 };

  return (
    <AnimatePresence>
      <motion.div
        className="exam-edit-modal__overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        onClick={onClose}
      >
        <motion.div
          className="exam-edit-modal"
          initial={initialPosition}
          animate={[floatPosition, finalPosition]}
          exit={exitPosition}
          transition={{
            type: "spring",
            stiffness: 100,
            damping: 20,
            duration: 0.3,
            times: [0, 0.5, 1],
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {!showForm ? (
            <motion.div
              className="exam-edit-modal__card-content"
              initial={{ opacity: 1 }}
              animate={{ opacity: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <h3 className="exam-management__title">{exam.title}</h3>
              <div className="exam-management__info">
                <div className="exam-management__header">
                  {/* <h3 className="exam-management__detail">
                    وضعیت
                    <span>{exam.status}</span>
                  </h3> */}
                  <h3 className="exam-management__detail">
                    مجری
                    <span>{exam.organizer}</span>
                  </h3>
                </div>
                <div className="exam-management__details">
                  <div className="exam-management__Register">
                    <h3 className="exam-management__detail">
                      تاریخ شروع ثبت‌نام
                      <span>{exam.startDate}</span>
                    </h3>
                    <h3 className="exam-management__detail">
                      تاریخ پایان ثبت‌نام
                      <span>{exam.endDate}</span>
                    </h3>
                    <h3 className="exam-management__detail Renewal">
                      تاریخ تمدید <span>{exam.extensionDate}</span>
                    </h3>
                  </div>
                  <div className="exam-management__holding">
                    <h3 className="exam-management__detail">
                      تاریخ برگزاری <span>{exam.examDate}</span>
                    </h3>
                    <h3 className="exam-management__detail">
                      ساعت برگزاری <span>{exam.examTime}</span>
                    </h3>
                    <h3 className="exam-management__detail receiveDate">
                      تاریخ دریافت کار <span>{exam.cardReceiptDate}</span>
                    </h3>
                  </div>
                  <p className="exam-management__detail examCost">
                    هزینه:
                    <span>{exam.cost}</span>
                  </p>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="exam-edit-modal__title">ویرایش آزمون</h2>
              <form className="exam-edit-modal__form" onSubmit={handleSubmit}>
                <div className="exam-edit-modal__grid">
                  <div className="exam-edit-modal__field">
                    <label>عنوان</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="exam-edit-modal__field">
                    <label>مجری</label>
                    <select
                      name="organizer"
                      value={formData.organizer}
                      onChange={handleChange}
                    >
                      {organizerOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="exam-edit-modal__field">
                    <label>تاریخ برگزاری</label>
                    <DatePicker
                      ref={(el) => (datePickerRefs.current["examDate"] = el)}
                      value={formData.examDate}
                      onChange={(date) => handleDateChange("examDate", date)}
                      calendar={persian}
                      locale={persian_fa}
                      format="YYYY/MM/DD"
                      calendarPosition="bottom-right"
                      inputClass="exam-edit-modal__date-input"
                      onOpen={() => setOpenDatePicker("examDate")}
                      onClose={() => setOpenDatePicker(null)}
                    />
                  </div>
                  <div className="exam-edit-modal__field">
                    <label>ساعت برگزاری</label>
                    <div className="exam-edit-modal__time-picker">
                      <input
                        type="text"
                        value={formData.examTime.split(":")[0] || "00"}
                        onChange={(e) =>
                          handleTimeChange("hour", e.target.value)
                        }
                        maxLength="2"
                        className="exam-edit-modal__time-input"
                      />
                      <span className="exam-edit-modal__time-separator">:</span>
                      <input
                        type="text"
                        value={formData.examTime.split(":")[1] || "00"}
                        onChange={(e) =>
                          handleTimeChange("minute", e.target.value)
                        }
                        maxLength="2"
                        className="exam-edit-modal__time-input"
                      />
                    </div>
                  </div>
                  <div className="exam-edit-modal__field">
                    <label>تاریخ دریافت کار</label>
                    <DatePicker
                      ref={(el) =>
                        (datePickerRefs.current["cardReceiptDate"] = el)
                      }
                      value={formData.cardReceiptDate}
                      onChange={(date) =>
                        handleDateChange("cardReceiptDate", date)
                      }
                      calendar={persian}
                      locale={persian_fa}
                      format="YYYY/MM/DD"
                      calendarPosition="bottom-right"
                      inputClass="exam-edit-modal__date-input"
                      onOpen={() => setOpenDatePicker("cardReceiptDate")}
                      onClose={() => setOpenDatePicker(null)}
                    />
                  </div>
                  <div className="exam-edit-modal__field">
                    <label>تاریخ شروع</label>
                    <DatePicker
                      ref={(el) => (datePickerRefs.current["startDate"] = el)}
                      value={formData.startDate}
                      onChange={(date) => handleDateChange("startDate", date)}
                      calendar={persian}
                      locale={persian_fa}
                      format="YYYY/MM/DD"
                      calendarPosition="bottom-right"
                      inputClass="exam-edit-modal__date-input"
                      onOpen={() => setOpenDatePicker("startDate")}
                      onClose={() => setOpenDatePicker(null)}
                    />
                  </div>
                  <div className="exam-edit-modal__field">
                    <label>تاریخ پایان</label>
                    <DatePicker
                      ref={(el) => (datePickerRefs.current["endDate"] = el)}
                      value={formData.endDate}
                      onChange={(date) => handleDateChange("endDate", date)}
                      calendar={persian}
                      locale={persian_fa}
                      format="YYYY/MM/DD"
                      calendarPosition="bottom-right"
                      inputClass="exam-edit-modal__date-input"
                      onOpen={() => setOpenDatePicker("endDate")}
                      onClose={() => setOpenDatePicker(null)}
                    />
                  </div>
                  <div className="exam-edit-modal__field">
                    <label>تاریخ تمدید</label>
                    <DatePicker
                      ref={(el) =>
                        (datePickerRefs.current["extensionDate"] = el)
                      }
                      value={formData.extensionDate}
                      onChange={(date) =>
                        handleDateChange("extensionDate", date)
                      }
                      calendar={persian}
                      locale={persian_fa}
                      format="YYYY/MM/DD"
                      calendarPosition="bottom-right"
                      inputClass="exam-edit-modal__date-input"
                      onOpen={() => setOpenDatePicker("extensionDate")}
                      onClose={() => setOpenDatePicker(null)}
                    />
                  </div>
                  <div className="exam-edit-modal__field">
                    <label>هزینه</label>
                    <input
                      type="text"
                      name="cost"
                      value={formData.cost}
                      onChange={handleChange}
                    />
                  </div>
                  {/* <div className="exam-edit-modal__field">
                    <label>وضعیت</label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                    >
                      {statusOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div> */}
                </div>
                <div className="exam-edit-modal__actions">
                  <button type="submit" className="exam-edit-modal__save-btn">
                    ذخیره
                  </button>
                  <button
                    type="button"
                    className="exam-edit-modal__close-btn"
                    onClick={onClose}
                  >
                    بستن
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ExamEditModal;
