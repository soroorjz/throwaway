import React, { useState, useEffect } from "react";
import "./CandidateModal.scss";
import { FaCircleExclamation } from "react-icons/fa6";
import RequiredDocumentsModal from "./RequiredDocumentsModal/RequiredDocumentsModal";
import PresenceDetailsModal from "./PresenceDetailsModal/PresenceDetailsModal";
import { Tooltip } from "react-tooltip";
import CommentModal from "./CommentModal";
import Stepper from "./Stepper";

const CandidateModal = ({
  isOpen,
  onClose,
  candidate,
  examTitle,
  jobDetails,
  candidateData,
  onStatusSubmit,
  resetForm,
  selectedChild,
  candidateStatuses,
  organizationName,
}) => {
  const candidateId = `${candidate.firstName}-${candidate.lastName}`;
  const [candidateStatusesState, setCandidateStatusesState] = useState(() => {
    const saved = localStorage.getItem("candidateStatuses");
    return saved ? JSON.parse(saved) : {};
  });
  const [needsPresence, setNeedsPresence] = useState(() => {
    const saved = localStorage.getItem(`needsPresence_${candidateId}`);
    return saved ? JSON.parse(saved) : false;
  });
  const [expertCommentModalOpen, setExpertCommentModalOpen] = useState(false);
  const [supervisorCommentModalOpen, setSupervisorCommentModalOpen] =
    useState(false);
  const [supervisorStatus, setSupervisorStatus] = useState("");
  const [currentStep, setCurrentStep] = useState(1);

  const [status, setStatus] = useState(() => {
    return candidateStatusesState[candidateId]?.status || "";
  });

  const [requiredDocs, setRequiredDocs] = useState(() => {
    const saved = localStorage.getItem(`requiredDocs_${candidateId}`);
    return saved ? JSON.parse(saved) : null;
  });
  const [presenceDetails, setPresenceDetails] = useState(() => {
    const saved = localStorage.getItem(`presenceDetails_${candidateId}`);
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (isOpen) {
      console.log("Loading data for candidateId:", candidateId);
      console.log("candidateStatuses:", candidateStatuses);
      console.log("Status:", candidateStatuses[candidateId]?.status);
      console.log("RequiredDocs from state:", requiredDocs);
      console.log("PresenceDetails from state:", presenceDetails);

      const savedDocs = localStorage.getItem(`requiredDocs_${candidateId}`);
      if (savedDocs) {
        const parsedDocs = JSON.parse(savedDocs);
        setRequiredDocs(
          parsedDocs && Object.keys(parsedDocs).length ? parsedDocs : null
        );
      }
      const savedDetails = localStorage.getItem(
        `presenceDetails_${candidateId}`
      );
      if (savedDetails) {
        const parsedDetails = JSON.parse(savedDetails);
        setPresenceDetails(
          parsedDetails && Object.keys(parsedDetails).length
            ? parsedDetails
            : null
        );
      }

      setCandidateStatusesState((prev) => ({
        ...prev,
        ...candidateStatuses,
      }));

      setStatus(candidateStatuses[candidateId]?.status || "");
      setSupervisorStatus("");
      setCurrentStep(1);
    }
  }, [isOpen, candidateId, candidateStatuses]);

  const handleCloseModal = () => {
    localStorage.setItem(
      "candidateStatuses",
      JSON.stringify(candidateStatusesState)
    );
    localStorage.setItem(
      `requiredDocs_${candidateId}`,
      JSON.stringify(requiredDocs)
    );
    localStorage.setItem(
      `needsPresence_${candidateId}`,
      JSON.stringify(needsPresence)
    );
    localStorage.setItem(
      `presenceDetails_${candidateId}`,
      JSON.stringify(presenceDetails)
    );
    console.log("Saved to localStorage:", {
      candidateStatusesState,
      requiredDocs,
      needsPresence,
      presenceDetails,
    });
    onClose();
  };

  const handleStatusChange = (e) => {
    const newStatus = e.target.value;
    setStatus(newStatus);
    if (newStatus === "rejected") {
      setNeedsPresence(false);
      setPresenceDetails(null);
      localStorage.removeItem(`needsPresence_${candidateId}`);
      localStorage.removeItem(`presenceDetails_${candidateId}`);
    }
    setCandidateStatusesState((prev) => {
      const isFirstReview = !prev[candidateId]?.reviewed;
      const updatedStatuses = {
        ...prev,
        [candidateId]: {
          ...prev[candidateId],
          status: newStatus,
          needsPresence:
            newStatus === "rejected" ? false : prev[candidateId]?.needsPresence,
        },
      };
      localStorage.setItem(
        "candidateStatuses",
        JSON.stringify(updatedStatuses)
      );
      return updatedStatuses;
    });

    if (newStatus === "defective") {
      setIsRequiredDocsModalOpen(true);
    }
  };

  const handleSupervisorStatusChange = (e) => {
    const newStatus = e.target.value;
    setSupervisorStatus(newStatus);
  };

  const handleNeedsPresenceChange = (e) => {
    const isChecked = e.target.checked;
    setNeedsPresence(isChecked);
    setCandidateStatusesState((prev) => ({
      ...prev,
      [candidateId]: {
        ...prev[candidateId],
        needsPresence: isChecked,
      },
    }));
    localStorage.setItem(
      `needsPresence_${candidateId}`,
      JSON.stringify(isChecked)
    );
    if (isChecked) {
      setIsPresenceDetailsModalOpen(true);
    } else {
      setPresenceDetails(null);
      localStorage.removeItem(`presenceDetails_${candidateId}`);
    }
  };

  const isPresenceDisabled = status === "rejected";

  const handleExpertCommentSubmit = (comment) => {
    setCandidateStatusesState((prev) => {
      const updatedStatuses = {
        ...prev,
        [candidateId]: {
          ...prev[candidateId],
          expertComment: comment,
        },
      };
      localStorage.setItem(
        "candidateStatuses",
        JSON.stringify(updatedStatuses)
      );
      return updatedStatuses;
    });
  };

  const handleSupervisorCommentSubmit = (comment) => {
    setCandidateStatusesState((prev) => {
      const updatedStatuses = {
        ...prev,
        [candidateId]: {
          ...prev[candidateId],
          supervisorNote: comment,
        },
      };
      localStorage.setItem(
        "candidateStatuses",
        JSON.stringify(updatedStatuses)
      );
      return updatedStatuses;
    });
  };

  const handleSubmit = () => {
    if (status || supervisorStatus) {
      const isAlreadyReviewed = !!candidateStatusesState[candidateId]?.reviewed;
      let finalStatus = status;
      let supervisorNote =
        candidateStatusesState[candidateId]?.supervisorNote || "";
      const expertComment =
        candidateStatusesState[candidateId]?.expertComment || "";
      let rejectedBySupervisor = false;

      if (supervisorStatus) {
        if (supervisorStatus === "approved") {
          finalStatus = "تأیید نهایی";
        } else if (supervisorStatus === "rejected") {
          finalStatus = "rejected";
          supervisorNote = supervisorNote || "عدم تأیید توسط ناظر";
          rejectedBySupervisor = true;
        }
      }

      onStatusSubmit(
        finalStatus,
        needsPresence,
        candidateId,
        !isAlreadyReviewed,
        supervisorNote,
        expertComment,
        rejectedBySupervisor
      );
      setCandidateStatusesState((prev) => {
        const updatedStatuses = {
          ...prev,
          [candidateId]: {
            ...prev[candidateId],
            status: finalStatus,
            needsPresence,
            reviewed: true,
            requiredDocs,
            presenceDetails,
            supervisorNote,
            expertComment,
            rejectedBySupervisor,
          },
        };
        localStorage.setItem(
          "candidateStatuses",
          JSON.stringify(updatedStatuses)
        );
        return updatedStatuses;
      });
      onClose();
    }
  };

  const handleRequiredDocsSubmit = (docsData) => {
    setRequiredDocs(docsData);
    setCandidateStatusesState((prev) => {
      const updatedStatuses = {
        ...prev,
        [candidateId]: {
          ...prev[candidateId],
          requiredDocs: docsData,
        },
      };
      localStorage.setItem(
        "candidateStatuses",
        JSON.stringify(updatedStatuses)
      );
      localStorage.setItem(
        `requiredDocs_${candidateId}`,
        JSON.stringify(docsData)
      );
      return updatedStatuses;
    });
    setIsRequiredDocsModalOpen(false);
  };

  const handlePresenceDetailsSubmit = (detailsData) => {
    setPresenceDetails(detailsData);
    setCandidateStatusesState((prev) => {
      const updatedStatuses = {
        ...prev,
        [candidateId]: {
          ...prev[candidateId],
          presenceDetails: detailsData,
        },
      };
      localStorage.setItem(
        "candidateStatuses",
        JSON.stringify(updatedStatuses)
      );
      localStorage.setItem(
        `presenceDetails_${candidateId}`,
        JSON.stringify(detailsData)
      );
      return updatedStatuses;
    });
    setIsPresenceDetailsModalOpen(false);
  };

  const handleWarningClick = (e) => {
    console.log("Warning click triggered", { status, requiredDocs });
    if (
      status === "defective" &&
      requiredDocs &&
      Object.keys(requiredDocs).length > 0
    ) {
      setIsRequiredDocsModalOpen(true);
    }
  };

  const handlePresenceDetailsClick = (e) => {
    console.log("Presence details click triggered", {
      needsPresence,
      presenceDetails,
    });
    if (
      needsPresence &&
      presenceDetails &&
      Object.keys(presenceDetails).length > 0
    ) {
      setIsPresenceDetailsModalOpen(true);
    }
  };

  const handlePresenceDetailsClose = () => {
    setIsPresenceDetailsModalOpen(false);
  };

  const [isRequiredDocsModalOpen, setIsRequiredDocsModalOpen] = useState(false);
  const [isPresenceDetailsModalOpen, setIsPresenceDetailsModalOpen] =
    useState(false);

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="candidate-modal__overlay">
        <div className="candidate-modal__content">
          <div className="candidate-modal__main-content">
            <button
              className="candidate-modal__close-button"
              onClick={handleCloseModal}
            >
              ×
            </button>
            <div className="candidate-modal__body-wrapper">
              {currentStep === 1 && (
                <div className="candidate-modal__section">
                  <h3 className="candidate-modal__section-title">
                    شرایط شغل-آزمون ثبت‌نام شده
                  </h3>
                  <div className="candidate-modal__conditions-grid">
                    <p className="candidate-modalTitle">{examTitle}</p>
                    <div className="conditions-grid__items">
                      {/* <div className="conditions-grid__item">
                        <strong>دستگاه:</strong>{" "}
                        <span>{organizationName || "-"}</span>
                      </div> */}
                      <div className="conditions-grid__item">
                        <strong>استان:</strong>{" "}
                        <span>{jobDetails?.province || "-"}</span>
                      </div>
                      <div className="conditions-grid__item">
                        <strong>شرایط اختصاصی:</strong>{" "}
                        <span>{jobDetails?.specificConditions || "-"}</span>
                      </div>
                      {/* <div className="conditions-grid__item">
                        <strong>شغل:</strong>{" "}
                        <span>{jobDetails?.jobName || "-"}</span>
                      </div> */}
                      <div className="conditions-grid__item">
                        <strong>محل:</strong>{" "}
                        <span>{jobDetails?.jobLocation || "-"}</span>
                      </div>
                      <div className="conditions-grid__item">
                        <strong>جنسیت:</strong>{" "}
                        <span>{jobDetails?.gender || "-"}</span>
                      </div>
                      <div className="conditions-grid__item">
                        <strong>ظرفیت:</strong>{" "}
                        <span>
                          {jobDetails?.capacity
                            ? jobDetails.capacity.toLocaleString("fa-IR")
                            : "-"}
                        </span>
                      </div>
                      <div className="conditions-grid__item">
                        <strong>سهمیه:</strong>{" "}
                        <span>{jobDetails?.quota || "-"}</span>
                      </div>
                      <div className="conditions-grid__item">
                        <strong>مقطع:</strong>{" "}
                        <span>{jobDetails?.educationLevel || "-"}</span>
                      </div>
                      <div className="conditions-grid__item">
                        <strong>رشته:</strong>{" "}
                        <span>{jobDetails?.fieldOfStudy || "-"}</span>
                      </div>
                      <div className="conditions-grid__item">
                        <strong>چندبرابر ظرفیت:</strong>{" "}
                        <span>
                          {jobDetails?.multiplierCapacity
                            ? jobDetails.multiplierCapacity.toLocaleString(
                                "fa-IR"
                              )
                            : "-"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {currentStep === 2 && (
                <div className="candidate-modal__section">
                  <h3 className="candidate-modal__section-title">
                    شرایط داوطلب
                  </h3>
                  <div className="candidate-modal__conditions-grid">
                    <div className="conditions-grid__items">
                      <div className="conditions-grid__item">
                        <strong>نام:</strong>{" "}
                        <span>{candidateData?.firstName || "-"}</span>
                      </div>
                      <div className="conditions-grid__item">
                        <strong>نام خانوادگی:</strong>{" "}
                        <span>{candidateData?.lastName || "-"}</span>
                      </div>
                      <div className="conditions-grid__item">
                        <strong>نام پدر:</strong>{" "}
                        <span>{candidateData?.fatherName || "-"}</span>
                      </div>
                      <div className="conditions-grid__item">
                        <strong>کد ملی:</strong>{" "}
                        <span>{candidateData?.nationalId || "-"}</span>
                      </div>
                      <div className="conditions-grid__item">
                        <strong>نمره آزمون:</strong>{" "}
                        <span>
                          {candidateData?.examScore
                            ? candidateData.examScore.toLocaleString("fa-IR")
                            : "-"}
                        </span>
                      </div>
                      <div className="conditions-grid__item">
                        <strong>رتبه:</strong>{" "}
                        <span>
                          {candidateData?.rank
                            ? candidateData.rank.toLocaleString("fa-IR")
                            : "-"}
                        </span>
                      </div>
                      <div className="conditions-grid__item">
                        <strong>سن:</strong>{" "}
                        <span>
                          {candidateData?.age
                            ? candidateData.age.toLocaleString("fa-IR")
                            : "-"}
                        </span>
                      </div>
                      <div className="conditions-grid__item">
                        <strong>جنسیت:</strong>{" "}
                        <span>{candidateData?.gender || "-"}</span>
                      </div>
                      <div className="conditions-grid__item">
                        <strong>وضعیت خدمت:</strong>{" "}
                        <span>{candidateData?.dutyStatus || "-"}</span>
                      </div>
                      <div className="conditions-grid__item">
                        <strong>سهمیه:</strong>{" "}
                        <span>{candidateData?.quota || "-"}</span>
                      </div>
                      <div className="conditions-grid__item">
                        <strong>مقطع تحصیلی:</strong>{" "}
                        <span>{candidateData?.educationLevel || "-"}</span>
                      </div>
                      <div className="conditions-grid__item">
                        <strong>رشته تحصیلی:</strong>{" "}
                        <span>{candidateData?.fieldOfStudy || "-"}</span>
                      </div>
                      <div className="conditions-grid__item">
                        <strong>شماره تماس:</strong>{" "}
                        <span>{candidateData?.phoneNumber || "-"}</span>
                      </div>
                      <div className="conditions-grid__item">
                        <strong>آدرس:</strong>{" "}
                        <span>{candidateData?.address || "-"}</span>
                      </div>
                      <div className="conditions-grid__item">
                        <strong>سابقه کار:</strong>{" "}
                        <span>{candidateData?.workExperience || "-"}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {currentStep === 3 && (
                <div className="candidate-modal__section">
                  <h3 className="candidate-modal__section-title">
                    مدارک بارگذاری شده
                  </h3>
                  <div className="candidate-modal__documents-grid">
                    <div className="candidate-modal__document-item candidate-image">
                      {/* <img
                        src={candidateData?.documents?.nationalCardImage || ""}
                        alt="تصویر کارت ملی"
                      /> */}
                      <p>تصویر کارت ملی</p>
                      <button className="candidate-modal__document-button">
                        دانلود
                      </button>
                    </div>
                    <div className="candidate-modal__document-item candidate-image">
                      {/* <img
                        src={candidateData?.documents?.nationalCardImage || ""}
                        alt="کارت ملی"
                      /> */}
                      <p>کارت ملی</p>
                      <button className="candidate-modal__document-button">
                        دانلود
                      </button>
                    </div>
                    <div className="candidate-modal__document-item candidate-image">
                      {/* <img
                        src={candidateData?.documents?.degreeImage || ""}
                        alt="تصویر مدرک تحصیلی"
                      /> */}
                      <p>تصویر مدرک تحصیلی</p>
                      <button className="candidate-modal__document-button">
                        دانلود
                      </button>
                    </div>
                    <div className="candidate-modal__document-item candidate-image">
                      {/* <img
                        src={
                          candidateData?.documents?.birthCertificatePage1 || ""
                        }
                        alt="تصویر صفحه اول شناسنامه"
                      /> */}
                      <p>تصویر صفحه اول شناسنامه</p>
                      <button className="candidate-modal__document-button">
                        دانلود
                      </button>
                    </div>
                    <div className="candidate-modal__document-item candidate-image">
                      {/* <img
                        src={
                          candidateData?.documents?.birthCertificatePage2 || ""
                        }
                        alt="تصویر صفحه دوم شناسنامه"
                      /> */}
                      <p>تصویر صفحه دوم شناسنامه</p>
                      <button className="candidate-modal__document-button">
                        دانلود
                      </button>
                    </div>
                    <div className="candidate-modal__document-item candidate-image">
                      {/* <img
                        src={candidateData?.documents?.personalPhoto || ""}
                        alt="عکس پرسنلی"
                      /> */}
                      <p>عکس پرسنلی</p>
                      <button className="candidate-modal__document-button">
                        دانلود
                      </button>
                    </div>
                    <div className="candidate-modal__document-item candidate-image">
                      {/* <img
                        src={candidateData?.documents?.otherDocuments || ""}
                        alt="تصویر سایر مدارک"
                      /> */}
                      <p>تصویر سایر مدارک</p>
                      <button className="candidate-modal__document-button">
                        دانلود
                      </button>
                    </div>
                  </div>
                </div>
              )}
              {currentStep === 4 && (
                <div className="candidate-modal__section">
                  <div className="candidate-modal__footer">
                    <h3>تعیین وضعیت توسط کارشناس</h3>
                    <div className="candidate-modal__status-options">
                      <label className="candidate-modal__status-option">
                        <input
                          type="radio"
                          name="status"
                          value="approved"
                          checked={status === "approved"}
                          onChange={handleStatusChange}
                        />
                        مورد تأیید
                      </label>
                      <label className="candidate-modal__status-option">
                        <input
                          type="radio"
                          name="status"
                          value="rejected"
                          checked={status === "rejected"}
                          onChange={handleStatusChange}
                        />
                        عدم تأیید
                      </label>
                      <label className="candidate-modal__status-option">
                        <input
                          type="radio"
                          name="status"
                          value="defective"
                          checked={status === "defective"}
                          onChange={handleStatusChange}
                        />
                        دارای نواقص
                        {status === "defective" &&
                          requiredDocs &&
                          Object.keys(requiredDocs).length > 0 && (
                            <>
                              <span
                                className="candidate-modal__warning-icon "
                                onClick={handleWarningClick}
                                data-tooltip-id={`tooltip-${candidateId}`}
                                data-tooltip-content="توضیحات نقص مدارک"
                              >
                                <FaCircleExclamation />
                              </span>
                              <Tooltip
                                id={`tooltip-${candidateId}`}
                                place="top"
                                className="candidate-modal__tooltip"
                              />
                            </>
                          )}
                      </label>
                    </div>
                    <button
                      className="candidate-modal__button candidate-modal__button--comment"
                      onClick={() => setExpertCommentModalOpen(true)}
                    >
                      توضیحات کارشناس
                    </button>
                    <div className="candidate-modal__presence-option">
                      <label className="candidate-modal__presence-label">
                        <input
                          type="checkbox"
                          checked={needsPresence}
                          onChange={handleNeedsPresenceChange}
                          disabled={isPresenceDisabled}
                        />
                        نیاز به حضور
                      </label>
                      {needsPresence &&
                        presenceDetails &&
                        Object.keys(presenceDetails).length > 0 && (
                          <>
                            <span
                              className="candidate-modal__warning-icon"
                              onClick={handlePresenceDetailsClick}
                              data-tooltip-id={`presence-tooltip-${candidateId}`}
                              data-tooltip-content="جزئیات زمان و مکان حضور"
                            >
                              <FaCircleExclamation />
                            </span>
                            <Tooltip
                              id={`presence-tooltip-${candidateId}`}
                              place="top"
                              className="candidate-modal__tooltip"
                            />
                          </>
                        )}
                    </div>
                    {selectedChild !== "بررسی نشده" && (
                      <div className="candidate-modal__supervisor-section">
                        <h3>تعیین وضعیت توسط ناظر</h3>
                        <div className="candidate-modal__status-options">
                          <label className="candidate-modal__status-option">
                            <input
                              type="radio"
                              name="supervisorStatus"
                              value="approved"
                              checked={supervisorStatus === "approved"}
                              onChange={handleSupervisorStatusChange}
                            />
                            مورد تأیید
                          </label>
                          <label className="candidate-modal__status-option">
                            <input
                              type="radio"
                              name="supervisorStatus"
                              value="rejected"
                              checked={supervisorStatus === "rejected"}
                              onChange={handleSupervisorStatusChange}
                            />
                            عدم تأیید
                          </label>
                        </div>
                        <button
                          className="candidate-modal__button candidate-modal__button--comment"
                          onClick={() => setSupervisorCommentModalOpen(true)}
                        >
                          توضیحات ناظر
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            <div className="candidate-modal__stepper-wrapper">
              <Stepper
                currentStep={currentStep}
                onStepChange={setCurrentStep}
              />
            </div>
          </div>
          <div className="candidate-modal__navigation">
            {currentStep > 1 && (
              <button
                className="candidate-modal__button candidate-modal__button--previous"
                onClick={handlePrevious}
              >
                قبلی
              </button>
            )}
            {currentStep < 4 && (
              <button
                className="candidate-modal__button candidate-modal__button--next"
                onClick={handleNext}
              >
                بعدی
              </button>
            )}
            {currentStep === 4 && (
              <button
                className="candidate-modal__button candidate-modal__button--submit"
                onClick={handleSubmit}
                disabled={!status && !supervisorStatus}
              >
                ثبت
              </button>
            )}
          </div>
        </div>
      </div>

      <RequiredDocumentsModal
        isOpen={isRequiredDocsModalOpen}
        onClose={() => setIsRequiredDocsModalOpen(false)}
        onSubmit={handleRequiredDocsSubmit}
        initialData={requiredDocs}
      />
      <PresenceDetailsModal
        isOpen={isPresenceDetailsModalOpen}
        onClose={handlePresenceDetailsClose}
        onSubmit={handlePresenceDetailsSubmit}
        initialData={presenceDetails}
      />
      <CommentModal
        isOpen={expertCommentModalOpen}
        onClose={() => setExpertCommentModalOpen(false)}
        onSubmit={handleExpertCommentSubmit}
        initialComment={
          candidateStatusesState[candidateId]?.expertComment || ""
        }
        title="توضیحات کارشناس"
        isReadOnly={selectedChild !== "بررسی نشده"}
      />
      <CommentModal
        isOpen={supervisorCommentModalOpen}
        onClose={() => setSupervisorCommentModalOpen(false)}
        onSubmit={handleSupervisorCommentSubmit}
        initialComment={
          candidateStatusesState[candidateId]?.supervisorNote || ""
        }
        title="توضیحات ناظر"
        isReadOnly={false}
      />
    </>
  );
};

export default CandidateModal;
