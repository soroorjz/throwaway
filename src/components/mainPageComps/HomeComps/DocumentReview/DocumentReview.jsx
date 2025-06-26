import React, { useState, useEffect } from "react";
import examData from "./DocumentData.json";
import { FaCircleCheck } from "react-icons/fa6";
import { IoNotifications } from "react-icons/io5";
import "./DocumentReview.scss";
import CandidateCard from "./CandidateCard/CandidateCard";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        {payload.map((entry, index) => (
          <p key={index} className="label">{`${
            entry.name
          }: ${entry.value.toLocaleString("fa-IR")} نفر`}</p>
        ))}
      </div>
    );
  }
  return null;
};

const DocumentReview = ({ selectedChild, setSelectedChild }) => {
  const [data, setData] = useState(examData)
  const [nonArchivedExams, setNonArchivedExams] = useState([]);
  const [selectedTitle, setSelectedTitle] = useState("");
  const [selectedOrganization, setSelectedOrganization] = useState("");
  const [activeTab, setActiveTab] = useState("");
  const [stats, setStats] = useState({
    totalCandidates: 0,
    notReviewed: 0,
    approved: 0,
    rejected: 0,
    defective: 0,
    finalized: 0,
    percentage: 0,
  });
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [candidates, setCandidates] = useState([]);
  const [candidateStatuses, setCandidateStatuses] = useState(() => {
    const saved = localStorage.getItem("candidateStatuses");
    return saved ? JSON.parse(saved) : {};
  });

  // تابع برای بررسی اینکه آیا آزمون بایگانی‌شده است
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

  // فیلتر کردن آزمون‌های غیربایگانی‌شده
  useEffect(() => {
    const filteredExams = data.filter((exam) => !isExamArchived(exam));
    setNonArchivedExams(filteredExams);
    if (filteredExams.length > 0 && !selectedTitle) {
      setSelectedTitle(filteredExams[0].examTitle);
    } else if (
      filteredExams.length > 0 &&
      !filteredExams.some((exam) => exam.examTitle === selectedTitle)
    ) {
      setSelectedTitle(filteredExams[0].examTitle);
    } else if (filteredExams.length === 0) {
      setSelectedTitle("");
      setSelectedOrganization("");
      setActiveTab("");
    }
  }, [data, candidateStatuses, selectedTitle]);

  const selectedExam = nonArchivedExams.find(
    (exam) => exam.examTitle === selectedTitle
  );
  const selectedOrg = selectedExam?.organizations.find(
    (org) => org.organizationName === selectedOrganization
  );
  const jobs = selectedOrg ? selectedOrg.jobs.map((job) => job.jobName) : [];
  const selectedJob = selectedOrg?.jobs.find(
    (job) => job.jobName === activeTab
  );
  const allCandidates = selectedJob ? selectedJob.candidates : [];

  useEffect(() => {
    if (selectedExam) {
      const organizations = selectedExam.organizations.map(
        (org) => org.organizationName
      );
      const firstOrg = organizations[0] || "";
      setSelectedOrganization(firstOrg);
      const firstJob = selectedExam.organizations[0]?.jobs[0]?.jobName || "";
      setActiveTab(firstJob);
    }
  }, [selectedExam]);

  useEffect(() => {
    console.log("Initial examData:", examData);
    console.log("DocumentReview - selectedChild:", selectedChild);
    console.log("DocumentReview - selectedTitle:", selectedTitle);
    console.log("DocumentReview - activeTab:", activeTab);
    console.log("DocumentReview - selectedExam:", selectedExam);
    console.log("DocumentReview - selectedJob:", selectedJob);
    console.log("DocumentReview - allCandidates:", allCandidates);
    console.log("DocumentReview - candidateStatuses:", candidateStatuses);
    console.log("DocumentReview - candidates:", candidates);
  }, [
    selectedChild,
    selectedTitle,
    activeTab,
    selectedExam,
    selectedJob,
    allCandidates,
    candidateStatuses,
    candidates,
  ]);

  const getFilteredCandidates = (statuses = candidateStatuses) => {
    if (!selectedJob) {
      console.log("No selectedJob, returning empty candidates");
      return [];
    }
    console.log(`Filtering for selectedChild: ${selectedChild}`);
    console.log(`Available candidates:`, allCandidates);
    const filtered = allCandidates.filter((candidate) => {
      const candidateId = `${candidate.firstName}-${candidate.lastName}`;
      const status = statuses[candidateId]?.status || "";
      const needsPresence = statuses[candidateId]?.needsPresence || false;
      console.log(
        `Filtering candidate ${candidateId}: status=${status}, needsPresence=${needsPresence}`
      );
      switch (selectedChild) {
        case "بررسی نشده":
          return !status && !needsPresence;
        case "تأیید شده":
          return status === "approved";
        case "رد شده":
          return status === "rejected";
        case "دارای نواقص":
          return status === "defective";
        case "نیاز به حضور":
          return needsPresence;
        case "دریافتی جدید":
          return candidate.hasNewSubmission === true;
        case "تأیید نهایی":
          console.log(
            `Checking for تأیید نهایی: candidateId=${candidateId}, status=${status}`
          );
          return status === "تأیید نهایی";
        default:
          console.log(`Unknown selectedChild: ${selectedChild}`);
          return false;
      }
    });

    console.log(`Filtered candidates for ${selectedChild}:`, filtered);
    return filtered;
  };

  useEffect(() => {
    if (selectedJob) {
      console.log("Updating candidates for selectedJob:", selectedJob.jobName);
      setStats({
        totalCandidates: selectedJob.stats.totalCandidates,
        notReviewed: selectedJob.stats.notReviewed,
        approved: selectedJob.stats.approved,
        rejected: selectedJob.stats.rejected,
        defective: selectedJob.stats.defective,
        finalized: selectedJob.stats.finalized || 0,
        percentage: selectedJob.stats.percentage,
      });
      const filteredCandidates = getFilteredCandidates();
      console.log("Setting candidates:", filteredCandidates);
      setCandidates(filteredCandidates);
    } else {
      console.log("No selectedJob, clearing candidates");
      setCandidates([]);
    }
  }, [selectedJob, candidateStatuses, data, selectedChild]);

  const handleStatusSubmit = (
    status,
    needsPresence,
    candidateId,
    isFirstReview,
    supervisorNote = "",
    expertComment = "",
    rejectedBySupervisor = false
  ) => {
    const currentStatus = candidateStatuses[candidateId]?.status || "";

    setStats((prevStats) => {
      const newStats = { ...prevStats };

      if (!isFirstReview && currentStatus) {
        if (currentStatus === "approved") newStats.approved -= 1;
        else if (currentStatus === "rejected") newStats.rejected -= 1;
        else if (currentStatus === "defective") newStats.defective -= 1;
        else if (currentStatus === "تأیید نهایی") newStats.finalized -= 1;
      }

      if (isFirstReview && newStats.notReviewed > 0) {
        newStats.notReviewed -= 1;
      }

      if (status === "approved") newStats.approved += 1;
      else if (status === "rejected") newStats.rejected += 1;
      else if (status === "defective") newStats.defective += 1;
      else if (status === "تأیید نهایی") newStats.finalized += 1;

      setData((prevData) => {
        const newData = [...prevData];
        const examIndex = newData.findIndex(
          (exam) => exam.examTitle === selectedTitle
        );
        if (examIndex !== -1) {
          const orgIndex = newData[examIndex].organizations.findIndex(
            (org) => org.organizationName === selectedOrganization
          );
          if (orgIndex !== -1) {
            const jobIndex = newData[examIndex].organizations[
              orgIndex
            ].jobs.findIndex((job) => job.jobName === activeTab);
            if (jobIndex !== -1) {
              newData[examIndex].organizations[orgIndex].jobs[jobIndex].stats =
                {
                  ...newStats,
                };
              const candidateIndex = newData[examIndex].organizations[
                orgIndex
              ].jobs[jobIndex].candidates.findIndex(
                (candidate) =>
                  `${candidate.firstName}-${candidate.lastName}` === candidateId
              );
              if (candidateIndex !== -1) {
                if (status === "تأیید نهایی" || status === "rejected") {
                  newData[examIndex].organizations[orgIndex].jobs[
                    jobIndex
                  ].candidates[candidateIndex].hasNewSubmission = false;
                }
              }
            }
          }
        }
        return newData;
      });

      return newStats;
    });

    setCandidateStatuses((prev) => {
      const updatedStatuses = {
        ...prev,
        [candidateId]: {
          ...prev[candidateId],
          status,
          needsPresence,
          reviewed: true,
          supervisorNote,
          expertComment,
          rejectedBySupervisor,
        },
      };
      localStorage.setItem(
        "candidateStatuses",
        JSON.stringify(updatedStatuses)
      );
      console.log("Updated candidateStatuses:", updatedStatuses);

      const updatedCandidates = getFilteredCandidates(updatedStatuses);
      setCandidates(updatedCandidates);
      console.log("Immediate updated candidates:", updatedCandidates);

      return updatedStatuses;
    });

    if (status === "defective") {
      setTimeout(() => {
        setData((prevData) => {
          const newData = [...prevData];
          const examIndex = newData.findIndex(
            (exam) => exam.examTitle === selectedTitle
          );
          if (examIndex !== -1) {
            const orgIndex = newData[examIndex].organizations.findIndex(
              (org) => org.organizationName === selectedOrganization
            );
            if (orgIndex !== -1) {
              const jobIndex = newData[examIndex].organizations[
                orgIndex
              ].jobs.findIndex((job) => job.jobName === activeTab);
              if (jobIndex !== -1) {
                const candidateIndex = newData[examIndex].organizations[
                  orgIndex
                ].jobs[jobIndex].candidates.findIndex(
                  (candidate) =>
                    `${candidate.firstName}-${candidate.lastName}` ===
                    candidateId
                );
                if (candidateIndex !== -1) {
                  newData[examIndex].organizations[orgIndex].jobs[
                    jobIndex
                  ].candidates[candidateIndex].hasNewSubmission = true;
                }
              }
            }
          }
          return newData;
        });
      }, 3000);
    }

    setShowSuccessModal(true);
    setTimeout(() => setShowSuccessModal(false), 2500);
  };

  const newSubmissionsCount = allCandidates.filter(
    (candidate) => candidate.hasNewSubmission === true
  ).length;

  const chartData = [
    {
      name: "وضعیت",
      "بررسی نشده": stats.notReviewed,
      "تأیید شده": stats.approved,
      "رد شده": stats.rejected,
      نواقص: stats.defective,
      "تأیید نهایی": stats.finalized,
    },
  ];

  const formatNumber = (num) => num.toLocaleString("fa-IR");

  const modalVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.2 } },
  };

  const handleNewSubmissionsClick = () => {
    setSelectedChild("دریافتی جدید");
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
              const newExam = nonArchivedExams.find(
                (exam) => exam.examTitle === e.target.value
              );
              const firstOrg =
                newExam?.organizations[0]?.organizationName || "";
              setSelectedOrganization(firstOrg);
              setActiveTab(newExam?.organizations[0]?.jobs[0]?.jobName || "");
            }}
          >
            {nonArchivedExams.length === 0 ? (
              <option value="">هیچ آزمونی در دسترس نیست</option>
            ) : (
              nonArchivedExams.map((exam, index) => (
                <option key={index} value={exam.examTitle}>
                  {exam.examTitle}
                </option>
              ))
            )}
          </select>
        </div>
        <div className="select-organization">
          <select
            value={selectedOrganization}
            onChange={(e) => {
              setSelectedOrganization(e.target.value);
              const org = selectedExam?.organizations.find(
                (org) => org.organizationName === e.target.value
              );
              setActiveTab(org?.jobs[0]?.jobName || "");
            }}
          >
            {selectedExam?.organizations.map((org, index) => (
              <option key={index} value={org.organizationName}>
                {org.organizationName}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="document-review__tabs">
        {jobs.map((job) => (
          <button
            key={job}
            className={`document-review__tab ${
              activeTab === job ? "document-review__tab--active" : ""
            }`}
            onClick={() => setActiveTab(job)}
          >
            {job}
          </button>
        ))}
      </div>
      <div className="document-review__item">
        <div className="document-notif" onClick={handleNewSubmissionsClick}>
          <IoNotifications className="notificationIcon" />
          <p>دریافتی جدید</p>
          {newSubmissionsCount > 0 && (
            <span className="new-submissions-count">{newSubmissionsCount}</span>
          )}
        </div>
        <div className="chart-container">
          <BarChart
            width={600}
            height={100}
            data={chartData}
            layout="vertical"
            margin={{ top: 20, right: 0, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              type="number"
              domain={[0, stats.totalCandidates]}
              tickFormatter={(value) => formatNumber(value)}
            />
            <YAxis dataKey="name" type="category" />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar
              dataKey="بررسی نشده"
              stackId="a"
              fill="#c0d5cf"
              radius={[0, 0, 0, 0]}
            />
            <Bar
              dataKey="تأیید شده"
              stackId="a"
              fill="#04364a"
              radius={[0, 0, 0, 0]}
            />
            <Bar
              dataKey="رد شده"
              stackId="a"
              fill="#e55604"
              radius={[0, 0, 0, 0]}
            />
            <Bar
              dataKey="نواقص"
              stackId="a"
              fill="#6b7280"
              radius={[0, 0, 0, 0]}
            />
            <Bar
              dataKey="تأیید نهایی"
              stackId="a"
              fill="#2ecc71"
              radius={[0, 10, 10, 0]}
            />
          </BarChart>
        </div>
      </div>
      <div className="document-review__candidates">
        {candidates.length === 0 ? (
          <p className="no-candidates">هیچ داوطلبی یافت نشد</p>
        ) : (
          candidates.map((candidate, index) => (
            <CandidateCard
              key={`${candidate.firstName}-${candidate.lastName}`}
              firstName={candidate.firstName}
              lastName={candidate.lastName}
              image={candidate.image}
              examTitle={selectedExam?.examTitle || ""}
              jobDetails={selectedJob?.jobDetails || {}}
              candidateData={candidate}
              skills={[]}
              description=""
              onStatusSubmit={handleStatusSubmit}
              selectedChild={selectedChild}
              candidateStatuses={candidateStatuses}
              organizationName={selectedOrg?.organizationName || ""}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default DocumentReview;
