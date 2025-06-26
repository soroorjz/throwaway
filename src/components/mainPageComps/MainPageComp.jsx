import React, { useState } from "react";
import "./MainPageComp.scss";
import CategoryGrid from "./HomeComps/CategoryGrid/CategoryGrid";
import PermitRequestsList from "./HomeComps/PermitRequestsList/PermitRequestsList";
import ExamManagement from "./HomeComps/ExamManagement/ExamManagement";
import QuestionDesignerManagement from "./HomeComps/QuestionDesignerManagement/QuestionDesignerManagement";
import ExecutiveManagement from "./HomeComps/ExecutiveManagement/ExecutiveManagement";
import AssignPermitToExam from "./HomeComps/AssignPermitToExam/AssignPermitToExam";
import { FaBookQuran } from "react-icons/fa6";
import ExamResults from "./HomeComps/ExamResults/ExamResults";
import DynamicList from "./HomeComps/DynamicList/DynamicList";
import ExamCenter from "./HomeComps/ExamCenter/ExamCenter";
import ExamLessons from "./HomeComps/ExamLessons/ExamLessons";
import { FaUsersGear, FaXmark } from "react-icons/fa6";
import { BiSolidArchive } from "react-icons/bi";
import {
  FaUserShield,
  FaBuilding,
  FaMapMarkerAlt,
  FaClipboardList,
  FaTasks,
  FaGraduationCap,
  FaPercent,
  FaBook,
  FaChartBar,
  FaUserEdit,
  FaUsers,
  FaCheckCircle,
  FaBriefcase,
  FaUniversity,
  FaUserCheck,
  FaSuitcase,
  FaSchool,
  FaArrowRight,
  FaFileAlt,
  FaLink,
  FaPencilAlt,
  FaLock,
  FaSitemap,
  FaFilePdf,
  FaChartLine,
  FaUsersCog,
} from "react-icons/fa";
import {
  FaFileCircleExclamation,
  FaFileImport,
  FaFileCircleQuestion,
  FaFileCircleXmark,
  FaFileCircleCheck,
  FaFileShield,
  FaFilter,
} from "react-icons/fa6";
import { BsFillFileEarmarkPersonFill } from "react-icons/bs";
import { MdMosque } from "react-icons/md";
import IssuedPermits from "./HomeComps/IssuedPermits/IssuedPermits";
import SupplementaryAssessmentResults from "./HomeComps/SupplementaryAssessmentResults/SupplementaryAssessmentResults";
import EvaluationOrganization from "./HomeComps/EvaluationOrganization/EvaluationOrganization";
import AssessmentMaterials from "./HomeComps/AssessmentMaterials/AssessmentMaterials";
import SupplementaryDocs from "./HomeComps/SupplementaryDocs/SupplementaryDocs";
import CandidateList from "./HomeComps/CandidateList/CandidateList";
import SelectionCandidateList from "./HomeComps/SelectionCandidateList/SelectionCandidateList";
import ExamAssessmentList from "./HomeComps/ExamAssessmentList/ExamAssessmentList";
import SelectionOrganization from "./HomeComps/SelectionOrganization/SelectionOrganization";
import SelectionResults from "./HomeComps/SelectionResults/SelectionResults";
import LessonDetails from "./HomeComps/ExamLessons/LessonDetails/LessonDetails";
import ManagingExamCenter from "./HomeComps/ManagingExamCenter/ManagingExamCenter";
import { menuItems } from "./SideBar/menuConfig.js/menuConfig";
import { useBaseInfoData } from "./HomeComps/baseInfoData";
import ExamIntroduction from "./HomeComps/ExamIntroduction/ExamIntroduction";
import { GiNotebook } from "react-icons/gi";
import { BsBuildingFillAdd } from "react-icons/bs";
import { BiSolidDetail } from "react-icons/bi";
import SetExecutor from "./HomeComps/SetExecutor/SetExecutor";
import DynamicListModal from "./HomeComps/DynamicList/DynamicListModal/DynamicListModal";
import DocumentReview from "./HomeComps/DocumentReview/DocumentReview";
import BookletGeneration from "./HomeComps/BookletGeneration/BookletGeneration";
import Chat from "./chat/Chat";
import Dashboard from "./HomeComps/Dashboard/Dashboard";
import ArchiveReview from "./HomeComps/DocumentReview/ArchiveReview/ArchiveReview";
import { BsChatDotsFill } from "react-icons/bs";
import OrganizationPage from "./HomeComps/OrganizationPage/OrganizationPage";
import { useAuth } from "../../AuthContext";

