import React, { useState } from "react";
import "./SelectionOrganization.scss";
import { FaFilter, FaPlus, FaDownload } from "react-icons/fa";
import ReactPaginate from "react-paginate";
import { initialSelectionOrganization } from "./initialSelectionOrganization";
import SelectionOrganizationModal from "./SelectionOrganizationModal";
import { useAuth } from "../../../../AuthContext"; // اضافه شده برای دریافت نقش کاربر

const SelectionOrganization = () => {
  const { user } = useAuth(); // دریافت اطلاعات کاربر
  const [selections, setSelections] = useState(initialSelectionOrganization);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [filters, setFilters] = useState({
    organization: "",
    job: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleteSuccessModalOpen, setIsDeleteSuccessModalOpen] =
    useState(false);
  const [selectionToDelete, setSelectionToDelete] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedSelection, setSelectedSelection] = useState(null);
  const [formData, setFormData] = useState({
    examName: "",
    organization: "",
    job: "",
    group: "",
    venue: "",
    documents: "",
    examDate: null,
    examTime: "",
    candidateList: null,
  });

  const itemsPerPage = 3;

  const filterConfig = [
    {
      label: "دستگاه",
      key: "organization",
      options: [
        { value: "", label: "همه" },
        {
          value: "سازمان شهرداری ها و دهیاری های کشور",
          label: "سازمان شهرداری ها و دهیاری های کشور",
        },
        { value: "سازمان بهزیستی کشور", label: "سازمان بهزیستی کشور" },
        { value: "وزارت نیرو", label: "وزارت نیرو" },
        { value: "قوه قضاییه", label: "قوه قضاییه" },
        { value: "وزارت نفت", label: "وزارت نفت" },
      ],
    },
    {
      label: "شغل",
      key: "job",
      options: [
        { value: "", label: "همه" },
        { value: "کارشناس اداری", label: "کارشناس اداری" },
        { value: "پرستار", label: "پرستار" },
        { value: "آتشنشان", label: "آتشنشان" },
        { value: "اپراتور فوق توزیع", label: "اپراتور فوق توزیع" },
        { value: "مهندس شیمی", label: "مهندس شیمی" },
        { value: "کارشناس شهرسازی", label: "کارشناس شهرسازی" },
        { value: "کارشناس مالی", label: "کارشناس مالی" },
        { value: "مهندس راه و ساختمان", label: "مهندس راه و ساختمان" },
        { value: "کارشناس محیط زیست", label: "کارشناس محیط زیست" },
        { value: "کارشناس امور مالیاتی", label: "کارشناس امور مالیاتی" },
      ],
    },
  ];

  const handleEditClick = (selection) => {
    setSelectedSelection(selection);
    setFormData({
      examName: selection.examName,
      organization: selection.organization,
      job: selection.job,
      group: selection.group,
      venue: selection.venue,
      documents: selection.documents,
      examDate: selection.examDate,
      examTime: selection.examTime,
      candidateList: selection.candidateList,
    });
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleAddClick = () => {
    setFormData({
      examName: "",
      organization: "",
      job: "",
      group: "",
      venue: "",
      documents: "",
      examDate: null,
      examTime: "",
      candidateList: null,
    });
    setIsEditMode(false);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedSelection(null);
    setFormData({
      examName: "",
      organization: "",
      job: "",
      group: "",
      venue: "",
      documents: "",
      examDate: null,
      examTime: "",
      candidateList: null,
    });
  };

  const handleFormChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const formattedDate = formData.examDate
      ? formData.examDate.format("YYYY/MM/DD")
      : "";
    const newSelection = {
      id: isEditMode
        ? selectedSelection.id
        : selections.length
        ? Math.max(...selections.map((s) => s.id)) + 1
        : 1,
      examName: formData.examName,
      organization: formData.organization,
      job: formData.job,
      group: formData.group,
      venue: formData.venue,
      documents: formData.documents,
      examDate: formattedDate,
      examTime: formData.examTime,
      candidateList: formData.candidateList ? formData.candidateList.name : "",
    };

    if (isEditMode) {
      setSelections((prev) =>
        prev.map((selection) =>
          selection.id === selectedSelection.id ? newSelection : selection
        )
      );
    } else {
      setSelections((prev) => [newSelection, ...prev]);
    }

    setIsSuccessModalOpen(true);
    setTimeout(() => {
      setIsSuccessModalOpen(false);
      handleModalClose();
    }, 3000);
  };

  const handleDeleteClick = (selection) => {
    setSelectionToDelete(selection);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    setSelections((prev) =>
      prev.filter((selection) => selection.id !== selectionToDelete.id)
    );
    setIsDeleteModalOpen(false);
    setIsDeleteSuccessModalOpen(true);
    setTimeout(() => {
      setIsDeleteSuccessModalOpen(false);
      setSelectionToDelete(null);
    }, 3000);
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false);
    setSelectionToDelete(null);
  };

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({ ...prev, [filterType]: value }));
    setCurrentPage(0);
  };

  const handleDownload = (file) => {
    if (file) {
      const fileUrl = `https://example.com/files/${file}`;
      const link = document.createElement("a");
      link.href = fileUrl;
      link.download = file;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const filteredSelections = selections
    .filter((selection) =>
      Object.values(selection).some((value) =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
    .filter((selection) =>
      !filters.organization
        ? true
        : selection.organization === filters.organization
    )
    .filter((selection) =>
      !filters.job ? true : selection.job === filters.job
    );

  const pageCount = Math.ceil(filteredSelections.length / itemsPerPage);
  const offset = currentPage * itemsPerPage;
  const currentItems = filteredSelections.slice(offset, offset + itemsPerPage);

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="selection-organization">
      <div className="selection-organization__titleWrapper">
        <h2 className="selection-organization__title">سازماندهی گزینش</h2>
        {user?.role !== "کاربر سازمان اداری و استخدامی" && (
          <button className="assign-permit__add-btn" onClick={handleAddClick}>
            <FaPlus /> افزودن
          </button>
        )}
      </div>

      <div className="selection-organization__search-container">
        <div className="selection-organization__actions">
          <div className="selection-organization__filter-container">
            <div className="selection-organization__filter">
              <FaFilter className="selection-organization__filter-icon" />
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
        </div>
        <input
          type="text"
          placeholder="جستجو در سازماندهی گزینش..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(0);
          }}
          className="selection-organization__search-input"
        />
      </div>

      <div className="selection-organization__list">
        {currentItems.length > 0 ? (
          currentItems.map((selection) => (
            <div key={selection.id} className="selection-organization__item">
              <div className="selection-organization__details">
                <div className="selection-organization__header">
                  <p className="selection-organization__headerDetail title">
                    {selection.examName}
                  </p>
                </div>
                <div className="selection-organization__body">
                  <div className="selection-organization__section">
                    <p className="selection-organization__detail">
                      دستگاه: <span>{selection.organization}</span>
                    </p>
                    <p className="selection-organization__detail">
                      شغل: <span>{selection.job}</span>
                    </p>
                    <p className="selection-organization__detail">
                      گروه: <span>{selection.group}</span>
                    </p>
                  </div>
                  <div className="selection-organization__section">
                    <p className="selection-organization__detail">
                      مکان برگزاری: <span>{selection.venue}</span>
                    </p>
                    <p className="selection-organization__detail">
                      تاریخ برگزاری: <span>{selection.examDate}</span>
                    </p>
                    <p className="selection-organization__detail">
                      ساعت برگزاری: <span>{selection.examTime}</span>
                    </p>
                  </div>
                  <div className="selection-organization__section">
                    <p className="selection-organization__detail">
                      لیست نفرات:{" "}
                      {selection.candidateList ? (
                        <button
                          className="selection-organization__download-btn"
                          onClick={() =>
                            handleDownload(selection.candidateList)
                          }
                        >
                          <FaDownload /> دریافت
                        </button>
                      ) : (
                        <span>فایلی موجود نیست</span>
                      )}
                    </p>
                    <p className="selection-organization__detail">
                      مدارک:{" "}
                      {selection.documents ? (
                        <button
                          className="selection-organization__download-btn"
                          onClick={() => handleDownload(selection.documents)}
                        >
                          <FaDownload /> دریافت
                        </button>
                      ) : (
                        <span>فایلی موجود نیست</span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
              {user?.role !== "کاربر سازمان اداری و استخدامی" && (
                <div className="selection-organization__btns">
                  <button
                    className="selection-organization__details-btn edit"
                    onClick={() => handleEditClick(selection)}
                  >
                    ویرایش
                  </button>
                  <button
                    className="selection-organization__details-btn delete"
                    onClick={() => handleDeleteClick(selection)}
                  >
                    حذف
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <p>هیچ سازماندهی یافت نشد</p>
        )}
      </div>

      <SelectionOrganizationModal
        isModalOpen={isModalOpen}
        isSuccessModalOpen={isSuccessModalOpen}
        isDeleteModalOpen={isDeleteModalOpen}
        isDeleteSuccessModalOpen={isDeleteSuccessModalOpen}
        setIsModalOpen={setIsModalOpen}
        setIsSuccessModalOpen={setIsSuccessModalOpen}
        setIsDeleteModalOpen={setIsDeleteModalOpen}
        setIsDeleteSuccessModalOpen={setIsDeleteSuccessModalOpen}
        handleModalClose={handleModalClose}
        handleFormChange={handleFormChange}
        handleFormSubmit={handleFormSubmit}
        handleDeleteConfirm={handleDeleteConfirm}
        handleDeleteCancel={handleDeleteCancel}
        formData={formData}
        isEditMode={isEditMode}
        filterConfig={filterConfig}
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

export default SelectionOrganization;
