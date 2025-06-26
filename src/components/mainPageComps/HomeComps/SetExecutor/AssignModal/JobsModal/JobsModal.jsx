import React from "react";
import "./JobsModal.scss";

const JobsModal = ({ isOpen, onClose, jobs }) => {
  if (!isOpen) return null;

  return (
    <div className="jobs-modal-overlay">
      <div className="jobs-modal-container">
        <div className="jobs-modal-header">
          <h2 className="jobs-modal-title">عناوین مشاغل</h2>
        </div>
        <div className="jobs-modal-body">
          <ul className="jobs-list">
            {jobs && jobs.length > 0 ? (
              jobs.map((job, index) => (
                <li key={index} className="job-item">
                  {job.name} ({job.applicants} داوطلب)
                </li>
              ))
            ) : (
              <li className="job-item">هیچ شغلی تعریف نشده است</li>
            )}
          </ul>
        </div>
        <div className="jobs-modal-footer">
          <button className="jobs-modal-close-button" onClick={onClose}>
            بستن
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobsModal;
