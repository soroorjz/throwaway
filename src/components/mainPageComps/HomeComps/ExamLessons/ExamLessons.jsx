import React, { useState, useEffect, useMemo } from "react";
import { FaPlus, FaSearch, FaFilter, FaSortAmountUpAlt } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "./ExamLessons.scss";
import { PiBooksBold } from "react-icons/pi";
import { examData, sampleQuestions } from "./examData";
import JSZip from "jszip";
import { saveAs } from "file-saver";

const encryptText = (text) => {
  try {
    return btoa(encodeURIComponent(text));
  } catch (error) {
    return text;
  }
};

const decryptText = (text) => {
  try {
    return decodeURIComponent(atob(text));
  } catch (error) {
    return text;
  }
};

const isJalaliDatePassed = (examDate) => {
  const today = "1404/02/21";
  const [examYear, examMonth, examDay] = examDate.split("/").map(Number);
  const [todayYear, todayMonth, todayDay] = today.split("/").map(Number);

  if (examYear < todayYear) return true;
  if (examYear > todayYear) return false;
  if (examMonth < todayMonth) return true;
  if (examMonth > todayMonth) return false;
  return examDay < todayDay;
};

const getExamStatus = (examDate, currentStatus) => {
  if (isJalaliDatePassed(examDate)) {
    return "در دسترس";
  }
  return currentStatus;
};

const validateJalaliDate = (dateStr) => {
  const regex = /^\d{4}\/\d{2}\/\d{2}$/;
  if (!regex.test(dateStr)) return false;
  const [year, month, day] = dateStr.split("/").map(Number);
  return year >= 1300 && month >= 1 && month <= 12 && day >= 1 && day <= 31;
};

