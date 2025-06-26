import React from "react";
import "./ConfirmationModal.scss";

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  executorName,
  examName,
}) => {
  if (!isOpen) return null;

  return (
    <div className="confirmation-modal-overlay">
      <div className="confirmation-modal-container">
        <div className="confirmation-modal-header">
          <h2 className="confirmation-modal-title">تأیید عملیات</h2>
        </div>
        <div className="confirmation-modal-body">
          <p>
            آیا از تعیین <strong>{executorName}</strong> برای{" "}
            <strong>{examName}</strong> اطمینان دارید؟
          </p>
        </div>
        <div className="confirmation-modal-footer">
          <button
            className="confirmation-modal-confirm-button"
            onClick={onConfirm}
          >
            تأیید
          </button>
          <button
            className="confirmation-modal-cancel-button"
            onClick={onClose}
          >
            لغو
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
