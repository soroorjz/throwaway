import React from "react";
import { FaTimes } from "react-icons/fa";
import { MdOutlineModeEdit } from "react-icons/md";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import TimePicker from "react-time-picker";
import "react-time-picker/dist/TimePicker.css";
import { useAuth } from "../../../../AuthContext";

const ExamCard = ({
  exam,
  isOverlay,
  editingField,
  setEditingField,
  onEditClick,
  onCloseOverlay,
  onFieldChange,
  onCostChange,
  onTimeChange,
  onSaveChanges,
  onCancelChanges,
  onDeleteClick,
}) => {
  const { user } = useAuth();
  const formatCost = (cost) => {
    return Number(cost).toLocaleString("fa-IR");
  };

  return (
    <div
      className={`exam-management__card ${isOverlay ? "overlay-card" : ""} ${
        isOverlay ? "animate-in" : ""
      }`}
    >
      {isOverlay && (
        <FaTimes
          className="exam-management__close-btn"
          onClick={onCloseOverlay}
        />
      )}
      <h3 className="exam-management__cardTitle">
        {isOverlay && editingField === "title" ? (
          <input
            type="text"
            value={exam.title}
            onChange={(e) => onFieldChange("title", e.target.value)}
            autoFocus
            className="exam-management__title-input"
          />
        ) : (
          <span>
            {exam.title}
            {isOverlay && (
              <MdOutlineModeEdit
                className="edit-icon"
                onClick={() => setEditingField("title")}
              />
            )}
          </span>
        )}
      </h3>
      <div className="exam-management__info">
        <div className="exam-management__header">
          {!isOverlay && (
            <h3 className="exam-management__detail">
              وضعیت
              <span>{exam.status}</span>
            </h3>
          )}
          <h3 className="exam-management__detail">
            مجری
            {isOverlay && editingField === "organizer" ? (
              <select
                value={exam.organizer}
                onChange={(e) => onFieldChange("organizer", e.target.value)}
                autoFocus
              >
                <option value="سازمان سنجش">
                  مرکز آموزشی و پژوهشی رایانگان
                </option>
                <option value="دانشگاه علوم پزشکی">
                  سازمان سنجش و آموزش کشور
                </option>
                <option value="شرکت ملی نفت">جهاد دانشگاهی</option>
                <option value="شهرداری تهران">شرکت آزمون گستر</option>
              </select>
            ) : (
              <span>
                {exam.organizer}
                {isOverlay && (
                  <MdOutlineModeEdit
                    className="edit-icon"
                    onClick={() => setEditingField("organizer")}
                  />
                )}
              </span>
            )}
          </h3>
        </div>

        <div className="exam-management__details">
          <div className="exam-management__Register">
            <h3 className="exam-management__detail">
              تاریخ شروع ثبت‌نام
              {isOverlay && editingField === "startDate" ? (
                <DatePicker
                  value={exam.startDate}
                  onChange={(date) =>
                    onFieldChange("startDate", date.format("YYYY/MM/DD"))
                  }
                  calendar={persian}
                  locale={persian_fa}
                  calendarPosition="bottom-right"
                  autoFocus
                />
              ) : (
                <span>
                  {exam.startDate}
                  {isOverlay && (
                    <MdOutlineModeEdit
                      className="edit-icon"
                      onClick={() => setEditingField("startDate")}
                    />
                  )}
                </span>
              )}
            </h3>
            <h3 className="exam-management__detail">
              تاریخ پایان ثبت‌نام
              {isOverlay && editingField === "endDate" ? (
                <DatePicker
                  value={exam.endDate}
                  onChange={(date) =>
                    onFieldChange("endDate", date.format("YYYY/MM/DD"))
                  }
                  calendar={persian}
                  locale={persian_fa}
                  calendarPosition="bottom-right"
                  autoFocus
                />
              ) : (
                <span>
                  {exam.endDate}
                  {isOverlay && (
                    <MdOutlineModeEdit
                      className="edit-icon"
                      onClick={() => setEditingField("endDate")}
                    />
                  )}
                </span>
              )}
            </h3>
            <h3 className="exam-management__detail Renewal">
              تاریخ تمدید
              {isOverlay && editingField === "extensionDate" ? (
                <DatePicker
                  value={exam.extensionDate}
                  onChange={(date) =>
                    onFieldChange("extensionDate", date.format("YYYY/MM/DD"))
                  }
                  calendar={persian}
                  locale={persian_fa}
                  calendarPosition="bottom-right"
                  autoFocus
                />
              ) : (
                <span>
                  {exam.extensionDate}
                  {isOverlay && (
                    <MdOutlineModeEdit
                      className="edit-icon"
                      onClick={() => setEditingField("extensionDate")}
                    />
                  )}
                </span>
              )}
            </h3>
          </div>
          <div className="exam-management__holding">
            <h3 className="exam-management__detail">
              تاریخ برگزاری
              {isOverlay && editingField === "examDate" ? (
                <DatePicker
                  value={exam.examDate}
                  onChange={(date) =>
                    onFieldChange("examDate", date.format("YYYY/MM/DD"))
                  }
                  calendar={persian}
                  locale={persian_fa}
                  calendarPosition="bottom-right"
                  autoFocus
                />
              ) : (
                <span>
                  {exam.examDate}
                  {isOverlay && (
                    <MdOutlineModeEdit
                      className="edit-icon"
                      onClick={() => setEditingField("examDate")}
                    />
                  )}
                </span>
              )}
            </h3>
            <h3 className="exam-management__detail">
              ساعت برگزاری
              {isOverlay && editingField === "examTime" ? (
                <TimePicker
                  value={exam.examTime}
                  onChange={(time) => onFieldChange("examTime", time)}
                  format="HH:mm"
                  locale="fa-IR"
                  disableClock={false}
                  clearIcon={null}
                  className="exam-management__time-picker"
                  autoFocus
                />
              ) : (
                <span>
                  {exam.examTime}
                  {isOverlay && (
                    <MdOutlineModeEdit
                      className="edit-icon"
                      onClick={() => setEditingField("examTime")}
                    />
                  )}
                </span>
              )}
            </h3>
            <h3 className="exam-management__detail receiveDate">
              تاریخ دریافت کارت
              {isOverlay && editingField === "cardReceiptDate" ? (
                <DatePicker
                  value={exam.cardReceiptDate}
                  onChange={(date) =>
                    onFieldChange("cardReceiptDate", date.format("YYYY/MM/DD"))
                  }
                  calendar={persian}
                  locale={persian_fa}
                  calendarPosition="bottom-right"
                  autoFocus
                />
              ) : (
                <span>
                  {exam.cardReceiptDate}
                  {isOverlay && (
                    <MdOutlineModeEdit
                      className="edit-icon"
                      onClick={() => setEditingField("cardReceiptDate")}
                    />
                  )}
                </span>
              )}
            </h3>
          </div>

          <p className="exam-management__detail examCost">
            هزینه:
            {isOverlay && editingField === "cost" ? (
              <div className="exam-management__cost-wrapper">
                <input
                  type="text"
                  value={exam.cost}
                  onChange={(e) => onCostChange(exam.id, e.target.value)}
                  onBlur={() => setEditingField(null)}
                  autoFocus
                  className="exam-management__cost-input"
                />
                <span className="exam-management__cost-unit">ریال</span>
              </div>
            ) : (
              <span>
                {formatCost(exam.cost)} ریال
                {isOverlay && (
                  <MdOutlineModeEdit
                    className="edit-icon"
                    onClick={() => setEditingField("cost")}
                  />
                )}
              </span>
            )}
          </p>
        </div>
      </div>
      {isOverlay && (
        <div className="exam-management__button-group">
          <button className="exam-management__save-btn" onClick={onSaveChanges}>
            ثبت
          </button>
          <button
            className="exam-management__cancel-btn"
            onClick={onCancelChanges}
          >
            لغو
          </button>
        </div>
      )}
      {!isOverlay && (
        <div className="exam-management__button-group">
          {user?.role === "کاربر سازمان اداری و استخدامی" && (
            <button
              className="exam-management__details-btn"
              onClick={() => onEditClick(exam.id)}
            >
              ویرایش
            </button>
          )}
          {user?.role === "کاربر سازمان اداری و استخدامی" && (
            <button
              className="exam-management__details-btn delete"
              onClick={() => onDeleteClick(exam.id)}
            >
              حذف
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ExamCard;
