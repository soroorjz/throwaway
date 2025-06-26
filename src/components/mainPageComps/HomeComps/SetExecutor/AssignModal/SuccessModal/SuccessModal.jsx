import React, { useEffect } from "react";
import "./SuccessModal.scss";
import { FaCircleCheck } from "react-icons/fa6";

const SuccessModal = ({ isOpen, onClose, executorName, examName }) => {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);

      return () => clearTimeout(timer); 
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="success-modal-overlay">
      <div className="success-modal-container">
        <div className="success-modal-body">
          <FaCircleCheck className="success-icon" />
          <p>
            تعیین <strong>{executorName}</strong> برای{" "}
            <strong>{examName}</strong> با موفقیت انجام شد.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;
