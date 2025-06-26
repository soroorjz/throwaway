import React, { useEffect, useState } from "react";
import "./ExamResults.scss";
import {
  FaFilter,
  FaDownload,
  FaPlus,
  FaSortAmountUpAlt,
} from "react-icons/fa";
import { Tooltip } from "react-tooltip";
import ReactPaginate from "react-paginate";
import { AnimatePresence } from "framer-motion";
import { initialExamResults } from "./initialExamResults";
import { useAuth } from "../../../../AuthContext";
import ExamStatusModal from "./ExamStatusModal/ExamStatusModal";
import ExamResultModal from "./ExamResultModal/ExamResultModal";

const ExamResults = () => {
  const { user } = useAuth();
  const [examResults, setExamResults] = useState(() => {
    const saved = localStorage.getItem("examResults");
    return saved ? JSON.parse(saved) : initialExamResults;
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [filters, setFilters] = useState({
    organizer: "",
    examName: "",
    organization: "",
    status: "",
    sort: "date-desc",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [selectedResult, setSelectedResult] = useState(null);
  const [newResult, setNewResult] = useState({
    examId: "",
    examName: "",
    examDate: "",
    organizer: "",
    participants: "",
    organization: "",
    resultFile: "",
    detailsFile: "",
    resultFileName: "انتخاب فایل",
    detailsFileName: "انتخاب فایل",
  });
  const itemsPerPage = 8;

  // دریافت exams از localStorage برای فیلترها
  const [exams, setExams] = useState(() => {
    const storedExams = JSON.parse(localStorage.getItem("exams")) || [];
    return storedExams;
  });

  useEffect(() => {
    localStorage.setItem("examResults", JSON.stringify(examResults));
  }, [examResults]);

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({ ...prev, [filterType]: value }));
    setCurrentPage(0);
  };

  const handleEdit = (result) => {
    setNewResult({
      examId: result.examId || "",
      examName: result.examName,
      examDate: result.examDate,
      organizer: result.organizer,
      participants: result.participants,
      organization: result.organization,
      resultFile: result.resultFile,
      detailsFile: result.detailsFile,
      resultFileName: result.resultFileName || "فایل نتایج",
      detailsFileName: result.detailsFileName || "جزئیات نتایج",
    });
    setSelectedResult(result);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    setExamResults(examResults.filter((result) => result.id !== id));
  };

  const handleAddResult = (e) => {
    e.preventDefault();
    if (isEditMode) {
      setExamResults((prev) =>
        prev.map((result) =>
          result.id === selectedResult.id
            ? {
                ...result,
                examId: newResult.examId,
                examName: newResult.examName,
                examDate: newResult.examDate,
                organizer: newResult.organizer,
                participants: newResult.participants,
                organization: newResult.organization,
                resultFile: newResult.resultFile,
                detailsFile: newResult.detailsFile,
                resultFileName: newResult.resultFileName,
                detailsFileName: newResult.detailsFileName,
              }
            : result
        )
      );
    } else {
      const newId = examResults.length
        ? Math.max(...examResults.map((r) => r.id)) + 1
        : 1;
      const resultToAdd = {
        id: newId,
        examId: newResult.examId,
        examName: newResult.examName,
        examDate: newResult.examDate,
        organizer: newResult.organizer,
        participants: newResult.participants,
        organization: newResult.organization,
        resultFile: newResult.resultFile,
        detailsFile: newResult.detailsFile,
        resultFileName: newResult.resultFileName,
        detailsFileName: newResult.detailsFileName,
        status: "در حال بررسی",
        resultDate: new Date().toLocaleDateString("fa-IR").replace(/[/]/g, "/"),
      };
      setExamResults((prev) => [resultToAdd, ...prev]);
    }
    setNewResult({
      examId: "",
      examName: "",
      examDate: "",
      organizer: "",
      participants: "",
      organization: "",
      resultFile: "",
      detailsFile: "",
      resultFileName: "انتخاب فایل",
      detailsFileName: "انتخاب فایل",
    });
    setIsModalOpen(false);
    setIsEditMode(false);
    setSelectedResult(null);
  };

  const handleStatusChange = (id, newStatus) => {
    setExamResults((prev) =>
      prev.map((result) =>
        result.id === id ? { ...result, status: newStatus } : result
      )
    );
    setIsStatusModalOpen(false);
    setSelectedResult(null);
  };

  const openStatusModal = (result) => {
    if (user?.role === "کاربر سازمان اداری و استخدامی") {
      setSelectedResult(result);
      setIsStatusModalOpen(true);
    }
  };

  // استخراج گزینه‌های پویا برای فیلتر عنوان آزمون
  const examNameOptions = [
    { value: "", label: "همه" },
    ...[...new Set(exams.map((exam) => exam.title))]
      .filter((title) => title)
      .map((title) => ({ value: title, label: title })),
  ];

  const filterConfig = [
    ...(user?.role !== "شركت تعاوني پژوهشگران رايانگان فرديس (مجری آزمون کتبی)"
      ? [
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
        ]
      : []),
    {
      label: "عنوان آزمون",
      key: "examName",
      options: examNameOptions,
    },
    {
      label: "دستگاه",
      key: "organization",
      options: [
        { value: "", label: "همه" },
        { value: "وزارت نیرو", label: "وزارت نیرو" },
        { value: "قوه قضاییه", label: "قوه قضاییه" },
        {
          value: "سازمان شهرداری ها و دهیاری های کشور",
          label: "سازمان شهرداری ها و دهیاری های کشور",
        },
        {
          value: "سازمان اداری و استخدامی کشور",
          label: "سازمان اداری و استخدامی کشور",
        },
        {
          value: "بانک مرکزی جمهوری اسلامی ایران",
          label: "بانک مرکزی جمهوری اسلامی ایران",
        },
        {
          value: "سازمان زندانها و اقدامات تامینی و تربیتی کشور",
          label: "سازمان زندانها و اقدامات تامینی و تربیتی کشور",
        },
        {
          value: "سازمان شهرداری ها و دهیاری های کشور",
          label: "سازمان شهرداری ها و دهیاری های کشور",
        },
        { value: "سازمان بهزیستی کشور", label: "سازمان بهزیستی کشور" },
        { value: "وزارت راه و شهرسازی", label: "وزارت راه و شهرسازی" },
        { value: "وزارت امور خارجه", label: "وزارت امور خارجه" },
      ],
    },
    {
      label: "وضعیت",
      key: "status",
      options: [
        { value: "", label: "همه" },
        { value: "در حال بررسی", label: "در حال بررسی" },
        { value: "عدم تأیید", label: "عدم تأیید" },
        { value: "تأیید شده", label: "تأیید شده" },
      ],
    },
  ];

  const sortOptions = [
    { value: "date-desc", label: "جدیدترین" },
    { value: "date-asc", label: "قدیمی‌ترین" },
  ];

  let filteredResults = examResults
    .filter((result) =>
      Object.values(result).some((value) =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
    .filter((result) =>
      !filters.organizer ? true : result.organizer === filters.organizer
    )
    .filter((result) =>
      !filters.examName ? true : result.examName === filters.examName
    )
    .filter((result) =>
      !filters.organization
        ? true
        : result.organization === filters.organization
    )
    .filter((result) =>
      !filters.status ? true : result.status === filters.status
    );

  filteredResults = [...filteredResults].sort((a, b) => {
    const dateA = a.examDate;
    const dateB = b.examDate;
    return filters.sort === "date-asc"
      ? dateA.localeCompare(dateB)
      : dateB.localeCompare(dateA);
  });

  const pageCount = Math.ceil(filteredResults.length / itemsPerPage);
  const offset = currentPage * itemsPerPage;
  const currentItems = filteredResults.slice(offset, offset + itemsPerPage);

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="exam-results">
      <div className="exam-results__titleWrapper">
        <h2 className="exam-results__title">نتایج آزمون‌</h2>
        {user?.role ===
          "شركت تعاوني پژوهشگران رايانگان فرديس (مجری آزمون کتبی)" && (
          <button
            className="assign-permit__add-btn"
            onClick={() => {
              setIsEditMode(false);
              setNewResult({
                examId: "",
                examName: "",
                examDate: "",
                organizer: "",
                participants: "",
                organization: "",
                resultFile: "",
                detailsFile: "",
                resultFileName: "انتخاب فایل",
                detailsFileName: "انتخاب فایل",
              });
              setIsModalOpen(true);
            }}
          >
            <FaPlus /> افزودن
          </button>
        )}
      </div>

      <div className="exam-results__search-container">
        <div className="exam-results__actions">
          <div className="exam-results__controls">
            <div className="exam-results__filter">
              <FaFilter className="exam-results__filter-icon" />
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
            <div className="exam-results__sort-container">
              <div className="exam-results__sort">
                <FaSortAmountUpAlt className="exam-results__sort-icon" />
                <div className="sort-options">
                  {sortOptions.map((option) => (
                    <div
                      key={option.value}
                      className={`sort-item ${
                        filters.sort === option.value ? "active" : ""
                      }`}
                      onClick={() => {
                        handleFilterChange("sort", option.value);
                        setCurrentPage(0);
                      }}
                    >
                      {option.label}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <input
          type="text"
          placeholder="جستجو در نتایج آزمون‌ها..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(0);
          }}
          className="exam-results__search-input"
        />
      </div>

      <ExamResultModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setIsEditMode(false);
          setNewResult({
            examId: "",
            examName: "",
            examDate: "",
            organizer: "",
            participants: "",
            organization: "",
            resultFile: "",
            detailsFile: "",
            resultFileName: "انتخاب فایل",
            detailsFileName: "انتخاب فایل",
          });
        }}
        onSubmit={handleAddResult}
        newResult={newResult}
        setNewResult={setNewResult}
        filterConfig={filterConfig}
        isEditMode={isEditMode}
      />

      <AnimatePresence>
        {isStatusModalOpen && selectedResult && (
          <ExamStatusModal
            isOpen={isStatusModalOpen}
            onClose={() => {
              setIsStatusModalOpen(false);
              setSelectedResult(null);
            }}
            onSubmit={handleStatusChange}
            result={selectedResult}
            source="ExamResults"
          />
        )}
      </AnimatePresence>

      <div className="exam-results__list">
        {currentItems.length > 0 ? (
          currentItems.map((result) => (
            <div key={result.id} className="exam-results__item">
              <div className="exam-results__content">
                <div className="exam-results__header">
                  <div className="exam-results__headerTop">
                    <p className="exam-results__headerDetail title">
                      {result.examName}
                    </p>
                    <p
                      className={`exam-results__headerDetail status ${
                        user?.role === "کاربر سازمان اداری و استخدامی"
                          ? "status--clickable"
                          : ""
                      }`}
                      onClick={() => openStatusModal(result)}
                    >
                      {result.status}
                    </p>
                  </div>
                  {user?.role !==
                    "شركت تعاوني پژوهشگران رايانگان فرديس (مجری آزمون کتبی)" && (
                    <p className="exam-results__headerDetail organizer">
                      مجری: <span>{result.organizer}</span>
                    </p>
                  )}
                  <p className="exam-results__headerDetail exam-results__exam-date">
                    تاریخ آزمون: <span>{result.examDate}</span>
                  </p>
                </div>
                <div className="exam-results__body">
                  <p className="exam-results__detail">
                    شرکت‌کنندگان: <span>{result.participants} نفر</span>
                  </p>
                  <p className="exam-results__detail">
                    دستگاه: <span>{result.organization}</span>
                  </p>
                </div>
                {result.status === "تأیید شده" && (
                  <div className="exam-result__date">
                    <p>
                      تاریخ انتشار نتایج
                      <span>{result.resultDate}</span>
                    </p>
                  </div>
                )}
                <div className="exam-results__actions">
                  <div className="exam-results__download-buttons">
                    <a
                      href={result.resultFile}
                      download
                      className={`exam-results__download-btn results ${
                        result.status !== "تأیید شده" ? "disabled" : ""
                      }`}
                      data-tooltip-id={`result-download-${result.id}`}
                      data-tooltip-content={
                        result.status !== "تأیید شده"
                          ? "امکان دریافت پیش از تأیید امکان‌پذیر نمی‌باشد"
                          : ""
                      }
                      onClick={(e) => {
                        if (result.status !== "تأیید شده") {
                          e.preventDefault();
                        }
                      }}
                    >
                      فایل نتایج
                      <FaDownload />
                    </a>
                    <a
                      href={result.detailsFile}
                      download
                      className={`exam-results__download-btn details ${
                        result.status !== "تأیید شده" ? "disabled" : ""
                      }`}
                      data-tooltip-id={`details-download-${result.id}`}
                      data-tooltip-content={
                        result.status !== "تأیید شده"
                          ? "امکان دریافت پیش از تأیید امکان‌پذیر نمی‌باشد"
                          : ""
                      }
                      onClick={(e) => {
                        if (result.status !== "تأیید شده") {
                          e.preventDefault();
                        }
                      }}
                    >
                      جزئیات نتایج
                      <FaDownload />
                    </a>
                    <Tooltip id={`result-download-${result.id}`} place="top" />
                    <Tooltip id={`details-download-${result.id}`} place="top" />
                  </div>
                  {user?.role ===
                    "شركت تعاوني پژوهشگران رايانگان فرديس (مجری آزمون کتبی)" &&
                    result.status === "در حال بررسی" && (
                      <div className="exam-results__edit-delete">
                        <button
                          className="exam-results__action-btn edit"
                          onClick={() => handleEdit(result)}
                        >
                          ویرایش
                        </button>
                        <button
                          className="exam-results__action-btn delete"
                          onClick={() => handleDelete(result.id)}
                        >
                          حذف
                        </button>
                      </div>
                    )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>هیچ نتیجه‌ای یافت نشد</p>
        )}
      </div>

      {pageCount > 1 && (
        <ReactPaginate
          previousLabel={"قبلی"}
          nextLabel={"بعدی"}
          breakLabel={"..."}
          pageCount={pageCount}
          marginPagesDisplayed={2}
          pageRangeDisplayed={3}
          onPageChange={handlePageClick}
          containerClassName={"pagination"}
          pageClassName={"pagination__page"}
          pageLinkClassName={"pagination__link"}
          previousClassName={"pagination__previous"}
          previousLinkClassName={"pagination__link"}
          nextClassName={"pagination__next"}
          nextLinkClassName={"pagination__link"}
          breakClassName={"pagination__break"}
          breakLinkClassName={"pagination__link"}
          activeClassName={"pagination__active"}
        />
      )}
    </div>
  );
};

export default ExamResults;
