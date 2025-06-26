import React from "react";
import { FaUser, FaStar } from "react-icons/fa";
import { FaDownload } from "react-icons/fa6";

const DesignerCard = ({ designer, onEditClick, onDeleteClick }) => {
  // مپینگ رتبه‌بندی به متن
  const ratingLabels = {
    1: "ضعیف",
    2: "متوسط",
    3: "خوب",
    4: "عالی",
  };

  const renderStars = (rating) => {
    const stars = [];
    const numericRating = Number(rating) || 0; // اگه rating غیرعددی یا undefined باشه، 0 می‌ذاریم
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <FaStar
          key={i}
          className={i <= numericRating ? "star-filled" : "star-empty"}
        />
      );
    }
    return stars;
  };

  // چک کردن وجود designer
  if (!designer) {
    return (
      <div className="question-designer-management__card">
        داده‌ای برای نمایش وجود ندارد
      </div>
    );
  }

  // گرفتن متن رتبه‌بندی
  const ratingText = ratingLabels[designer.performanceRating] || "نامشخص";

  return (
    <div className="question-designer-management__card">
      <div className="question-designer-management__header">
        <div className="question-designer-management__user-info">
          <FaUser className="question-designer-management__user-icon" />
          <span className="question-designer-management__name">
            {designer.firstName || "نام"} {designer.lastName || "نام خانوادگی"}
          </span>
        </div>
        <span
          className={`question-designer-management__status question-designer-management__status--${
            designer.status || "unknown"
          }`}
        >
          {designer.status || "درحال بررسی"}
        </span>
      </div>
      <div className="question-designer-management__details">
        <p>
          <span>استان محل سکونت:</span> {designer.province || "نامشخص"}
        </p>
        <p>
          <span>شماره همراه:</span> {designer.mobileNumber || "نامشخص"}
        </p>
        <p>
          <span>کد ملی:</span> {designer.nationalCode || "نامشخص"}
        </p>
        <p className="deignerIdNumber">
          <span>شماره شناسنامه:</span> {designer.idNumber || "نامشخص"}
        </p>
        <p className="question-designer-management__rating">
          <span>رتبه عملکرد:</span>{" "}
        
            {ratingText} 
            {/* ({renderStars(designer.performanceRating)}) */}
          
        </p>
        <p>
          <span>نظر مجری:</span> {designer.managerComment ? "دارد" : "ندارد"}
        </p>
        <p>
          <span>مبلغ قرارداد:</span> {designer.contractAmount || "0"} ریال
        </p>
        <p>
          <span>تصویر قرارداد:</span>{" "}
          {designer.contractImage ? (
            <a
              href={designer.contractImage}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaDownload className="designerContractImage" />
            </a>
          ) : (
            "ندارد"
          )}
        </p>
      </div>
      <div className="question-designer-management__actions">
        <button
          className="question-designer-management__edit-btn"
          onClick={() => {
            console.log("ویرایش کلیک شد برای:", designer);
            onEditClick(designer);
          }}
        >
          ویرایش
        </button>
        <button
          className="question-designer-management__delete-btn"
          onClick={() => onDeleteClick(designer)}
        >
          حذف
        </button>
      </div>
    </div>
  );
};

export default DesignerCard;
