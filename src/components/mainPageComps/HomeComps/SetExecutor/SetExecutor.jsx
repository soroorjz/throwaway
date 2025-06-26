import React, { useState, useEffect } from "react";
import "./SetExecutor.scss";
import AssignModal from "./AssignModal/AssignModal";
import DetailsModal from "./DetailsModal/DetailsModal";
import moment from "jalali-moment";
import { initialExamsData } from "./initialExamsData";
import { useAuth } from "../../../../AuthContext"; // اضافه شده برای دریافت نقش کاربر

const SetExecutor = () => {
  const { user } = useAuth(); // دریافت اطلاعات کاربر
  const loadFromLocalStorage = () => {
    try {
      const savedAssigned = localStorage.getItem("assignedExams");
      const savedUnassigned = localStorage.getItem("unassignedExams");
      const savedDetails = localStorage.getItem("examDetails");
      const savedJobs = localStorage.getItem("examJobs");

      if (savedAssigned && savedUnassigned && savedDetails && savedJobs) {
        const loadedData = {
          assignedExams: JSON.parse(savedAssigned),
          unassignedExams: JSON.parse(savedUnassigned),
          examDetails: JSON.parse(savedDetails),
          examJobs: JSON.parse(savedJobs),
        };
        console.log("Loaded from localStorage:", loadedData);
        return loadedData;
      }
    } catch (error) {
      console.error("Error loading from localStorage:", error);
    }

    console.log("Using initialExamsData:", initialExamsData);
    if (!initialExamsData || !Array.isArray(initialExamsData)) {
      console.error("initialExamsData is not an array:", initialExamsData);
      return {
        assignedExams: [],
        unassignedExams: [],
        examDetails: {},
        examJobs: {},
      };
    }

    const assignedExams = initialExamsData
      .filter((exam) => exam.assigned)
      .map((exam) => exam.name);
    const unassignedExams = initialExamsData
      .filter((exam) => !exam.assigned)
      .map((exam) => exam.name);
    const examDetails = initialExamsData.reduce((acc, exam) => {
      acc[exam.name] = exam.details;
      return acc;
    }, {});
    const examJobs = initialExamsData.reduce((acc, exam) => {
      acc[exam.name] = exam.jobs;
      return acc;
    }, {});

    const initialData = {
      assignedExams,
      unassignedExams,
      examDetails,
      examJobs,
    };
    console.log("Initialized from initialExamsData:", initialData);
    return initialData;
  };

  const initialData = loadFromLocalStorage();
  const [assignedExams, setAssignedExams] = useState(initialData.assignedExams);
  const [unassignedExams, setUnassignedExams] = useState(
    initialData.unassignedExams
  );
  const [examDetails, setExamDetails] = useState(initialData.examDetails);
  const [examJobs, setExamJobs] = useState(initialData.examJobs);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedExam, setSelectedExam] = useState(null);
  const [selectedExamForDetails, setSelectedExamForDetails] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem("assignedExams", JSON.stringify(assignedExams));
      localStorage.setItem("unassignedExams", JSON.stringify(unassignedExams));
      localStorage.setItem("examDetails", JSON.stringify(examDetails));
      localStorage.setItem("examJobs", JSON.stringify(examJobs));
      console.log("Saved to localStorage:", {
        assignedExams,
        unassignedExams,
        examDetails,
        examJobs,
      });
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }
  }, [assignedExams, unassignedExams, examDetails, examJobs]);

  const openModal = (exam) => {
    if (!exam) {
      console.error("Attempted to open AssignModal with invalid exam:", exam);
      return;
    }
    console.log("Opening AssignModal for exam:", exam, "Jobs:", examJobs[exam]);
    setSelectedExam(exam);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    console.log("Closing AssignModal, resetting selectedExam");
    setIsModalOpen(false);
    setSelectedExam(null);
  };

  const handleConfirm = (exam, executor, file) => {
    console.log("Confirming exam:", exam, "with executor:", executor);
    const currentDate = moment().format("jYYYY/jMM/jDD");
    setUnassignedExams((prev) => prev.filter((e) => e !== exam));
    setAssignedExams((prev) => [...prev, exam]);
    setExamDetails((prev) => ({
      ...prev,
      [exam]: { executor, file, assignmentDate: currentDate },
    }));
    closeModal();
  };

  const openDetailsModal = (exam) => {
    if (!exam) {
      console.error("Attempted to open DetailsModal with invalid exam:", exam);
      return;
    }
    console.log(
      "Opening DetailsModal for exam:",
      exam,
      "Jobs:",
      examJobs[exam]
    );
    setSelectedExamForDetails(exam);
    setIsDetailsModalOpen(true);
  };

  const closeDetailsModal = () => {
    console.log("Closing DetailsModal, resetting selectedExamForDetails");
    setIsDetailsModalOpen(false);
    setSelectedExamForDetails(null);
  };

  return (
    <div className="set-executor-container">
      <h1 className="set-executor-title">تعیین مجری</h1>
      <p className="set-executor-desc">
        در این صفحه می‌توان برای برگزاری ارزیابی تکمیلی آزمون‌ها، مجری
        برگزارکننده را تعیین نمود.
      </p>
      <div className="set-executor-grid">
        <div className="set-executor-column">
          <h2 className="set-executor-column-title">آزمون‌های فاقد مجری</h2>
          {unassignedExams.map((exam, index) => (
            <div key={index} className="set-executor-exam-item">
              <div className="set-executor-column-desc">
                <span className="set-executor-exam-name">{exam}</span>
              </div>
              {user?.role !== "کاربر سازمان اداری و استخدامی" && (
                <button
                  className="set-executor-button-assign"
                  onClick={() => openModal(exam)}
                >
                  تعیین
                </button>
              )}
            </div>
          ))}
        </div>
        <div className="set-executor-column">
          <h2 className="set-executor-column-title">آزمون‌های دارای مجری</h2>
          {assignedExams.map((exam, index) => (
            <div key={index} className="set-executor-exam-item">
              <div className="set-executor-column-desc">
                <span className="set-executor-exam-name">{exam}</span>
                {examDetails[exam]?.assignmentDate && (
                  <span className="set-executor-exam-date">
                    {examDetails[exam].assignmentDate}
                  </span>
                )}
              </div>
              <button
                className="set-executor-button-show"
                onClick={() => openDetailsModal(exam)}
              >
                نمایش
              </button>
            </div>
          ))}
        </div>
      </div>
      {isModalOpen && selectedExam && (
        <AssignModal
          isOpen={isModalOpen}
          onClose={closeModal}
          examName={selectedExam}
          onConfirm={handleConfirm}
          jobs={examJobs[selectedExam] || []}
        />
      )}
      {isDetailsModalOpen && selectedExamForDetails && (
        <DetailsModal
          isOpen={isDetailsModalOpen}
          onClose={closeDetailsModal}
          examName={selectedExamForDetails}
          details={examDetails[selectedExamForDetails] || {}}
          jobs={examJobs[selectedExamForDetails] || []}
        />
      )}
    </div>
  );
};

export default SetExecutor;
