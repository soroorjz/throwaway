import React from "react";
import "./ExamManagementSkeleton.scss";

const ExamManagementSkeleton = () => {
  const years = [1404, 1403, 1402]; // سه سال برای شبیه‌سازی تب‌ها
  const skeletonCardsPerYear = 4; // ۴ کارت برای هر سال

  return (
    <div className="exam-management-skeleton">
      <div className="exam-management-skeleton__titleWrapper">
        <div className="exam-management-skeleton__title skeleton-box"></div>
        <div className="exam-management-skeleton__add-btn skeleton-box"></div>
      </div>

      <div className="exam-management-skeleton__actions">
        <div className="exam-management-skeleton__controls">
          <div className="exam-management-skeleton__filter skeleton-box"></div>
          <div className="exam-management-skeleton__sort skeleton-box"></div>
        </div>
        <div className="exam-management-skeleton__search skeleton-box"></div>
      </div>

      <div className="exam-management-skeleton__tabs">
        {years.map((year) => (
          <div
            key={year}
            className="exam-management-skeleton__tab skeleton-box"
          ></div>
        ))}
      </div>

      <div className="exam-management-skeleton__sections">
        {years.map((year) => (
          <div key={year} className="exam-management-skeleton__section">
            <div className="exam-management-skeleton__section-title skeleton-box"></div>
            <div className="exam-management-skeleton__grid">
              {Array.from({ length: skeletonCardsPerYear }, (_, index) => (
                <div key={index} className="exam-management-skeleton__card">
                  <div className="exam-management-skeleton__card-title skeleton-box"></div>
                  <div className="exam-management-skeleton__card-details">
                    <div className="skeleton-box skeleton-box--small"></div>
                    <div className="skeleton-box skeleton-box--small"></div>
                    <div className="skeleton-box skeleton-box--small"></div>
                    <div className="skeleton-box skeleton-box--small"></div>
                  </div>
                  <div className="exam-management-skeleton__card-buttons">
                    <div className="skeleton-box skeleton-box--button"></div>
                    <div className="skeleton-box skeleton-box--button"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExamManagementSkeleton;
