import React, { useState } from "react";
import "./AssignModal.scss";
import { FaUpload } from "react-icons/fa6";
import JobsModal from "./JobsModal/JobsModal";
import ConfirmationModal from "./ConfirmationModal/ConfirmationModal";
import SuccessModal from "./SuccessModal/SuccessModal";

const AssignModal = ({ isOpen, onClose, examName, onConfirm, jobs }) => {
  const [isJobsModalOpen, setIsJobsModalOpen] = useState(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [selectedExecutor, setSelectedExecutor] = useState("");
  const [uploadedFile, setUploadedFile] = useState(null);

  // لاگ برای بررسی ورودی‌ها
  console.log("AssignModal props:", { isOpen, examName, jobs });

  if (!isOpen || !examName) {
    console.warn("AssignModal not rendered: invalid isOpen or examName", {
      isOpen,
      examName,
    });
    return null;
  }

  const handleExecutorChange = (e) => {
    setSelectedExecutor(e.target.value);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedFile({
          name: file.name,
          data: event.target.result,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleConfirmClick = () => {
    if (!selectedExecutor) {
      alert("لطفاً یک مجری انتخاب کنید.");
      return;
    }
    setIsConfirmationModalOpen(true);
  };

  const handleFinalConfirm = () => {
    setIsConfirmationModalOpen(false);
    setIsSuccessModalOpen(true);
  };

  const handleSuccessClose = () => {
    setIsSuccessModalOpen(false);
    onConfirm(examName, selectedExecutor, uploadedFile);
  };

  // محاسبه مجموع داوطلبان
  const totalApplicants =
    jobs && jobs.length > 0
      ? jobs.reduce((sum, job) => sum + (job.applicants || 0), 0)
      : 0;

  // لاگ برای بررسی totalApplicants
  console.log("Total applicants for", examName, ":", totalApplicants);

  return (
    <>
      <div className="modal-overlay">
        <div className="modal-container">
          <div className="modal-header">
            <h2 className="modal-title"> تعیین مجری ارزیابی تکمیلی {examName}</h2>
          </div>
          <div className="modal-body">
            <div className="executor-selection-row">
              <div className="modal-info">
                <p>تعداد شغل: {jobs ? jobs.length : 0}</p>
                <p
                  className="modal-info-link"
                  onClick={() => setIsJobsModalOpen(true)}
                >
                  مشاهده عناوین مشاغل
                </p>
              </div>
            </div>
            <div className="executor-selection-row">
              <div className="modal-section-title">
                مجری {examName} را تعیین کنید:
              </div>
              <div className="modal-form">
                <div className="executor-selection">
                  <label className="modal-select-label">مجری:</label>
                  <select
                    className="modal-select"
                    value={selectedExecutor}
                    onChange={handleExecutorChange}
                  >
                    <option value="">انتخاب کنید</option>
                    <option value="جهاد دانشگاهی">جهاد دانشگاهی</option>
                    <option value="سازمان سنجش و آموزش کشور">
                      سازمان سنجش و آموزش کشور
                    </option>
                    <option value="شرکت آزمون گستر">شرکت آزمون گستر</option>
                    <option value="شرکت تعاونی پژوهشگران رایانگان فردیس">
                      شرکت تعاونی پژوهشگران رایانگان فردیس
                    </option>
                  </select>
                </div>
                <div className="file-input-wrapper">
                  <input
                    type="file"
                    className="modal-file-input"
                    id="file-upload"
                    onChange={handleFileChange}
                  />
                  <label htmlFor="file-upload" className="custom-file-label">
                    بارگذاری قرارداد/ تفاهم‌نامه
                    <FaUpload />
                  </label>
                </div>
              </div>
              <div className="total-applicants">
                <p>تعداد کل داوطلبان: {totalApplicants}</p>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button
              className="modal-confirm-button"
              onClick={handleConfirmClick}
            >
              تأیید
            </button>
            <button className="modal-cancel-button" onClick={onClose}>
              لغو
            </button>
          </div>
        </div>
      </div>
      <JobsModal
        isOpen={isJobsModalOpen}
        onClose={() => setIsJobsModalOpen(false)}
        jobs={jobs}
      />
      <ConfirmationModal
        isOpen={isConfirmationModalOpen}
        onClose={() => setIsConfirmationModalOpen(false)}
        onConfirm={handleFinalConfirm}
        executorName={selectedExecutor}
        examName={examName}
      />
      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={handleSuccessClose}
        executorName={selectedExecutor}
        examName={examName}
      />
    </>
  );
};

export default AssignModal;
