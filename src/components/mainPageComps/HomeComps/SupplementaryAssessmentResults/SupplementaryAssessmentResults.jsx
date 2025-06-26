import React, { useEffect, useState } from "react";
import "./SupplementaryAssessmentResults.scss";
import {
  FaFilter,
  FaDownload,
  FaEdit,
  FaTrash,
  FaSortAmountUpAlt,
  FaPlus,
} from "react-icons/fa";
import ReactPaginate from "react-paginate";
import { motion, AnimatePresence } from "framer-motion";
import { initialSupplementaryResults } from "./initialSupplementaryResults";
import { useAuth } from "../../../../AuthContext";
import AddSupplementaryResultModal from "./AddSupplementaryResultModal/AddSupplementaryResultModal";
import ExamStatusModal from "../ExamResults/ExamStatusModal/ExamStatusModal";
import { Tooltip } from "react-tooltip";

const SupplementaryAssessmentResults = () => {
  const { user } = useAuth();

  const [supplementaryResults, setSupplementaryResults] = useState(() =>
    initialSupplementaryResults.map((result) => ({
      ...result,
      status: [
        "در حال بررسی",
        "در انتظار",
        "تأیید شده",
        "در حال اجرا",
        "به تأیید سازمان اداری و استخدامی", // اضافه کردن برای تبدیل
      ].includes(result.status)
        ? "ارسال به سازمان اداری و استخدامی"
        : result.status.replace(
            "به تأیید سازمان اداری و استخدامی",
            "تأیید سازمان اداری و استخدامی"
          ),
    }))
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [filters, setFilters] = useState({
    organization: "",
    status: "",
    sort: "",
  });
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAddSuccessModalOpen, setIsAddSuccessModalOpen] = useState(false);
  const [selectedResult, setSelectedResult] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [selectedStatusResult, setSelectedStatusResult] = useState(null);
  const itemsPerPage = 10;

  console.log("SupplementaryAssessmentResults component rendered");

  useEffect(() => {
    console.log("User object:", user);
    console.log("User Role:", user?.role);
  }, [user]);

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({ ...prev, [filterType]: value }));
    setCurrentPage(0);
  };

  const handleEdit = (result) => {
    setSelectedResult(result);
    setIsEditMode(true);
    setIsAddModalOpen(true);
  };

  const handleDelete = (id) => {
    setSupplementaryResults(
      supplementaryResults.filter((result) => result.id !== id)
    );
    console.log(`حذف ارزیابی با ID: ${id}`);
  };

  const handleAddResult = (newResult) => {
    if (isEditMode && selectedResult) {
      setSupplementaryResults((prev) =>
        prev.map((result) =>
          result.id === selectedResult.id
            ? {
                ...newResult,
                id: selectedResult.id,
                resultFile: newResult.resultFile
                  ? newResult.resultFile.name
                  : newResult.resultFile,
                status: "ارسال به سازمان اداری و استخدامی",
              }
            : result
        )
      );
    } else {
      const newId = supplementaryResults.length
        ? Math.max(...supplementaryResults.map((r) => r.id)) + 1
        : 1;
      setSupplementaryResults((prev) => [
        {
          ...newResult,
          id: newId,
          status: "ارسال به سازمان اداری و استخدامی",
          resultFile: newResult.resultFile
            ? newResult.resultFile.name
            : newResult.resultFile,
        },
        ...prev,
      ]);
    }
    setIsAddModalOpen(false);
    setIsEditMode(false);
    setSelectedResult(null);
    setIsAddSuccessModalOpen(true);
    setTimeout(() => {
      setIsAddSuccessModalOpen(false);
    }, 3000);
  };

  const handleStatusChange = (id, newStatus) => {
    console.log(
      `Updating status for supplementary result ID ${id} to: ${newStatus}`
    );
    setSupplementaryResults((prev) =>
      prev.map((result) =>
        result.id === id ? { ...result, status: newStatus } : result
      )
    );
    setIsStatusModalOpen(false);
    setSelectedStatusResult(null);
  };

  const openStatusModal = (result) => {
    console.log("Status button clicked. User Role:", user?.role);
    console.log("Result status:", result.status);
    console.log("Result object:", result);
    console.log("User object:", user);

    // بررسی وجود result و user
    if (!result || !user) {
      console.error("Result or user is undefined");
      alert("خطا: اطلاعات کاربر یا نتیجه یافت نشد.");
      return;
    }

    // نرمال‌سازی وضعیت برای حذف فاصله‌های اضافی
    const normalizedStatus = result.status?.trim();
    console.log("Normalized status:", normalizedStatus);

    const canAccess =
      // دسترسی برای نقش "کاربر سازمان اداری و استخدامی"
      (user?.role === "کاربر سازمان اداری و استخدامی" &&
        (normalizedStatus === "ارسال به سازمان اداری و استخدامی" ||
          normalizedStatus === "تأیید سازمان اداری و استخدامی")) ||
      // دسترسی برای نقش "وزارت نیرو"
      (user?.role === "وزارت نیرو" &&
        (normalizedStatus === "تأیید سازمان اداری و استخدامی" ||
          normalizedStatus === "تأیید نهایی"));

    if (canAccess) {
      console.log("Opening ExamStatusModal for result:", result);
      setSelectedStatusResult(result);
      setIsStatusModalOpen(true);
    } else {
      console.error("Access denied: User does not have required permissions.");
      console.error("User role:", user?.role);
      console.error("Status:", normalizedStatus);
      alert("شما دسترسی لازم برای تغییر وضعیت را ندارید.");
    }
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
        { value: "سازمان محیط زیست", label: "سازمان محیط زیست" },
        { value: "وزارت اقتصاد", label: "وزارت اقتصاد" },
      ],
    },
    {
      label: "وضعیت",
      key: "status",
      options: [
        { value: "", label: "همه" },
        {
          value: "ارسال به سازمان اداری و استخدامی",
          label: "ارسال به سازمان اداری و استخدامی",
        },
        {
          value: "تأیید سازمان اداری و استخدامی",
          label: "تأیید سازمان اداری و استخدامی",
        },
        { value: "تأیید نهایی", label: "تأیید نهایی" },
      ],
    },
  ];

  const sortOptions = [
    { value: "", label: "پیش‌فرض" },
    { value: "dateAsc", label: "قدیمی‌ترین" },
    { value: "dateDesc", label: "جدیدترین" },
  ];

  const convertPersianDateToComparable = (persianDate) => {
    const [year, month, day] = persianDate.split("/").map(Number);
    return `${year}${month.toString().padStart(2, "0")}${day
      .toString()
      .padStart(2, "0")}`;
  };

  const filteredResults = supplementaryResults
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
      const dateA = convertPersianDateToComparable(a.date);
      const dateB = convertPersianDateToComparable(b.date);
      return filters.sort === "dateAsc"
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
    <div className="supplementary-results">
      <div className="supplementary-results__title-wrapper">
        <h2 className="supplementary-results__title">نتایج ارزیابی تکمیلی</h2>
        {user?.role ===
          "شركت تعاوني پژوهشگران رايانگان فرديس (مجری ارزیابی تکمیلی)" && (
          <button
            className="supplementary-results__add-btn"
            onClick={() => {
              setIsEditMode(false);
              setSelectedResult(null);
              setIsAddModalOpen(true);
            }}
          >
            <FaPlus /> افزودن
          </button>
        )}
      </div>

      <div className="supplementary-results__search-container">
        <div className="supplementary-results__actions">
          <div className="supplementary-results__filter-container">
            <div className="supplementary-results__filter">
              <FaFilter className="supplementary-results__filter-icon" />
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
          <div className="supplementary-results__sort-container">
            <div className="supplementary-results__sort">
              <FaSortAmountUpAlt className="supplementary-results__sort-icon" />
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
          placeholder="جستجو در نتایج ..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(0);
          }}
          className="supplementary-results__search-input"
        />
      </div>

      <div className="supplementary-results__list">
        {currentItems.length > 0 ? (
          currentItems.map((result) => {
            const canChangeStatus =
              (result.status?.trim() === "ارسال به سازمان اداری و استخدامی" &&
                user?.role === "کاربر سازمان اداری و استخدامی") ||
              (result.status?.trim() === "تأیید سازمان اداری و استخدامی" &&
                (user?.role === "وزارت نیرو" ||
                  user?.role === "کاربر سازمان اداری و استخدامی")) ||
              (result.status?.trim() === "تأیید نهایی" &&
                user?.role === "وزارت نیرو");

            const isDownloadDisabled =
              result.status === "ارسال به سازمان اداری و استخدامی" &&
              user?.role === "وزارت نیرو";

            return (
              <div key={result.id} className="supplementary-results__item">
                <div className="supplementary-results__content">
                  <div className="supplementary-results__header">
                    <div className="supplementary-results__headerTop">
                      <p className="supplementary-results__headerDetail title">
                        {result.assessmentName}
                      </p>
                      <p
                        className={`supplementary-results__headerDetail status ${
                          canChangeStatus ? "status--clickable" : ""
                        }`}
                        onClick={() => openStatusModal(result)}
                      >
                        {result.status}
                      </p>
                    </div>
                  </div>
                  <div className="supplementary-results__body">
                    <p className="supplementary-results__detail">
                      مجری: <span>{result.organizer}</span>
                    </p>
                    <p className="supplementary-results__detail">
                      شغل: <span>{result.job}</span>
                    </p>
                    <p className="supplementary-results__detail">
                      دستگاه: <span>{result.organization}</span>
                    </p>
                    <p className="supplementary-results__detail">
                      تاریخ برگزاری: <span>{result.date}</span>
                    </p>
                    <p className="supplementary-results__detail">
                      استان برگزاری ارزیابی تکمیلی:{" "}
                      <span>{result.Province}</span>
                    </p>
                    {result.status === "تأیید نهایی" && (
                      <p className="supplementary-results__detail">
                        تاریخ انتشار نتایج: <span>{result.resultDate}</span>
                      </p>
                    )}
                  </div>
                  <div className="supplementary-results__actions">
                    <div className="supplementary-results__download-buttons">
                      <a
                        href={result.resultFile}
                        download
                        className={`supplementary-results__download-btn results ${
                          isDownloadDisabled ? "disabled" : ""
                        }`}
                        data-tooltip-id={`download-tooltip-${result.id}`}
                        data-tooltip-content={
                          isDownloadDisabled
                            ? "نتایج ارزیابی تکمیلی در دسترس نمی‌باشد"
                            : ""
                        }
                        onClick={(e) => {
                          if (isDownloadDisabled) {
                            e.preventDefault();
                          }
                        }}
                      >
                        فایل نتایج
                        <FaDownload />
                      </a>
                      <Tooltip
                        id={`download-tooltip-${result.id}`}
                        place="top"
                        effect="solid"
                      />
                    </div>
                    {user?.role ===
                      "شركت تعاوني پژوهشگران رايانگان فرديس (مجری ارزیابی تکمیلی)" &&
                      result.status === "ارسال به سازمان اداری و استخدامی" && (
                        <div className="supplementary-results__edit-delete">
                          <button
                            className="supplementary-results__action-btn edit"
                            onClick={() => handleEdit(result)}
                          >
                            ویرایش
                          </button>
                          <button
                            className="supplementary-results__action-btn delete"
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

      <AnimatePresence>
        {isAddModalOpen && (
          <AddSupplementaryResultModal
            isOpen={isAddModalOpen}
            onClose={() => {
              setIsAddModalOpen(false);
              setIsEditMode(false);
              setSelectedResult(null);
            }}
            onSubmit={handleAddResult}
            isEditMode={isEditMode}
            result={selectedResult}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isStatusModalOpen && selectedStatusResult && (
          <ExamStatusModal
            isOpen={isStatusModalOpen}
            onClose={() => {
              setIsStatusModalOpen(false);
              setSelectedStatusResult(null);
            }}
            onSubmit={handleStatusChange}
            result={selectedStatusResult}
            source="SupplementaryAssessmentResults"
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isAddSuccessModalOpen && (
          <>
            <motion.div
              className="success-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            />
            <motion.div
              className="success-modal"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
            >
              <p>
                {isEditMode
                  ? "نتیجه با موفقیت ویرایش شد!"
                  : "نتیجه با موفقیت اضافه شد!"}
              </p>
            </motion.div>
          </>
        )}
      </AnimatePresence>

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

export default SupplementaryAssessmentResults;
