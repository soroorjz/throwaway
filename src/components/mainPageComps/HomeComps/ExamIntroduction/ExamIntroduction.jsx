import React, { useState, useEffect } from "react";
import { FaCircleCheck } from "react-icons/fa6";
import "./ExamIntroduction.scss";

const ExamIntroduction = () => {
  // لود exams از localStorage
  const [exams, setExams] = useState(() => {
    const savedExams = localStorage.getItem("exams");
    return savedExams ? JSON.parse(savedExams) : [];
  });

  const [selectedExam, setSelectedExam] = useState("");
  const [examDescription, setExamDescription] = useState("");
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editExamId, setEditExamId] = useState(null);
  const [editDescription, setEditDescription] = useState("");
  const [publishedExams, setPublishedExams] = useState(() => {
    const saved = localStorage.getItem("publishedExams");
    return saved ? JSON.parse(saved) : [];
  });

  // ذخیره exams و publishedExams در localStorage
  useEffect(() => {
    localStorage.setItem("exams", JSON.stringify(exams));
    localStorage.setItem("publishedExams", JSON.stringify(publishedExams));
  }, [exams, publishedExams]);

  // فیلتر کردن آزمون‌های نمایش‌داده‌شده در select
  const availableExams = exams.filter(
    (exam) => !publishedExams.some((published) => published.id === exam.id)
  );

  const handlePublishClick = () => {
    if (selectedExam && examDescription) {
      setIsConfirmModalOpen(true);
    }
  };

  const handleConfirm = () => {
    setIsConfirmModalOpen(false);
    const selectedExamObj = exams.find(
      (exam) => exam.id === parseInt(selectedExam)
    );
    const newExam = {
      id: parseInt(selectedExam),
      name: selectedExamObj.title, // استفاده از title به جای name
      description: examDescription,
    };
    setPublishedExams([...publishedExams, newExam]);
    setIsSuccessModalOpen(true);
    setTimeout(() => {
      setIsSuccessModalOpen(false);
    }, 3000);
    setSelectedExam("");
    setExamDescription("");
  };

  const handleCancel = () => {
    setIsConfirmModalOpen(false);
  };

  const handleExamChange = (e) => {
    setSelectedExam(e.target.value);
  };

  const handleDelete = (examId) => {
    setPublishedExams(publishedExams.filter((exam) => exam.id !== examId));
  };

  const handleEdit = (exam) => {
    setEditExamId(exam.id);
    setEditDescription(exam.description);
    setIsEditModalOpen(true);
  };

  const handleEditConfirm = () => {
    setPublishedExams(
      publishedExams.map((exam) =>
        exam.id === editExamId
          ? { ...exam, description: editDescription }
          : exam
      )
    );
    setIsEditModalOpen(false);
    setEditExamId(null);
    setEditDescription("");
  };

  const getSelectedExamName = () => {
    const exam = exams.find((exam) => exam.id === parseInt(selectedExam));
    return exam ? exam.title : ""; // استفاده از title به جای name
  };

  return (
    <div className="examIntro-selector-container">
      <div className="examIntro-select-wrapper">
        <label htmlFor="examIntro-select" className="examIntro-select-label">
          آزمون
        </label>
        <select
          id="examIntro-select"
          className="examIntro-select"
          value={selectedExam}
          onChange={handleExamChange}
        >
          <option value="" disabled>
            آزمون موردنظر را انتخاب کنید
          </option>
          {availableExams.map((exam) => (
            <option key={exam.id} value={exam.id}>
              {exam.title} {/* استفاده از title برای نمایش در select */}
            </option>
          ))}
        </select>
      </div>
      <textarea
        className="examIntro-textarea"
        placeholder="توضیحات یا محتوای مربوط به آزمون را اینجا وارد کنید..."
        value={examDescription}
        onChange={(e) => setExamDescription(e.target.value)}
      ></textarea>
      <button
        className="examIntro-PublishBtn"
        onClick={handlePublishClick}
        disabled={!selectedExam || !examDescription}
      >
        انتشار
      </button>

      <div className="examIntro-cards-container">
        {publishedExams.map((exam) => (
          <div key={exam.id} className="examIntro-card">
            <h3>{exam.name}</h3>
            <div className="examIntro-card-buttons">
              <button
                className="examIntro-card-button edit"
                onClick={() => handleEdit(exam)}
              >
                ویرایش
              </button>
              <button
                className="examIntro-card-button delete"
                onClick={() => handleDelete(exam.id)}
              >
                حذف
              </button>
            </div>
          </div>
        ))}
      </div>

      {isConfirmModalOpen && (
        <div className="examIntro-modal-overlay">
          <div className="examIntro-modal-content">
            <p>
              آیا از انتشار معرفی آزمون <strong>{getSelectedExamName()}</strong>{" "}
              اطمینان دارید؟
            </p>
            <div className="examIntro-modal-buttons">
              <button
                className="examIntro-modal-confirm"
                onClick={handleConfirm}
              >
                تأیید
              </button>
              <button className="examIntro-modal-cancel" onClick={handleCancel}>
                لغو
              </button>
            </div>
          </div>
        </div>
      )}

      {isSuccessModalOpen && (
        <div className="examIntro-modal-overlay">
          <div className="examIntro-modal-content examIntro-success">
            <FaCircleCheck className="examIntro-successIcon" />
            <p>
              معرفی آزمون <strong>{getSelectedExamName()}</strong> با موفقیت
              انجام شد.
            </p>
          </div>
        </div>
      )}

      {isEditModalOpen && (
        <div className="examIntro-modal-overlay">
          <div className="examIntro-modal-content">
            <h3>ویرایش معرفی آزمون</h3>
            <textarea
              className="examIntro-textarea"
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
            ></textarea>
            <div className="examIntro-modal-buttons">
              <button
                className="examIntro-modal-confirm"
                onClick={handleEditConfirm}
              >
                ذخیره
              </button>
              <button
                className="examIntro-modal-cancel"
                onClick={() => setIsEditModalOpen(false)}
              >
                لغو
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamIntroduction;
