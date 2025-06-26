import React, { useState, useEffect } from "react";
import "./AssignPermitToExam.scss";
import { FaFilter, FaSearch, FaSortAmountUpAlt } from "react-icons/fa";
import ReactPaginate from "react-paginate";
import AssignPermitModal from "./AssignPermitModal";
import ViewPermitsModal from "./ViewPermitsModal";

const AssignPermitToExam = () => {
  const [exams, setExams] = useState(() => {
    const saved = localStorage.getItem("exams");
    console.log("Loaded exams:", saved);
    return saved ? JSON.parse(saved) : [];
  });
  const [permits, setPermits] = useState(() => {
    const saved = localStorage.getItem("permits");
    console.log("Loaded permits:", saved);
    return saved ? JSON.parse(saved) : [];
  });
  const [assignments, setAssignments] = useState(() => {
    const saved = localStorage.getItem("examPermitAssignments");
    console.log("Loaded assignments:", saved);
    return saved ? JSON.parse(saved) : [];
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [filters, setFilters] = useState({
    organizer: "",
    permitStatus: "",
    activity: "", // تغییر: افزودن فیلتر فعالیت
    sort: "date-desc",
  });
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedExam, setSelectedExam] = useState(null);
  const itemsPerPage = 4;

  useEffect(() => {
    localStorage.setItem("examPermitAssignments", JSON.stringify(assignments));

    const examPermitDetails = assignments.map((assignment) => {
      const exam = exams.find((e) => e.id === assignment.examId);
      const assignedPermits = permits.filter((p) =>
        assignment.permitIds.includes(p.id)
      );
      return {
        examId: assignment.examId,
        exam: exam || null,
        permits: assignedPermits,
      };
    });
    console.log("Saving examPermitDetails to localStorage:", examPermitDetails);
    localStorage.setItem(
      "examPermitDetails",
      JSON.stringify(examPermitDetails)
    );
  }, [assignments, exams, permits]);

  const isExamDatePassed = (examDate) => {
    // تبدیل تاریخ امروز به فرمت جلالی
    const today = new Date();
    const gregorianYear = today.getFullYear();
    const gregorianMonth = today.getMonth() + 1;
    const gregorianDay = today.getDate();

    // تبدیل ساده میلادی به جلالی (بدون کتابخانه)
    const jalaliYear = gregorianYear - (gregorianYear < 2000 ? 621 : 622);
    const jalaliMonth =
      gregorianMonth > 2 ? gregorianMonth - 2 : gregorianMonth + 10;
    const jalaliDay = gregorianDay;

    const todayJalali = `${jalaliYear}/${jalaliMonth
      .toString()
      .padStart(2, "0")}/${jalaliDay.toString().padStart(2, "0")}`;

    // مقایسه تاریخ‌ها به‌صورت رشته‌ای (فرمت YYYY/MM/DD قابل مقایسه است)
    return examDate < todayJalali;
  };

  const handleAssignClick = (exam) => {
    setSelectedExam(exam);
    setIsAssignModalOpen(true);
  };

  const handleViewPermitsClick = (exam) => {
    setSelectedExam(exam);
    setIsViewModalOpen(true);
  };

  const handleAssignPermits = (selectedPermitIds) => {
    const newAssignment = {
      id: assignments.length
        ? Math.max(...assignments.map((a) => a.id)) + 1
        : 1,
      examId: selectedExam.id,
      permitIds: selectedPermitIds,
    };
    setAssignments((prev) => {
      const updatedAssignments = prev.filter(
        (assignment) => assignment.examId !== selectedExam.id
      );
      return [...updatedAssignments, newAssignment];
    });
    setIsAssignModalOpen(false);
    setSelectedExam(null);
  };

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({ ...prev, [filterType]: value }));
    setCurrentPage(0);
  };

  // تغییر: افزودن فیلتر فعالیت به filterConfig
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
      key: "permitStatus",
      options: [
        { value: "", label: "همه" },
        { value: "with-permit", label: "دارای مجوز" },
        { value: "without-permit", label: "بدون مجوز" },
      ],
    },
    {
      label: "فعالیت",
      key: "activity",
      options: [
        { value: "", label: "همه" },
        { value: "assignable", label: "قابل تخصیص" },
        { value: "expired", label: "اتمام زمان تخصیص" },
      ],
    },
  ];

  const sortOptions = [
    { value: "date-desc", label: "جدیدترین" },
    { value: "date-asc", label: "قدیمی‌ترین" },
  ];

  let filteredExams = exams
    .filter((exam) => exam.status === "در انتظار")
    .filter((exam) =>
      Object.values(exam).some((value) =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
    .filter((exam) =>
      !filters.organizer ? true : exam.organizer === filters.organizer
    )
    .filter((exam) => {
      if (!filters.permitStatus) return true;
      const assignedPermits = assignments.find((a) => a.examId === exam.id);
      return filters.permitStatus === "with-permit"
        ? assignedPermits && assignedPermits.permitIds.length > 0
        : !assignedPermits || assignedPermits.permitIds.length === 0;
    })
    // تغییر: افزودن فیلتر فعالیت
    .filter((exam) => {
      if (!filters.activity) return true;
      return filters.activity === "assignable"
        ? !isExamDatePassed(exam.examDate)
        : isExamDatePassed(exam.examDate);
    });

  // Sorting based on exam date
  filteredExams = [...filteredExams].sort((a, b) => {
    const dateA = new Date(a.examDate);
    const dateB = new Date(b.examDate);
    return filters.sort === "date-asc" ? dateA - dateB : dateB - dateA;
  });

  console.log("Filtered exams (در انتظار):", filteredExams);

  const pageCount = Math.ceil(filteredExams.length / itemsPerPage);
  const offset = currentPage * itemsPerPage;
  const currentItems = filteredExams.slice(offset, offset + itemsPerPage);

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getAssignedPermits = (examId) => {
    const assignment = assignments.find((a) => a.examId === examId);
    return assignment ? assignment.permitIds : [];
  };

  return (
    <div className="assign-permit">
      <div className="assign-permit__headerTitle">
        <h2 className="assign-permit__title">تخصیص مجوز به آزمون</h2>
      </div>

      <div className="assign-permit__search-container">
        <div className="assign-permit__actions">
          <div className="assign-permit__controls">
            <div className="assign-permit__filter">
              <FaFilter className="filter__icon" />
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
            <div className="assign-permit__sort-container">
              <div className="assign-permit__sort">
                <FaSortAmountUpAlt className="sort__icon" />
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
        <div className="assign-permit__search-wrapper">
          <FaSearch className="assign-permit__search-icon" />
          <input
            type="text"
            placeholder="جستجو..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(0);
            }}
            className="assign-permit__search-input"
          />
        </div>
      </div>

      <AssignPermitModal
        isOpen={isAssignModalOpen}
        onClose={() => {
          setIsAssignModalOpen(false);
          setSelectedExam(null);
        }}
        onSubmit={handleAssignPermits}
        exam={selectedExam}
        existingPermitIds={
          selectedExam ? getAssignedPermits(selectedExam.id) : []
        }
      />

      <ViewPermitsModal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedExam(null);
        }}
        permitIds={selectedExam ? getAssignedPermits(selectedExam.id) : []}
      />

      <div className="assign-permit__list">
        {currentItems.length > 0 ? (
          currentItems.map((exam) => {
            const assignedPermits = getAssignedPermits(exam.id);
            return (
              <div key={exam.id} className="assign-permit__item">
                <div className="assign-permit__header">
                  <p className="assign-permit__headerDetail">
                    <span>{exam.title}</span>
                  </p>
                  <p className="assign-permit__headerDetail permit-status">
                    <span>
                      {assignedPermits.length > 0 ? "دارای مجوز" : "بدون مجوز"}
                    </span>
                  </p>
                </div>
                <div className="assign-permit__body">
                  <p className="assign-permit__detail">
                    نام مجری آزمون کتبی: <span>{exam.organizer}</span>
                  </p>
                  <p className="assign-permit__detail">
                    تاریخ آزمون: <span>{exam.examDate}</span>
                  </p>
                </div>
                <div className="assign-permit__btns">
                  {(!assignedPermits.length ||
                    !isExamDatePassed(exam.examDate)) && (
                    <button
                      className="assign-permit__action-btn assign"
                      onClick={() => handleAssignClick(exam)}
                    >
                      {assignedPermits.length > 0 ? "ویرایش" : "تخصیص"}
                    </button>
                  )}
                  {assignedPermits.length > 0 && (
                    <button
                      className="assign-permit__action-btn view"
                      onClick={() => handleViewPermitsClick(exam)}
                    >
                      مشاهده
                    </button>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <p>هیچ آزمونی یافت نشد</p>
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

export default AssignPermitToExam;
