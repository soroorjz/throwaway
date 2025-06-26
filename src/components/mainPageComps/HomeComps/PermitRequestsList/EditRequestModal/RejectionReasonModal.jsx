import React from "react";
import "./RejectionReasonModal.scss";

const RejectionReasonModal = ({ isOpen, onClose, rejectionReason }) => {
  if (!isOpen) return null;

  console.log("RejectionReasonModal received reason:", rejectionReason);

  return (
    <div className="rejection-reason-modal__overlay">
      <div className="rejection-reason-modal">
        <h2 className="rejection-reason-modal__title">علت رد درخواست</h2>
        <p className="rejection-reason-modal__reason">
          {rejectionReason || "علت رد درخواست ثبت نشده است"}
        </p>
        <div className="rejection-reason-modal__actions">
          <button className="rejection-reason-modal__btn" onClick={onClose}>
            تأیید
          </button>
        </div>
      </div>
    </div>
  );
};

export default RejectionReasonModal;
