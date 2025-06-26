import React, { useState, useEffect } from "react";
import examData from "../DocumentData.json";
import "./ArchiveReview.scss";
import CandidateCard from "../CandidateCard/CandidateCard";
import { FaCircleCheck } from "react-icons/fa6";
import { AnimatePresence, motion } from "framer-motion";
import "./ArchiveReview.scss";

const ArchiveReview = ({ setSelectedChild }) => {
    const [data] = useState(examData);
    const [candidateStatuses, setCandidateStatuses] = useState(() => {
      const saved = localStorage.getItem("candidateStatuses");
      return saved ? JSON.parse(saved) : {};
    });
    const [archivedExams, setArchivedExams] = useState([]);
    const [selectedTitle, setSelectedTitle] = useState("");
    const [selectedOrganization, setSelectedOrganization] = useState("");
    const [archiveTab, setArchiveTab] = useState("تأیید نهایی");
    const [candidates, setCandidates] = useState([]);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
  
    const isExamArchived = (exam) => {
      return exam.organizations.every((org) =>
        org.jobs.every((job) =>
          job.candidates.every((candidate) => {
            const candidateId = `${candidate.firstName}-${candidate.lastName}`;
            const status = candidateStatuses[candidateId]?.status;
            const rejectedBySupervisor =
              candidateStatuses[candidateId]?.rejectedBySupervisor;
            return (
              status === "تأیید نهایی" ||
              (status === "rejected" && rejectedBySupervisor)
            );
          })
        )
      );
    };
  
    // به‌روزرسانی لیست آزمون‌های بایگانی‌شده
    useEffect(() => {
      const filteredExams = data.filter(isExamArchived);
      setArchivedExams(filteredExams);
      if (filteredExams.length > 0) {
        setSelectedTitle(filteredExams[0].examTitle);
      } else {
        setSelectedTitle("");
        setSelectedOrganization("");
      }
    }, [data, candidateStatuses]);
  
    useEffect(() => {
      const selectedExam = archivedExams.find(
        (exam) => exam.examTitle === selectedTitle
      );
      if (selectedExam) {
        const organizations = selectedExam.organizations.map(
          (org) => org.organizationName
        );
        setSelectedOrganization(organizations[0] || "");
      }
    }, [selectedTitle, archivedExams]);
  
    const getFilteredCandidates = () => {
      const selectedExam = archivedExams.find(
        (exam) => exam.examTitle === selectedTitle
      );
      const selectedOrg = selectedExam?.organizations.find(
        (org) => org.organizationName === selectedOrganization
      );
      if (!selectedOrg) return [];
  
      const allCandidates = selectedOrg.jobs.flatMap((job) => job.candidates);
      return allCandidates.filter((candidate) => {
        const candidateId = `${candidate.firstName}-${candidate.lastName}`;
        const status = candidateStatuses[candidateId]?.status;
        const rejectedBySupervisor =
          candidateStatuses[candidateId]?.rejectedBySupervisor;
        if (archiveTab === "تأیید نهایی") {
          return status === "تأیید نهایی";
        } else if (archiveTab === "رد نهایی") {
          return status === "rejected" && rejectedBySupervisor;
        }
        return false;
      });
    };
  
    // به‌روزرسانی داوطلبان
    useEffect(() => {
      setCandidates(getFilteredCandidates());
    }, [selectedTitle, selectedOrganization, archiveTab, candidateStatuses]);
  
    // انیمیشن‌های مودال
    const modalVariants = {
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { duration: 0.3 } },
      exit: { opacity: 0, transition: { duration: 0.2 } },
    };
  
    return (
      <div className="document-review-container">
        <AnimatePresence>
          {showSuccessModal && (
            <motion.div
              className="document-review-successModal__overlay"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <motion.div
                className="document-review-successModal"
                variants={modalVariants}
              >
                <FaCircleCheck />
                <p>عملیات با موفقیت انجام شد</p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
  
        <div className="document-reviewSelectionPart">
          <div className="select-title">
            <select
              value={selectedTitle}
              onChange={(e) => {
                setSelectedTitle(e.target.value);
                const newExam = archivedExams.find(
                  (exam) => exam.examTitle === e.target.value
                );
                setSelectedOrganization(
                  newExam?.organizations[0]?.organizationName || ""
                );
              }}
            >
              {archivedExams.length === 0 ? (
                <option value="">هیچ آزمونی بایگانی نشده است</option>
              ) : (
                archivedExams.map((exam, index) => (
                  <option key={index} value={exam.examTitle}>
                    {exam.examTitle}
                  </option>
                ))
              )}
            </select>
          </div>
          {selectedTitle && (
            <div className="select-organization">
              <select
                value={selectedOrganization}
                onChange={(e) => setSelectedOrganization(e.target.value)}
              >
                {archivedExams
                  .find((exam) => exam.examTitle === selectedTitle)
                  ?.organizations.map((org, index) => (
                    <option key={index} value={org.organizationName}>
                      {org.organizationName}
                    </option>
                  ))}
              </select>
            </div>
          )}
        </div>
  
        {selectedTitle && (
          <div className="document-review__tabs">
            <button
              className={`document-review__tab ${
                archiveTab === "تأیید نهایی" ? "document-review__tab--active" : ""
              }`}
              onClick={() => setArchiveTab("تأیید نهایی")}
            >
              تأیید نهایی
            </button>
            <button
              className={`document-review__tab ${
                archiveTab === "رد نهایی" ? "document-review__tab--active" : ""
              }`}
              onClick={() => setArchiveTab("رد نهایی")}
            >
              رد نهایی
            </button>
          </div>
        )}
  
        <div className="document-review__candidates">
          {candidates.length === 0 ? (
            <p className="no-candidates">هیچ داوطلبی یافت نشد</p>
          ) : (
            candidates.map((candidate) => (
              <CandidateCard
                key={`${candidate.firstName}-${candidate.lastName}`}
                firstName={candidate.firstName}
                lastName={candidate.lastName}
                image={candidate.image}
                examTitle={selectedTitle}
                jobDetails={{}}
                candidateData={candidate}
                skills={[]}
                description=""
                candidateStatuses={candidateStatuses}
                organizationName={selectedOrganization}
                readOnly={true} 
              />
            ))
          )}
        </div>
      </div>
    );
  };
  
  export default ArchiveReview;