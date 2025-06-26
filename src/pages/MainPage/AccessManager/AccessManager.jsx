import React, { useState } from "react";
import "./AccessManager.scss";
import EditAccessModal from "./EditAccessModal/EditAccessModal";

const accessList = [
  { id: 1, name: "سازمان اداری و استخدامی" },
  { id: 2, name: "وزارت نیرو" },
  { id: 3, name: "دستگاه تابعه" },
  { id: 4, name: "مجری آزمون" },
  { id: 5, name: "مجری ارزیابی" },
  { id: 6, name: "طراح سوال" },
  { id: 7, name: "ارزیاب" },
  { id: 8, name: "ادمین" },
];

const AccessManager = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [selectedAccess, setSelectedAccess] = useState(null);

  const handleEditClick = (access) => {
    setSelectedAccess(access);
    setModalMode("edit");
    setModalOpen(true);
  };

  const handleAddClick = () => {
    setSelectedAccess(null);
    setModalMode("add");
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedAccess(null);
    setModalMode("add");
  };

  return (
    <div className="access-manager">
      <div className="access-manager-header">
        <h1>مدیریت دسترسی‌ها</h1>
        <button className="add-button" onClick={handleAddClick}>
          افزودن دسترسی
        </button>
      </div>
      <div className="access-grid">
        {accessList.map((access) => (
          <div key={access.id} className="access-card">
            <h3>{access.name}</h3>
            <button
              className="edit-button"
              onClick={() => handleEditClick(access)}
            >
              ویرایش
            </button>
          </div>
        ))}
      </div>
      <EditAccessModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        access={selectedAccess}
        mode={modalMode}
      />
    </div>
  );
};

export default AccessManager;
