import React, { useState, useEffect } from "react";
import "./BookletGeneration.scss";
import ConfirmPublishModal from "./ConfirmPublishModal";
import SuccessModal from "./SuccessModal";
import StimulsoftViewer from "./StimulsoftViewer";

const BookletGeneration = () => {
  const [examPermitDetails, setExamPermitDetails] = useState(() => {
    const saved = localStorage.getItem("examPermitDetails");
    return saved ? JSON.parse(saved) : [];
  });
  const [generatedBooklets, setGeneratedBooklets] = useState(() => {
    const saved = localStorage.getItem("generatedBooklets");
    return saved ? JSON.parse(saved) : [];
  });
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [selectedExam, setSelectedExam] = useState(null);
  const [publishExam, setPublishExam] = useState(null);

  useEffect(() => {
    const handleStorageChange = () => {
      const savedDetails = localStorage.getItem("examPermitDetails");
      const savedBooklets = localStorage.getItem("generatedBooklets");
      console.log("Updated examPermitDetails:", savedDetails);
      console.log("Updated generatedBooklets:", savedBooklets);
      setExamPermitDetails(savedDetails ? JSON.parse(savedDetails) : []);
      setGeneratedBooklets(savedBooklets ? JSON.parse(savedBooklets) : []);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  useEffect(() => {
    console.log("Saving generatedBooklets to localStorage:", generatedBooklets);
    localStorage.setItem("generatedBooklets", JSON.stringify(generatedBooklets));
  }, [generatedBooklets]);

  const filteredExams = examPermitDetails.filter(
    (item) => item.permits && item.permits.length > 0
  );

  const handleGenerateBooklet = (examId, examTitle) => {
    const examDetail = examPermitDetails.find((item) => item.examId === examId);
    if (!examDetail) {
      alert("خطا: اطلاعات آزمون یافت نشد.");
      return;
    }
    setGeneratedBooklets((prev) => {
      if (prev.some((booklet) => booklet.examId === examId)) {
        return prev;
      }
      const updatedBooklets = [
        ...prev,
        { examId, examTitle, generatedAt: new Date().toISOString() },
      ];
      console.log("Updated generatedBooklets:", updatedBooklets);
      return updatedBooklets;
    });
    setSelectedExam({ examId, examTitle });
  };

  const handlePublishBooklet = (examId, examTitle) => {
    const booklet = generatedBooklets.find((b) => b.examId === examId);
    if (!booklet) {
      alert("خطا: لطفاً ابتدا دفترچه را تولید کنید.");
      return;
    }
    setPublishExam({ examId, examTitle });
    setIsConfirmModalOpen(true);
  };

  const handleConfirmPublish = () => {
    setIsConfirmModalOpen(false);
    setIsSuccessModalOpen(true);
  };

  return (
    <div className="booklet-generation">
      <h2 className="booklet-generation__title">تولید و انتشار دفترچه آزمون</h2>
      <div className="booklet-generation__grid">
        {filteredExams.length > 0 ? (
          filteredExams.map((item) => (
            <div key={item.examId} className="booklet-generation__card">
              <h3 className="booklet-generation__card-title">
                {item.exam?.title || "بدون عنوان"}
              </h3>
              <div className="booklet-generation__button-group">
                <button
                  className="booklet-generation__generate-btn"
                  onClick={() =>
                    handleGenerateBooklet(item.examId, item.exam?.title)
                  }
                >
                  تولید دفترچه
                </button>
                <button
                  className="booklet-generation__publish-btn"
                  onClick={() =>
                    handlePublishBooklet(item.examId, item.exam?.title)
                  }
                >
                  انتشار دفترچه
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="booklet-generation__no-exams">
            هیچ آزمونی با مجوز تخصیص‌یافته یافت نشد.
          </p>
        )}
      </div>

      <ConfirmPublishModal
        isOpen={isConfirmModalOpen}
        onClose={() => {
          setIsConfirmModalOpen(false);
          setPublishExam(null);
        }}
        onConfirm={handleConfirmPublish}
        examTitle={publishExam?.examTitle}
      />

      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => {
          setIsSuccessModalOpen(false);
          setPublishExam(null);
        }}
        examTitle={publishExam?.examTitle}
      />

      {selectedExam && (
        <StimulsoftViewer
          examId={selectedExam.examId}
          onClose={() => setSelectedExam(null)}
        />
      )}
    </div>
  );
};

export default BookletGeneration;