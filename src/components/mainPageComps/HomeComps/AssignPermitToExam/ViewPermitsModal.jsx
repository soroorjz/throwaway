import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./ViewPermitsModal.scss";

const ViewPermitsModal = ({ isOpen, onClose, permitIds }) => {
  const [permits, setPermits] = useState(() => {
    const saved = localStorage.getItem("permits");
    return saved ? JSON.parse(saved) : [];
  });

  const assignedPermits = permits.filter((permit) =>
    permitIds.includes(permit.id)
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="view-permits-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="view-permits-modal__content"
            initial={{ scale: 0.7, y: "-50%" }}
            animate={{ scale: 1, y: "0%" }}
            exit={{ scale: 0.7, y: "-50%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <h3>مجوزهای اختصاص‌یافته</h3>
            <div className="view-permits-modal__permits-list">
              {assignedPermits.length > 0 ? (
                assignedPermits.map((permit) => (
                  <div
                    key={permit.id}
                    className="view-permits-modal__permit-item"
                  >
                    <p>
                      {permit.number} - {permit.organization} (
                      {permit.employmentType})
                    </p>
                  </div>
                ))
              ) : (
                <p>هیچ مجوزی اختصاص نیافته است</p>
              )}
            </div>
            <div className="view-permits-modal__form-actions">
              <button
                type="button"
                className="view-permits-modal__btn view-permits-modal__btn--close"
                onClick={onClose}
              >
                بستن
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ViewPermitsModal;
