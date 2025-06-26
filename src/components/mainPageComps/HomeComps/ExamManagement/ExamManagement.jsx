import React, { useState, useEffect, useRef, useCallback } from "react";
import "./ExamManagement.scss";
import ExamCard from "./ExamCard";
import ExamActions from "./ExamActions";
import { initialExams } from "./examManagementData";
import ExamTabs from "./ExamTabs/ExamTabs";
import AddExamModal from "./AddExamModal/AddExamModal";
import { FaPlus } from "react-icons/fa";
import { useAuth } from "../../../../AuthContext";
import { persianToLatinDigits } from "../../../../utils/persianToLatinDigits";
import { getHandler } from "../../../../apiService";



const ExamManagement = () => {
  let apiExam = getHandler("exam");
  const { user } = useAuth();
  const [exams, setExams] = useState(apiExam);
  const [originalExams, setOriginalExams] = useState(null);
  const [selectedExamId, setSelectedExamId] = useState(null);
  const [editingField, setEditingField] = useState(null);
  const [filters, setFilters] = useState({
    organizer: "",
    status: "",
    sort: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [activeYear, setActiveYear] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const sectionRefs = useRef({});
  const isProgrammaticScroll = useRef(false);

  const groupedExams = React.useMemo(() => {
    const result = exams.reduce((acc, exam) => {
      const year =
        exam.examDate && persianToLatinDigits(exam.examDate.split("/")[0]);
      if (year && !acc[year]) acc[year] = [];
      if (year) acc[year].push(exam);
      else {
        console.warn(`Skipping exam with invalid year, ID ${exam.id}:`, exam);
      }
      return acc;
    }, {});
    console.log("Grouped exams:", result);
    return result;
  }, [exams]);

  const currentYear = 1404;
  const years = React.useMemo(() => {
    const result = Object.keys(groupedExams)
      .map(Number)
      .sort((a, b) => b - a)
      .filter((year) => year >= currentYear - 4);
    console.log("Years:", result);
    return result;
  }, [groupedExams]);

  useEffect(() => {
    if (years.length > 0 && !activeYear) {
      console.log("Setting initial activeYear:", years[0]);
      setActiveYear(years[0]);
    }
  }, [years, activeYear]);

  const handleIntersection = useCallback(
    (entries) => {
      if (isProgrammaticScroll.current) {
        console.log("Ignoring IntersectionObserver due to programmatic scroll");
        return;
      }

      let maxRatio = 0;
      let visibleYear = null;

      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio > maxRatio) {
          maxRatio = entry.intersectionRatio;
          visibleYear = Number(entry.target.id.replace("exam-section-", ""));
        }
      });

      if (visibleYear && visibleYear !== activeYear) {
        console.log(
          `IntersectionObserver: Changing activeYear to ${visibleYear}`
        );
        setActiveYear(visibleYear);
      }
    },
    [activeYear]
  );

  useEffect(() => {
    const observer = new IntersectionObserver(handleIntersection, {
      threshold: 0.3,
      rootMargin: "-10% 0px -10% 0px",
    });

    years.forEach((year) => {
      const element = sectionRefs.current[year];
      if (element) {
        observer.observe(element);
        console.log(`Observing section for year ${year}`);
      } else {
        console.warn(`No element found for year ${year} in sectionRefs`);
      }
    });

    return () => {
      years.forEach((year) => {
        const element = sectionRefs.current[year];
        if (element) observer.unobserve(element);
      });
    };
  }, [years, handleIntersection]);

  const handleEditClick = (id) => {
    setOriginalExams([...exams]);
    setSelectedExamId(id);
  };

  const handleCloseOverlay = () => {
    setSelectedExamId(null);
    setEditingField(null);
  };

  const handleFieldChange = (field, value) => {
    setExams((prevExams) =>
      prevExams.map((exam) =>
        exam.id === selectedExamId ? { ...exam, [field]: value } : exam
      )
    );
  };

  const handleCostChange = (examId, value) => {
    if (!/^\d*$/.test(value)) return;
    setExams((prevExams) =>
      prevExams.map((exam) =>
        exam.id === examId ? { ...exam, cost: value } : exam
      )
    );
  };

  const handleTimeChange = (examId, field, value) => {
    if (!/^\d*$/.test(value)) return;
    const numValue = parseInt(value) || 0;

    setExams((prevExams) =>
      prevExams.map((exam) => {
        if (exam.id === examId) {
          const [currentHour, currentMinute] = exam.examTime.split(":");
          if (field === "hour") {
            if (numValue > 23) return exam;
            return {
              ...exam,
              examTime: `${value.padStart(2, "0")}:${currentMinute || "00"}`,
            };
          } else if (field === "minute") {
            if (numValue > 59) return exam;
            return {
              ...exam,
              examTime: `${currentHour || "00"}:${value.padStart(2, "0")}`,
            };
          }
        }
        return exam;
      })
    );
  };

  const handleSaveChanges = () => {
    setSelectedExamId(null);
    setEditingField(null);
    setOriginalExams(null);
  };

  const handleCancelChanges = () => {
    if (originalExams) {
      setExams(originalExams);
    }
    setSelectedExamId(null);
    setEditingField(null);
    setOriginalExams(null);
  };

  const handleDeleteExam = (id) => {
    const confirmDelete = window.confirm(
      "آیا مطمئن هستید که می‌خواهید این آزمون را حذف کنید؟"
    );
    if (!confirmDelete) return;

    const updatedExams = exams.filter((exam) => exam.id !== id);
    setExams(updatedExams);
    console.log("Exam deleted, updatedExams:", updatedExams);
  };

  const handleAddExam = (newExam) => {
    const newId = exams.length
      ? Math.max(...exams.map((exam) => exam.examId)) + 1
      : 1;
    const examToAdd = {
      examId: newId,
      status: 1,
      ...newExam,
    };
    const updatedExams = [examToAdd, ...exams];
    console.log("updatedExams:", updatedExams);
    setExams(updatedExams);
    setIsAddModalOpen(false);
    setFilters({ organizer: "", status: "", sort: "" });
    setSearchTerm("");
    const newYear = persianToLatinDigits(newExam.examDate.split("/")[0]);
    console.log(`Setting activeYear to ${newYear} after adding exam`);
    setActiveYear(Number(newYear));
    setTimeout(() => {
      const section = sectionRefs.current[newYear];
      if (section) {
        console.log(`Scrolling to section for year ${newYear}`);
        isProgrammaticScroll.current = true;
        section.scrollIntoView({ behavior: "smooth", block: "start" });
        setTimeout(() => {
          isProgrammaticScroll.current = false;
          console.log("Programmatic scroll completed");
        }, 1000);
      } else {
        console.warn(`No section found for year ${newYear}`);
      }
    }, 100);
    alert("آزمون جدید با موفقیت اضافه شد!");
  };

  const handleFilterChange = useCallback((filterType, value) => {
    setFilters((prev) => ({ ...prev, [filterType]: value }));
  }, []);

  const sortOptions = [
    { value: "", label: "پیش‌فرض" },
    { value: "startDateAsc", label: "تاریخ ثبت‌نام (نزدیک‌ترین)" },
    { value: "startDateDesc", label: "تاریخ ثبت‌نام (دورترین)" },
    { value: "examDateAsc", label: "تاریخ برگزاری (نزدیک‌ترین)" },
    { value: "examDateDesc", label: "تاریخ برگزاری (دورترین)" },
  ];

  const filterConfig = [
    {
      label: "مجری",
      key: "organizer",
      options: [
        { value: "", label: "همه" },
        {
          value: "مرکز آموزشی و پژوهشی رایانگان",
          label: "مرکز آموزشی و پژوهشی رایانگان",
        },
        { value: "شرکت آزمون گستر", label: "شرکت آزمون گستر" },
        {
          value: "سازمان سنجش و آموزش کشور",
          label: "سازمان سنجش و آموزش کشور",
        },
        { value: "جهاد دانشگاهی", label: "جهاد دانشگاهی" },
      ],
    },
    {
      label: "وضعیت",
      key: "status",
      options: [
        { value: "", label: "همه" },
        { value: "درحال ثبت نام", label: "درحال ثبت نام" },
        { value: "در انتظار", label: "در انتظار" },
        { value: "پایان ثبت نام", label: "پایان ثبت نام" },
        { value: "پایان آزمون", label: "پایان آزمون" },
      ],
    },
  ];

  const filteredExams = React.useMemo(() => {
    const result = exams
      .filter((exam) =>
        Object.values(exam).some((value) =>
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
      .filter((exam) =>
        !filters.organizer ? true : exam.organizer === filters.organizer
      )
      .filter((exam) =>
        !filters.status ? true : exam.status === filters.status
      )
      .sort((a, b) => {
        if (filters.sort === "startDateAsc")
          return a.startDate.localeCompare(b.startDate);
        if (filters.sort === "startDateDesc")
          return b.startDate.localeCompare(a.startDate);
        if (filters.sort === "examDateAsc")
          return a.examDate.localeCompare(b.examDate);
        if (filters.sort === "examDateDesc")
          return b.examDate.localeCompare(a.examDate);
        return 0;
      });
    console.log("Filtered exams:", result);
    return result;
  }, [exams, searchTerm, filters]);

  const filteredGroupedExams = React.useMemo(() => {
    const result = filteredExams.reduce((acc, exam) => {
      const year =
        exam.examDate && persianToLatinDigits(exam.examDate.split("/")[0]);
      if (year && !acc[year]) acc[year] = [];
      if (year) acc[year].push(exam);
      return acc;
    }, {});
    console.log("Filtered grouped exams:", result);
    return result;
  }, [filteredExams]);

  return (
    <div className="exam-management">
      <div className="exam-management__titleWrapper">
        <h2 className="exam-management__title">مدیریت آزمون‌ها</h2>
        {user?.role === "کاربر سازمان اداری و استخدامی" && (
          <button
            className="exam-management__add-btn"
            onClick={() => setIsAddModalOpen(true)}
          >
            <FaPlus /> افزودن
          </button>
        )}
      </div>

      <ExamActions
        filters={filters}
        onFilterChange={handleFilterChange}
        filterConfig={filterConfig}
        sortOptions={sortOptions}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />
      <ExamTabs
        years={years}
        activeYear={activeYear}
        setActiveYear={setActiveYear}
        sectionRefs={sectionRefs}
      />
      <AddExamModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddExam}
        filterConfig={filterConfig}
      />
      <div className="exam-management__sections">
        {years.map((year) => {
          const examsInYear = filteredGroupedExams[year] || [];
          if (examsInYear.length === 0) {
            console.log(`No exams found for year ${year}, skipping section`);
            return null;
          }
          console.log(
            `Rendering section for year ${year} with ${examsInYear.length} exams`
          );
          return (
            <div
              key={year}
              id={`exam-section-${year}`}
              className="exam-management__section"
              ref={(el) => {
                sectionRefs.current[year] = el;
                if (el) console.log(`Section ref set for year ${year}`);
              }}
            >
              <h4 className="exam-management__section-title">
                آزمون‌های برگزار شده در {year}
              </h4>
              <div className="exam-management__grid">
                {examsInYear.map((exam) => (
                  <ExamCard
                    key={exam.id}
                    exam={exam}
                    isOverlay={exam.id === selectedExamId}
                    editingField={editingField}
                    setEditingField={setEditingField}
                    onEditClick={handleEditClick}
                    onCloseOverlay={handleCloseOverlay}
                    onFieldChange={handleFieldChange}
                    onCostChange={handleCostChange}
                    onTimeChange={handleTimeChange}
                    onSaveChanges={handleSaveChanges}
                    onCancelChanges={handleCancelChanges}
                    onDeleteClick={handleDeleteExam}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
      {selectedExamId && (
        <div
          className="exam-management__overlay"
          onClick={handleCloseOverlay}
        />
      )}
    </div>
  );
};

export default ExamManagement;
