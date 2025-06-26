import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaUpload } from "react-icons/fa";
import "./ConfirmPublishModal.scss";

const ConfirmPublishModal = ({ isOpen, onClose, onConfirm, examTitle }) => {
  const [uploadedFile, setUploadedFile] = useState(null);

  const handleFileChange = (file) => {
    setUploadedFile(file);
  };

  const handleConfirm = () => {
    onConfirm(uploadedFile);
    setUploadedFile(null); // Reset file after confirm
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="confirm-publish-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="confirm-publish-modal__content"
            initial={{ scale: 0.7, y: "-50%" }}
            animate={{ scale: 1, y: "0%" }}
            exit={{ scale: 0.7, y: "-50%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <h3>بارگذاری دفترچه آزمون</h3>
            <p>
              فایل نهایی دفترچه آزمون <strong>{examTitle}</strong> را بارگذاری
              کنید.
            </p>
            <div className="confirm-publish-modal__form-group">
              <label>بارگذاری دفترچه</label>
              <div className="file-upload-wrapper">
                <label className="file-upload-label">
                  <FaUpload className="file-upload-icon" />
                  <span>
                    {uploadedFile ? uploadedFile.name : "انتخاب فایل"}
                  </span>
                  <input
                    type="file"
                    onChange={(e) => handleFileChange(e.target.files[0])}
                    className="file-upload-input"
                    accept=".pdf,.doc,.docx"
                  />
                </label>
              </div>
            </div>
            <div className="confirm-publish-modal__actions">
              <button
                className="confirm-publish-modal__btn confirm-publish-modal__btn--confirm"
                onClick={handleConfirm}
                disabled={!uploadedFile}
              >
                انتشار
              </button>
              <button
                className="confirm-publish-modal__btn confirm-publish-modal__btn--cancel"
                onClick={() => {
                  onClose();
                  setUploadedFile(null);
                }}
              >
                لغو
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmPublishModal;
