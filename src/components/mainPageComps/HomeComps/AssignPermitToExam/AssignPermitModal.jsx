import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./AssignPermitModal.scss";

const AssignPermitModal = ({
  isOpen,
  onClose,
  onSubmit,
  exam,
  existingPermitIds,
}) => {
  const [permits, setPermits] = useState(() => {
    const saved = localStorage.getItem("permits");
    return saved ? JSON.parse(saved) : [];
  });
  const [selectedPermitIds, setSelectedPermitIds] = useState(
    existingPermitIds || []
  );

  useEffect(() => {
    setSelectedPermitIds(existingPermitIds || []);
  }, [existingPermitIds]);

  const handleCheckboxChange = (permitId) => {
    setSelectedPermitIds((prev) =>
      prev.includes(permitId)
        ? prev.filter((id) => id !== permitId)
        : [...prev, permitId]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedPermitIds.length === 0) {
      alert("لطفاً حداقل یک مجوز انتخاب کنید.");
      return;
    }
    onSubmit(selectedPermitIds);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="assign-permit-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="assign-permit-modal__content"
            initial={{ scale: 0.7, y: "-50%" }}
            animate={{ scale: 1, y: "0%" }}
            exit={{ scale: 0.7, y: "-50%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <h3>تخصیص مجوز به آزمون</h3>
            <div className="assign-permit-modal__exam-info">
              <p>
                <strong>نام آزمون:</strong> {exam?.title || "نامشخص"}
              </p>
            </div>
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="assign-permit-modal__form-group">
                <label className="assign-permit-modal__formTltle">انتخاب مجوزها</label>
                <div className="assign-permit-modal__permits-list">
                  {permits.length > 0 ? (
                    permits.map((permit) => (
                      <div
                        key={permit.id}
                        className="assign-permit-modal__permit-item"
                      >
                        <input
                          type="checkbox"
                          id={`permit-${permit.id}`}
                          checked={selectedPermitIds.includes(permit.id)}
                          onChange={() => handleCheckboxChange(permit.id)}
                        />
                        <label htmlFor={`permit-${permit.id}`}>
                          {permit.number} - {permit.organization} (
                          {permit.employmentType})
                        </label>
                      </div>
                    ))
                  ) : (
                    <p>هیچ مجوزی یافت نشد</p>
                  )}
                </div>
              </div>
              <div className="assign-permit-modal__form-actions">
                <button
                  type="submit"
                  className="assign-permit-modal__btn assign-permit-modal__btn--submit"
                >
                  ثبت
                </button>
                <button
                  type="button"
                  className="assign-permit-modal__btn assign-permit-modal__btn--cancel"
                  onClick={onClose}
                >
                  انصراف
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AssignPermitModal;
