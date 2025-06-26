import React, { useState } from "react";
import DynamicList from "./DynamicList";
import "./BaseInfo.scss";

const BaseInfo = () => {
  const [activeSection, setActiveSection] = useState(null);

  const [militaryStatusData, setMilitaryStatusData] = useState([
    { id: 1, description: "معاف پزشکی" },
    { id: 2, description: "پایان خدمت" },
    { id: 3, description: "در حال خدمت" },
  ]);

  const [educationData, setEducationData] = useState([
    { id: 1, description: "دیپلم" },
    { id: 2, description: "کارشناسی" },
    { id: 3, description: "کارشناسی ارشد" },
    { id: 4, description: "دکتری" },
  ]);

  const [maritalStatusData, setMaritalStatusData] = useState([
    { id: 1, description: "مجرد" },
    { id: 2, description: "متاهل" },
  ]);

  const sections = {
    militaryStatus: {
      title: "وضعیت نظام وظیفه",
      data: militaryStatusData,
      setData: setMilitaryStatusData,
    },
    education: {
      title: "تحصیلات",
      data: educationData,
      setData: setEducationData,
    },
    maritalStatus: {
      title: "وضعیت تاهل",
      data: maritalStatusData,
      setData: setMaritalStatusData,
    },
  };

  const handleSectionClick = (section) => {
    setActiveSection(section);
  };

  return (
    <div className="base-info">
      <h2 className="base-info__title">مجموعه اطلاعات پایه</h2>
      <div className="base-info__sections">
        <button
          className={`base-info__section-btn ${
            activeSection === "militaryStatus"
              ? "base-info__section-btn--active"
              : ""
          }`}
          onClick={() => handleSectionClick("militaryStatus")}
        >
          وضعیت نظام وظیفه
        </button>
        <button
          className={`base-info__section-btn ${
            activeSection === "education"
              ? "base-info__section-btn--active"
              : ""
          }`}
          onClick={() => handleSectionClick("education")}
        >
          تحصیلات
        </button>
        <button
          className={`base-info__section-btn ${
            activeSection === "maritalStatus"
              ? "base-info__section-btn--active"
              : ""
          }`}
          onClick={() => handleSectionClick("maritalStatus")}
        >
          وضعیت تاهل
        </button>
      </div>

      {activeSection && (
        <DynamicList
          title={sections[activeSection].title}
          data={sections[activeSection].data}
          setData={sections[activeSection].setData}
        />
      )}
    </div>
  );
};

export default BaseInfo;
