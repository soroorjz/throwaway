import React from "react";
import "./Stepper.scss";
import { FaHome, FaListUl, FaFileAlt, FaQuestionCircle } from "react-icons/fa";

// کامپوننت Stepper برای نمایش مراحل
const Stepper = ({ currentStep, onStepChange }) => {
  const steps = [
    { label: "شرایط شغل", icon: <FaHome /> },
    { label: "شرایط داوطلب", icon: <FaListUl /> },
    { label: "مدارک", icon: <FaFileAlt /> },
    { label: "بررسی", icon: <FaQuestionCircle /> },
  ];

  const handleStepClick = (stepIndex) => {
    if (onStepChange) {
      onStepChange(stepIndex + 1);
    }
  };

  return (
    <div className="stepper">
      {steps.map((step, index) => (
        <div
          key={index}
          className="stepper__wrapper"
          onClick={() => handleStepClick(index)}
        >
          <div
            className={`stepper__item ${
              currentStep === index + 1 ? "active" : ""
            } ${currentStep > index + 1 ? "completed" : ""}`}
          >
            <div className="stepper__icon">{step.icon}</div>
            <div className="stepper__label">{step.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Stepper;
