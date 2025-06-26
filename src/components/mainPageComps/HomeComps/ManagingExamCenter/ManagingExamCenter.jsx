import React, { useState, useEffect } from "react";
import { Tooltip } from "react-tooltip";
import MapChart from "./MapChart";
import VolunteerModal from "./VolunteerModal";
import OrganizationModal from "./OrganizationModal";
import Legend from "./Legend";
import { saveToLocalStorage } from "./utils";
import { initialData } from "./data";
import "./ManagingExamCenter.scss";
import ExamTabs from "./ExamTabs/ExamTabs";

const ConfirmationModal = ({ isOpen, onClose, onConfirm, message }) => {
  if (!isOpen) return null;
  return (
    <div className="modal-overlay">
      <div className="confirmation-modal">
        <p className="modal-message">{message}</p>
        <div className="modal-buttons">
          <button onClick={onConfirm} className="modal-confirm-btn">
            تأیید
          </button>
          <button onClick={onClose} className="modal-cancel-btn">
            لغو
          </button>
        </div>
      </div>
    </div>
  );
};

const SuccessModal = ({ isOpen, message }) => {
  if (!isOpen) return null;
  return (
    <div className="modal-overlay" SuccessModal>
      <div className="success-modal successModalBox">
        <p className="modal-success-message">{message}</p>
      </div>
    </div>
  );
};

const ManagingExamCenter = () => {
  const exams = Object.keys(initialData);
  const [selectedExam, setSelectedExam] = useState(exams[0]);
  const [modalData, setModalData] = useState(null);
  const [orgModalData, setOrgModalData] = useState(null);
  const [volunteerData, setVolunteerData] = useState(() => {
    const saved = localStorage.getItem(`volunteerData_${selectedExam}`);
    return saved ? JSON.parse(saved) : initialData[selectedExam].volunteerData;
  });
  const [organizationData, setOrganizationData] = useState(() => {
    const saved = localStorage.getItem(`organizationData_${selectedExam}`);
    return saved ? JSON.parse(saved) : initialData[selectedExam].orgData;
  });
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [totalCandidates, setTotalCandidates] = useState(0);
  const [unorganizedCandidates, setUnorganizedCandidates] = useState(0);

  useEffect(() => {
    const calculateTotals = () => {
      let total = 0;
      let unorganized = 0;

      volunteerData.forEach((province) => {
        province.candidates.forEach((candidate) => {
          total += candidate.total;
          unorganized += candidate.unorganized;
        });
      });

      setTotalCandidates(total);
      setUnorganizedCandidates(unorganized);
    };

    calculateTotals();
  }, [volunteerData]);

  useEffect(() => {
    const savedVolunteer = localStorage.getItem(
      `volunteerData_${selectedExam}`
    );
    const savedOrg = localStorage.getItem(`organizationData_${selectedExam}`);
    setVolunteerData(
      savedVolunteer
        ? JSON.parse(savedVolunteer)
        : initialData[selectedExam].volunteerData
    );
    setOrganizationData(
      savedOrg ? JSON.parse(savedOrg) : initialData[selectedExam].orgData
    );
  }, [selectedExam]);

  useEffect(() => {
    if (isSuccessModalOpen) {
      const timer = setTimeout(() => {
        setIsSuccessModalOpen(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isSuccessModalOpen]);

  const handleSave = () => {
    saveToLocalStorage(volunteerData, organizationData, selectedExam);
  };

  const handlePublishExamCards = () => {
    setIsConfirmModalOpen(true);
  };

  const handleConfirmPublish = () => {
    setIsConfirmModalOpen(false);
    setIsSuccessModalOpen(true);
  };

  const handleExportExcel = () => {
    const blob = new Blob(["محتوای جای‌گزین اکسل"], {
      type: "application/vnd.ms-excel",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `exam_${selectedExam}_data.xls`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportExamCards = () => {
    const blob = new Blob(["محتوای جای‌گزین زیپ"], {
      type: "application/zip",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `exam_${selectedExam}_cards.zip`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="ManagingExam-Container">
      <div className="ManagingExam-Container-Title">
        <p>مدیریت حوزه‌های آزمون</p>
        <div className="action-buttons">
          <button
            onClick={handleExportExcel}
            className="excel-btn"
            disabled={true}
            data-tooltip-id="excel-tooltip"
            data-tooltip-content="پیش از تکمیل ساماندهی تمامی استان‌ها، خروجی اکسل غیرفعال است."
          >
            خروجی اکسل
          </button>
          <button
            onClick={handleExportExamCards}
            className="cards-btn"
            disabled={true}
            data-tooltip-id="cards-tooltip"
            data-tooltip-content="پیش از تکمیل ساماندهی تمامی استان‌ها، خروجی کارت‌های آزمون غیرفعال است."
          >
            خروجی کارت‌های آزمون
          </button>
          <button
            onClick={handlePublishExamCards}
            className="publish-btn"
            disabled={true}
            data-tooltip-id="publish-tooltip"
            data-tooltip-content="پیش از تکمیل ساماندهی تمامی استان‌ها، انتشار کارت آزمون غیرفعال است."
          >
            انتشار کارت آزمون
          </button>
          <Tooltip id="excel-tooltip" place="top" />
          <Tooltip id="cards-tooltip" place="top" />
          <Tooltip id="publish-tooltip" place="top" />
        </div>
      </div>
      <ExamTabs
        exams={exams}
        selectedExam={selectedExam}
        onSelectExam={setSelectedExam}
      />
      <div className="stats-box">
        <div className="stat-item">
          <span className="stat-label">تعداد کل داوطلبان:</span>
          <span className="stat-value"> {totalCandidates} نفر</span>
        </div>
        <hr className="stats-box-Divider" />
        <div className="stat-item">
          <span className="stat-label">تعداد داوطلبان ساماندهی‌نشده:</span>
          <span className="stat-value"> {unorganizedCandidates} نفر</span>
        </div>
      </div>
      <div className="map-container">
        <MapChart volunteerData={volunteerData} setModalData={setModalData} />
        <Legend />
      </div>
      <VolunteerModal
        isOpen={!!modalData}
        onClose={() => setModalData(null)}
        data={modalData}
        onOrganize={(province, gender, unorganized) =>
          setOrgModalData({ province, gender, unorganized })
        }
      />
      <OrganizationModal
        isOpen={!!orgModalData}
        onClose={() => setOrgModalData(null)}
        province={orgModalData?.province}
        gender={orgModalData?.gender}
        initialUnorganized={orgModalData?.unorganized}
        organizationData={organizationData}
        setOrganizationData={setOrganizationData}
        volunteerData={volunteerData}
        setVolunteerData={setVolunteerData}
        onSave={handleSave}
      />
      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmPublish}
        message="آیا از انتشار کارت‌های آزمون در حساب کاربری داوطلبان اطمینان دارید؟"
      />
      <SuccessModal
        isOpen={isSuccessModalOpen}
        message="کارت‌های آزمون در حساب کاربری داوطلبان منتشر شد"
      />
    </div>
  );
};

export default ManagingExamCenter;
