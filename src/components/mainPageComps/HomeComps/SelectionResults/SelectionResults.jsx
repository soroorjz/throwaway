import { useState } from "react";
import {
  FaFilter,
  FaDownload,
  FaSortAmountUpAlt,
  FaPlus,
} from "react-icons/fa";
import "./SelectionResults.scss";
import ReactPaginate from "react-paginate";
import { initialSelectionResults } from "./initialSelectionResults";
import { useAuth } from "../../../../AuthContext";
import AddSelectionResultModal from "./AddSelectionResultModal/AddSelectionResultModal";
import SelectionResultStatusModal from "./SelectionResultStatusModal/SelectionResultStatusModal";
import { Tooltip } from "react-tooltip";
import { AnimatePresence } from "framer-motion";

const SelectionResults = () => {
  const { user } = useAuth();
  const [selectionResults, setSelectionResults] = useState(
    initialSelectionResults
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [filters, setFilters] = useState({
    organization: "",
    status: "",
    sort: "",
  });
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedResult, setSelectedResult] = useState(null);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [selectedStatusResult, setSelectedStatusResult] = useState(null);
  const itemsPerPage = 4;

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({ ...prev, [filterType]: value }));
    setCurrentPage(0);
  };

  const handleAddResult = (newResult) => {
    const newId = selectionResults.length
      ? Math.max(...selectionResults.map((r) => r.id)) + 1
      : 1;
    setSelectionResults([{ ...newResult, id: newId }, ...selectionResults]);
    setIsAddModalOpen(false);
    setIsSuccessModalOpen(true);
    setTimeout(() => setIsSuccessModalOpen(false), 3000);
  };

  const handleEdit = (result) => {
    setSelectedResult(result);
    setIsEditModalOpen(true);
  };

  const handleUpdateResult = (updatedResult) => {
    setSelectionResults(
      selectionResults.map((result) =>
        result.id === selectedResult.id
          ? { ...updatedResult, id: selectedResult.id }
          : result
      )
    );
    setIsEditModalOpen(false);
    setSelectedResult(null);
    setIsSuccessModalOpen(true);
    setTimeout(() => setIsSuccessModalOpen(false), 3000);
  };

  const handleDelete = (id) => {
    setSelectionResults(selectionResults.filter((result) => result.id !== id));
    setIsSuccessModalOpen(true);
    setTimeout(() => setIsSuccessModalOpen(false), 3000);
  };

  const handleStatusChange = (id, newStatus) => {
    setSelectionResults((prev) =>
      prev.map((result) =>
        result.id === id ? { ...result, status: newStatus } : result
      )
    );
    setIsStatusModalOpen(false);
    setSelectedStatusResult(null);
    setIsSuccessModalOpen(true);
    setTimeout(() => setIsSuccessModalOpen(false), 3000);
  };

  const openStatusModal = (result) => {
    if (user?.role === "کاربر سازمان اداری و استخدامی") {
      setSelectedStatusResult(result);
      setIsStatusModalOpen(true);
    }
  };

  const filterConfig = [
    {
      label: "دستگاه",
      key: "organization",
      options: [
        { value: "", label: "همه" },
        { value: "وزارت آموزش و پرورش", label: "وزارت آموزش و پرورش" },
        {
          value: "سازمان شهرداری ها و دهیاری های کشور",
          label: "سازمان شهرداری ها و دهیاری های کشور",
        },
        { value: "وزارت نیرو", label: "وزارت نیرو" },
        { value: "سازمان بهزیستی کشور", label: "سازمان بهزیستی کشور" },
        { value: "وزارت نفت", label: "وزارت نفت" },
        { value: "شهرداری تهران", label: "شهرداری تهران" },
        { value: "بانک مرکزی", label: "بانک مرکزی" },
        { value: "وزارت راه", label: "وزارت راه" },
        { value: "سازمان محیط زیست", label: "سازمان محیط زیست" },
        { value: "وزارت اقتصاد", label: "وزارت اقتصاد" },
      ],
    },
    {
      label: "وضعیت",
      key: "status",
      options: [
        { value: "", label: "همه" },
        { value: "تأیید شده", label: "تأیید شده" },
        { value: "عدم تأیید", label: "عدم تأیید" },
        { value: "در انتظار تأیید نتایج", label: "در انتظار تأیید نتایج" },
      ],
    },
  ];

  const sortOptions = [
    { value: "", label: "پیش‌فرض" },
    { value: "statusAsc", label: "صعودی (وضعیت)" },
    { value: "statusDesc", label: "نزولی (وضعیت)" },
  ];

  const filteredResults = selectionResults
    .filter((result) =>
      Object.values(result).some((value) =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
    .filter((result) =>
      !filters.organization
        ? true
        : result.organization === filters.organization
    )
    .filter((result) =>
      !filters.status ? true : result.status === filters.status
    )
    .sort((a, b) => {
      if (!filters.sort) return 0;
      return filters.sort === "statusAsc"
        ? a.status.localeCompare(b.status)
        : b.status.localeCompare(a.status);
    });

  const pageCount = Math.ceil(filteredResults.length / itemsPerPage);
  const offset = currentPage * itemsPerPage;
  const currentItems = filteredResults.slice(offset, offset + itemsPerPage);

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="selection-results">
      <div className="selection-results__title-wrapper">
        <h2 className="selection-results__title">نتایج گزینش</h2>
        {user?.role === "وزارت نیرو" && (
          <button
            className="selection-results__add-btn"
            onClick={() => setIsAddModalOpen(true)}
          >
            <FaPlus /> افزودن
          </button>
        )}
      </div>

      <div className="selection-results__search-container">
        <div className="selection-results__actions">
          <div className="selection-results__filter-container">
            <div className="selection-results__filter">
              <FaFilter className="selection-results__filter-icon" />
              <div className="filter-selects">
                {filterConfig
                  .filter(
                    (filter) =>
                      user?.role !== "وزارت نیرو" ||
                      filter.key !== "organization"
                  )
                  .map((filter) => (
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
          <div className="selection-results__sort-container">
            <div className="selection-results__sort">
              <FaSortAmountUpAlt className="selection-results__sort-icon" />
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
        <input
          type="text"
          placeholder="جستجو در نتایج..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(0);
          }}
          className="selection-results__search-input"
        />
      </div>

      <div className="selection-results__list">
        {currentItems.length > 0 ? (
          currentItems.map((result) => {
            const isDownloadEnabled = result.status === "تأیید شده";
            const canChangeStatus =
              user?.role === "کاربر سازمان اداری و استخدامی";

            return (
              <div key={result.id} className="selection-results__item">
                <div className="selection-results__content">
                  <div className="selection-results__header">
                    <div className="selection-results__headerTop">
                      <p className="selection-results__headerDetail title">
                        {result.examName}
                      </p>
                      <p
                        className={`selection-results__headerDetail status ${
                          canChangeStatus ? "status--clickable" : ""
                        }`}
                        onClick={() => openStatusModal(result)}
                      >
                        {result.status}
                      </p>
                    </div>
                  </div>
                  <hr className="selection-results__divider" />
                  <div className="selection-results__body">
                    <p className="selection-results__detail">
                      شغل: <span>{result.job}</span>
                    </p>
                    {user?.role !== "وزارت نیرو" && (
                      <p className="selection-results__detail">
                        دستگاه: <span>{result.organization}</span>
                      </p>
                    )}
                    <p className="selection-results__detail">
                      تاریخ برگزاری: <span>{result.date}</span>
                    </p>
                  </div>
                  <div className="selection-results__actionsATC">
                    <div className="selection-candidate-list__download-buttons">
                      <a
                        href={isDownloadEnabled ? result.candidateFile : "#"}
                        download={isDownloadEnabled}
                        className={`selection-candidate-list__download-btn ${
                          !isDownloadEnabled ? "disabled" : ""
                        }`}
                        data-tooltip-id={`download-tooltip-${result.id}`}
                        data-tooltip-content={
                          !isDownloadEnabled
                            ? "درحال حاضر، نتایج گزینش در دسترس نمی‌باشد"
                            : ""
                        }
                      >
                        دریافت نتایج گزینش
                        <FaDownload />
                      </a>
                      {!isDownloadEnabled && (
                        <Tooltip
                          id={`download-tooltip-${result.id}`}
                          place="top"
                          style={{
                            backgroundColor: "#1f2937",
                            color: "#ffffff",
                            fontSize: "12px",
                            padding: "8px",
                            borderRadius: "4px",
                            zIndex: 1000,
                            fontFamily: "Vazir, Arial, sans-serif",
                          }}
                        />
                      )}
                    </div>
                    {user?.role === "وزارت نیرو" && (
                      <div className="selection-results__edit-delete">
                        <button
                          className="selection-results__action-btn edit"
                          onClick={() => handleEdit(result)}
                        >
                          ویرایش
                        </button>
                        <button
                          className="selection-results__action-btn delete"
                          onClick={() => handleDelete(result.id)}
                        >
                          حذف
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <p>هیچ نتیجه‌ای یافت نشد</p>
        )}
      </div>

      <AddSelectionResultModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddResult}
        organizationOptions={
          filterConfig.find((f) => f.key === "organization")?.options || []
        }
        user={user}
      />

      <AddSelectionResultModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedResult(null);
        }}
        onSubmit={handleUpdateResult}
        initialData={selectedResult}
        organizationOptions={
          filterConfig.find((f) => f.key === "organization")?.options || []
        }
        user={user}
      />

      <AnimatePresence>
        {isStatusModalOpen && selectedStatusResult && (
          <SelectionResultStatusModal
            isOpen={isStatusModalOpen}
            onClose={() => {
              setIsStatusModalOpen(false);
              setSelectedStatusResult(null);
            }}
            onSubmit={handleStatusChange}
            result={selectedStatusResult}
            source="SelectionResults"
          />
        )}
      </AnimatePresence>

      {isSuccessModalOpen && (
        <div className="success-modal">
          <p>عملیات با موفقیت انجام شد!</p>
        </div>
      )}

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

export default SelectionResults;