const accessRules = {
  1: {
    menus: [
      "خانه",
      "دسترسی سریع",
      "اطلاعات پایه",
      "مجوز استخدام",
      "آزمون‌های استخدامی",
      "سازماندهی آزمون",
      "بررسی مدارک",
      "ارزیابی تکمیلی",
      "گزینش",
    ],
    subMenus: {},
  },
  2: {
    menus: [
      "خانه",
      "دسترسی سریع",
      "اطلاعات پایه",
      "مجوز استخدام",
      "آزمون‌های استخدامی",
      "سازماندهی آزمون",
      "بررسی مدارک",
      "ارزیابی تکمیلی",
      "گزینش",
    ],
    subMenus: {
      "سازماندهی آزمون": [
        "عوامل اجرایی مجری",
        "حوزه آزمون",
        "تولید دفترچه آزمون",
        "مدیریت حوزه‌های آزمون",
      ],
      گزینش: ["سازماندهی گزینش", "نتایج گزینش"],
    },
  },
  3: {
    menus: [
      "خانه",
      "دسترسی سریع",
      "مجوز استخدام",
      "آزمون‌های استخدامی",
      "بررسی مدارک",
      "ارزیابی تکمیلی",
      "گزینش",
    ],
    subMenus: {
      "آزمون‌های استخدامی": ["مدیریت آزمون", "نتایج آزمون", "معرفی آزمون"],
    },
  },
  4: {
    menus: [
      "خانه",
      "دسترسی سریع",
      "مجوز استخدام",
      "آزمون‌های استخدامی",
      "ارزیابی تکمیلی",
      "گزینش",
    ],
    subMenus: {},
  },
  5: {
    menus: ["خانه", "دسترسی سریع", "آزمون‌های استخدامی", "سازماندهی آزمون"],
    subMenus: {
      "آزمون‌های استخدامی": ["مدیریت آزمون", "نتایج آزمون", "معرفی آزمون"],
      "سازماندهی آزمون": [
        "معرفی آزمون",
        "لیست نفرات",
        "عوامل اجرایی مجری",
        "حوزه آزمون",
        "مدیریت حوزه‌های آزمون",
        "قرنطینه سوال",
        "طراح سوال",
      ],
    },
  },
  6: {
    menus: ["خانه", "دسترسی سریع", "ارزیابی تکمیلی"],
    subMenus: {
      "ارزیابی تکمیلی": [
        "لیست نفرات",
        "سازماندهی ارزیابی",
        "مستندات ارزیابی تکمیلی",
        "نتایج ارزیابی تکمیلی",
        "مواد ارزیابی تکمیلی",
      ],
    },
  },
  7: {
    menus: ["خانه", "دسترسی سریع"],
    subMenus: {},
  },
};

const getAccessibleMenuItems = (roleId, menuItems) => {
  const allowedTitles = accessRules[roleId]?.menus || [];
  return menuItems.filter((item) => allowedTitles.includes(item.title));
};

const getAccessibleSubMenus = (roleId, menuTitle, children) => {
  const allowedSubMenus =
    accessRules[roleId]?.subMenus?.[menuTitle] ||
    children.map((child) => (typeof child === "string" ? child : child.title));
  return children.filter((child) =>
    allowedSubMenus.includes(typeof child === "string" ? child : child.title)
  );
};

const hasSubMenuAccess = (roleId, menuTitle, subMenuTitle) => {
  if (!accessRules[roleId]?.menus.includes(menuTitle)) return false;
  const allowedSubMenus = accessRules[roleId]?.subMenus?.[menuTitle];
  return !allowedSubMenus || allowedSubMenus.includes(subMenuTitle);
};

const DefaultChildComponent = ({ childName }) => (
  <div className="category-Content">
    <h3>{childName}</h3>
  </div>
);

