import "./SupplementaryDocs.scss";
import ReactPaginate from "react-paginate";
import { initialSupplementaryDocs } from "./initialSupplementaryDocs";
import React, { useState, useMemo } from "react";
import { FaFilter, FaDownload, FaPlus } from "react-icons/fa";
import { useAuth } from "../../../../AuthContext";
import { Tooltip } from "react-tooltip";
import AddSupplementaryDocModal from "./AddSupplementaryDocModal/AddSupplementaryDocModal";
import SupplementaryDocStatusModal from "./SupplementaryDocStatusModal/SupplementaryDocStatusModal";
import { AnimatePresence } from "framer-motion";

const SupplementaryDocs = () => {
  const { user } = useAuth();
  const [docs, setDocs] = useState(() => {
    const saved = localStorage.getItem("supplementaryDocs");
    return saved ? JSON.parse(saved) : initialSupplementaryDocs;
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [filters, setFilters] = useState({
    organizer: "",
    organization: "",
    status: "",
  });
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [isAddSuccessModalOpen, setIsAddSuccessModalOpen] = useState(false);
  const itemsPerPage = 10;

  // ذخیره در لوکال استوریج
  React.useEffect(() => {
    localStorage.setItem("supplementaryDocs", JSON.stringify(docs));
  }, [docs]);

  const examNames = useMemo(() => {
    const uniqueNames = [...new Set(docs.map((doc) => doc.examName))];
    return uniqueNames.map((name) => ({
      value: name,
      label: name,
    }));
  }, [docs]);

  const jobs = useMemo(() => {
    const uniqueJobs = [...new Set(docs.map((doc) => doc.job))];
    return uniqueJobs.map((job) => ({
      value: job,
      label: job,
    }));
  }, [docs]);

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
        { value: "وزارت راه", label: "وزارت راه" },
        { value: "وزارت امور خارجه", label: "وزارت امور خارجه" },
      ],
    },
    {
      label: "وضعیت",
      key: "status",
      options: [
        { value: "", label: "همه" },
        { value: "تأیید شده", label: "تأیید شده" },
        { value: "عدم تأیید", label: "عدم تأیید" },
        { value: "بررسی نشده", label: "بررسی نشده" },
      ],
    },
  ];

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({ ...prev, [filterType]: value }));
    setCurrentPage(0);
  };

  const handleEdit = (doc) => {
    setSelectedDoc(doc);
    setIsEditModalOpen(true);
  };

  const handleDelete = (id) => {
    setDocs(docs.filter((doc) => doc.id !== id));
    setIsAddSuccessModalOpen(true);
    setTimeout(() => setIsAddSuccessModalOpen(false), 3000);
  };

  const handleAddDoc = (newDocData) => {
    const newId = docs.length ? Math.max(...docs.map((d) => d.id)) + 1 : 1;
    const docToAdd = {
      id: newId,
      examName: newDocData.examName,
      organizer: newDocData.organizer,
      organization: newDocData.organization,
      job: newDocData.job,
      MultipleCapacity: parseInt(newDocData.MultipleCapacity),
      examDate: newDocData.examDate || "", // رشته یا خالی
      Province: newDocData.Province,
      detailsFile: newDocData.detailsFile ? newDocData.detailsFile.name : "",
      documentFile: newDocData.documentFile ? newDocData.documentFile.name : "",
      status: "بررسی نشده",
    };
    setDocs((prev) => [docToAdd, ...prev]);
    setIsAddModalOpen(false);
    setIsAddSuccessModalOpen(true);
    setTimeout(() => setIsAddSuccessModalOpen(false), 3000);
  };

  const handleUpdateDoc = (updatedDocData) => {
    setDocs(
      docs.map((doc) =>
        doc.id === selectedDoc.id
          ? {
              ...doc,
              organizer: updatedDocData.organizer,
              organization: updatedDocData.organization,
              job: updatedDocData.job,
              MultipleCapacity: parseInt(updatedDocData.MultipleCapacity),
              examDate: updatedDocData.examDate || "", // رشته یا خالی
              Province: updatedDocData.Province,
              detailsFile: updatedDocData.detailsFile
                ? updatedDocData.detailsFile.name
                : doc.detailsFile,
              documentFile: updatedDocData.documentFile
                ? updatedDocData.documentFile.name
                : doc.documentFile,
            }
          : doc
      )
    );
    setIsEditModalOpen(false);
    setSelectedDoc(null);
    setIsAddSuccessModalOpen(true);
    setTimeout(() => setIsAddSuccessModalOpen(false), 3000);
  };

  const openStatusModal = (doc) => {
    if (user?.role === "کاربر سازمان اداری و استخدامی") {
      setSelectedDoc(doc);
      setIsStatusModalOpen(true);
    }
  };

  const handleStatusChange = (id, newStatus) => {
    setDocs((prev) =>
      prev.map((doc) => (doc.id === id ? { ...doc, status: newStatus } : doc))
    );
    setIsStatusModalOpen(false);
    setSelectedDoc(null);
  };

  const filteredDocs = docs
    .filter((doc) =>
      Object.values(doc).some((value) =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
    .filter((doc) =>
      !filters.organizer ? true : doc.organizer === filters.organizer
    )
    .filter((doc) =>
      !filters.organization ? true : doc.organization === filters.organization
    )
    .filter((doc) => (!filters.status ? true : doc.status === filters.status));

  const pageCount = Math.ceil(filteredDocs.length / itemsPerPage);
  const offset = currentPage * itemsPerPage;
  const currentItems = filteredDocs.slice(offset, offset + itemsPerPage);

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="supplementary-docs">
      <div className="supplementary-docs__titleWrapper">
        <h2 className="supplementary-docs__title">مستندات ارزیابی تکمیلی</h2>
        {user?.role ===
          "شركت تعاوني پژوهشگران رايانگان فرديس (مجری ارزیابی تکمیلی)" && (
          <button
            className="supplementary-docs__add-btn"
            onClick={() => setIsAddModalOpen(true)}
          >
            <FaPlus /> افزودن
          </button>
        )}
      </div>

      <div className="supplementary-docs__search-container">
        <div className="supplementary-docs__actions">
          <div className="supplementary-docs__filter">
            <FaFilter className="supplementary-docs__filter-icon" />
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
          placeholder="جستجو در مستندات..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(0);
          }}
          className="supplementary-docs__search-input"
        />
      </div>

      <div className="supplementary-docs__list">
        {currentItems.length > 0 ? (
          currentItems.map((doc) => {
            const isDownloadEnabled = doc.status === "تأیید شده";
            return (
              <div key={doc.id} className="supplementary-docs__item">
                <div className="supplementary-docs__content">
                  <div className="supplementary-docs__header">
                    <div className="supplementary-docs__headerTop">
                      <p className="supplementary-docs__headerDetail title">
                        {doc.examName}
                      </p>
                      <p
                        className={`supplementary-docs__headerDetail status ${
                          user?.role === "کاربر سازمان اداری و استخدامی"
                            ? "status--clickable"
                            : ""
                        }`}
                        onClick={() => openStatusModal(doc)}
                      >
                        {doc.status}
                      </p>
                    </div>
                    <p className="supplementary-docs__headerDetail">
                      مجری: <span>{doc.organizer}</span>
                    </p>
                  </div>
                  <div className="supplementary-docs__body">
                    <div className="supplementary-docs__bodyTop">
                      <p className="supplementary-docs__detail">
                        دستگاه: <span>{doc.organization}</span>
                      </p>
                      <p className="supplementary-docs__detail">
                        شغل: <span>{doc.job}</span>
                      </p>
                      <p className="supplementary-docs__detail">
                        چند برابر ظرفیت:{" "}
                        <span>{doc.MultipleCapacity} برابر</span>
                      </p>
                    </div>
                    <div className="supplementary-docs__bodyBottom">
                      <p className="supplementary-docs__detail">
                        تاریخ برگزاری: <span>{doc.examDate}</span>
                      </p>
                      <p className="supplementary-docs__detail">
                        استان محل برگزاری: <span>{doc.Province}</span>
                      </p>
                    </div>
                  </div>
                  <div className="supplementary-docs__actions">
                    <div className="supplementary-docs__download-buttons">
                      <a
                        href={isDownloadEnabled ? doc.detailsFile : "#"}
                        download={isDownloadEnabled}
                        className={`supplementary-docs__download-btn details ${
                          !isDownloadEnabled ? "disabled" : ""
                        }`}
                        data-tooltip-id={`details-tooltip-${doc.id}`}
                        data-tooltip-content={
                          !isDownloadEnabled
                            ? "درحال حاضر، مستندات ارزیابی تکمیلی در دسترس نمی‌باشد"
                            : ""
                        }
                      >
                        دریافت مستندات ارزیابی تکمیلی
                        <FaDownload />
                      </a>
                      {!isDownloadEnabled && (
                        <Tooltip
                          id={`details-tooltip-${doc.id}`}
                          place="top"
                          style={{
                            backgroundColor: "#1f2937",
                            color: "#ffffff",
                            fontSize: "12px",
                            padding: "8px",
                            borderRadius: "4px",
                            zIndex: 1000,
                            fontFamily: "Vazirmatn",
                          }}
                        />
                      )}
                      <a
                        href={isDownloadEnabled ? doc.documentFile : "#"}
                        download={isDownloadEnabled}
                        className={`supplementary-docs__download-btn details ${
                          !isDownloadEnabled ? "disabled" : ""
                        }`}
                        data-tooltip-id={`document-tooltip-${doc.id}`}
                        data-tooltip-content={
                          !isDownloadEnabled
                            ? "درحال حاضر،سند ارزیابی تکمیلی در دسترس نمی‌باشد"
                            : ""
                        }
                      >
                        دریافت سند ارزیابی تکمیلی
                        <FaDownload />
                      </a>
                      {!isDownloadEnabled && (
                        <Tooltip
                          id={`document-tooltip-${doc.id}`}
                          place="top"
                          style={{
                            backgroundColor: "#1f2937",
                            color: "#ffffff",
                            fontSize: "12px",
                            padding: "8px",
                            borderRadius: "4px",
                            zIndex: 1000,
                            fontFamily: "Vazirmatn",
                          }}
                        />
                      )}
                    </div>
                    {user?.role ===
                      "شركت تعاوني پژوهشگران رايانگان فرديس (مجری ارزیابی تکمیلی)" &&
                      (doc.status === "تأیید شده" ||
                        doc.status === "عدم تأیید" ||
                        doc.status === "ارزیابی تکمیلی") && (
                        <div className="supplementary-docs__edit-delete">
                          <button
                            className="supplementary-docs__action-btn edit"
                            onClick={() => handleEdit(doc)}
                          >
                            ویرایش
                          </button>
                          <button
                            className="supplementary-docs__action-btn delete"
                            onClick={() => handleDelete(doc.id)}
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
          <p>هیچ مستندی یافت نشد</p>
        )}
      </div>

      <AddSupplementaryDocModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddDoc}
        examNameOptions={examNames}
        organizerOptions={
          filterConfig.find((f) => f.key === "organizer").options
        }
        organizationOptions={
          filterConfig.find((f) => f.key === "organization").options
        }
        jobOptions={jobs}
      />

      <AddSupplementaryDocModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedDoc(null);
        }}
        onSubmit={handleUpdateDoc}
        initialData={selectedDoc}
        examNameOptions={examNames}
        organizerOptions={
          filterConfig.find((f) => f.key === "organizer").options
        }
        organizationOptions={
          filterConfig.find((f) => f.key === "organization").options
        }
        jobOptions={jobs}
        isEditMode
      />

      <AnimatePresence>
        {isStatusModalOpen && selectedDoc && (
          <SupplementaryDocStatusModal
            isOpen={isStatusModalOpen}
            onClose={() => {
              setIsStatusModalOpen(false);
              setSelectedDoc(null);
            }}
            onSubmit={handleStatusChange}
            result={selectedDoc}
            source="SupplementaryDocs"
          />
        )}
      </AnimatePresence>

      {isAddSuccessModalOpen && (
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

export default SupplementaryDocs;
