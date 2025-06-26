import React, { useState, useEffect } from "react";
import { FaPlus, FaFilter, FaSortAmountUpAlt } from "react-icons/fa";
import { BsInfoCircle } from "react-icons/bs";
import ReactPaginate from "react-paginate";
import { Tooltip } from "react-tooltip";
import EditRequestModal from "./EditRequestModal/EditRequestModal";
import RejectionReasonModal from "./EditRequestModal/RejectionReasonModal";
import { samplePermits } from "../samplePermits";
import "./PermitRequestsList.scss";
import { useAuth } from "../../../../AuthContext";
import DateObject from "react-date-object";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

const PermitRequestsList = () => {
  const { user } = useAuth();
  console.log("Current user:", user);

  const [requests, setRequests] = useState(() => {
    try {
      const saved = localStorage.getItem("permits");
      const parsedPermits = saved ? JSON.parse(saved) : samplePermits;
      return parsedPermits.filter((p) => !p.isPending);
    } catch (error) {
      console.error("Error parsing permits from localStorage:", error);
      return samplePermits.filter((p) => !p.isPending);
    }
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [filters, setFilters] = useState({
    employmentType: "",
    organization: "",
    subOrganization: "",
    status: "",
    scoreRatio: "",
    sort: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReasonModalOpen, setIsReasonModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [selectedReason, setSelectedReason] = useState("");
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const [modalKey, setModalKey] = useState(0);
  const [modalData, setModalData] = useState({
    permitNumber: "",
    permitImage: null,
    permitExpirationDate: null,
  });
  const itemsPerPage = 3;

  // تابع برای آپدیت localStorage با حفظ همه مجوزها
  const updateLocalStorage = (updatedRequests) => {
    try {
      const allPermits = JSON.parse(localStorage.getItem("permits")) || [];
      const updatedPermits = allPermits.map((permit) => {
        const updatedRequest = updatedRequests.find((r) => r.id === permit.id);
        return updatedRequest ? { ...permit, ...updatedRequest } : permit;
      });
      const newRequests = updatedRequests.filter(
        (r) => !allPermits.some((p) => p.id === r.id)
      );
      const finalPermits = [...updatedPermits, ...newRequests];
      localStorage.setItem("permits", JSON.stringify(finalPermits));
      console.log(
        "Updated permits in localStorage:",
        JSON.stringify(finalPermits, null, 2)
      );
    } catch (error) {
      console.error("Error updating localStorage:", error);
    }
  };

  // رصد تغییرات localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const saved = localStorage.getItem("permits");
        const parsedPermits = saved ? JSON.parse(saved) : samplePermits;
        const filteredPermits = parsedPermits.filter((p) => !p.isPending);
        setRequests(filteredPermits);
      } catch (error) {
        console.error("Error reloading permits from localStorage:", error);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  useEffect(() => {
    updateLocalStorage(requests);
  }, [requests]);

  const resetModalData = () => {
    setModalData({
      permitNumber: "",
      permitImage: null,
      permitExpirationDate: null,
    });
  };

  const handleEditClick = (request) => {
    console.log("Editing request:", JSON.stringify(request, null, 2));
    const isPermit = request.type === "permit";
    const safeRequest = {
      ...request,
      id: request.id ? request.id.toString() : `request-${Date.now()}`,
      type: request.type || "request",
      number:
        request.number ||
        (isPermit
          ? `PERMIT-${Math.floor(Math.random() * 10000)}`
          : `PR-${String(requests.length + 1).padStart(3, "0")}`),
      organization: request.organization || "نامشخص",
      subOrganization: request.subOrganization || "",
      employmentType: request.employmentType || "نامشخص",
      scoreRatio: request.scoreRatio || "نامشخص",
      hiringCapacity: parseInt(request.hiringCapacity) || 0,
      capacityMultiplier: request.capacityMultiplier
        ? String(request.capacityMultiplier)
        : "نامشخص",
      registrationDate:
        request.registrationDate ||
        new DateObject({
          calendar: persian,
          locale: persian_fa,
        }).format("YYYY/MM/DD"),
      confirmationDate: request.confirmationDate || "",
      permitExpirationDate: request.permitExpirationDate || "",
      permitNumber: request.permitNumber || (isPermit ? request.number : ""),
      quotaTable:
        Array.isArray(request.quotaTable) && request.quotaTable.length > 0
          ? request.quotaTable
          : [],
      educationTable:
        Array.isArray(request.educationTable) &&
        request.educationTable.length > 0
          ? request.educationTable
          : [],
      generalExamTable:
        Array.isArray(request.generalExamTable) &&
        request.generalExamTable.length > 0
          ? request.generalExamTable
          : [],
      specializedExamTable:
        Array.isArray(request.specializedExamTable) &&
        request.specializedExamTable.length > 0
          ? request.specializedExamTable
          : [],
      supplementaryEvaluationTable:
        Array.isArray(request.supplementaryEvaluationTable) &&
        request.supplementaryEvaluationTable.length > 0
          ? request.supplementaryEvaluationTable
          : [],
      requestLetter: request.requestLetter || "",
      status: request.status || "در انتظار",
      requestStatusRef:
        request.status === "تأیید شده"
          ? 2
          : request.status === "رد شده"
          ? 3
          : 1,
      permitImage: request.permitImage || null,
      permitImageName: request.permitImageName || "",
      description: request.description || "",
      specialConditions: request.specialConditions || "",
      isReadOnly:
        user?.role === "کاربر سازمان اداری و استخدامی" ||
        request.status === "تأیید شده",
    };
    setSelectedRequest(safeRequest);
    setIsModalOpen(true);
    setModalKey((prev) => prev + 1);
  };

  const handleAddClick = () => {
    setSelectedRequest(null);
    resetModalData();
    setIsModalOpen(true);
    setModalKey((prev) => prev + 1);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedRequest(null);
  };

  const handleReasonModalOpen = (reason, requestId) => {
    console.log(
      "Opening RejectionReasonModal with reason:",
      reason,
      "and requestId:",
      requestId
    );
    setSelectedReason(reason || "علت رد درخواست ثبت نشده است");
    setSelectedRequestId(requestId);
    setIsReasonModalOpen(true);
  };

  const handleReasonModalClose = () => {
    setIsReasonModalOpen(false);
    setSelectedReason("");
    setSelectedRequestId(null);
  };

  const handleUpdateRejectionReason = (requestId, newReason) => {
    setRequests((prev) =>
      prev.map((req) =>
        req.id === requestId ? { ...req, rejectionReason: newReason } : req
      )
    );
  };

  const handleUpdateRequest = (updatedRequest) => {
    console.log(
      "Updating request with:",
      JSON.stringify(updatedRequest, null, 2)
    );
    setRequests((prev) => {
      const existingRequest = prev.find((req) => req.id === updatedRequest.id);
      if (existingRequest) {
        // آپدیت درخواست موجود
        return prev.map((req) =>
          req.id === updatedRequest.id
            ? {
                ...req,
                ...updatedRequest,
                number: updatedRequest.number || req.number, // حفظ شماره
                status: updatedRequest.status || req.status,
                confirmationDate:
                  updatedRequest.status === "تأیید شده"
                    ? updatedRequest.confirmationDate ||
                      new DateObject({
                        calendar: persian,
                        locale: persian_fa,
                      }).format("YYYY/MM/DD")
                    : updatedRequest.confirmationDate || "",
                permitNumber: updatedRequest.permitNumber || req.permitNumber,
                permitImage: updatedRequest.permitImage || req.permitImage,
                permitExpirationDate:
                  updatedRequest.permitExpirationDate ||
                  req.permitExpirationDate,
              }
            : req
        );
      } else {
        // اضافه کردن درخواست جدید
        const newRequest = {
          ...updatedRequest,
          id: updatedRequest.id || `request-${Date.now()}`,
          number:
            updatedRequest.number ||
            `PR-${String(prev.length + 1).padStart(3, "0")}`,
          registrationDate:
            updatedRequest.registrationDate ||
            new DateObject({
              calendar: persian,
              locale: persian_fa,
            }).format("YYYY/MM/DD"),
        };
        return [newRequest, ...prev];
      }
    });
    setIsModalOpen(false);
    setSelectedRequest(null);
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
      label: "نوع استخدام",
      key: "employmentType",
      options: [
        { value: "", label: "همه" },
        { value: "رسمی", label: "رسمی" },
        { value: "پیمانی", label: "پیمانی" },
        { value: "قراردادی", label: "قراردادی" },
      ],
    },
    {
      label: "دستگاه",
      key: "organization",
      options: [
        { value: "", label: "همه" },
        {
          value: "شرکت تولید نیروی برق حرارتی",
          label: "شرکت تولید نیروی برق حرارتی",
        },
        {
          value: "سازمان بهزیستی کشور",
          label: "سازمان بهزیستی کشور",
        },
        { value: "وزارت نیرو", label: "وزارت نیرو" },
      ],
    },
    {
      label: "دستگاه تابعه",
      key: "subOrganization",
      options: [
        { value: "", label: "همه" },
        { value: "اداره کل تهران", label: "اداره کل تهران" },
        {
          value: "معاونت پیشگیری از معلولیت‌ها",
          label: "معاونت پیشگیری از معلولیت‌ها",
        },
        { value: "شرکت برق منطقه‌ای", label: "شرکت برق منطقه‌ای" },
        { value: "سازمان دانش‌آموزی", label: "سازمان دانش‌آموزی" },
      ],
    },
    {
      label: "وضعیت درخواست",
      key: "status",
      options: [
        { value: "", label: "همه" },
        { value: "در انتظار", label: "در انتظار" },
        { value: "تأیید شده", label: "تأیید شده" },
        { value: "رد شده", label: "رد شده" },
      ],
    },
    {
      label: "نسبت امتیاز",
      key: "scoreRatio",
      options: [
        { value: "", label: "همه" },
        { value: "70/30", label: "70/30" },
        { value: "40/60", label: "40/60" },
      ],
    },
  ];

  const filteredRequests = requests
    .filter(
      (item) =>
        item.type === "permit" ||
        (item.type === "request" && item.status === "تأیید شده")
    )
    .filter((item) =>
      user?.role === "وزارت نیرو" ? item.organization === "وزارت نیرو" : true
    )
    .filter((item) =>
      Object.values(item).some((value) =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
    .filter((item) => {
      return (
        (!filters.employmentType ||
          item.employmentType === filters.employmentType) &&
        (!filters.organization || item.organization === filters.organization) &&
        (!filters.subOrganization ||
          item.subOrganization === filters.subOrganization) &&
        (!filters.status || item.status === filters.status) &&
        (!filters.scoreRatio || item.scoreRatio === filters.scoreRatio)
      );
    })
    .sort((a, b) => {
      if (filters.sort === "dateAsc")
        return (a.confirmationDate || a.registrationDate).localeCompare(
          b.confirmationDate || b.registrationDate
        );
      if (filters.sort === "dateDesc")
        return (b.confirmationDate || b.registrationDate).localeCompare(
          a.confirmationDate || a.registrationDate
        );
      return 0;
    });

  const pageCount = Math.ceil(filteredRequests.length / itemsPerPage);
  const offset = currentPage * itemsPerPage;
  const currentItems = filteredRequests.slice(offset, offset + itemsPerPage);

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="permit-requests">
      <div className="permit-requests__headerTitle">
        <h2 className="permit-requests__title">ثبت شرایط و تعریف شغل محل‌ها</h2>
        {user?.role === "وزارت نیرو" && (
          <button className="assign-permit__add-btn" onClick={handleAddClick}>
            <FaPlus /> افزودن
          </button>
        )}
      </div>

      <div className="permit-requests__search-container">
        <div className="permit-requests__actions">
          <div className="permit-requests__filter-container">
            <div className="permit-requests__filter">
              <FaFilter className="permit-requests__filter-icon" />
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
          <div className="permit-requests__sort-container">
            <div className="permit-requests__sort">
              <FaSortAmountUpAlt className="permit-requests__sort-icon" />
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
          placeholder="جستجو در درخواست‌ها و مجوزها..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(0);
          }}
          className="permit-requests__search-input"
        />
      </div>

      <div className="permit-requests__list">
        {currentItems.length > 0 ? (
          <>
            {currentItems.map((item) => (
              <div key={item.id} className="permit-requests__item">
                <div className="permit-requests__details">
                  <div className="permit-requests__header">
                    <p className="permit-requests__headerDetail request-status">
                      {item.type === "permit" ? "شماره مجوز" : "شماره درخواست"}
                      <span>{item.number}</span>
                    </p>
                    <p className="permit-requests__headerDetail request-status">
                      وضعیت
                      <span>
                        {item.status}
                        {item.status === "رد شده" && (
                          <BsInfoCircle
                            className="permit-requests__info-icon"
                            onClick={() =>
                              handleReasonModalOpen(
                                item.rejectionReason,
                                item.id
                              )
                            }
                            data-tooltip-id="rejection-tooltip"
                            data-tooltip-content="مشاهده علت رد درخواست"
                            data-tooltip-place="top"
                          />
                        )}
                      </span>
                    </p>
                  </div>
                  <div className="permit-requests__body">
                    <div className="permit-requests__dates">
                      <p className="permit-requests__detail">
                        دستگاه: <span>{item.organization}</span>
                      </p>
                      <p className="permit-requests__detail">
                        تاریخ ثبت: <span>{item.registrationDate}</span>
                      </p>
                      <p className="permit-requests__detail">
                        دستگاه تابعه: <span>{item.subOrganization}</span>
                      </p>
                    </div>
                    <div className="permit-requests__organization">
                      <p className="permit-requests__detail">
                        نوع استخدام: <span>{item.employmentType}</span>
                      </p>
                      <p className="permit-requests__detail">
                        نسبت امتیاز: <span>{item.scoreRatio}</span>
                      </p>
                      <p className="permit-requests__detail">
                        تاریخ اعتبار مجوز:{" "}
                        <span>
                          {item.permitExpirationDate || item.confirmationDate}
                        </span>
                      </p>
                    </div>
                    <div className="permit-requests__lastBox">
                      <p className="permit-requests__detail">
                        ظرفیت استخدام: <span>{item.hiringCapacity} نفر</span>
                      </p>
                      <p className="permit-requests__detail">
                        چند برابر ظرفیت: <span>{item.capacityMultiplier}</span>
                      </p>
                      <p className="permit-requests__detail">
                        تاریخ تأیید:{" "}
                        <span>{item.confirmationDate || "نامشخص"}</span>
                      </p>
                    </div>
                  </div>
                </div>
                <div className="permit-requests__btns">
                  {user?.role === "وزارت نیرو" &&
                    item.status === "در انتظار" && (
                      <button
                        className="permit-requests__details-btn edit"
                        onClick={() => handleEditClick(item)}
                      >
                        ویرایش
                      </button>
                    )}
                  {user?.role === "کاربر سازمان اداری و استخدامی" && (
                    <button
                      className="permit-requests__details-btn edit"
                      onClick={() => handleEditClick(item)}
                    >
                      بررسی/ ویرایش
                    </button>
                  )}
                </div>
              </div>
            ))}
            <Tooltip id="rejection-tooltip" />
          </>
        ) : (
          <p>هیچ درخواست یا مجوزی یافت نشد</p>
        )}
      </div>

      <EditRequestModal
        key={modalKey}
        isOpen={isModalOpen}
        onClose={handleModalClose}
        request={selectedRequest}
        onUpdate={handleUpdateRequest}
        isEditMode={selectedRequest !== null}
        fromPage="permitRequests"
        initialModalData={modalData}
        resetModalData={resetModalData}
      />

      <RejectionReasonModal
        isOpen={isReasonModalOpen}
        onClose={handleReasonModalClose}
        rejectionReason={selectedReason}
        requestId={selectedRequestId}
        onUpdate={handleUpdateRejectionReason}
      />

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

export default PermitRequestsList;
