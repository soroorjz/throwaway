import React, { useState, useMemo } from "react";
import { GrOrganization } from "react-icons/gr";
import ReactPaginate from "react-paginate";
import "./ExecutiveManagement.scss";
import ExecutiveTabs from "./ExecutiveTabs/ExecutiveTabs";
import { initialExecutives } from "./initialExecutives";
import { FaFilter, FaPlus } from "react-icons/fa";
import ExecutiveModal from "./ExecutiveModal";
import { useAuth } from "../../../../AuthContext";


const ExecutiveManagement = () => {
  const { user } = useAuth(); // دریافت اطلاعات کاربر
  const [executives, setExecutives] = useState(() => {
    const saved = localStorage.getItem("executives");
    return saved ? JSON.parse(saved) : initialExecutives;
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    domain: "",
    activityType: "",
    status: "",
    performanceRating: "",
  });
  const [selectedTab, setSelectedTab] = useState("همه");
  const [currentPage, setCurrentPage] = useState(0);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAddSuccessModalOpen, setIsAddSuccessModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isViewMode, setIsViewMode] = useState(false); // اضافه شده برای حالت مشاهده
  const [selectedExecutive, setSelectedExecutive] = useState(null);
  const [newExecutive, setNewExecutive] = useState({
    firstName: "",
    lastName: "",
    domain: "",
    activityType: "",
    organizerName: "",
    nationalCode: "",
    phoneNumber: "",
    status: "فعال",
    performanceRating: "",
  });

  const itemsPerPage = 12;

  React.useEffect(() => {
    localStorage.setItem("executives", JSON.stringify(executives));
  }, [executives]);

  const domains = useMemo(() => {
    const uniqueDomains = [
      ...new Set(executives.map((executive) => executive.domain)),
    ];
    return [
      { value: "", label: "همه" },
      ...uniqueDomains.map((domain) => ({ value: domain, label: domain })),
    ];
  }, [executives]);

  const activityTypes = useMemo(() => {
    const uniqueActivityTypes = [
      ...new Set(executives.map((executive) => executive.activityType)),
    ];
    return [
      { value: "", label: "همه" },
      ...uniqueActivityTypes.map((activityType) => ({
        value: activityType,
        label: activityType,
      })),
    ];
  }, [executives]);

  const organizers = useMemo(() => {
    const uniqueOrganizers = [
      ...new Set(executives.map((executive) => executive.organizerName)),
    ];
    return [
      { value: "", label: "انتخاب کنید" },
      ...uniqueOrganizers.map((organizer) => ({
        value: organizer,
        label: organizer,
      })),
    ];
  }, [executives]);

  const statuses = useMemo(() => {
    const uniqueStatuses = [
      ...new Set(executives.map((executive) => executive.status)),
    ];
    return [
      { value: "", label: "همه" },
      ...uniqueStatuses.map((status) => ({
        value: status,
        label: status,
      })),
    ];
  }, [executives]);

  const performanceRatings = [
    { value: "", label: "همه" },
    { value: "1", label: "ضعیف" },
    { value: "2", label: "متوسط" },
    { value: "3", label: "خوب" },
    { value: "4", label: "عالی" },
  ];

  const filterConfig = [
    {
      label: "استان محل سکونت",
      key: "domain",
      options: domains,
    },
    {
      label: "نوع فعالیت",
      key: "activityType",
      options: activityTypes,
    },
    {
      label: "وضعیت",
      key: "status",
      options: statuses,
    },
    {
      label: "رتبه عملکرد",
      key: "performanceRating",
      options: performanceRatings,
    },
  ];

  const getPerformanceRatingText = (rating) => {
    switch (String(rating)) {
      case "1":
        return "ضعیف";
      case "2":
        return "متوسط";
      case "3":
        return "خوب";
      case "4":
        return "عالی";
      default:
        return "نامشخص";
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [key]: value,
    }));
    setCurrentPage(0);
  };

  const handleTabChange = (tab) => {
    setSelectedTab(tab);
    setCurrentPage(0);
  };

  const filteredExecutives = useMemo(() => {
    return executives.filter((executive) => {
      const searchMatch =
        searchTerm === "" ||
        Object.values(executive)
          .join(" ")
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      const domainMatch =
        filters.domain === "" || executive.domain === filters.domain;

      const activityTypeMatch =
        filters.activityType === "" ||
        executive.activityType === filters.activityType;

      const statusMatch =
        filters.status === "" || executive.status === filters.status;

      const performanceRatingMatch =
        filters.performanceRating === "" ||
        String(executive.performanceRating) === filters.performanceRating;

      const tabMatch =
        selectedTab === "همه" || executive.organizerName === selectedTab;

      return (
        searchMatch &&
        domainMatch &&
        activityTypeMatch &&
        statusMatch &&
        performanceRatingMatch &&
        tabMatch
      );
    });
  }, [executives, searchTerm, filters, selectedTab]);

  const pageCount = Math.ceil(filteredExecutives.length / itemsPerPage);
  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentExecutives = filteredExecutives.slice(startIndex, endIndex);

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = (id) => {
    if (
      window.confirm(
        "آیا مطمئن هستید که می‌خواهید این عامل اجرایی را حذف کنید؟"
      )
    ) {
      setExecutives((prevExecutives) =>
        prevExecutives.filter((executive) => executive.id !== id)
      );
      setCurrentPage(0);
    }
  };

  const handleEdit = (executive) => {
    setNewExecutive({
      firstName: executive.firstName,
      lastName: executive.lastName,
      domain: executive.domain,
      activityType: executive.activityType,
      organizerName: executive.organizerName,
      nationalCode: executive.nationalCode,
      phoneNumber: executive.phoneNumber,
      status: executive.status,
      performanceRating: executive.performanceRating || "",
    });
    setSelectedExecutive(executive);
    setIsEditMode(true);
    setIsViewMode(false); // اطمینان از غیرفعال بودن حالت مشاهده
    setIsAddModalOpen(true);
  };

  const handleView = (executive) => {
    setNewExecutive({
      firstName: executive.firstName,
      lastName: executive.lastName,
      domain: executive.domain,
      activityType: executive.activityType,
      organizerName: executive.organizerName,
      nationalCode: executive.nationalCode,
      phoneNumber: executive.phoneNumber,
      status: executive.status,
      performanceRating: executive.performanceRating || "",
    });
    setSelectedExecutive(executive);
    setIsEditMode(false);
    setIsViewMode(true); // فعال کردن حالت مشاهده
    setIsAddModalOpen(true);
  };

  const handleAddExecutive = (e) => {
    e.preventDefault();
    if (isEditMode) {
      setExecutives((prev) =>
        prev.map((executive) =>
          executive.id === selectedExecutive.id
            ? {
                ...executive,
                firstName: newExecutive.firstName,
                lastName: newExecutive.lastName,
                domain: newExecutive.domain,
                activityType: newExecutive.activityType,
                organizerName: newExecutive.organizerName,
                nationalCode: newExecutive.nationalCode,
                phoneNumber: newExecutive.phoneNumber,
                status: newExecutive.status,
                performanceRating: newExecutive.performanceRating,
              }
            : executive
        )
      );
    } else {
      const newId = executives.length
        ? Math.max(...executives.map((e) => e.id)) + 1
        : 1;
      const executiveToAdd = {
        id: newId,
        ...newExecutive,
      };
      setExecutives((prev) => [executiveToAdd, ...prev]);
    }
    setNewExecutive({
      firstName: "",
      lastName: "",
      domain: "",
      activityType: "",
      organizerName: "",
      nationalCode: "",
      phoneNumber: "",
      status: "فعال",
      performanceRating: "",
    });
    setIsAddModalOpen(false);
    setIsEditMode(false);
    setIsViewMode(false);
    setSelectedExecutive(null);
    setTimeout(() => {
      setIsAddSuccessModalOpen(true);
      setTimeout(() => {
        setIsAddSuccessModalOpen(false);
      }, 3000);
    }, 300);
  };

  const handleAddFormChange = (key, value) => {
    setNewExecutive((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="executive-management">
      <div className="executive-management__titleWrapper">
        <h2 className="executive-management__title">عوامل اجرایی مجری</h2>
        {user?.role !== "کاربر سازمان اداری و استخدامی" && (
          <button
            className="assign-permit__add-btn"
            onClick={() => {
              setIsEditMode(false);
              setIsViewMode(false);
              setNewExecutive({
                firstName: "",
                lastName: "",
                domain: "",
                activityType: "",
                organizerName: "",
                nationalCode: "",
                phoneNumber: "",
                status: "فعال",
                performanceRating: "",
              });
              setIsAddModalOpen(true);
            }}
          >
            <FaPlus /> افزودن
          </button>
        )}
      </div>

      <div className="executive-management__controls">
        <div className="executive-management__filter-container">
          <FaFilter className="executive-management__filter-icon" />
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
        <div className="executive-management__search">
          <input
            type="text"
            placeholder="جستجو ..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(0);
            }}
          />
        </div>
      </div>
      <ExecutiveTabs executives={executives} onTabChange={handleTabChange} />

      <div className="executive-management__grid">
        {currentExecutives.length > 0 ? (
          currentExecutives.map((executive) => (
            <div key={executive.id} className="executive-management__card">
              <div className="executive-management__header">
                <p className="executive-management__detail name">
                  {executive.firstName} {executive.lastName}
                </p>
                <p className="executiveStatus">{executive.status}</p>
              </div>
              <div className="executive-management__details">
                <div className="executive-management__area">
                  <p className="executive-management__detail">
                    استان محل سکونت: <span>{executive.domain}</span>
                  </p>
                  <div className="executive-management__activity-type">
                    <p className="executive-management__detail">
                      نوع فعالیت: <span>{executive.activityType}</span>
                    </p>
                    <p className="executive-management__detail">
                      رتبه عملکرد:{" "}
                      <span>
                        {getPerformanceRatingText(executive.performanceRating)}
                      </span>
                    </p>
                  </div>
                </div>
                <div className="executive-management__info">
                  <p className="executive-management__detail">
                    کدملی: <span>{executive.nationalCode}</span>
                  </p>
                  <p className="executive-management__detail">
                    شماره همراه: <span>{executive.phoneNumber}</span>
                  </p>
                  <div className="executive-management__detail">
                    <p className="organizer-Name">
                      مجری: <span>{executive.organizerName}</span>
                    </p>
                  </div>
                </div>
              </div>
              <div className="executive-management__actions">
                {user?.role === "کاربر سازمان اداری و استخدامی" ? (
                  <button
                    className="executive-management__view-btn"
                    onClick={() => handleView(executive)}
                  >
                    مشاهده
                  </button>
                ) : (
                  <>
                    <button
                      className="executive-management__edit-btn"
                      onClick={() => handleEdit(executive)}
                    >
                      ویرایش
                    </button>
                    <button
                      className="executive-management__delete-btn"
                      onClick={() => handleDelete(executive.id)}
                    >
                      حذف
                    </button>
                  </>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="executive-management__no-results">
            هیچ نتیجه‌ای یافت نشد.
          </p>
        )}
      </div>

      <ExecutiveModal
        isAddModalOpen={isAddModalOpen}
        isAddSuccessModalOpen={isAddSuccessModalOpen}
        setIsAddModalOpen={setIsAddModalOpen}
        setIsAddSuccessModalOpen={setIsAddSuccessModalOpen}
        handleAddExecutive={handleAddExecutive}
        newExecutive={newExecutive}
        setNewExecutive={setNewExecutive}
        handleAddFormChange={handleAddFormChange}
        domains={domains}
        activityTypes={activityTypes}
        organizers={organizers}
        statuses={statuses}
        isEditMode={isEditMode}
        isViewMode={isViewMode} // اضافه شده برای حالت مشاهده
      />

      {filteredExecutives.length > itemsPerPage && (
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

export default ExecutiveManagement;