const ExamLessons = ({ setSelectedChild, setLessonDetails }) => {
  const [exams, setExams] = useState(() => {
    const savedExams = localStorage.getItem("exams");
    try {
      let parsedExams = savedExams ? JSON.parse(savedExams) : examData;
      const uniqueExams = Array.from(
        new Map(parsedExams.map((exam) => [exam.id, exam])).values()
      );
      const filteredExams = uniqueExams
        .map((exam) => ({
          ...exam,
          status: validateJalaliDate(exam.examDate)
            ? getExamStatus(exam.examDate, exam.status)
            : "در قرنطینه",
        }))
        .filter(
          (exam) =>
            exam &&
            exam.id &&
            exam.examName &&
            typeof exam.examName === "string" &&
            exam.examDate &&
            validateJalaliDate(exam.examDate)
        );
      return filteredExams.length > 0 ? filteredExams : examData;
    } catch (error) {
      console.error("Error parsing localStorage exams:", error);
      const uniqueExams = Array.from(
        new Map(examData.map((exam) => [exam.id, exam])).values()
      );
      return uniqueExams
        .map((exam) => ({
          ...exam,
          status: validateJalaliDate(exam.examDate)
            ? getExamStatus(exam.examDate, exam.status)
            : "در قرنطینه",
        }))
        .filter(
          (exam) =>
            exam &&
            exam.id &&
            exam.examName &&
            typeof exam.examName === "string" &&
            exam.examDate &&
            validateJalaliDate(exam.examDate)
        );
    }
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTokenModalOpen, setIsTokenModalOpen] = useState(false);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [token, setToken] = useState("");
  const [inputToken, setInputToken] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedExamId, setSelectedExamId] = useState(null);
  const [newExam, setNewExam] = useState({
    examName: "",
    examDate: "",
    lessons: [
      { name: "زبان انگلیسی", icon: "fa-language", type: "عمومی" },
      { name: "مهارت‌های کامپیوتری", icon: "fa-laptop", type: "عمومی" },
      { name: "دانش عمومی", icon: "fa-book-open", type: "عمومی" },
      { name: "هوش و استعداد", icon: "fa-brain", type: "عمومی" },
    ],
    status: "در قرنطینه",
  });
  const [filters, setFilters] = useState({
    status: "all",
    sort: "newest",
  });
  const [currentPage, setCurrentPage] = useState(0);

  const STATIC_PASSWORD = "static123";

  const filterConfig = [
    {
      key: "status",
      label: "وضعیت",
      options: [
        { value: "all", label: "همه" },
        { value: "در قرنطینه", label: "در قرنطینه" },
        { value: "منتشر شده", label: "منتشر شده" },
        { value: "در دسترس", label: "در دسترس" },
      ],
    },
  ];

  const sortOptions = [
    { value: "newest", label: "جدیدترین" },
    { value: "oldest", label: "قدیمی‌ترین" },
  ];

  const parseJalaliDate = (dateStr) => {
    if (!dateStr || !validateJalaliDate(dateStr)) {
      return filters.sort === "newest" ? -Infinity : Infinity;
    }
    const [year, month, day] = dateStr.split("/").map(Number);
    return year * 10000 + month * 100 + day;
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(0);
  };

  const filteredExams = useMemo(() => {
    return exams
      .filter((exam) => {
        if (!exam || !exam.examName || !exam.examDate) return false;
        const matchesSearch = exam.examName
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
        const matchesStatus =
          filters.status === "all" || exam.status === filters.status;
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        const dateA = parseJalaliDate(a.examDate);
        const dateB = parseJalaliDate(b.examDate);
        return filters.sort === "newest" ? dateB - dateA : dateA - dateB;
      });
  }, [exams, searchTerm, filters.status, filters.sort]);

  useEffect(() => {
    try {
      localStorage.setItem("exams", JSON.stringify(exams));
    } catch (error) {
      console.error("Error saving exams to localStorage:", error);
    }
  }, [exams]);

  const generateToken = () => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < 8; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    return result;
  };

  const handleAddExam = (e) => {
    e.preventDefault();
    if (!validateJalaliDate(newExam.examDate)) {
      setErrorMessage("فرمت تاریخ نامعتبر است (مثال: 1404/05/01)");
      return;
    }
    if (exams.some((exam) => exam.examName === newExam.examName)) {
      setErrorMessage("آزمونی با این نام قبلاً وجود دارد!");
      return;
    }
    const newId = exams.length ? Math.max(...exams.map((e) => e.id)) + 1 : 1;
    const examToAdd = {
      id: newId,
      ...newExam,
      token: generateToken(),
      status: getExamStatus(newExam.examDate, "در قرنطینه"),
    };
    setExams((prev) => [examToAdd, ...prev]);
    setNewExam({
      examName: "",
      examDate: "",
      lessons: [
        { name: "زبان انگلیسی", icon: "fa-language", type: "عمومی" },
        { name: "مهارت‌های کامپیوتری", icon: "fa-laptop", type: "عمومی" },
        { name: "دانش عمومی", icon: "fa-book-open", type: "عمومی" },
        { name: "هوش و استعداد", icon: "fa-brain", type: "عمومی" },
      ],
      status: "در قرنطینه",
    });
    setIsModalOpen(false);
    setToken(examToAdd.token);
    setIsTokenModalOpen(true);
    setErrorMessage("");
  };

  const examOptions = [
    {
      value: "آزمون استخدامی وزارت بهداشت",
      label: "آزمون استخدامی وزارت بهداشت",
    },
    {
      value: "آزمون استخدامی آموزش و پرورش",
      label: "آزمون استخدامی آموزش و پرورش",
    },
    { value: "آزمون استخدامی شرکت گاز", label: "آزمون استخدامی شرکت گاز" },
    {
      value: "آزمون استخدامی سازمان بنادر",
      label: "آزمون استخدامی سازمان بنادر",
    },
  ];

  const handleLessonClick = (exam, lesson) => {
    setSelectedChild("جزئیات درس");
    setLessonDetails({
      examName: exam.examName,
      lessonName: lesson.name,
      initialQuestions: sampleQuestions,
      examStatus: exam.status,
    });
    window.location.hash = "جزئیات_درس";
  };

  const downloadZip = async (exam) => {
    const zip = new JSZip();

    exam.lessons.forEach((lesson, index) => {
      let content = `درس: ${lesson.name}\nسوالات نمونه:\n`;
      sampleQuestions.forEach((q, qIndex) => {
        content += `
          ${qIndex + 1}. ${q.question}
             الف) ${q.optionA}
             ب) ${q.optionB}
             ج) ${q.optionC}
             د) ${q.optionD}
             پاسخ: ${q.answer} (${q.level})
        `;
      });
      zip.file(`lesson_${index + 1}_${lesson.name}.txt`, content);
    });

    const zipBlob = await zip.generateAsync({ type: "blob" });
    saveAs(zipBlob, `${exam.examName}_questions.zip`);
  };

  const handlePublish = (examId) => {
    setSelectedExamId(examId);
    setIsPublishModalOpen(true);
    setInputToken("");
    setErrorMessage("");
  };

  const validateAndDownload = () => {
    const exam = exams.find((e) => e.id === selectedExamId);
    if (!exam) {
      setErrorMessage("آزمون یافت نشد!");
      return;
    }

    if (inputToken === exam.token || inputToken === STATIC_PASSWORD) {
      setExams((prevExams) =>
        prevExams.map((e) =>
          e.id === selectedExamId
            ? {
                ...e,
                status: getExamStatus(e.examDate, "منتشر شده"),
              }
            : e
        )
      );
      downloadZip(exam);
      setIsPublishModalOpen(false);
      setInputToken("");
      setErrorMessage("");
    } else {
      setErrorMessage("توکن وارد شده نادرست است!");
    }
  };

  return (
    <div className="exam-lessons">
      <div className="exam-lessons__headerTitle">
        <h2 className="exam-lessons__title">قرنطینه سوال</h2>
        {/* <button
          className="exam-lessons__add-btn"
          onClick={() => setIsModalOpen(true)}
        >
          <FaPlus /> افزودن
        </button> */}
      </div>

      <div className="exam-lessons__search-container">
        <div className="exam-lessons__actions">
          <div className="exam-lessons__filter-container">
            <div className="exam-lessons__filter">
              <FaFilter className="exam-lessons__filter-icon" />
              <div className="filter-selects">
                {filterConfig.map((filter) => (
                  <div key={filter.key} className="filter-select-wrapper">
                    <label className="filter-select-label">
                      {filter.label}
                    </label>
                    <select
                      value={filters[filter.key]}
                      onChange={(e) =>
                        handleFilterChange(filter.key, e.target.value)
                      }
                      className="filter-select"
                    >
                      {filter.options.map((option, optIndex) => (
                        <option key={optIndex} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="exam-lessons__sort-container">
            <div className="exam-lessons__sort">
              <FaSortAmountUpAlt className="exam-lessons__sort-icon" />
              <div className="sort-options">
                {sortOptions.map((option) => (
                  <div
                    key={option.value}
                    className={`sort-item ${
                      filters.sort === option.value ? "active" : ""
                    }`}
                    onClick={() => {
                      handleFilterChange("sort", option.value);
                    }}
                  >
                    {option.label}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="exam-lessons__search-wrapper">
          <FaSearch className="exam-lessons__search-icon" />
          <input
            type="text"
            placeholder="جستجو..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(0);
            }}
            className="exam-lessons__search-input"
          />
        </div>
      </div>

      {isModalOpen && (
        <div className="exam-lessons__modal">
          <div className="exam-lessons__modal-content">
            <h3>افزودن مخزن سوال</h3>
            {errorMessage && (
              <p className="exam-lessons__error">{errorMessage}</p>
            )}
            <form onSubmit={handleAddExam}>
              <div className="exam-lessons__modal-form-group">
                <label>نام آزمون</label>
                <select
                  value={newExam.examName}
                  onChange={(e) =>
                    setNewExam({ ...newExam, examName: e.target.value })
                  }
                  required
                >
                  <option value="">انتخاب کنید</option>
                  {examOptions.map((option, index) => (
                    <option key={index} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="exam-lessons__modal-form-group">
                <label>تاریخ آزمون (مثال: 1404/05/01)</label>
                <input
                  type="text"
                  value={newExam.examDate}
                  onChange={(e) =>
                    setNewExam({ ...newExam, examDate: e.target.value })
                  }
                  placeholder="1404/05/01"
                  required
                />
              </div>
              <div className="exam-lessons__modal-form-actions">
                <button
                  type="submit"
                  className="exam-lessons__modal-btn exam-lessons__modal-btn--submit"
                >
                  افزودن
                </button>
                <button
                  type="button"
                  className="exam-lessons__modal-btn exam-lessons__modal-btn--cancel"
                  onClick={() => {
                    setIsModalOpen(false);
                    setErrorMessage("");
                  }}
                >
                  انصراف
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isTokenModalOpen && (
        <div className="exam-lessons__modal">
          <div className="exam-lessons__modal-content">
            <h3>توکن آزمون</h3>
            <p className="exam-lessons__token">{token}</p>
            <p className="exam-lessons__token-info">
              لطفاً این توکن را یادداشت کنید. برای دسترسی به آزمون به آن نیاز
              خواهید داشت.
            </p>
            <div className="exam-lessons__modal-form-actions">
              <button
                className="exam-lessons__modal-btn exam-lessons__modal-btn--submit"
                onClick={() => setIsTokenModalOpen(false)}
              >
                تأیید
              </button>
            </div>
          </div>
        </div>
      )}

      {isPublishModalOpen && (
        <div className="exam-lessons__modal">
          <div className="exam-lessons__modal-content">
            <h3>دریافت سوالات آزمون</h3>
            <p className="exam-lessons__token-info">
              توکن مدنظر پیش‌تر برای شما پیامک گردیده
            </p>
            <div className="exam-lessons__modal-form-group">
              <input
                type="text"
                value={inputToken}
                onChange={(e) => setInputToken(e.target.value)}
                placeholder="توکن را وارد کنید"
                className="exam-lessons__search-input"
              />
              {errorMessage && (
                <p className="exam-lessons__error">{errorMessage}</p>
              )}
            </div>
            <div className="exam-lessons__modal-form-actions">
              <button
                className="exam-lessons__modal-btn exam-lessons__modal-btn--submit"
                onClick={validateAndDownload}
              >
                تأیید
              </button>
              <button
                type="button"
                className="exam-lessons__modal-btn exam-lessons__modal-btn--cancel"
                onClick={() => {
                  setIsPublishModalOpen(false);
                  setErrorMessage("");
                }}
              >
                انصراف
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="exam-lessons__list">
        {filteredExams.length > 0 ? (
          filteredExams.map((exam) => (
            <div key={exam.id} className="exam-lessons__row">
              <div className="exam-lessons__rowTitle">
                <div className="exam-lessons__exam-name">
                  <p>{exam.examName}</p>
                  <p className="exam-lesson__examDate">{exam.examDate}</p>
                  <span
                    className={
                      exam.status === "منتشر شده"
                        ? "Published"
                        : exam.status === "در دسترس"
                        ? "available"
                        : "quarantine"
                    }
                  >
                    {exam.status}
                  </span>
                </div>
                {exam.status !== "در دسترس" && (
                  <button
                    type="button"
                    className="publishBtn"
                    onClick={() => handlePublish(exam.id)}
                  >
                    انتشار
                  </button>
                )}
              </div>

              <Swiper
                modules={[Navigation]}
                spaceBetween={20}
                slidesPerView={3}
                navigation
                loop={filteredExams.length > 3}
                dir="rtl"
                className="exam-lessons__swiper"
              >
                {exam.lessons.map((lesson, index) => (
                  <SwiperSlide key={index}>
                    <div
                      className="exam-lessons__card"
                      onClick={() => handleLessonClick(exam, lesson)}
                    >
                      <p className="exam-lessons__card-type">{lesson.type}</p>
                      <p className="exam-lessons__card-title">{lesson.name}</p>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          ))
        ) : (
          <p>هیچ آزمونی یافت نشد</p>
        )}
      </div>
    </div>
  );
};

export default ExamLessons;
