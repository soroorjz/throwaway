import React from 'react';
import './ExamTabs.scss';

const ExamTabs = ({ exams, selectedExam, onSelectExam }) => {
  return (
    <div className="exam-tabs">
      {exams.map((exam) => (
        <button
          key={exam}
          className={`exam-tab ${selectedExam === exam ? 'active' : ''}`}
          onClick={() => onSelectExam(exam)}
        >
          {exam}
        </button>
      ))}
    </div>
  );
};

export default ExamTabs;