import React from "react";
import "./RejectionModal.scss";

const RejectionModal = ({
  isOpen,
  onClose,
  onSubmit,
  rejectionReason,
  setRejectionReason,
}) => {
  if (!isOpen) return null;

  const handleSubmit = () => {
    if (rejectionReason.trim()) {
      console.log("Submitting rejection reason:", rejectionReason);
      onSubmit(rejectionReason);
      onClose();
    } else {
      alert("لطفاً علت رد درخواست را وارد کنید!");
    }
  };

  return (
    <div className="rejection-modal__overlay">
      <div className="rejection-modal">
        <h2 className="rejection-modal__title">علت رد درخواست</h2>
        <p className="rejection-modal__description">
          لطفاً علت رد درخواست مجوز را وارد کنید.
        </p>
        <textarea
          className="rejection-modal__textarea"
          value={rejectionReason}
          onChange={(e) => setRejectionReason(e.target.value)}
          placeholder="علت رد درخواست را وارد کنید..."
        />
        <div className="rejection-modal__actions">
          <button
            className="rejection-modal__btn rejection-modal__btn--cancel"
            onClick={onClose}
          >
            انصراف
          </button>
          <button
            className="rejection-modal__btn rejection-modal__btn--submit"
            onClick={handleSubmit}
          >
            ثبت
          </button>
        </div>
      </div>
    </div>
  );
};

export default RejectionModal;
