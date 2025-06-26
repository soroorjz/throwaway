import React, { useState } from "react";
import "./CandidateList.scss";
import { FaFilter, FaDownload, FaPlus } from "react-icons/fa";
import ReactPaginate from "react-paginate";
import { initialCandidateList } from "./initialCandidateList";
import { useAuth } from "../../../../AuthContext";
import CandidateReportModal from "./CandidateReportModal";

const CandidateList = () => {
  const { user } = useAuth();
  const [candidates, setCandidates] = useState(initialCandidateList);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [filters, setFilters] = useState({
    organization: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [newReport, setNewReport] = useState({
    examName: "",
    organization: "",
    capacityMultiple: "",
    candidateFile: "",
    candidateFileName: "انتخاب فایل",
    status: "در انتظار", // اضافه کردن status پیش‌فرض
  });
  const itemsPerPage = 10;

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({ ...prev, [filterType]: value }));
    setCurrentPage(0);
  };

  const handleEdit = (candidate) => {
    setNewReport({
      examName: candidate.examName,
      organization: candidate.organization,
      capacityMultiple: candidate.capacityMultiple,
      candidateFile: candidate.candidateFile,
      candidateFileName: candidate.candidateFileName || "دریافت لیست نفرات",
      status: "در انتظار", // تنظیم status به "در انتظار" هنگام ویرایش
    });
    setSelectedCandidate(candidate);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    setCandidates(candidates.filter((candidate) => candidate.id !== id));
    console.log(`حذف لیست نفرات با ID: ${id}`);
  };

  const handleAddReport = (e) => {
    e.preventDefault();
    if (isEditMode) {
      setCandidates((prev) =>
        prev.map((candidate) =>
          candidate.id === selectedCandidate.id
            ? {
                ...candidate,
                examName: newReport.examName,
                organization: newReport.organization,
                capacityMultiple: newReport.capacityMultiple,
                candidateFile: newReport.candidateFile,
                candidateFileName: newReport.candidateFileName,
                status: newReport.status, // استفاده از status جدید
              }
            : candidate
        )
      );
    } else {
      const newId = candidates.length
        ? Math.max(...candidates.map((c) => c.id)) + 1
        : 1;
      const reportToAdd = {
        id: newId,
        examName: newReport.examName,
        organization: newReport.organization,
        capacityMultiple: newReport.capacityMultiple,
        candidateFile: newReport.candidateFile,
        candidateFileName: newReport.candidateFileName,
        status: newReport.status, // اضافه کردن status
      };
      setCandidates((prev) => [reportToAdd, ...prev]);
    }
    setNewReport({
      examName: "",
      organization: "",
      capacityMultiple: "",
      candidateFile: "",
      candidateFileName: "انتخاب فایل",
      status: "در انتظار", // ریست با status پیش‌فرض
    });
    setIsModalOpen(false);
    setIsEditMode(false);
    setSelectedCandidate(null);
  };

  const filterConfig = [
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
          value: "بانک مرکزی جمهوری اسلامی ایران",
          label: "بانک مرکزی جمهوری اسلامی ایران",
        },
        {
          value: "سازمان زندانها و اقدامات تامینی و تربیتی کشور",
          label: "سازمان زندانها و اقدامات تامینی و تربیتی کشور",
        },
        { value: "سازمان بهزیستی کشور", label: "سازمان بهزیستی کشور" },
        { value: "وزارت راه و شهرسازی", label: "وزارت راه و شهرسازی" },
        { value: "وزارت امور خارجه", label: "وزارت امور خارجه" },
      ],
    },
  ];

  const capacityOptions = [
    { value: "", label: "انتخاب کنید" },
    { value: "3 برابر ظرفیت", label: "3 برابر ظرفیت" },
    { value: "5 برابر ظرفیت", label: "5 برابر ظرفیت" },
  ];

  const filteredCandidates = candidates
    .filter((candidate) =>
      Object.values(candidate).some((value) =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
    .filter((candidate) =>
      !filters.organization
        ? true
        : candidate.organization === filters.organization
    );

  const pageCount = Math.ceil(filteredCandidates.length / itemsPerPage);
  const offset = currentPage * itemsPerPage;
  const currentItems = filteredCandidates.slice(offset, offset + itemsPerPage);

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="candidate-list">
      <div className="candidate-list__titleWrapper">
        <h2 className="candidate-list__title">لیست نفرات ارزیابی تکمیلی</h2>
        {user?.role !== "کاربر سازمان اداری و استخدامی" && (
          <button
            className="candidate-list__add-btn"
            onClick={() => {
              setIsEditMode(false);
              setNewReport({
                examName: "",
                organization: "",
                capacityMultiple: "",
                candidateFile: "",
                candidateFileName: "انتخاب فایل",
                status: "در انتظار", // تنظیم status پیش‌فرض
              });
              setIsModalOpen(true);
            }}
          >
            <FaPlus /> افزودن
          </button>
        )}
      </div>

      <div className="candidate-list__search-container">
        <div className="candidate-list__actions">
          <div className="candidate-list__filter">
            <FaFilter className="candidate-list__filter-icon" />
            <div className="filter-selects">
              {filterConfig.map((filter) => (
                <div key={filter.key} className="filter-select-wrapper">
                  <label className="filter-select-label">{filter.label}</label>
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
        <input
          type="text"
          placeholder="جستجو در لیست نفرات..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(0);
          }}
          className="candidate-list__search-input"
        />
      </div>

      <CandidateReportModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setIsEditMode(false);
          setNewReport({
            examName: "",
            organization: "",
            capacityMultiple: "",
            candidateFile: "",
            candidateFileName: "انتخاب فایل",
            status: "در انتظار", // تنظیم status پیش‌فرض
          });
        }}
        onSubmit={handleAddReport}
        newReport={newReport}
        setNewReport={setNewReport}
        filterConfig={filterConfig}
        capacityOptions={capacityOptions}
        isEditMode={isEditMode}
      />

      <div className="candidate-list__list">
        {currentItems.length > 0 ? (
          currentItems.map((candidate) => (
            <div key={candidate.id} className="candidate-list__item">
              <div className="candidate-list__content">
                <div className="candidate-list__header">
                  <p className="candidate-list__headerDetail title">
                    {candidate.examName}
                  </p>
                  <p className="candidate-list__headerDetail headerDetailStatus">
                    {candidate.status}
                  </p>
                </div>
                <hr className="candidate-list__divider" />
                <div className="candidate-list__body">
                  <p className="candidate-list__detail">
                    دستگاه: <span>{candidate.organization}</span>
                  </p>
                  <p className="candidate-list__detail">
                    چند برابر ظرفیت: <span>{candidate.capacityMultiple}</span>
                  </p>
                </div>
                <div className="candidate-list__actions">
                  <div className="candidate-list__download-buttons">
                    <a
                      href={candidate.candidateFile}
                      download
                      className="candidate-list__download-btn details"
                    >
                      دریافت لیست نفرات
                      <FaDownload />
                    </a>
                  </div>

                  {user?.role !== "کاربر سازمان اداری و استخدامی" && (
                    <div className="candidate-list__edit-delete">
                      <button
                        className="candidate-list__action-btn edit"
                        onClick={() => handleEdit(candidate)}
                      >
                        ویرایش
                      </button>
                      <button
                        className="candidate-list__action-btn delete"
                        onClick={() => handleDelete(candidate.id)}
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

export default CandidateList;
