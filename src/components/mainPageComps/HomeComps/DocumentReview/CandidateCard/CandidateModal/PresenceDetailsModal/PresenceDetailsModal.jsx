import React, { useState, useEffect } from "react";
import "./PresenceDetailsModal.scss";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import "react-multi-date-picker/styles/layouts/mobile.css";
import TimePicker from "react-time-picker";
import "react-time-picker/dist/TimePicker.css";

const PresenceDetailsModal = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [date, setDate] = useState(initialData?.date || "");
  const [time, setTime] = useState(initialData?.time || "");
  const [location, setLocation] = useState(initialData?.location || "");

  useEffect(() => {
    if (initialData) {
      setDate(initialData.date || "");
      setTime(initialData.time || "");
      setLocation(initialData.location || "");
    }
  }, [initialData]);

  const handleDateChange = (date) => {
    if (date) {
      setDate(date.format("YYYY/MM/DD"));
    } else {
      setDate("");
    }
  };

  const validateTime = (time) => {
    if (!time) return "";
    const [hours, minutes] = time.split(":").map(Number);
    if (isNaN(hours) || isNaN(minutes)) return "";
    const validHours = Math.min(Math.max(hours, 0), 23);
    const validMinutes = Math.min(Math.max(minutes, 0), 59);
    return `${validHours.toString().padStart(2, "0")}:${validMinutes
      .toString()
      .padStart(2, "0")}`;
  };

  const handleTimeChange = (time) => {
    const validatedTime = validateTime(time);
    setTime(validatedTime);
  };

  const handleSubmit = () => {
    if (date && time && location.trim()) {
      onSubmit({ date, time, location });
      setDate("");
      setTime("");
      setLocation("");
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="presence-details-modal__overlay">
      <div className="presence-details-modal__content">
        <div className="presence-details-modal__header">
          <h2 className="presence-details-modal__title">
            تعیین زمان و مکان حضور
          </h2>
          <button
            className="presence-details-modal__close-button"
            onClick={onClose}
          >
            ×
          </button>
        </div>
        <div className="presence-details-modal__body">
          <div className="presence-details-modal__form-group">
            <label className="presence-details-modal__label">تاریخ:</label>
            <DatePicker
              calendar={persian}
              locale={persian_fa}
              value={date}
              onChange={handleDateChange}
              className="presence-details-modal__date-picker"
              format="YYYY/MM/DD"
              placeholder="انتخاب تاریخ (مثال: 1403/12/15)"
              calendarPosition="bottom-right"
              editable={true}
            />
          </div>
          <div className="presence-details-modal__form-group">
            <label className="presence-details-modal__label">زمان:</label>
            <TimePicker
              onChange={handleTimeChange}
              value={time}
              format="HH:mm"
              disableClock={true}
              locale="fa-IR"
              className="presence-details-modal__time-picker"
              clearIcon={null}
              maxDetail="minute"
              placeholder="انتخاب زمان (مثال: 14:30)"
            />
          </div>
          <div className="presence-details-modal__form-group presence-details-modal__address ">
            <label className="presence-details-modal__label">
              نشانی محل حضور:
            </label>
            <textarea
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="presence-details-modal__textarea"
              placeholder="نشانی محل حضور را وارد کنید"
            />
          </div>
        </div>
        <div className="presence-details-modal__footer">
          <button
            className="presence-details-modal__button presence-details-modal__button--submit"
            onClick={handleSubmit}
            disabled={!date || !time || !location.trim()}
          >
            ثبت
          </button>
          <button
            className="presence-details-modal__button presence-details-modal__button--cancel"
            onClick={onClose}
          >
            انصراف
          </button>
        </div>
      </div>
    </div>
  );
};

export default PresenceDetailsModal;
