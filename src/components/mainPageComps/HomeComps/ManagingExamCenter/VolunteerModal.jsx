import React from "react";
import { useAuth } from "../../../../AuthContext";

const VolunteerModal = ({ isOpen, onClose, data, onOrganize }) => {
  const { user } = useAuth();
  if (!isOpen || !data) return null;

  const tableData = data.candidates.map((candidate) => ({
    gender: candidate.gender,
    leftHanded: candidate.leftHanded,
    needsAssistant: candidate.needsAssistant,
    total: candidate.total,
    unorganized: candidate.unorganized,
  }));

  const isAdminUser = user?.role === "کاربر سازمان اداری و استخدامی";

  return (
    <div className="modal-overlay VolunteerModal">
      <div className="modal-content">
        <button className="modal-close-icon" onClick={onClose}>
          ✕
        </button>
        <h2 className="modal-title">ساماندهی داوطلبان استان {data.name}</h2>
        <table className="volunteer-table">
          <thead>
            <tr>
              <th>جنسیت</th>
              <th>چپ‌دست</th>
              <th>نیاز به منشی</th>
              <th>تعداد کل داوطلبان</th>
              <th>داوطلبان ساماندهی‌نشده</th>
              <th>عملیات</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, index) => (
              <tr key={index}>
                <td>{row.gender}</td>
                <td>{row.leftHanded}</td>
                <td>{row.needsAssistant}</td>
                <td>{row.total}</td>
                <td>{row.unorganized}</td>
                <td>
                  <button
                    className={`organize-button ${
                      isAdminUser ? "show-button" : ""
                    }`}
                    onClick={() =>
                      onOrganize(
                        data.name,
                        row.gender,
                        row.unorganized,
                        isAdminUser
                      )
                    }
                  >
                    {isAdminUser ? "نمایش" : "ساماندهی"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button className="modal-close-button" onClick={onClose}>
          ثبت
        </button>
      </div>
    </div>
  );
};

export default VolunteerModal;
