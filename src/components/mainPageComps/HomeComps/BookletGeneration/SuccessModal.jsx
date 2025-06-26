import React, { useEffect } from "react";
import { FaCircleCheck } from "react-icons/fa6";
import { motion, AnimatePresence } from "framer-motion";
import "./SuccessModal.scss";

const SuccessModal = ({ isOpen, onClose, examTitle }) => {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="booklet-success-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="booklet-success-modal__content"
            initial={{ scale: 0.7, y: "-50%" }}
            animate={{ scale: 1, y: "0%" }}
            exit={{ scale: 0.7, y: "-50%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <FaCircleCheck/>
            <p>
              دفترچه‌ی آزمون با موفقیت در حساب کاربری داوطلبان آزمون{" "}
              <strong>{examTitle || "بدون عنوان"}</strong> قرار گرفت.
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SuccessModal;
