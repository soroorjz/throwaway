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
        {isOverlay && editingField === "examName" ? (
          <input
            type="text"
            value={exam.examName}
            onChange={(e) => onFieldChange("examName", e.target.value)}
            autoFocus
            className="exam-management__title-input"
          />
        ) : (
          <span>
            {exam.examName}
            {isOverlay && (
              <MdOutlineModeEdit
                className="edit-icon"
                onClick={() => setEditingField("examName")}
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
              <span>{exam.examStatusRef}</span>
            </h3>
          )}
          <h3 className="exam-management__detail">
            مجری
            {isOverlay && editingField === "examOrganizerRef" ? (
              <select
                value={exam.examOrganizerRef}
                onChange={(e) => onFieldChange("examOrganizerRef", e.target.value)}
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
                {exam.examOrganizerRef}
                {isOverlay && (
                  <MdOutlineModeEdit
                    className="edit-icon"
                    onClick={() => setEditingField("examOrganizerRef")}
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
              {isOverlay && editingField === "examRegisterStartDate" ? (
                <DatePicker
                  value={exam.examRegisterStartDate}
                  onChange={(date) =>
                    onFieldChange("examRegisterStartDate", date.format("YYYY/MM/DD"))
                  }
                  calendar={persian}
                  locale={persian_fa}
                  calendarPosition="bottom-right"
                  autoFocus
                />
              ) : (
                <span>
                  {exam.examRegisterStartDate}
                  {isOverlay && (
                    <MdOutlineModeEdit
                      className="edit-icon"
                      onClick={() => setEditingField("examRegisterStartDate")}
                    />
                  )}
                </span>
              )}
            </h3>
            <h3 className="exam-management__detail">
              تاریخ پایان ثبت‌نام
              {isOverlay && editingField === "examRegisterEndDate" ? (
                <DatePicker
                  value={exam.examRegisterEndDate}
                  onChange={(date) =>
                    onFieldChange("examRegisterEndDate", date.format("YYYY/MM/DD"))
                  }
                  calendar={persian}
                  locale={persian_fa}
                  calendarPosition="bottom-right"
                  autoFocus
                />
              ) : (
                <span>
                  {exam.examRegisterEndDate}
                  {isOverlay && (
                    <MdOutlineModeEdit
                      className="edit-icon"
                      onClick={() => setEditingField("examRegisterEndDate")}
                    />
                  )}
                </span>
              )}
            </h3>
            <h3 className="exam-management__detail Renewal">
              تاریخ تمدید
              {isOverlay && editingField === "examRenewalDate" ? (
                <DatePicker
                  value={exam.examRenewalDate}
                  onChange={(date) =>
                    onFieldChange("examRenewalDate", date.format("YYYY/MM/DD"))
                  }
                  calendar={persian}
                  locale={persian_fa}
                  calendarPosition="bottom-right"
                  autoFocus
                />
              ) : (
                <span>
                  {exam.examRenewalDate}
                  {isOverlay && (
                    <MdOutlineModeEdit
                      className="edit-icon"
                      onClick={() => setEditingField("examRenewalDate")}
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
              {isOverlay && editingField === "examWithdrawCard" ? (
                <DatePicker
                  value={exam.examWithdrawCard}
                  onChange={(date) =>
                    onFieldChange("examWithdrawCard", date.format("YYYY/MM/DD"))
                  }
                  calendar={persian}
                  locale={persian_fa}
                  calendarPosition="bottom-right"
                  autoFocus
                />
              ) : (
                <span>
                  {exam.examWithdrawCard}
                  {isOverlay && (
                    <MdOutlineModeEdit
                      className="edit-icon"
                      onClick={() => setEditingField("examWithdrawCard")}
                    />
                  )}
                </span>
              )}
            </h3>
          </div>

          <p className="exam-management__detail examCost">
            هزینه:
            {isOverlay && editingField === "examPrice" ? (
              <div className="exam-management__cost-wrapper">
                <input
                  type="text"
                  value={exam.examPrice}
                  onChange={(e) => onCostChange(exam.id, e.target.value)}
                  onBlur={() => setEditingField(null)}
                  autoFocus
                  className="exam-management__cost-input"
                />
                <span className="exam-management__cost-unit">ریال</span>
              </div>
            ) : (
              <span>
                {formatCost(exam.examPrice)} ریال
                {isOverlay && (
                  <MdOutlineModeEdit
                    className="edit-icon"
                    onClick={() => setEditingField("examPrice")}
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
