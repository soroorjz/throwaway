import React, { useState } from "react";
import { FaUser, FaTimes } from "react-icons/fa";
import "./CandidateCard.scss";
import CandidateModal from "./CandidateModal/CandidateModal";
import { Tooltip } from "react-tooltip";
import { useAuth } from "../../../../../AuthContext";

const CandidateCard = ({
  firstName,
  lastName,
  image,
  examTitle,
  jobDetails,
  skills = [],
  description = "",
  candidateData,
  onStatusSubmit,
  candidateStatuses = {},
  selectedChild,
}) => {
  const { user } = useAuth(); // دریافت اطلاعات کاربر
  const defaultIcon = <FaUser />;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const candidateId = `${firstName}-${lastName}`;
  const candidateStatus = candidateStatuses[candidateId] || {};
  const supervisorNote = candidateStatus.supervisorNote || "";
  const rejectedBySupervisor = candidateStatus.rejectedBySupervisor || false;

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleStatusSubmit = (
    status,
    needsPresence,
    candidateId,
    isFirstReview,
    supervisorNote,
    expertComment,
    rejectedBySupervisor
  ) => {
    // فقط اگر وضعیت جدید باعث حذف داوطلب از صفحه فعلی شود، انیمیشن حذف را فعال کن
    if (
      selectedChild === "رد شده" &&
      status === "rejected" &&
      rejectedBySupervisor
    ) {
      // عدم نیاز به انیمیشن حذف، چون داوطلب در همان صفحه می‌ماند
      onStatusSubmit(
        status,
        needsPresence,
        candidateId,
        isFirstReview,
        supervisorNote,
        expertComment,
        rejectedBySupervisor
      );
    } else {
      setIsRemoving(true);
      setTimeout(() => {
        onStatusSubmit(
          status,
          needsPresence,
          candidateId,
          isFirstReview,
          supervisorNote,
          expertComment,
          rejectedBySupervisor
        );
        setIsRemoving(false); // بازگشت به حالت عادی بعد از انیمیشن
      }, 300);
    }
  };

  if (isRemoving) {
    return null;
  }

  return (
    <>
      <div className={`candidate-card`}>
        <div className="candidate-card__image">
          {image ? (
            <img src={image} alt={`${firstName} ${lastName}`} />
          ) : (
            <span className="candidate-card__default-icon">{defaultIcon}</span>
          )}
          {rejectedBySupervisor && (
            <>
              <span
                className="candidate-card__reject-icon"
                data-tooltip-id={`reject-tooltip-${candidateId}`}
                data-tooltip-content="رد شده توسط ناظر"
              >
                <FaTimes />
              </span>
              <Tooltip
                id={`reject-tooltip-${candidateId}`}
                place="top"
                effect="solid"
                className="candidate-card__tooltip"
              />
            </>
          )}
        </div>
        <h3 className="candidate-card__name">{`${firstName} ${lastName}`}</h3>
        {/* {supervisorNote && (
          <p className="candidate-card__supervisor-note">{supervisorNote}</p>
        )} */}
        <div className="candidate-card__divider"></div>
        {user?.role !== "کاربر سازمان اداری و استخدامی" && (
          <button
            className={`candidate-card__button ${
              rejectedBySupervisor ? "candidate-card__button--rejected" : ""
            }`}
            onClick={handleOpenModal}
            // disabled={rejectedBySupervisor}
          >
            بررسی
          </button>
        )}
      </div>
      <CandidateModal
        candidateData={candidateData}
        jobDetails={jobDetails}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        candidate={{ firstName, lastName }}
        examTitle={examTitle}
        onStatusSubmit={handleStatusSubmit}
        resetForm={() => setIsModalOpen(false)}
        selectedChild={selectedChild}
        candidateStatuses={candidateStatuses}
      />
    </>
  );
};

export default CandidateCard;
