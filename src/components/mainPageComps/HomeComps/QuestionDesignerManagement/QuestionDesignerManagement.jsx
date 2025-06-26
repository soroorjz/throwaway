import React, { useState, useMemo, useEffect } from "react";
import ReactPaginate from "react-paginate";
import "./QuestionDesignerManagement.scss";
import { initialQuestionDesigners } from "./initialQuestionDesigners";
import { motion, AnimatePresence } from "framer-motion";
import { FaPlus } from "react-icons/fa";
import DesignerControls from "./DesignerControls";
import DesignerCard from "./DesignerCard";
import AddDesignerModal from "./AddDesignerModal";
import AddSuccessModal from "./AddSuccessModal";
import EditDesignerModal from "./EditDesignerModal";
import EditSuccessModal from "./EditSuccessModal";
import DeleteDesignerModal from "./DeleteDesignerModal";
import DeleteSuccessModal from "./DeleteSuccessModal";

const QuestionDesignerManagement = () => {
  const [designers, setDesigners] = useState(() => {
    const saved = localStorage.getItem("questionDesigners");
    return saved ? JSON.parse(saved) : initialQuestionDesigners;
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    province: "",
    status: "",
    sort: "date-desc",
  });
  const [currentPage, setCurrentPage] = useState(0);
  const [activeModal, setActiveModal] = useState(null);
  const [selectedDesigner, setSelectedDesigner] = useState(null);
  const [formData, setFormData] = useState({});
  const [newDesigner, setNewDesigner] = useState({
    firstName: "",
    lastName: "",
    province: "",
    address: "",
    status: "",
    mobileNumber: "",
    nationalCode: "",
    idNumber: "",
    contractImage: "",
    contractAmount: "",
    performanceRating: "",
    managerComment: "",
    username: "",
    password: "",
  });

  const itemsPerPage = 12;

  useEffect(() => {
    try {
      localStorage.setItem("questionDesigners", JSON.stringify(designers));
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }
  }, [designers]);

  const provinces = useMemo(() => {
    const uniqueProvinces = [...new Set(designers.map((d) => d.province))];
    return [
      { value: "", label: "همه" },
      ...uniqueProvinces.map((province) => ({
        value: province,
        label: province,
      })),
    ];
  }, [designers]);

  const statuses = useMemo(() => {
    const uniqueStatuses = [...new Set(designers.map((d) => d.status))];
    return [
      { value: "", label: "همه" },
      ...uniqueStatuses.map((status) => ({
        value: status,
        label: status,
      })),
    ];
  }, [designers]);

  const sortOptions = [
    { value: "date-desc", label: "جدیدترین" },
    { value: "date-asc", label: "قدیمی‌ترین" },
  ];

  const filteredDesigners = useMemo(() => {
    let filtered = designers.filter((designer) => {
      const searchMatch =
        searchTerm === "" ||
        `${designer.firstName} ${designer.lastName}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      const provinceMatch =
        filters.province === "" || designer.province === filters.province;
      const statusMatch =
        filters.status === "" || designer.status === filters.status;
      return searchMatch && provinceMatch && statusMatch;
    });

    return [...filtered].sort((a, b) => {
      const dateA = a.createdAt
        ? new Date(a.createdAt)
        : new Date("1400/01/01");
      const dateB = b.createdAt
        ? new Date(b.createdAt)
        : new Date("1400/01/01");
      return filters.sort === "date-asc" ? dateA - dateB : dateB - dateA;
    });
  }, [designers, searchTerm, filters]);

  const pageCount = Math.ceil(filteredDesigners.length / itemsPerPage);
  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentDesigners = filteredDesigners.slice(startIndex, endIndex);

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleEditClick = (designer) => {
    setSelectedDesigner(designer);
    setFormData({
      firstName: designer.firstName,
      lastName: designer.lastName,
      province: designer.province,
      address: designer.address,
      status: designer.status,
      mobileNumber: designer.mobileNumber,
      nationalCode: designer.nationalCode,
      idNumber: designer.idNumber,
      contractImage: designer.contractImage,
      contractAmount: designer.contractAmount,
      performanceRating: designer.performanceRating,
      managerComment: designer.managerComment,
      username: designer.username,
      password: designer.password,
    });
    setActiveModal("edit");
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!selectedDesigner || !selectedDesigner.id) return;
    setDesigners((prev) =>
      prev.map((designer) =>
        designer.id === selectedDesigner.id
          ? {
              ...designer,
              ...formData,
              contractAmount: parseInt(formData.contractAmount) || 0,
              performanceRating: parseInt(formData.performanceRating) || 1,
            }
          : designer
      )
    );
    setActiveModal("editSuccess");
  };

  const handleDeleteClick = (designer) => {
    setSelectedDesigner(designer);
    setActiveModal("delete");
  };

  const handleDeleteConfirm = () => {
    if (!selectedDesigner || !selectedDesigner.id) return;
    setDesigners((prev) =>
      prev.filter((designer) => designer.id !== selectedDesigner.id)
    );
    setActiveModal("deleteSuccess");
  };

  const handleAddDesigner = (e) => {
    e.preventDefault();
    const newId = designers.length
      ? Math.max(...designers.map((d) => d.id)) + 1
      : 1;
    const designerToAdd = {
      id: newId,
      ...newDesigner,
      contractAmount: parseInt(newDesigner.contractAmount) || 0,
      performanceRating: parseInt(newDesigner.performanceRating) || 1,
      createdAt: new Date().toLocaleDateString("fa-IR").replace(/[/]/g, "/"),
    };
    setDesigners((prev) => [designerToAdd, ...prev]);
    setNewDesigner({
      firstName: "",
      lastName: "",
      province: "",
      address: "",
      status: "",
      mobileNumber: "",
      nationalCode: "",
      idNumber: "",
      contractImage: "",
      contractAmount: "",
      performanceRating: "",
      managerComment: "",
      username: "",
      password: "",
    });
    setActiveModal("addSuccess");
  };

  // مدیریت بستن خودکار مودال‌های موفقیت
  useEffect(() => {
    if (
      activeModal === "addSuccess" ||
      activeModal === "editSuccess" ||
      activeModal === "deleteSuccess"
    ) {
      const timer = setTimeout(() => {
        setActiveModal(null);
        setSelectedDesigner(null);
        setFormData({});
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [activeModal]);

  return (
    <div className="question-designer-management">
      <div className="question-designer-management__titleWrapper">
        <h2 className="question-designer-management__title">طراح سوال</h2>
        <button
          className="assign-permit__add-btn"
          onClick={() => setActiveModal("add")}
        >
          <FaPlus /> افزودن
        </button>
      </div>

      <div className="question-designer-management__controls">
        <DesignerControls
          sortOptions={sortOptions}
          filters={filters}
          setFilters={setFilters}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          setCurrentPage={setCurrentPage}
          provinces={provinces}
          statuses={statuses}
        />
      </div>

      <div className="question-designer-management__grid">
        {currentDesigners.length > 0 ? (
          currentDesigners.map((designer) => (
            <DesignerCard
              key={designer.id}
              designer={designer}
              onEditClick={handleEditClick}
              onDeleteClick={handleDeleteClick}
            />
          ))
        ) : (
          <p className="question-designer-management__no-results">
            هیچ نتیجه‌ای یافت نشد.
          </p>
        )}
      </div>

      <AnimatePresence>
        {activeModal === "add" && (
          <AddDesignerModal
            isOpen={true}
            onClose={() => setActiveModal(null)}
            newDesigner={newDesigner}
            setNewDesigner={setNewDesigner}
            onSubmit={handleAddDesigner}
            provinces={provinces}
            statuses={statuses}
          />
        )}
        {activeModal === "addSuccess" && (
          <AddSuccessModal isOpen={true} onClose={() => setActiveModal(null)} />
        )}
        {activeModal === "edit" && (
          <EditDesignerModal
            isOpen={true}
            onClose={() => setActiveModal(null)}
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleEditSubmit}
            provinces={provinces}
            statuses={statuses}
          />
        )}
        {activeModal === "editSuccess" && (
          <EditSuccessModal
            isOpen={true}
            onClose={() => setActiveModal(null)}
          />
        )}
        {activeModal === "delete" && (
          <DeleteDesignerModal
            isOpen={true}
            onConfirm={handleDeleteConfirm}
            onCancel={() => setActiveModal(null)}
          />
        )}
        {activeModal === "deleteSuccess" && (
          <DeleteSuccessModal
            isOpen={true}
            onClose={() => setActiveModal(null)}
          />
        )}
      </AnimatePresence>

      {filteredDesigners.length > itemsPerPage && (
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

export default QuestionDesignerManagement;
