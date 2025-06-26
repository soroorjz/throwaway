import React, { useState, useEffect } from "react";
import {
  FaFilter,
  FaSortAmountUpAlt,
  FaPlus,
  FaDownload,
} from "react-icons/fa";
import { AnimatePresence } from "framer-motion";
import ReactPaginate from "react-paginate";
import { samplePermits } from "../samplePermits";
import EditRequestModal from "../PermitRequestsList/EditRequestModal/EditRequestModal";
import AddPermitModal from "./AddPermitModal/AddPermitModal";
import DateObject from "react-date-object";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import "./IssuedPermitsList.scss";
import { useAuth } from "../../../../AuthContext";

const IssuedPermits = () => {
  const { user } = useAuth();
  const [permits, setPermits] = useState(() => {
    const saved = localStorage.getItem("permits");
    return saved ? JSON.parse(saved) : samplePermits;
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [filters, setFilters] = useState({
    organization: "",
    sort: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPermit, setSelectedPermit] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const itemsPerPage = 3;

  const updateLocalStorage = (updatedPermits) => {
    try {
      const allPermits = JSON.parse(localStorage.getItem("permits")) || [];
      const updatedPermitsMap = updatedPermits.map((permit) => {
        const existingPermit = allPermits.find((p) => p.id === permit.id);
        return existingPermit ? { ...existingPermit, ...permit } : permit;
      });
      const newPermits = updatedPermits.filter(
        (p) => !allPermits.some((ep) => ep.id === p.id)
      );
      const finalPermits = [...updatedPermitsMap, ...newPermits];
      localStorage.setItem("permits", JSON.stringify(finalPermits));
      console.log(
        "Updated permits in localStorage:",
        JSON.stringify(finalPermits, null, 2)
      );
    } catch (error) {
      console.error("Error updating localStorage:", error);
    }
  };

  useEffect(() => {
    updateLocalStorage(permits);
  }, [permits]);

  const generatePersianPermitNumber = () => {
    const randomNumber = Math.floor(Math.random() * 9000) + 1000;
    return `ج.ا.ا-${randomNumber}`;
  };

  const handleEditClick = (permit) => {
    setSelectedPermit(permit);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedPermit(null);
  };

  const handleAddClick = () => {
    setIsAddModalOpen(true);
  };

  const handleAddModalClose = () => {
    setIsAddModalOpen(false);
  };

  const handleAddPermit = (newPermit) => {
    let persianDate;
    try {
      persianDate = new DateObject({
        date:
          newPermit.date instanceof DateObject
            ? newPermit.date.toDate()
            : newPermit.date,
        calendar: persian,
        locale: persian_fa,
      }).format("YYYY/MM/DD");
    } catch (error) {
      console.error("Error converting modal date:", error);
      persianDate = "نامعتبر";
    }

    const permitWithId = {
      ...newPermit,
      id: Math.random().toString(36).substr(2, 9),
      type: "permit",
      status: "در انتظار",
      number: generatePersianPermitNumber(),
      registrationDate: new DateObject({
        date: new Date(),
        calendar: persian,
        locale: persian_fa,
      }).format("YYYY/MM/DD"),
      confirmationDate: persianDate,
      employmentType: newPermit.employmentType || "نامشخص",
      subOrganization: newPermit.subOrganization || "نامشخص",
      scoreRatio: newPermit.scoreRatio || "نامشخص",
      hiringCapacity: newPermit.hiringCapacity || 0,
      capacityMultiplier: newPermit.capacityMultiplier || 0,
      permitImage: newPermit.permitImage || null,
      description: newPermit.description || "",
      isPending: true,
    };

    setPermits((prev) => [permitWithId, ...prev]);
    setIsAddModalOpen(false);
  };

  const toPersianDate = (dateString) => {
    try {
      if (!dateString) return "نامعتبر";
      const persianDateRegex = /^\d{4}[\/-]\d{2}[\/-]\d{2}$/;
      if (persianDateRegex.test(dateString)) {
        return dateString.replace(/-/g, "/");
      }

      const date = new DateObject({
        date: new Date(dateString),
        calendar: persian,
        locale: persian_fa,
      });
      if (!date.isValid) throw new Error("Invalid date");
      return date.format("YYYY/MM/DD");
    } catch (error) {
      console.error("Error converting date:", error);
      return dateString || "نامعتبر";
    }
  };

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({ ...prev, [filterType]: value }));
    setCurrentPage(0);
  };

  const sortOptions = [
    { value: "", label: "پیش‌فرض" },
    { value: "dateAsc", label: "قدیمی‌ترین مجوز" },
    { value: "dateDesc", label: "جدیدترین مجوز" },
  ];

  const filterConfig = [
    {
      label: "دستگاه",
      key: "organization",
      options: [
        { value: "", label: "همه" },
        { value: "وزارت آموزش و پرورش", label: "وزارت آموزش و پرورش" },
        { value: "وزارت نیرو", label: "وزارت نیرو" },
        { value: "سازمان بهزیستی کشور", label: "سازمان بهزیستی کشور" },
      ],
    },
  ];

  const filteredPermits = permits
    .filter(
      (permit) =>
        permit.type === "permit" ||
        (permit.type === "request" && permit.status === "تأیید شده")
    )
    .filter((permit) =>
      Object.values(permit).some((value) =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
    .filter(
      (permit) =>
        !filters.organization || permit.organization === filters.organization
    )
    .sort((a, b) => {
      if (filters.sort === "dateAsc")
        return a.confirmationDate.localeCompare(b.confirmationDate);
      if (filters.sort === "dateDesc")
        return b.confirmationDate.localeCompare(a.confirmationDate);
      return 0;
    });

  const pageCount = Math.ceil(filteredPermits.length / itemsPerPage);
  const offset = currentPage * itemsPerPage;
  const currentItems = filteredPermits.slice(offset, offset + itemsPerPage);

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleUpdatePermit = (updatedPermit) => {
    setPermits((prevPermits) => {
      const isNewPermit = !updatedPermit.id;
      const permitWithId = isNewPermit
        ? {
            ...updatedPermit,
            id: Math.random().toString(36).substr(2, 9),
            number: updatedPermit.number || generatePersianPermitNumber(),
            confirmationDate: updatedPermit.date
              ? new DateObject({
                  date: updatedPermit.date,
                  calendar: persian,
                  locale: persian_fa,
                }).format("YYYY/MM/DD")
              : updatedPermit.confirmationDate,
            isPending: false,
          }
        : {
            ...updatedPermit,
            number:
              updatedPermit.number ||
              prevPermits.find((p) => p.id === updatedPermit.id)?.number,
            isPending: false,
          };

      if (isNewPermit) {
        return [permitWithId, ...prevPermits];
      } else {
        const filteredPermits = prevPermits.filter(
          (p) => p.id !== updatedPermit.id
        );
        return [permitWithId, ...filteredPermits];
      }
    });
  };

  const handleDownloadImage = (permitImage) => {
    if (permitImage && permitImage instanceof File) {
      const url = URL.createObjectURL(permitImage);
      const link = document.createElement("a");
      link.href = url;
      link.download = permitImage.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="issued-permits">
      <div className="issued-permits__headerTitle">
        <h2 className="issued-permits__title">مدیریت مجوزها</h2>
        {user?.role === "کاربر سازمان اداری و استخدامی" && (
          <button className="assign-permit__add-btn" onClick={handleAddClick}>
            <FaPlus /> افزودن
          </button>
        )}
      </div>

      <div className="issued-permits__search-container">
        <div className="issued-permits__actions">
          <div className="issued-permits__filter-container">
            <div className="issued-permits__filter">
              <FaFilter className="issued-permits__filter-icon" />
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
          <div className="issued-permits__sort-container">
            <div className="issued-permits__sort">
              <FaSortAmountUpAlt className="issued-permits__sort-icon" />
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
          placeholder="جستجو در مجوزها..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(0);
          }}
          className="issued-permits__search-input"
        />
      </div>

      <div className="issued-permits__list">
        {currentItems.length > 0 ? (
          currentItems.map((permit) => (
            <div key={permit.id} className="issued-permits__item">
              <div className="issued-permits__content">
                <div className="issued-permits__header">
                  <div className="issued-permits__headerTop">
                    <p className="issued-permits__headerDetail title">
                      مجوز {permit.number}
                      {permit.isPending && (
                        <span className="pending-badge">در انتظار</span>
                      )}
                    </p>
                  </div>
                </div>
                <div className="issued-permits__body">
                  <p className="issued-permits__detail">
                    دستگاه: <span>{permit.organization}</span>
                  </p>
                  <p className="issued-permits__detail">
                    تاریخ اعتبار مجوز:{" "}
                    <span>{toPersianDate(permit.confirmationDate)}</span>
                  </p>
                  <p className="issued-permits__detail">
                    توضیحات: <span>{permit.description || "بدون توضیحات"}</span>
                  </p>
                </div>
                <div className="issued-permits__actions">
                  <div className="issued-permits__download-buttons">
                    <button
                      className={`issued-permits__download-btn results ${
                        !permit.permitImage ? "disabled" : ""
                      }`}
                      onClick={() => handleDownloadImage(permit.permitImage)}
                      disabled={!permit.permitImage}
                    >
                      فایل تصویر مجوز
                      <FaDownload />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>هیچ مجوزی یافت نشد</p>
        )}
      </div>

      <AnimatePresence>
        {/* {isModalOpen && (
          <EditRequestModal
            isOpen={isModalOpen}
            onClose={handleModalClose}
            onUpdate={handleUpdatePermit}
            request={selectedPermit}
            isEditMode={true}
            isReadOnly={true}
            fromPage="issuedPermits"
          />
        )} */}
        {isAddModalOpen && (
          <AddPermitModal
            isOpen={isAddModalOpen}
            onClose={handleAddModalClose}
            onSubmit={handleAddPermit}
          />
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

export default IssuedPermits;
