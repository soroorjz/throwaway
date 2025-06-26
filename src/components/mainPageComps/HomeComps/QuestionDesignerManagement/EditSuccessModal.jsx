import React from "react";
import { motion } from "framer-motion";

const EditSuccessModal = ({ isOpen, onClose }) => {
  return (
    <>
      <motion.div
        className="success-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      />
      <motion.div
        className="success-modal"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.3 }}
      >
        <p>ویرایش با موفقیت انجام شد!</p>
      </motion.div>
    </>
  );
};

export default EditSuccessModal;