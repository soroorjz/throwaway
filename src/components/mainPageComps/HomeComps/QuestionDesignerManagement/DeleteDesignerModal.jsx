import React from "react";
import { motion } from "framer-motion";

const DeleteDesignerModal = ({ isOpen, onConfirm, onCancel }) => {
  return (
    <motion.div
      className="modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="delete-modal-content"
        initial={{ scale: 0.7, y: "-50%" }}
        animate={{ scale: 1, y: "0%" }}
        exit={{ scale: 0.7, y: "-50%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <h3>تأیید حذف</h3>
        <p>آیا از حذف طراح مطمئن هستید؟</p>
        <div className="modal-buttons">
          <button className="modal-submit" onClick={onConfirm}>
            بله
          </button>
          <button className="modal-cancel" onClick={onCancel}>
            خیر
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default DeleteDesignerModal;