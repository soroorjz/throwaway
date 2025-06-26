import React, { useState, useMemo, useEffect } from "react";
import ReactPaginate from "react-paginate";
import "./ExamCenter.scss";
import { initialExamCenters } from "./initialExamCenters";
import {
  FaFilter,
  FaBuilding,
  FaPlus,
  FaSortAmountUpAlt,
} from "react-icons/fa";
import ExamCenterModal from "./ExamCenterModal";
import { useAuth } from "../../../../AuthContext";

const ExamCenter = () => {
  const { user } = useAuth(); // دریافت اطلاعات کاربر
  const [centers, setCenters] = useState(() => {
    const saved = localStorage.getItem("examCenters");
    return saved ? JSON.parse(saved) : initialExamCenters;
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    province: "",
    status: "",
    gender: "",
    sort: "",
  });
  const [currentPage, setCurrentPage] = useState(0);
  const [activeTab, setActiveTab] = useState("حوزه‌های من");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddSuccessModalOpen, setIsAddSuccessModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleteSuccessModalOpen, setIsDeleteSuccessModalOpen] =
    useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedCenter, setSelectedCenter] = useState(null);
  const [centerToDelete, setCenterToDelete] = useState(null);
  const [newCenter, setNewCenter] = useState({
    title: "",
    province: "",
    city: "",
    capacity: "",
    gender: "",
    status: "",
    contractDate: null,
    address: "",
    phone: "",
    category: "",
  });

  const itemsPerPage = 12;

  useEffect(() => {
    localStorage.setItem("examCenters", JSON.stringify(centers));
  }, [centers]);

  const tabs = [
    "حوزه‌های من",
    "حوزه‌های جهاد دانشگاهی",
    "حوزه‌های سازمان سنجش و آموزش کشور",
    "حوزه‌های شرکت آزمون گستر",
  ];

  const provinces = useMemo(() => {
    const uniqueProvinces = [
      ...new Set(centers.map((center) => center.province)),
    ];
    return [
      { value: "", label: "همه" },
      ...uniqueProvinces.map((province) => ({
        value: province,
        label: province,
      })),
    ];
  }, [centers]);

  const genders = useMemo(() => {
    const uniqueGenders = [...new Set(centers.map((center) => center.gender))];
    return [
      { value: "", label: "همه" },
      ...uniqueGenders.map((gender) => ({
        value: gender,
        label: gender,
      })),
    ];
  }, [centers]);

  const statuses = useMemo(() => {
    const uniqueStatuses = [...new Set(centers.map((center) => center.status))];
    return [
      { value: "", label: "همه" },
      ...uniqueStatuses.map((status) => ({
        value: status,
        label: status,
      })),
    ];
  }, [centers]);

  const categories = useMemo(() => {
    return tabs.map((tab) => ({
      value: tab,
      label: tab,
    }));
  }, []);

  const sortOptions = useMemo(
    () => [
      { value: "", label: "پیش‌فرض" },
      { value: "capacity-asc", label: "کمترین ظرفیت" },
      { value: "capacity-desc", label: "بیشترین ظرفیت" },
      { value: "contractDate-asc", label: "نزدیک‌ترین تاریخ قرارداد " },
      { value: "contractDate-desc", label: "دورترین تاریخ قرارداد " },
    ],
    []
  );

  const filterConfig = [
    {
      label: "استان",
      key: "province",
      options: provinces,
    },
    {
      label: "وضعیت",
      key: "status",
      options: statuses,
    },
    {
      label: "جنسیت",
      key: "gender",
      options: genders,
    },
  ];

  const handleFilterChange = (key, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [key]: value,
    }));
    setCurrentPage(0);
  };

  const filteredCenters = useMemo(() => {
    let result = centers.filter((center) => {
      const tabMatch = center.category === activeTab;
      const searchMatch =
        searchTerm === "" ||
        Object.values(center)
          .join(" ")
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      const provinceMatch =
        filters.province === "" || center.province === filters.province;
      const statusMatch =
        filters.status === "" || center.status === filters.status;
      const genderMatch =
        filters.gender === "" || center.gender === filters.gender;

      return (
        tabMatch && searchMatch && provinceMatch && statusMatch && genderMatch
      );
    });

    if (filters.sort) {
      result = [...result].sort((a, b) => {
        if (filters.sort === "capacity-asc") {
          return a.capacity - b.capacity;
        } else if (filters.sort === "capacity-desc") {
          return b.capacity - a.capacity;
        } else if (filters.sort === "contractDate-asc") {
          const dateA = a.contractDate
            ? new Date(a.contractDate.split("/").reverse().join("-"))
            : new Date(0);
          const dateB = b.contractDate
            ? new Date(b.contractDate.split("/").reverse().join("-"))
            : new Date(0);
          return dateA - dateB;
        } else if (filters.sort === "contractDate-desc") {
          const dateA = a.contractDate
            ? new Date(a.contractDate.split("/").reverse().join("-"))
            : new Date(0);
          const dateB = b.contractDate
            ? new Date(b.contractDate.split("/").reverse().join("-"))
            : new Date(0);
          return dateB - dateA;
        }
        return 0;
      });
    }

    return result;
  }, [centers, activeTab, searchTerm, filters]);

  const pageCount = Math.ceil(filteredCenters.length / itemsPerPage);
  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCenters = filteredCenters.slice(startIndex, endIndex);

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleAddClick = () => {
    setNewCenter({
      title: "",
      province: "",
      city: "",
      capacity: "",
      gender: "",
      status: "",
      contractDate: null,
      address: "",
      phone: "",
      category: "",
    });
    setIsEditMode(false);
    setIsModalOpen(true);
  };

  const handleEditClick = (center) => {
    setSelectedCenter(center);
    setNewCenter({
      title: center.title,
      province: center.province,
      city: center.city,
      capacity: center.capacity,
      gender: center.gender,
      status: center.status,
      contractDate: center.contractDate,
      address: center.address,
      phone: center.phone,
      category: center.category,
    });
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (center) => {
    setCenterToDelete(center);
    setIsDeleteModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedCenter(null);
    setNewCenter({
      title: "",
      province: "",
      city: "",
      capacity: "",
      gender: "",
      status: "",
      contractDate: null,
      address: "",
      phone: "",
      category: "",
    });
  };

  const handleFormChange = (key, value) => {
    setNewCenter((prev) => ({ ...prev, [key]: value }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const formattedDate = newCenter.contractDate
      ? newCenter.contractDate.format("YYYY/MM/DD")
      : "";
    const centerData = {
      ...newCenter,
      capacity: parseInt(newCenter.capacity, 10),
      contractDate: formattedDate,
    };

    if (isEditMode) {
      setCenters((prev) =>
        prev.map((center) =>
          center.id === selectedCenter.id
            ? { ...centerData, id: center.id }
            : center
        )
      );
    } else {
      const newId = centers.length
        ? Math.max(...centers.map((c) => c.id)) + 1
        : 1;
      setCenters((prev) => [{ ...centerData, id: newId }, ...prev]);
    }

    setIsModalOpen(false);
    setTimeout(() => {
      setIsAddSuccessModalOpen(true);
      setTimeout(() => {
        setIsAddSuccessModalOpen(false);
      }, 3000);
    }, 300);
  };

  const handleDeleteConfirm = () => {
    setCenters((prev) =>
      prev.filter((center) => center.id !== centerToDelete.id)
    );
    setIsDeleteModalOpen(false);
    setIsDeleteSuccessModalOpen(true);
    setTimeout(() => {
      setIsDeleteSuccessModalOpen(false);
      setCenterToDelete(null);
    }, 3000);
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false);
    setCenterToDelete(null);
  };

  return (
    <div className="exam-center">
      <div className="exam-center__titleWrapper">
        <h2 className="exam-center__title">حوزه‌ آزمون</h2>
        {user?.role !== "کاربر سازمان اداری و استخدامی" && (
          <button className="assign-permit__add-btn" onClick={handleAddClick}>
            <FaPlus /> افزودن
          </button>
        )}
      </div>
      <div className="exam-center__search-container">
        <div className="exam-center__actions">
          <div className="exam-center__controls">
            <div className="exam-center__filter">
              <FaFilter className="exam-center__filter-icon" />
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
            <div className="exam-center__sort-container">
              <div className="exam-center__sort">
                <FaSortAmountUpAlt className="exam-center__sort-icon" />
                <div className="sort-options">
                  {sortOptions.map((option) => (
                    <div
                      key={option.value}
                      className={`sort-item ${
                        filters.sort === option.value ? "active" : ""
                      }`}
                      onClick={() => handleFilterChange("sort", option.value)}
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
          placeholder="جستجو در حوزه‌های آزمون..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(0);
          }}
          className="exam-center__search-input"
        />
      </div>
      <div className="exam-center__tabs">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`exam-center__tab ${
              activeTab === tab ? "exam-center__tab--active" : ""
            }`}
            onClick={() => {
              setActiveTab(tab);
              setCurrentPage(0);
            }}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="exam-center__grid">
        {currentCenters.length > 0 ? (
          currentCenters.map((center) => (
            <div key={center.id} className="exam-center__card">
              <div className="exam-center__header">
                <div className="exam-center__center-info">
                  <FaBuilding className="exam-center__center-icon" />
                  <span className="exam-center__title">{center.title}</span>
                </div>
                <span
                  className={`exam-center__status exam-center__status--${center.status}`}
                >
                  {center.status}
                </span>
              </div>
              <div className="exam-center__details">
                <p className="exam-center__capacity">
                  ظرفیت: <span>{center.capacity} نفر</span>
                </p>
                <p className="exam-center__gender">
                  جنسیت: <span>{center.gender}</span>
                </p>
                <p className="exam-center__contract-date">
                  نام و نام خانوادگی مدیر حوزه:
                  <span> {center.firstName} </span>
                  <span>{center.lastName}</span>
                </p>
                <p className="exam-center__contract-date">
                  تاریخ قرارداد: <span>{center.contractDate}</span>
                </p>
                <p className="exam-center__contract-date">
                  مبلغ قرارداد: <span>{center.contractAmount} ریال</span>
                </p>
                <p className="exam-center__address">
                  آدرس: <span>{center.address}</span>
                </p>
                <p className="exam-center__phone">
                  تلفن: <span>{center.phone}</span>
                </p>
              </div>
              {user?.role !== "کاربر سازمان اداری و استخدامی" && (
                <div className="exam-center__actions">
                  <button
                    className="exam-center__edit-btn"
                    onClick={() => handleEditClick(center)}
                  >
                    ویرایش
                  </button>
                  <button
                    className="exam-center__delete-btn"
                    onClick={() => handleDeleteClick(center)}
                  >
                    حذف
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="exam-center__no-results">هیچ نتیجه‌ای یافت نشد.</p>
        )}
      </div>

      <ExamCenterModal
        isModalOpen={isModalOpen}
        isAddSuccessModalOpen={isAddSuccessModalOpen}
        isDeleteModalOpen={isDeleteModalOpen}
        isDeleteSuccessModalOpen={isDeleteSuccessModalOpen}
        setIsModalOpen={setIsModalOpen}
        setIsAddSuccessModalOpen={setIsAddSuccessModalOpen}
        setIsDeleteModalOpen={setIsDeleteModalOpen}
        setIsDeleteSuccessModalOpen={setIsDeleteSuccessModalOpen}
        handleModalClose={handleModalClose}
        handleFormChange={handleFormChange}
        handleFormSubmit={handleFormSubmit}
        handleDeleteConfirm={handleDeleteConfirm}
        handleDeleteCancel={handleDeleteCancel}
        newCenter={newCenter}
        isEditMode={isEditMode}
        provinces={provinces}
        genders={genders}
        statuses={statuses}
        categories={categories}
      />

      {filteredCenters.length > itemsPerPage && (
        <ReactPaginate
          previousLabel={"قبلی"}
          nextLabel={"بعدی"}
          breakLabel={"..."}
          pageCount={pageCount}
          marginPagesDisplayed={2}
          pageRangeDisplayed={3}
          onPageChange={handlePageChange}
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

export default ExamCenter;