const MainPageComp = ({
  selectedTitle,
  setSelectedTitle,
  selectedChild,
  setSelectedChild,
  resetToHome,
  resetToTitle,
}) => {
  const { user } = useAuth();
  const { baseInfoSections } = useBaseInfoData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const [lessonDetails, setLessonDetails] = useState(null);
  const [pendingSection, setPendingSection] = useState(null);
  const [isWarningModalOpen, setIsWarningModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [editItem, setEditItem] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const accessibleMenuItems = getAccessibleMenuItems(user?.roleId, menuItems);
  const accessibleTitles = accessibleMenuItems.map((item) => item.title);

  const fixedInfoSections = [
    { title: "وضعیت نظام وظیفه", icon: <FaUserShield /> },
    { title: "دستگاه اجرایی", icon: <FaBuilding /> },
    { title: "مکان جغرافیایی", icon: <FaMapMarkerAlt /> },
    { title: "مقطع تحصیلی", icon: <FaGraduationCap /> },
    { title: "سهمیه", icon: <FaFilter /> },
    { title: "مذاهب", icon: <MdMosque /> },
    { title: "نوع استخدام", icon: <FaBriefcase /> },
    { title: "نوع دانشگاه", icon: <FaUniversity /> },
  ];

  const variableInfoSections = [
    { title: "نسبت امتیاز", icon: <FaPercent /> },
    {
      title: "مجری آزمون کتبی",
      icon: <FaUserEdit />,
    },
    { title: "مجری ارزیابی تکمیلی", icon: <FaUserCheck /> },
    { title: "رشته تحصیلی", icon: <FaBook /> },
    { title: "شغل", icon: <FaSuitcase /> },
    { title: "وضعیت گزینش", icon: <FaCheckCircle /> },
    { title: "رسته عوامل مجری", icon: <FaUsers /> },
    { title: "فهرست دانشگاه‌ها", icon: <FaSchool /> },
  ];

  const documentReviewChildren = [
    "بررسی نشده",
    "تأیید شده",
    "رد شده",
    "دارای نواقص",
    "نیاز به حضور",
    "دریافتی جدید",
    "تأیید نهایی",
  ];

  const childComponentMap = {
    "ثبت شرایط و تعریف شغل محل‌ها": <PermitRequestsList />,
    بایگانی: <ArchiveReview setSelectedChild={setSelectedChild} />,
    "سازماندهی ارزیابی": <EvaluationOrganization />,
    "مدیریت آزمون": <ExamManagement />,
    "طراح سوال": <QuestionDesignerManagement />,
    "تعیین مجری": <SetExecutor />,
    "عوامل اجرایی مجری": <ExecutiveManagement />,
    "تخصیص مجوز به آزمون": <AssignPermitToExam />,
    "نتایج آزمون": <ExamResults />,
    "نتایج ارزیابی تکمیلی": <SupplementaryAssessmentResults />,
    "حوزه آزمون": <ExamCenter />,
    "مدیریت حوزه‌های آزمون": <ManagingExamCenter />,
    "مدیریت مجوزها": <IssuedPermits />,
    "مواد ارزیابی تکمیلی": <AssessmentMaterials />,
    "مستندات ارزیابی تکمیلی": <SupplementaryDocs />,
    "لیست نفرات ارزیابی تکمیلی": <CandidateList />,
    "لیست نفرات گزینش": <SelectionCandidateList />,
    "سازماندهی گزینش": <SelectionOrganization />,
    "لیست نفرات": <ExamAssessmentList />,
    "معرفی آزمون": <ExamIntroduction />,
    "نتایج گزینش": <SelectionResults />,
    "تولید دفترچه آزمون": <BookletGeneration />,
    "قرنطینه سوال": (
      <ExamLessons
        setSelectedChild={setSelectedChild}
        setLessonDetails={setLessonDetails}
      />
    ),
    "جزئیات درس": lessonDetails ? (
      <LessonDetails
        examName={lessonDetails.examName}
        lessonName={lessonDetails.lessonName}
        initialQuestions={lessonDetails.initialQuestions}
        examStatus={lessonDetails.examStatus}
      />
    ) : (
      <DefaultChildComponent childName="LessonDetails" />
    ),
  };

  const handleBack = () => {
    window.history.back();
    const isFixedInfo = fixedInfoSections.some(
      (section) => section.title === selectedChild
    );
    const isVariableInfo = variableInfoSections.some(
      (section) => section.title === selectedChild
    );
    setTimeout(() => {
      let hashTag = decodeURI(window.location.hash);
      if (selectedChild === "جزئیات درس") {
        setSelectedChild("قرنطینه سوال");
        setLessonDetails(null);
      } else if (
        hashTag == "#اطلاعات_ثابت" ||
        hashTag == "#اطلاعات_متغیر" ||
        hashTag == "قرنطینه سوال"
      ) {
        setSelectedChild(hashTag.replace("#", "").replaceAll("_", " "));
      } else if (documentReviewChildren.includes(selectedChild)) {
        resetToTitle();
      } else if (selectedChild) {
        resetToTitle();
      } else if (selectedTitle) {
        resetToHome();
      }
    }, 100);
  };

  const openModal = (section, mode = "add", item = null) => {
    setModalMode(mode);
    setEditItem(item);
    if (fixedInfoSections.some((s) => s.title === selectedChild)) {
      setPendingSection(section);
      setIsWarningModalOpen(true);
    } else {
      setIsModalOpen(true);
      setFormData(item || {});
    }
  };

  const closeWarningModal = () => {
    setIsWarningModalOpen(false);
    setPendingSection(null);
    setEditItem(null);
  };

  const confirmWarningModal = () => {
    setIsWarningModalOpen(false);
    setIsModalOpen(true);
    setFormData(editItem || {});
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormData({});
    setEditItem(null);
    setModalMode("add");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (section) => {
    if (modalMode === "add") {
      const newItem = {
        id: section.data.length + 1,
        ...formData,
      };
      const updatedData = [...section.data, newItem];
      section.setData(updatedData);
      localStorage.setItem(section.title, JSON.stringify(updatedData));
    } else if (modalMode === "edit" && editItem) {
      const updatedData = section.data.map((item) =>
        item.id === editItem.id ? { ...item, ...formData } : item
      );
      section.setData(updatedData);
      localStorage.setItem(section.title, JSON.stringify(updatedData));
    }
    closeModal();
  };

  const renderWarningModal = () => {
    if (!isWarningModalOpen) return null;
    const message =
      modalMode === "add"
        ? `آیا از افزودن مورد جدید به "${selectedChild}" مطمئن هستید؟`
        : `آیا از ویرایش "${selectedChild}" مطمئن هستید؟`;
    return (
      <div className="modal warning-modal">
        <div className="modal-content">
          <h2>هشدار</h2>
          <p>{message}</p>
          <div className="modal-actions">
            <button onClick={confirmWarningModal}>تأیید</button>
            <button onClick={closeWarningModal}>انصراف</button>
          </div>
        </div>
      </div>
    );
  };

  const renderBreadcrumbs = () => {
    if (
      !selectedTitle ||
      selectedTitle.title === "خانه" ||
      (!selectedTitle && !selectedChild)
    ) {
      return null;
    }

    if (
      selectedTitle &&
      !accessibleTitles.includes(selectedTitle.title) &&
      !(
        selectedTitle.title === "اطلاعات پایه" &&
        accessibleTitles.includes("اطلاعات پایه")
      ) &&
      !(
        selectedTitle.title === "سازماندهی آزمون" &&
        accessibleTitles.includes("سازماندهی آزمون")
      )
    ) {
      return null;
    }

    if (
      selectedChild &&
      !hasSubMenuAccess(user?.roleId, selectedTitle.title, selectedChild)
    ) {
      return null;
    }

    const isFixedInfo = fixedInfoSections.some(
      (section) => section.title === selectedChild
    );
    const isVariableInfo = variableInfoSections.some(
      (section) => section.title === selectedChild
    );

    return (
      <div className="breadcrumbs_container">
        <div className="breadcrumbs">
          <span
            className="breadcrumbs__item"
            onClick={() => {
              window.location.hash = "MainPage";
              setSelectedChild(null);
            }}
          >
            خانه
          </span>
          {selectedTitle && (
            <>
              <span className="breadcrumbs__separator">/</span>
              <span
                className="breadcrumbs__item"
                onClick={(event) => {
                  setSelectedChild(null);
                  const hash = event.target.innerText
                    .replaceAll(" ", "_")
                    .replace(/\u200C/g, "");
                  window.location.hash = hash;
                }}
              >
                {selectedTitle.title}
              </span>
            </>
          )}
          {(isFixedInfo || isVariableInfo) && (
            <>
              <span className="breadcrumbs__separator">/</span>
              <span
                className="breadcrumbs__item"
                onClick={(event) => {
                  setSelectedChild(
                    isFixedInfo ? "اطلاعات ثابت" : "اطلاعات متغیر"
                  );
                  const hash = event.target.innerText
                    .replaceAll(" ", "_")
                    .replace(/\u200C/g, "");
                  window.location.hash = hash;
                }}
              >
                {isFixedInfo ? "اطلاعات ثابت" : "اطلاعات متغیر"}
              </span>
            </>
          )}
          {selectedChild === "جزئیات درس" && (
            <>
              <span className="breadcrumbs__separator">/</span>
              <span
                className="breadcrumbs__item"
                onClick={(event) => {
                  setSelectedChild("قرنطینه سوال");
                  const hash = event.target.innerText
                    .replaceAll(" ", "_")
                    .replace(/\u200C/g, "");
                  window.location.hash = hash;
                }}
              >
                قرنطینه سوال
              </span>
            </>
          )}
          {selectedChild && (
            <>
              <span className="breadcrumbs__separator">/</span>
              <span
                className="breadcrumbs__item"
                onClick={(event) => {
                  setSelectedChild(event.target.innerText);
                  const hash = event.target.innerText
                    .replaceAll(" ", "_")
                    .replace(/\u200C/g, "");
                  window.location.hash = hash;
                }}
              >
                {selectedChild}
              </span>
            </>
          )}
        </div>
        <button
          className={`back-button ${!selectedTitle ? "disabled" : ""}`}
          onClick={handleBack}
          disabled={!selectedTitle}
        >
          <FaArrowRight />
          بازگشت
        </button>
      </div>
    );
  };

  const renderContent = () => {
    if (
      selectedTitle &&
      !accessibleTitles.includes(selectedTitle.title) &&
      !(
        selectedTitle.title === "اطلاعات پایه" &&
        accessibleTitles.includes("اطلاعات پایه")
      ) &&
      !(
        selectedTitle.title === "سازماندهی آزمون" &&
        accessibleTitles.includes("سازماندهی آزمون")
      )
    ) {
      return (
        <div className="category-Content">
          <p>شما به این بخش دسترسی ندارید.</p>
        </div>
      );
    }

    if (selectedChild) {
      const parentMenu = accessibleMenuItems.find((item) =>
        item.children.some((child) =>
          typeof child === "string"
            ? child === selectedChild
            : child.title === selectedChild
        )
      );
      const isBaseInfoChild =
        fixedInfoSections.some((section) => section.title === selectedChild) ||
        variableInfoSections.some(
          (section) => section.title === selectedChild
        ) ||
        ["اطلاعات ثابت", "اطلاعات متغیر"].includes(selectedChild);
      const isExamOrganizationChild =
        ["قرنطینه سوال", "جزئیات درس"].includes(selectedChild) &&
        accessibleTitles.includes("سازماندهی آزمون");
      if (
        !parentMenu &&
        !isBaseInfoChild &&
        !isExamOrganizationChild &&
        !(
          selectedTitle.title === "اطلاعات پایه" &&
          accessibleTitles.includes("اطلاعات پایه")
        ) &&
        !hasSubMenuAccess(user?.roleId, selectedTitle.title, selectedChild)
      ) {
        return (
          <div className="category-Content">
            <p>شما به این بخش دسترسی ندارید.</p>
          </div>
        );
      }
    }

    if (window.location.hash !== "") {
      let text = decodeURI(window.location.hash).slice(1);
      const matchedItems = menuItems.filter((obj) => {
        const titleMatch = obj.title
          ?.replaceAll(" ", "_")
          .replace(/\u200C/g, "")
          .includes(text);

        const childMatch = obj.children?.some((child) => {
          if (typeof child === "string") {
            const normalized = child
              .replaceAll(" ", "_")
              .replace(/\u200C/g, "");
            return normalized.includes(text);
          } else if (child.title) {
            const normalized = child.title
              .replaceAll(" ", "_")
              .replace(/\u200C/g, "");
            return normalized.includes(text);
          }
          return false;
        });

        return titleMatch || childMatch;
      });
      let rawText = "";

      if (matchedItems.length > 0) {
        matchedItems[0].children?.forEach((obj) => {
          if (typeof obj === "string") {
            const normalized = obj.replaceAll(" ", "_").replace(/\u200C/g, "");
            if (normalized === text) {
              rawText = obj;
            }
          } else if (obj?.title) {
            const normalized = obj.title
              .replaceAll(" ", "_")
              .replace(/\u200C/g, "");
            if (normalized === text) {
              rawText = obj.title;
            }
          }
        });
      }

      if (matchedItems.length > 0) {
        setSelectedTitle(matchedItems[0]);
        setSelectedChild(rawText);
      } else {
        if (
          fixedInfoSections.filter(
            (c) => c.title.replaceAll(" ", "_").replace(/\u200C/g, "") === text
          ).length > 0
        ) {
          setSelectedTitle(menuItems[2]);
          setSelectedChild(
            fixedInfoSections.filter(
              (c) =>
                c.title?.replaceAll(" ", "_").replace(/\u200C/g, "") === text
            )[0].title
          );
        } else if (
          variableInfoSections.filter(
            (c) => c.title.replaceAll(" ", "_").replace(/\u200C/g, "") === text
          ).length > 0
        ) {
          setSelectedTitle(menuItems[2]);
          setSelectedChild(
            variableInfoSections.filter(
              (c) =>
                c.title?.replaceAll(" ", "_").replace(/\u200C/g, "") === text
            )[0].title
          );
        }
      }
    }

    if (!selectedTitle && !selectedChild) {
      return (
        <div className="category-Content">
          <Dashboard
            setSelectedTitle={setSelectedTitle}
            setSelectedChild={setSelectedChild}
          />
        </div>
      );
    }

    if (selectedTitle && !selectedChild) {
      if (selectedTitle.title === "دسترسی سریع") {
        const iconMap = {
          "ثبت شرایط و تعریف شغل محل‌ها": <FaClipboardList />,
          "مدیریت مجوزها": <FaFileAlt />,
          "مدیریت آزمون": <FaTasks />,
          "تخصیص مجوز به آزمون": <FaLink />,
          "نتایج آزمون": <FaChartBar />,
          "لیست نفرات": <FaUsers />,
          "مدیریت حوزه‌های آزمون": <FaBuilding />,
          "طراح سوال": <FaPencilAlt />,
          "عوامل اجرایی مجری": <FaUsersGear />,
          "تولید دفترچه آزمون": <GiNotebook />,
          "قرنطینه سوال": <FaLock />,
          "حوزه آزمون": <FaMapMarkerAlt />,
          "لیست نفرات ارزیابی تکمیلی": <FaUserCheck />,
          "سازماندهی ارزیابی": <FaSitemap />,
          "مواد ارزیابی تکمیلی": <FaBook />,
          "مستندات ارزیابی تکمیلی": <FaFilePdf />,
          "نتایج ارزیابی تکمیلی": <FaChartLine />,
          "لیست نفرات گزینش": <FaUserShield />,
          "سازماندهی گزینش": <FaUsersCog />,
          "نتایج گزینش": <FaCheckCircle />,
          "بررسی نشده": <FaFileCircleQuestion />,
          "تأیید شده": <FaFileCircleCheck />,
          "رد شده": <FaFileCircleXmark />,
          "دارای نواقص": <FaFileCircleExclamation />,
          "دریافتی جدید": <FaFileImport />,
          "نیاز به حضور": <BsFillFileEarmarkPersonFill />,
          "تأیید نهایی": <FaFileShield />,
          بایگانی: <BiSolidArchive />,
          "تعیین مجری": <BsBuildingFillAdd />,
          "معرفی آزمون": <BiSolidDetail />,
        };

        const allMenuChildren = menuItems
          .filter((item) => item.title !== "دسترسی سریع")
          .flatMap((item) =>
            Array.isArray(item.children)
              ? item.children
                  .filter(
                    (child) =>
                      (typeof child === "string" ? child : child.title) !==
                        "اطلاعات ثابت" &&
                      (typeof child === "string" ? child : child.title) !==
                        "اطلاعات متغیر" &&
                      hasSubMenuAccess(
                        user?.roleId,
                        item.title,
                        typeof child === "string" ? child : child.title
                      )
                  )
                  .map((child) =>
                    typeof child === "string"
                      ? { title: child, icon: iconMap[child] || <FaTasks /> }
                      : child
                  )
              : []
          );

        const quickAccessItems = [
          ...(accessibleTitles.includes("اطلاعات پایه")
            ? fixedInfoSections
            : []),
          ...(accessibleTitles.includes("اطلاعات پایه")
            ? variableInfoSections
            : []),
          ...allMenuChildren,
        ];

        return (
          <div className="category-Content">
            <CategoryGrid
              children={quickAccessItems}
              setSelectedChild={setSelectedChild}
            />
          </div>
        );
      }

      const children = Array.isArray(selectedTitle.children)
        ? getAccessibleSubMenus(
            user?.roleId,
            selectedTitle.title,
            selectedTitle.children
          )
        : [];
      return (
        <div className="category-Content">
          {children.length > 0 ? (
            <CategoryGrid
              children={children}
              setSelectedChild={setSelectedChild}
            />
          ) : (
            <p> </p>
          )}
        </div>
      );
    }

    if (selectedChild) {
      if (baseInfoSections[selectedChild?.trim()]) {
        const { title, data, setData, columns } =
          baseInfoSections[selectedChild.trim()];
        const isVariable = variableInfoSections.some(
          (section) => section.title === selectedChild
        );
        if (selectedChild.trim() === "دستگاه اجرایی") {
          return (
            <div className="category-Content">
              <OrganizationPage
                title={title}
                data={data}
                setData={setData}
                columns={columns}
              />
            </div>
          );
        }
        return (
          <div className="category-Content">
            <DynamicList
              title={title}
              data={data}
              setData={setData}
              columns={columns}
              openModal={(mode, item) =>
                openModal({ title, data, setData, columns }, mode, item)
              }
              isVariable={isVariable}
            />
            <DynamicListModal
              isOpen={isModalOpen}
              onClose={closeModal}
              onSubmit={handleSubmit}
              formData={formData}
              onInputChange={handleInputChange}
              section={{ title, data, setData, columns }}
              mode={modalMode}
            />
            {renderWarningModal()}
          </div>
        );
      }

      if (
        selectedTitle?.title?.trim() === "اطلاعات پایه" ||
        selectedTitle?.title?.trim() === "سازماندهی آزمون"
      ) {
        if (selectedChild === "اطلاعات ثابت") {
          return (
            <div className="category-Content">
              <CategoryGrid
                children={fixedInfoSections}
                setSelectedChild={setSelectedChild}
              />
            </div>
          );
        }

        if (selectedChild === "اطلاعات متغیر") {
          return (
            <div className="category-Content">
              <CategoryGrid
                children={variableInfoSections}
                setSelectedChild={setSelectedChild}
              />
            </div>
          );
        }

        return (
          <div className="category-Content">
            {childComponentMap[selectedChild] || (
              <p>زیرمجموعه "{selectedChild}" یافت نشد</p>
            )}
          </div>
        );
      }

      if (documentReviewChildren.includes(selectedChild)) {
        return (
          <div className="category-Content">
            <DocumentReview
              key={selectedChild}
              selectedChild={selectedChild}
              setSelectedChild={setSelectedChild}
            />
          </div>
        );
      }

      return (
        <div className="category-Content">
          {childComponentMap[selectedChild] || (
            <DefaultChildComponent childName={selectedChild} />
          )}
        </div>
      );
    }

    return <div className="category-Content"></div>;
  };

  return (
    <div className="main-page">
      {renderBreadcrumbs()}
      {renderContent()}
      {isChatOpen && (
        <div className="chat-popup">
          <div className="chat-popup-content">
            <div className="chat-header-main">
              <span className="chat-user-main">
                {JSON.parse(localStorage.user).firstName +
                  " " +
                  JSON.parse(localStorage.user).lastName +
                  " (" +
                  JSON.parse(localStorage.user).role +
                  ")"}
              </span>
              <span className="close-chat" onClick={() => setIsChatOpen(false)}>
                <FaXmark />
              </span>
            </div>
            <Chat />
          </div>
        </div>
      )}
      {JSON.parse(localStorage.user).roleId != "7" && (
        <button className="chatPopUpBtn" onClick={() => setIsChatOpen(true)}>
          <BsChatDotsFill size={24} />
        </button>
      )}
    </div>
  );
};

export default MainPageComp;
