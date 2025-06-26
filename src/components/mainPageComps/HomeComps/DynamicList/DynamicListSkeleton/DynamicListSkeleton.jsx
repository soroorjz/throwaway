import React from "react";
import "./DynamicListSkeleton.scss";

const DynamicListSkeleton = () => {
  const skeletonRows = Array(5).fill(); // ۵ ردیف برای شبیه‌سازی جدول

  return (
    <div className="dynamic-list-skeleton">
      <div className="dynamic-list-skeleton__header">
        <div className="dynamic-list-skeleton__title skeleton-box"></div>
        <div className="dynamic-list-skeleton__actions">
          <div className="dynamic-list-skeleton__search skeleton-box"></div>
          <div className="dynamic-list-skeleton__add-btn skeleton-box"></div>
        </div>
      </div>

      <table className="dynamic-list-skeleton__table">
        <thead>
          <tr>
            <th className="dynamic-list-skeleton__table-header">ردیف</th>
            <th className="dynamic-list-skeleton__table-header">شرح</th>
            <th className="dynamic-list-skeleton__table-header">عملیات</th>
          </tr>
        </thead>
        <tbody>
          {skeletonRows.map((_, index) => (
            <tr key={index} className="dynamic-list-skeleton__table-row">
              <td className="dynamic-list-skeleton__table-cell">
                <div className="skeleton-box skeleton-box--small"></div>
              </td>
              <td className="dynamic-list-skeleton__table-cell">
                <div className="skeleton-box skeleton-box--text"></div>
              </td>
              <td className="dynamic-list-skeleton__table-cell">
                <div className="dynamic-list-skeleton__table-actions">
                  <div className="skeleton-box skeleton-box--icon"></div>
                  <div className="skeleton-box skeleton-box--icon"></div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DynamicListSkeleton;
