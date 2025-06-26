import React, { useState, useEffect } from "react";
import "./RequiredDocumentsModal.scss";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import "react-multi-date-picker/styles/layouts/mobile.css";
import TimePicker from "react-time-picker";
import "react-time-picker/dist/TimePicker.css";

const RequiredDocumentsModal = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [documents, setDocuments] = useState([
    { title: "", isMandatory: true },
  ]);
  const [description, setDescription] = useState("");
  const [deadlineDate, setDeadlineDate] = useState("");
  const [deadlineTime, setDeadlineTime] = useState("");

  useEffect(() => {
    if (initialData) {
      if (initialData.documents && initialData.documents.length > 0) {
        setDocuments(initialData.documents);
      }
      setDescription(initialData.description || "");
      setDeadlineDate(initialData.deadlineDate || "");
      setDeadlineTime(initialData.deadlineTime || "");
    }
  }, [initialData]);

  const addDocument = () => {
    setDocuments([...documents, { title: "", isMandatory: true }]);
  };

  const updateDocument = (index, field, value) => {
    const updatedDocuments = [...documents];
    updatedDocuments[index] = { ...updatedDocuments[index], [field]: value };
    setDocuments(updatedDocuments);
  };

  const removeDocument = (index) => {
    if (documents.length > 1) {
      setDocuments(documents.filter((_, i) => i !== index));
    }
  };

  const handleDateChange = (date) => {
    const formattedDate = date ? date.format("YYYY/MM/DD") : "";
    setDeadlineDate(formattedDate);
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
    setDeadlineTime(validatedTime);
  };

  const handleSubmit = () => {
    const validDocuments = documents.filter((doc) => doc.title.trim());
    if (validDocuments.length > 0) {
      onSubmit({
        documents: validDocuments,
        description,
        deadlineDate,
        deadlineTime,
      });
      setDocuments([{ title: "", isMandatory: true }]);
      setDescription("");
      setDeadlineDate("");
      setDeadlineTime("");
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="required-docs-modal__overlay">
      <div className="required-docs-modal__content">
        <div className="required-docs-modal__header">
          <h2 className="required-docs-modal__title">مدارک موردنیاز</h2>
          <button
            className="required-docs-modal__close-button"
            onClick={onClose}
          >
            ×
          </button>
        </div>
        <div className="required-docs-modal__body">
          <div className="required-docs-modal__documents-container">
            {documents.map((doc, index) => (
              <div key={index} className="required-docs-modal__document-item">
                <div className="required-docs-modal__form-group required-docs-modal__title-mandatory">
                  <div className="required-docs-modal__form-group">
                    <label className="required-docs-modal__label">عنوان:</label>
                    <input
                      type="text"
                      value={doc.title}
                      onChange={(e) =>
                        updateDocument(index, "title", e.target.value)
                      }
                      className="required-docs-modal__input"
                      placeholder="عنوان مدرک را وارد کنید"
                    />
                  </div>
                  <div className="required-docs-modal__form-group">
                    <label className="required-docs-modal__label">
                      نوع الزام:
                    </label>
                    <div className="required-docs-modal__switch">
                      <span
                        className={`required-docs-modal__switch-label ${
                          doc.isMandatory
                            ? "required-docs-modal__switch-label--active"
                            : ""
                        }`}
                      >
                        اجباری
                      </span>
                      <label className="required-docs-modal__switch-toggle">
                        <input
                          type="checkbox"
                          checked={!doc.isMandatory}
                          onChange={() =>
                            updateDocument(
                              index,
                              "isMandatory",
                              !doc.isMandatory
                            )
                          }
                        />
                        <span className="required-docs-modal__switch-slider"></span>
                      </label>
                      <span
                        className={`required-docs-modal__switch-label ${
                          !doc.isMandatory
                            ? "required-docs-modal__switch-label--active"
                            : ""
                        }`}
                      >
                        اختیاری
                      </span>
                    </div>
                  </div>
                  {documents.length > 1 && (
                    <button
                      className="required-docs-modal__remove-button"
                      onClick={() => removeDocument(index)}
                    >
                      −
                    </button>
                  )}
                </div>
              </div>
            ))}
            <button
              className="required-docs-modal__add-button"
              onClick={addDocument}
            >
              +
            </button>
          </div>
          <div className="required-docs-modal__form-group">
            <label className="required-docs-modal__label">توضیحات:</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="required-docs-modal__textarea"
              placeholder="توضیحات مدرک را وارد کنید"
            />
          </div>
          <div className="required-docs-modal__form-group docsDate">
            <h3 className="required-docs-modal__deadline-title  ">
              تعیین مهلت بارگذاری مدارک
            </h3>
            <div className="required-docs-modal__deadline-picker">
              <DatePicker
                calendar={persian}
                locale={persian_fa}
                value={deadlineDate}
                onChange={handleDateChange}
                className="required-docs-modal__date-picker"
                format="YYYY/MM/DD"
                placeholder="انتخاب تاریخ (مثال: 1403/12/15)"
                calendarPosition="bottom-right"
                editable={true}
              />
              <TimePicker
                onChange={handleTimeChange}
                value={deadlineTime}
                format="HH:mm"
                disableClock={true}
                locale="fa-IR"
                className="required-docs-modal__time-picker"
                clearIcon={null}
                maxDetail="minute"
                placeholder="انتخاب زمان (مثال: 14:30)"
              />
            </div>
          </div>
        </div>
        <div className="required-docs-modal__footer">
          <button
            className="required-docs-modal__button required-docs-modal__button--submit"
            onClick={handleSubmit}
            disabled={!documents.some((doc) => doc.title.trim())}
          >
            ثبت
          </button>
          <button
            className="required-docs-modal__button required-docs-modal__button--cancel"
            onClick={onClose}
          >
            انصراف
          </button>
        </div>
      </div>
    </div>
  );
};

export default RequiredDocumentsModal;
