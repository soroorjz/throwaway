import React, { useState } from "react";
import "./DetailsModal.scss";
import { FaDownload } from "react-icons/fa6";
import JobsModal from "../AssignModal/JobsModal/JobsModal";

const DetailsModal = ({ isOpen, onClose, examName, details, jobs }) => {
  const [isJobsModalOpen, setIsJobsModalOpen] = useState(false);

  // لاگ برای بررسی ورودی‌ها
  console.log("DetailsModal props:", { isOpen, examName, details, jobs });

  if (!isOpen || !examName) {
    console.warn("DetailsModal not rendered: invalid isOpen or examName", {
      isOpen,
      examName,
    });
    return null;
  }

  // محاسبه مجموع داوطلبان
  const totalApplicants =
    jobs && jobs.length > 0
      ? jobs.reduce((sum, job) => sum + (job.applicants || 0), 0)
      : 0;

  // لاگ برای بررسی totalApplicants
  console.log("Total applicants for", examName, ":", totalApplicants);

  // مدیریت نمایش و دانلود فایل
  const renderFileSection = () => {
    if (!details?.file) {
      return "بارگذاری نشده";
    }

    if (typeof details.file === "string") {
      // فایل پیش‌فرض (رشته‌ای مثل مسیر فایل)
      const fileName = details.file.split("/").pop(); // گرفتن نام فایل از مسیر
      return (
        <>
          {fileName}{" "}
          <a
            href={details.file}
            download={fileName}
            className="DetailsModalDownload-link"
          >
            <FaDownload />
          </a>
        </>
      );
    }

    if (details.file.name && details.file.data) {
      // فایل آپلودشده (شیء با name و data)
      return (
        <>
          {details.file.name}{" "}
          <a
            href={details.file.data}
            download={details.file.name}
            className="DetailsModalDownload-link"
          >
            <FaDownload />
          </a>
        </>
      );
    }

    return "فایل نامعتبر";
  };

  return (
    <>
      <div className="modal-overlay">
        <div className="modal-container">
          <div className="modal-header">
            <h2 className="modal-title">{examName}</h2>
          </div>
          <div className="modal-body">
            <div className="details-selection-row">
              <div className="modal-info">
                <p>تعداد کل داوطلبان: {totalApplicants}</p>
                <p>تعداد شغل: {jobs ? jobs.length : 0}</p>
                <p
                  className="modal-info-link"
                  onClick={() => setIsJobsModalOpen(true)}
                >
                  مشاهده عناوین مشاغل
                </p>
              </div>
            </div>
            <div className="details-selection-row">
              <div className="modal-section-title">
                اطلاعات مجری {examName}:
              </div>
              <div className="modal-details">
                <p>
                  <strong>مجری:</strong> {details?.executor || "تعیین نشده"}
                </p>
                <p>
                  <strong>تاریخ تعیین:</strong>{" "}
                  {details?.assignmentDate || "تعیین نشده"}
                </p>
                <p>
                  <strong>فایل قرارداد:</strong> {renderFileSection()}
                </p>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button className="modal-close-button" onClick={onClose}>
              بستن
            </button>
          </div>
        </div>
      </div>
      <JobsModal
        isOpen={isJobsModalOpen}
        onClose={() => setIsJobsModalOpen(false)}
        jobs={jobs}
      />
    </>
  );
};

export default DetailsModal;
