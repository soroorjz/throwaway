import React, { useState } from "react";
import "./SelectionCandidateList.scss";
import { FaFilter, FaDownload, FaPlus } from "react-icons/fa";
import ReactPaginate from "react-paginate";
import { initialSelectionCandidateList } from "./initialSelectionCandidateList";
import { useAuth } from "../../../../AuthContext";
import SelectionCandidateReportModal from "./SelectionCandidateReportModal";

const SelectionCandidateList = () => {
  const { user } = useAuth();
  const [candidates, setCandidates] = useState(initialSelectionCandidateList);
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
    job: "",
    participantCount: "",
    candidateFile: "",
    candidateFileName: "انتخاب فایل",
  });
  const itemsPerPage = 4;

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({ ...prev, [filterType]: value }));
    setCurrentPage(0);
  };

  const handleEdit = (candidate) => {
    setNewReport({
      examName: candidate.examName,
      organization: candidate.organization,
      job: candidate.job,
      participantCount: candidate.participantCount,
      candidateFile: candidate.candidateFile,
      candidateFileName: candidate.candidateFileName || "دریافت لیست نفرات",
    });
    setSelectedCandidate(candidate);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    setCandidates(candidates.filter((candidate) => candidate.id !== id));
    console.log(`حذف لیست نفرات گزینش با ID: ${id}`);
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
                job: newReport.job,
                participantCount: newReport.participantCount,
                candidateFile: newReport.candidateFile,
                candidateFileName: newReport.candidateFileName,
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
        job: newReport.job,
        participantCount: newReport.participantCount,
        candidateFile: newReport.candidateFile,
        candidateFileName: newReport.candidateFileName,
      };
      setCandidates((prev) => [reportToAdd, ...prev]);
    }
    setNewReport({
      examName: "",
      organization: "",
      job: "",
      participantCount: "",
      candidateFile: "",
      candidateFileName: "انتخاب فایل",
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
        {
          value: "سازمان شهرداری ها و دهیاری های کشور",
          label: "سازمان شهرداری ها و دهیاری های کشور",
        },
        { value: "سازمان بهزیستی کشور", label: "سازمان بهزیستی کشور" },
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

  const examOptions = [
    { value: "", label: "انتخاب کنید" },
    { value: "آزمون استخدامی 1403", label: "آزمون استخدامی 1403" },
    { value: "آزمون کاردانی 1403", label: "آزمون کاردانی 1403" },
    { value: "آزمون کارشناسی 1403", label: "آزمون کارشناسی 1403" },
  ];

  const jobOptions = [
    { value: "", label: "انتخاب کنید" },
    { value: "کارشناس IT", label: "کارشناس IT" },
    { value: "مهندس عمران", label: "مهندس عمران" },
    { value: "حسابدار", label: "حسابدار" },
    { value: "کارشناس منابع انسانی", label: "کارشناس منابع انسانی" },
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
    <div className="selection-candidate-list">
      <div className="selection-candidate-list__titleWrapper">
        <h2 className="selection-candidate-list__title">لیست نفرات گزینش</h2>
        {/* {user?.role !== "کاربر سازمان اداری و استخدامی" && (
          <button
            className="selection-candidate-list__add-btn"
            onClick={() => {
              setIsEditMode(false);
              setNewReport({
                examName: "",
                organization: "",
                job: "",
                participantCount: "",
                candidateFile: "",
                candidateFileName: "انتخاب فایل",
              });
              setIsModalOpen(true);
            }}
          >
            <FaPlus /> افزودن گزارش
          </button>
        )} */}
      </div>

      <div className="selection-candidate-list__search-container">
        <div className="selection-candidate-list__actions">
          <div className="selection-candidate-list__filter">
            <FaFilter className="selection-candidate-list__filter-icon" />
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
          className="selection-candidate-list__search-input"
        />
      </div>

      <SelectionCandidateReportModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setIsEditMode(false);
          setNewReport({
            examName: "",
            organization: "",
            job: "",
            participantCount: "",
            candidateFile: "",
            candidateFileName: "انتخاب فایل",
          });
        }}
        onSubmit={handleAddReport}
        newReport={newReport}
        setNewReport={setNewReport}
        filterConfig={filterConfig}
        examOptions={examOptions}
        jobOptions={jobOptions}
        isEditMode={isEditMode}
      />

      <div className="selection-candidate-list__list">
        {currentItems.length > 0 ? (
          currentItems.map((candidate) => (
            <div key={candidate.id} className="selection-candidate-list__item">
              <div className="selection-candidate-list__content">
                <div className="selection-candidate-list__header">
                  <p className="selection-candidate-list__headerDetail title">
                    {candidate.examName}
                  </p>
                </div>
                <hr className="selection-candidate-list__divider" />
                <div className="selection-candidate-list__body">
                  <p className="selection-candidate-list__detail">
                    دستگاه: <span>{candidate.organization}</span>
                  </p>
                  <p className="selection-candidate-list__detail">
                    شغل: <span>{candidate.job}</span>
                  </p>
                  <p className="selection-candidate-list__detail">
                    تعداد داوطلبان:{" "}
                    <span>{candidate.participantCount} نفر</span>
                  </p>
                </div>
                <div className="selection-candidate-list__actions">
                  <div className="selection-candidate-list__download-buttons">
                    <a
                      href={candidate.candidateFile}
                      download
                      className="selection-candidate-list__download-btn details"
                    >
                      دریافت لیست نفرات
                      <FaDownload />
                    </a>
                  </div>

                  {/* {user?.role !== "کاربر سازمان اداری و استخدامی" && (
                    <div className="selection-candidate-list__edit-delete">
                      <button
                        className="selection-candidate-list__action-btn edit"
                        onClick={() => handleEdit(candidate)}
                      >
                        ویرایش
                      </button>
                      <button
                        className="selection-candidate-list__action-btn delete"
                        onClick={() => handleDelete(candidate.id)}
                      >
                        حذف
                      </button>
                    </div>
                  )} */}
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

export default SelectionCandidateList;
