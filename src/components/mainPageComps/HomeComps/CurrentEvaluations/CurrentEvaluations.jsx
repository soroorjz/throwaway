import React, { useState } from "react";
import "./CurrentEvaluations.scss";
import ReactPaginate from "react-paginate";
import { initialEvaluations } from "./initialEvaluations";
import {
  FaFilter,
  FaSearch,
  FaPlus,
  FaSortAmountUpAlt,
  FaDownload,
} from "react-icons/fa";
import CurrentEvaluationsModal from "./CurrentEvaluationsModal"; 

const CurrentEvaluations = () => {
  const [evaluations, setEvaluations] = useState(() => {
    const saved = localStorage.getItem("evaluations");
    return saved ? JSON.parse(saved) : initialEvaluations;
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [filters, setFilters] = useState({
    organizer: "",
    sort: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddSuccessModalOpen, setIsAddSuccessModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedEvaluation, setSelectedEvaluation] = useState(null);
  const [newEvaluation, setNewEvaluation] = useState({
    examTitle: "",
    organizer: "",
    registrationDate: null,
    documents: null,
  });

  const itemsPerPage = 4;

  const sortOptions = [
    { value: "", label: "پیش‌فرض" },
    { value: "registrationDateAsc", label: "صعودی (تاریخ ثبت)" },
    { value: "registrationDateDesc", label: "نزولی (تاریخ ثبت)" },
  ];

  const filterConfig = [
    {
      label: "مجری آزمون",
      key: "organizer",
      options: [
        { value: "", label: "همه" },
        { value: "سازمان سنجش", label: "سازمان سنجش" },
        { value: "دانشگاه علوم پزشکی", label: "دانشگاه علوم پزشکی" },
        { value: "شرکت برق منطقه‌ای", label: "شرکت برق منطقه‌ای" },
        { value: "شرکت ملی نفت", label: "شرکت ملی نفت" },
        { value: "شهرداری تهران", label: "شهرداری تهران" },
        { value: "بانک مرکزی", label: "بانک مرکزی" },
        { value: "سازمان راهداری", label: "سازمان راهداری" },
        { value: "سازمان محیط زیست", label: "سازمان محیط زیست" },
      ],
    },
  ];

  React.useEffect(() => {
    localStorage.setItem("evaluations", JSON.stringify(evaluations));
  }, [evaluations]);

  const handleEditClick = (evaluation) => {
    setSelectedEvaluation(evaluation);
    setNewEvaluation({
      examTitle: evaluation.examTitle,
      organizer: evaluation.organizer,
      registrationDate: evaluation.registrationDate,
      documents: evaluation.documents,
    });
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (id) => {
    if (
      window.confirm(
        `آیا مطمئن هستید که می‌خواهید ارزیابی با شماره ${id} را حذف کنید؟`
      )
    ) {
      setEvaluations((prevEvaluations) =>
        prevEvaluations.filter((evaluation) => evaluation.id !== id)
      );
      setCurrentPage(0);
    }
  };

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({ ...prev, [filterType]: value }));
    setCurrentPage(0);
  };

  const filteredEvaluations = evaluations
    .filter((evaluation) =>
      Object.values(evaluation).some((value) =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
    .filter((evaluation) =>
      !filters.organizer ? true : evaluation.organizer === filters.organizer
    )
    .sort((a, b) => {
      if (!filters.sort) return 0;
      return filters.sort === "registrationDateAsc"
        ? a.registrationDate.localeCompare(b.registrationDate)
        : b.registrationDate.localeCompare(a.registrationDate);
    });

  const pageCount = Math.ceil(filteredEvaluations.length / itemsPerPage);
  const offset = currentPage * itemsPerPage;
  const currentItems = filteredEvaluations.slice(offset, offset + itemsPerPage);

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleEvaluationSubmit = (e) => {
    e.preventDefault();
    if (isEditMode) {
      setEvaluations((prev) =>
        prev.map((evaluation) =>
          evaluation.id === selectedEvaluation.id
            ? {
                ...evaluation,
                examTitle: newEvaluation.examTitle,
                organizer: newEvaluation.organizer,
                registrationDate: newEvaluation.registrationDate
                  ? newEvaluation.registrationDate.format("YYYY/MM/DD")
                  : "",
                documents: newEvaluation.documents
                  ? newEvaluation.documents.name
                  : "",
              }
            : evaluation
        )
      );
    } else {
      const newId = evaluations.length
        ? Math.max(...evaluations.map((e) => e.id)) + 1
        : 1;
      const evaluationToAdd = {
        id: newId,
        examTitle: newEvaluation.examTitle,
        organizer: newEvaluation.organizer,
        registrationDate: newEvaluation.registrationDate
          ? newEvaluation.registrationDate.format("YYYY/MM/DD")
          : "",
        documents: newEvaluation.documents ? newEvaluation.documents.name : "",
      };
      setEvaluations((prev) => [evaluationToAdd, ...prev]);
    }
    setNewEvaluation({
      examTitle: "",
      organizer: "",
      registrationDate: null,
      documents: null,
    });
    setIsModalOpen(false);
    setIsEditMode(false);
    setSelectedEvaluation(null);
    setTimeout(() => {
      setIsAddSuccessModalOpen(true);
      setTimeout(() => {
        setIsAddSuccessModalOpen(false);
      }, 3000);
    }, 300);
  };

  const handleFormChange = (key, value) => {
    setNewEvaluation((prev) => ({ ...prev, [key]: value }));
  };

  const handleDownload = (documentFile) => {
    if (documentFile) {
      const fileUrl = `https://example.com/documents/${documentFile}`;
      const link = document.createElement("a");
      link.href = fileUrl;
      link.download = documentFile;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="current-evaluations">
      <div className="current-evaluations__titleWrapper">
        <h2 className="current-evaluations__title">ارزیابی‌های جاری</h2>
        <button
          className="assign-permit__add-btn"
          onClick={() => {
            setIsEditMode(false);
            setNewEvaluation({
              examTitle: "",
              organizer: "",
              registrationDate: null,
              documents: null,
            });
            setIsModalOpen(true);
          }}
        >
          <FaPlus /> افزودن
        </button>
      </div>

      <div className="current-evaluations__search-container">
        <div className="current-evaluations__actions">
          <div className="current-evaluations__filter-container">
            <div className="current-evaluations__filter">
              <FaFilter className="current-evaluations__filter-icon" />
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
          <div className="current-evaluations__sort-container">
            <div className="current-evaluations__sort">
              <FaSortAmountUpAlt className="current-evaluations__sort-icon" />
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
        <div className="current-evaluations__search-wrapper">
          <FaSearch className="current-evaluations__search-icon" />
          <input
            type="text"
            placeholder="جستجو..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(0);
            }}
            className="current-evaluations__search-input"
          />
        </div>
      </div>

      <div className="current-evaluations__list">
        {currentItems.length > 0 ? (
          currentItems.map((evaluation) => (
            <div key={evaluation.id} className="current-evaluations__item">
              <div className="current-evaluations__header">
                <p className="current-evaluations__headerDetail">
                  <span>{evaluation.examTitle}</span>
                </p>
                <p className="current-evaluations__headerDetail administratorName">
                  <span>نام مجری: {evaluation.organizer}</span>
                </p>
              </div>
              <div className="current-evaluations__body">
                <p className="current-evaluations__detail">
                  تاریخ ثبت: <span>{evaluation.registrationDate}</span>
                </p>
                <p className="current-evaluations__detail">
                  {evaluation.documents ? (
                    <button
                      className="download-btn"
                      onClick={() => handleDownload(evaluation.documents)}
                    >
                      <FaDownload className="download-icon" />
                      دریافت مستندات
                    </button>
                  ) : (
                    <span>بدون مستندات</span>
                  )}
                </p>
              </div>
              <div className="current-evaluations__btns">
                <button
                  className="current-evaluations__action-btn edit"
                  onClick={() => handleEditClick(evaluation)}
                >
                  ویرایش
                </button>
                <button
                  className="current-evaluations__action-btn delete"
                  onClick={() => handleDeleteClick(evaluation.id)}
                >
                  حذف
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>هیچ ارزیابی یافت نشد</p>
        )}
      </div>

      <CurrentEvaluationsModal
        isModalOpen={isModalOpen}
        isAddSuccessModalOpen={isAddSuccessModalOpen}
        setIsModalOpen={setIsModalOpen}
        setIsAddSuccessModalOpen={setIsAddSuccessModalOpen}
        handleEvaluationSubmit={handleEvaluationSubmit}
        handleFormChange={handleFormChange}
        newEvaluation={newEvaluation}
        isEditMode={isEditMode}
        filterConfig={filterConfig}
      />

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

export default CurrentEvaluations;
