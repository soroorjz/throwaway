import React, { useState } from "react";
import "./EvaluationOrganization.scss";
import {
  FaFilter,
  FaSortAmountUpAlt,
  FaPlus,
  FaDownload,
} from "react-icons/fa";
import ReactPaginate from "react-paginate";
import { motion, AnimatePresence } from "framer-motion";
import { sampleEvaluations } from "./sampleEvaluations";
import { useAuth } from "../../../../AuthContext";
import AddEvaluationModal from "./AddEvaluationModal/AddEvaluationModal";

const EvaluationOrganization = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [filters, setFilters] = useState({
    organization: "",
    job: "",
    group: "",
    location: "",
    stauss: "",
    sort: "",
    province: "",
  });
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAddSuccessModalOpen, setIsAddSuccessModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const canDownload = ["کاربر سازمان اداری و استخدامی", "وزارت نیرو"].includes(
    user?.role
  );
  const [isDeleteSuccessModalOpen, setIsDeleteSuccessModalOpen] =
    useState(false);
  const [evaluationToDelete, setEvaluationToDelete] = useState(null);
  const [selectedEvaluation, setSelectedEvaluation] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const itemsPerPage = 3;

  const handleEditClick = (evaluation) => {
    setSelectedEvaluation(evaluation);
    setIsEditMode(true);
    setIsAddModalOpen(true);
  };

  const handleDeleteClick = (evaluation) => {
    setEvaluationToDelete(evaluation);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    setIsDeleteModalOpen(false);
    setIsDeleteSuccessModalOpen(true);
    console.log(`ارزیابی ${evaluationToDelete.examTitle} حذف شد`);
    setTimeout(() => {
      setIsDeleteSuccessModalOpen(false);
      setEvaluationToDelete(null);
    }, 3000);
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false);
    setEvaluationToDelete(null);
  };

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({ ...prev, [filterType]: value }));
    setCurrentPage(0);
  };

  const handleAddEvaluation = (newEvaluation) => {
    if (isEditMode && selectedEvaluation) {
      // به‌روزرسانی ارزیابی موجود
      const index = sampleEvaluations.findIndex(
        (e) => e.id === selectedEvaluation.id
      );
      if (index !== -1) {
        sampleEvaluations[index] = {
          ...newEvaluation,
          id: selectedEvaluation.id,
          examinees: newEvaluation.examinees
            ? newEvaluation.examinees.name
            : newEvaluation.examinees,
          evaluators: newEvaluation.evaluators
            ? newEvaluation.evaluators.name
            : newEvaluation.evaluators,
        };
      }
    } else {
      // افزودن ارزیابی جدید
      const newId = sampleEvaluations.length
        ? Math.max(...sampleEvaluations.map((e) => e.id)) + 1
        : 1;
      sampleEvaluations.unshift({
        ...newEvaluation,
        id: newId,
        examinees: newEvaluation.examinees
          ? newEvaluation.examinees.name
          : newEvaluation.examinees,
        evaluators: newEvaluation.evaluators
          ? newEvaluation.evaluators.name
          : newEvaluation.evaluators,
      });
    }
    setIsAddModalOpen(false);
    setIsEditMode(false);
    setSelectedEvaluation(null);
    setIsAddSuccessModalOpen(true);
    setTimeout(() => {
      setIsAddSuccessModalOpen(false);
    }, 3000);
  };

  const sortOptions = [
    { value: "", label: "پیش‌فرض" },
    { value: "dateAsc", label: "قدیمی‌ترین آزمون" },
    { value: "dateDesc", label: "جدیدترین آزمون" },
  ];

  const filterConfig = [
    {
      label: "دستگاه",
      key: "organization",
      options: [
        { value: "", label: "همه" },
        { value: "وزارت نیرو", label: "وزارت نیرو" },
        {
          value: "بانک مرکزی جمهوری اسلامی ایران",
          label: "بانک مرکزی جمهوری اسلامی ایران",
        },
        {
          value: "سازمان شهرداری ها و دهیاری های کشور",
          label: "سازمان شهرداری ها و دهیاری های کشور",
        },
        { value: "قوه قضاییه", label: "قوه قضاییه" },
        {
          value: "سازمان زندانها و اقدامات تامینی و تربیتی کشور",
          label: "سازمان زندانها و اقدامات تامینی و تربیتی کشور",
        },
        { value: "سازمان بهزیستی کشور", label: "سازمان بهزیستی کشور" },
        {
          value: "سازمان شهرداری ها و دهیاری های کشور",
          label: "سازمان شهرداری ها و دهیاری های کشور",
        },
        { value: "وزارت راه و شهرسازی", label: "وزارت راه و شهرسازی" },
        { value: "وزارت امور خارجه", label: "وزارت امور خارجه" },
      ],
    },
    {
      label: "شغل",
      key: "job",
      options: [
        { value: "", label: "همه" },
        { value: "اپراتور فوق توزیع", label: "اپراتور فوق توزیع" },
        { value: "متصدی امور دفتری", label: "متصدی امور دفتری" },
        { value: "آتشنشان", label: "آتشنشان" },
        {
          value: "مامور گارد انتظامات زندانها",
          label: "مامور گارد انتظامات زندانها",
        },
        { value: "کارشناس اداری", label: "کارشناس اداری" },
        { value: "حسابدار", label: "حسابدار" },
        { value: "مهندس هوافضا", label: "مهندس هوافضا" },
        { value: "مترجم", label: "مترجم" },
      ],
    },
    {
      label: "گروه",
      key: "group",
      options: [
        { value: "", label: "همه" },
        { value: "گروه الف", label: "گروه الف" },
        { value: "گروه ب", label: "گروه ب" },
        { value: "گروه ج", label: "گروه ج" },
      ],
    },
    {
      label: "استان",
      key: "province",
      options: [
        { value: "", label: "همه" },
        { value: "آذربایجان شرقی", label: "آذربایجان شرقی" },
        { value: "آذربایجان غربی", label: "آذربایجان غربی" },
        { value: "اردبیل", label: "اردبیل" },
        { value: "اصفهان", label: "اصفهان" },
        { value: "البرز", label: "البرز" },
        { value: "ایلام", label: "ایلام" },
        { value: "بوشهر", label: "بوشهر" },
        { value: "تهران", label: "تهران" },
        { value: "چهارمحال و بختیاری", label: "چهارمحال و بختیاری" },
        { value: "خراسان جنوبی", label: "خراسان جنوبی" },
        { value: "خراسان رضوی", label: "خراسان رضوی" },
        { value: "خراسان شمالی", label: "خراسان شمالی" },
        { value: "خوزستان", label: "خوزستان" },
        { value: "زنجان", label: "زنجان" },
        { value: "سمنان", label: "سمنان" },
        { value: "سیستان و بلوچستان", label: "سیستان و بلوچستان" },
        { value: "فارس", label: "فارس" },
        { value: "قزوین", label: "قزوین" },
        { value: "قم", label: "قم" },
        { value: "کردستان", label: "کردستان" },
        { value: "کرمان", label: "کرمان" },
        { value: "کرمانشاه", label: "کرمانشاه" },
        { value: "کهگیلویه و بویراحمد", label: "کهگیلویه و بویراحمد" },
        { value: "گلستان", label: "گلستان" },
        { value: "گیلان", label: "گیلان" },
        { value: "لرستان", label: "لرستان" },
        { value: "مازندران", label: "مازندران" },
        { value: "مرکزی", label: "مرکزی" },
        { value: "هرمزگان", label: "هرمزگان" },
        { value: "همدان", label: "همدان" },
        { value: "یزد", label: "یزد" },
      ],
    },
    {
      label: "وضعیت",
      key: "stauss",
      options: [
        { value: "", label: "همه" },
        { value: "سازماندهی", label: "سازماندهی" },
        { value: "در انتظار اجرا", label: "در انتظار اجرا" },
        { value: "درحال اجرا", label: "درحال اجرا" },
        { value: "در انتظار اعلام نتایج", label: "در انتظار اعلام نتایج" },
        { value: "پایان یافته", label: "پایان یافته" },
      ],
    },
  ];

  // فیلتر کردن filterConfig برای نمایش "دستگاه" فقط برای نقش‌های مجاز
  const filteredFilterConfig = filterConfig.filter((filter) =>
    filter.key === "organization"
      ? [
          "شركت تعاوني پژوهشگران رايانگان فرديس (مجری ارزیابی تکمیلی)",
          "کاربر سازمان اداری و استخدامی",
        ].includes(user?.role)
      : true
  );

  const filteredEvaluations = sampleEvaluations
    .filter((evaluation) =>
      Object.values(evaluation).some((value) =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
    .filter((evaluation) => {
      return (
        (!filters.organization ||
          evaluation.organization === filters.organization) &&
        (!filters.job || evaluation.job === filters.job) &&
        (!filters.group || evaluation.group === filters.group) &&
        (!filters.province || evaluation.province === filters.province) &&
        (!filters.stauss || evaluation.stauss === filters.stauss)
      );
    })
    .sort((a, b) => {
      if (filters.sort === "dateAsc")
        return a.examDate.localeCompare(b.examDate);
      if (filters.sort === "dateDesc")
        return b.examDate.localeCompare(a.examDate);
      return 0;
    });

  const pageCount = Math.ceil(filteredEvaluations.length / itemsPerPage);
  const offset = currentPage * itemsPerPage;
  const currentItems = filteredEvaluations.slice(offset, offset + itemsPerPage);

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="evaluation-organization">
      <div className="evaluation-organization__title-wrapper">
        <h2 className="evaluation-organization__title">سازماندهی ارزیابی</h2>
        {user?.role ===
          "شركت تعاوني پژوهشگران رايانگان فرديس (مجری ارزیابی تکمیلی)" && (
          <button
            className="evaluation-organization__add-btn"
            onClick={() => {
              setIsEditMode(false);
              setSelectedEvaluation(null);
              setIsAddModalOpen(true);
            }}
          >
            <FaPlus /> افزودن
          </button>
        )}
      </div>

      <div className="evaluation-organization__search-container">
        <div className="evaluation-organization__actions">
          <div className="evaluation-organization__filter-container">
            <div className="evaluation-organization__filter">
              <FaFilter className="evaluation-organization__filter-icon" />
              <div className="filter-selects">
                {filteredFilterConfig.map((filter) => (
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
          <div className="evaluation-organization__sort-container">
            <div className="evaluation-organization__sort">
              <FaSortAmountUpAlt className="evaluation-organization__sort-icon" />
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
          placeholder="جستجو در ارزیابی‌ها..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(0);
          }}
          className="evaluation-organization__search-input"
        />
      </div>

      <div className="evaluation-organization__list">
        {currentItems.length > 0 ? (
          currentItems.map((evaluation) => (
            <div key={evaluation.id} className="evaluation-organization__item">
              <div className="evaluation-organization__details">
                <div className="evaluation-organization__header">
                  <p className="evaluation-organization__headerDetail examName">
                    <span>{evaluation.examTitle}</span>
                  </p>
                  <p className="evaluation-organization__headerDetail">
                    وضعیت
                    <span>{evaluation.stauss}</span>
                  </p>
                </div>
                <div className="evaluation-organization__body">
                  <div className="evaluation-organization__dates">
                    <p className="evaluation-organization__detail">
                      شغل: <span>{evaluation.job}</span>
                    </p>
                    <p className="evaluation-organization__detail">
                      دستگاه
                      <span>{evaluation.organization}</span>
                    </p>
                  </div>
                  <div className="evaluation-organization__organization">
                    <p className="evaluation-organization__detail">
                      استان محل برگزاری: <span>{evaluation.province}</span>
                    </p>
                    <p className="evaluation-organization__detail">
                      شهر محل برگزاری: <span>{evaluation.City}</span>
                    </p>
                  </div>
                  <div className="evaluation-organization__lastBox">
                    <p className="evaluation-organization__detail">
                      محل: <span>{evaluation.location}</span>
                    </p>
                    <p className="evaluation-organization__detail">
                      گروه: <span>{evaluation.group}</span>
                    </p>
                  </div>
                  <div className="evaluation-organization__organization">
                    <p className="evaluation-organization__detail">
                      تاریخ برگزاری: <span>{evaluation.examDate}</span>
                    </p>
                    <p className="evaluation-organization__detail">
                      ساعت برگزاری: <span>{evaluation.examTime}</span>
                    </p>
                  </div>
                  <div className="evaluation-organization__organization">
                    <p className="evaluation-organization__detail">
                      تاریخ پایان برگزاری: <span>{evaluation.examEndDate}</span>
                    </p>
                    <p className="evaluation-organization__detail">
                      ساعت پایان برگزاری: <span>{evaluation.examEndTime}</span>
                    </p>
                  </div>
                  <div className="evaluation-organization__lastBox">
                    <p className="evaluation-organization__detail">
                      تعداد ارزیابی‌شوندگان:
                      <span>{evaluation.examineesCount}نفر</span>
                    </p>
                    <p className="evaluation-organization__detail">
                      تعداد ارزیابان:
                      <span>{evaluation.evaluatorsCount}نفر</span>
                    </p>
                  </div>
                  <div className="evaluation-organization__lastBox">
                    <p className="evaluation-organization__detail">
                      لیست ارزیابی‌شوندگان:
                      {evaluation.examinees ? (
                        <a
                          href={canDownload ? evaluation.examinees : undefined}
                          download={canDownload}
                          className={`download-btn ${
                            !canDownload ? "disabled-download" : ""
                          }`}
                          aria-disabled={!canDownload}
                          onClick={(e) => !canDownload && e.preventDefault()}
                        >
                          <FaDownload className="download-icon" />
                        </a>
                      ) : (
                        <span>بدون مستندات</span>
                      )}
                    </p>
                    <p className="evaluation-organization__detail">
                      لیست ارزیابان:
                      {evaluation.evaluators ? (
                        <a
                          href={canDownload ? evaluation.examinees : undefined}
                          download={canDownload}
                          className={`download-btn ${
                            !canDownload ? "disabled-download" : ""
                          }`}
                          aria-disabled={!canDownload}
                          onClick={(e) => !canDownload && e.preventDefault()}
                        >
                          <FaDownload className="download-icon" />
                        </a>
                      ) : (
                        <span>بدون مستندات</span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
              {[
                "وزارت نیرو",
                "کاربر سازمان اداری و استخدامی",
                "شركت تعاوني پژوهشگران رايانگان فرديس (مجری ارزیابی تکمیلی)",
              ].includes(user?.role) && (
                <div className="evaluation-organization__btns">
                  {user?.role ===
                    "شركت تعاوني پژوهشگران رايانگان فرديس (مجری ارزیابی تکمیلی)" && (
                    <>
                      <button
                        className="evaluation-organization__details-btn edit"
                        onClick={() => handleEditClick(evaluation)}
                      >
                        ویرایش
                      </button>
                      <button
                        className="evaluation-organization__details-btn delete"
                        onClick={() => handleDeleteClick(evaluation)}
                      >
                        حذف
                      </button>
                    </>
                  )}
                  {[
                    "وزارت نیرو",
                    "کاربر سازمان اداری و استخدامی",
                    "شركت تعاوني پژوهشگران رايانگان فرديس (مجری ارزیابی تکمیلی)",
                  ].includes(user?.role) && (
                    <a
                      href={evaluation.scheduleFile}
                      download
                      className="evaluation-organization__details-btn schedule"
                    >
                      دریافت برنامه زمان‌بندی
                    </a>
                  )}
                </div>
              )}
            </div>
          ))
        ) : (
          <p>هیچ ارزیابی یافت نشد</p>
        )}
      </div>

      <AnimatePresence>
        {isAddModalOpen && (
          <AddEvaluationModal
            isOpen={isAddModalOpen}
            onClose={() => {
              setIsAddModalOpen(false);
              setIsEditMode(false);
              setSelectedEvaluation(null);
            }}
            onSubmit={handleAddEvaluation}
            isEditMode={isEditMode}
            evaluation={selectedEvaluation}
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
                  ? "ارزیابی با موفقیت ویرایش شد!"
                  : "ارزیابی با موفقیت اضافه شد!"}
              </p>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isDeleteModalOpen && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="delete-modal-content"
              initial={{ scale: 0.7, y: "-50%" }}
              animate={{ scale: 1, y: "0%" }}
              exit={{ scale: 0.7, y: "-50%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <h3>تأیید حذف</h3>
              <p>آیا از حذف ارزیابی مطمئن هستید؟</p>
              <div className="modal-buttons">
                <button className="modal-submit" onClick={handleDeleteConfirm}>
                  بله
                </button>
                <button className="modal-cancel" onClick={handleDeleteCancel}>
                  خیر
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isDeleteSuccessModalOpen && (
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
              <p>ارزیابی با موفقیت حذف شد!</p>
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

export default EvaluationOrganization;
