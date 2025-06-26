import React, { useState } from "react";
import "./ExamAssessmentList.scss";
import { FaFilter, FaDownload, FaSortAmountUpAlt } from "react-icons/fa";
import ReactPaginate from "react-paginate";
import { initialExamAssessmentList } from "./initialExamAssessmentList";

const ExamAssessmentList = () => {
  const [assessments, setAssessments] = useState(initialExamAssessmentList);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [filters, setFilters] = useState({
    organization: "",
    sort: "date-desc",
  });
  const itemsPerPage = 10;

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({ ...prev, [filterType]: value }));
    setCurrentPage(0);
  };

  const handleEdit = (id) => {
    console.log(`ویرایش لیست ارزیابی آزمون با ID: ${id}`);
  };

  const handleDelete = (id) => {
    setAssessments(assessments.filter((assessment) => assessment.id !== id));
    console.log(`حذف لیست ارزیابی آزمون با ID: ${id}`);
  };

  const filterConfig = [
    {
      label: "دستگاه",
      key: "organization",
      options: [
        { value: "", label: "همه" },
        { value: "وزارت آموزش و پرورش", label: "وزارت آموزش و پرورش" },
        { value: "وزارت بهداشت", label: "وزارت بهداشت" },
        { value: "وزارت نیرو", label: "وزارت نیرو" },
        { value: "قوه قضاییه", label: "قوه قضاییه" },
        { value: "وزارت نفت", label: "وزارت نفت" },
        { value: "شهرداری تهران", label: "شهرداری تهران" },
        { value: "بانک مرکزی", label: "بانک مرکزی" },
        { value: "وزارت راه", label: "وزارت راه" },
        { value: "سازمان محیط زیست", label: "سازمان محیط زیست" },
        { value: "وزارت اقتصاد", label: "وزارت اقتصاد" },
      ],
    },
  ];

  const sortOptions = [
    { value: "date-desc", label: "جدیدترین" },
    { value: "date-asc", label: "قدیمی‌ترین" },
  ];

  let filteredAssessments = assessments
    .filter((assessment) =>
      Object.values(assessment).some((value) =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
    .filter((assessment) =>
      !filters.organization
        ? true
        : assessment.examName.includes(filters.organization)
    );

  // Sorting based on examDate
  filteredAssessments = [...filteredAssessments].sort((a, b) => {
    const dateA = a.examDate;
    const dateB = b.examDate;
    return filters.sort === "date-asc"
      ? dateA.localeCompare(dateB)
      : dateB.localeCompare(dateA);
  });

  const pageCount = Math.ceil(filteredAssessments.length / itemsPerPage);
  const offset = currentPage * itemsPerPage;
  const currentItems = filteredAssessments.slice(offset, offset + itemsPerPage);

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="exam-assessment-list">
      <h2 className="exam-assessment-list__title">لیست نفرات</h2>

      <div className="exam-assessment-list__search-container">
        <div className="exam-assessment-list__actions">
          <div className="exam-assessment-list__controls">
            <div className="exam-assessment-list__filter">
              <FaFilter className="exam-assessment-list__filter-icon" />
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
            <div className="exam-assessment-list__sort-container">
              <div className="exam-assessment-list__sort">
                <FaSortAmountUpAlt className="exam-assessment-list__sort-icon" />
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
          placeholder="جستجو در لیست نفرات ..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(0);
          }}
          className="exam-assessment-list__search-input"
        />
      </div>

      <div className="exam-assessment-list__list">
        {currentItems.length > 0 ? (
          currentItems.map((assessment) => (
            <div key={assessment.id} className="exam-assessment-list__item">
              <div className="exam-assessment-list__content">
                <div className="exam-assessment-list__header">
                  <p className="exam-assessment-list__headerDetail title">
                    {assessment.examName}
                  </p>
                  <p className="headerDetailStatus">{assessment.status}</p>
                </div>
                {/* <hr className="exam-assessment-list__divider" /> */}
                <p className="exam-assessment-list__headerDetail exam-date">
                  تاریخ آزمون: <span>{assessment.examDate}</span>
                </p>
                <div className="exam-assessment-list__body">
                  <p className="exam-assessment-list__detail">
                    تعداد کل: <span>{assessment.totalCount} نفر</span>
                  </p>
                  <p className="exam-assessment-list__detail">
                    تعداد زن: <span>{assessment.femaleCount} نفر</span>
                  </p>
                  <p className="exam-assessment-list__detail">
                    تعداد مرد: <span>{assessment.maleCount} نفر</span>
                  </p>
                </div>
                <div className="exam-assessment-list__actions">
                  <div className="exam-assessment-list__download-buttons">
                    <a
                      href={assessment.assessmentFile}
                      download
                      className="exam-assessment-list__download-btn details"
                    >
                      دریافت لیست نفرات
                      <FaDownload />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>هیچ لیستی یافت نشد</p>
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

export default ExamAssessmentList;
