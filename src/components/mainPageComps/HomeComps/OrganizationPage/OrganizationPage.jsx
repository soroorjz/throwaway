import React, { useState, useMemo } from "react";
import Tree from "react-d3-tree";
import { FaBuilding, FaPlus } from "react-icons/fa";
import { MdOutlineEdit } from "react-icons/md";
import { RiDeleteBin5Line } from "react-icons/ri";
import ReactPaginate from "react-paginate";
import { Tooltip } from "react-tooltip";
import buildOrgTree from "./buildOrgTree";
import "./OrganizationPage.scss";
import SubOrganizationsModal from "../DynamicList/SubOrganizationsModal";
import AddOrganizationModal from "./AddOrganizationModal/AddOrganizationModal";

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, orgName }) => {
  if (!isOpen) return null;

  return (
    <div className="delete-confirmation-modal-overlay">
      <div className="delete-confirmation-modal">
        <div className="delete-confirmation-modal-content">
          <h3>تأیید حذف</h3>
          <p>آیا از حذف دستگاه "{orgName}" اطمینان دارید؟</p>
          <div className="delete-confirmation-modal-actions">
            <button
              onClick={onConfirm}
              className="delete-confirmation-modal-confirm"
            >
              تأیید
            </button>
            <button
              onClick={onClose}
              className="delete-confirmation-modal-cancel"
            >
              لغو
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const OrganizationPage = ({ title, data, setData, columns }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [orgToDelete, setOrgToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [modalMode, setModalMode] = useState("view");
  const itemsPerPage = 10;

  const orgTree = useMemo(() => buildOrgTree(data), [data]);

  const filteredOrgTree = orgTree.filter((org) =>
    org.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pageCount = Math.ceil(filteredOrgTree.length / itemsPerPage);
  const paginatedData = filteredOrgTree.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const handlePageChange = ({ selected }) => setCurrentPage(selected);

  const handleShowChart = (org) => {
    setSelectedOrg(org);
    setModalMode("view");
    setIsModalOpen(true);
  };

  const handleEditClick = (org) => {
    setSelectedOrg(org);
    setModalMode("edit");
    setIsModalOpen(true);
  };

  const handleAddOrganizations = (newOrgs) => {
    setData([...data, ...newOrgs]);
    localStorage.setItem(title, JSON.stringify([...data, ...newOrgs]));
  };

  const handleDeleteClick = (org) => {
    setOrgToDelete(org);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (orgToDelete) {
      const deleteOrgAndChildren = (orgId) => {
        const orgsToDelete = [orgId];
        data.forEach((item) => {
          if (item.parent === orgId) {
            orgsToDelete.push(...deleteOrgAndChildren(item.id));
          }
        });
        return orgsToDelete;
      };

      const orgsToDelete = deleteOrgAndChildren(orgToDelete.id);
      const updatedData = data.filter(
        (item) => !orgsToDelete.includes(item.id)
      );

      setData(updatedData);
      localStorage.setItem(title, JSON.stringify(updatedData));
    }
    setIsDeleteModalOpen(false);
    setOrgToDelete(null);
  };

  const renderCustomNodeElement = ({ nodeDatum }) => (
    <g>
      <foreignObject x="-80" y="-40" width="160" height="100">
        <div className="organization-page__node">
          <div className="organization-page__node-content">
            <FaBuilding className="organization-page__node-icon" />
            <span
              className="organization-page__node-name"
              data-tooltip-id={`tooltip-${nodeDatum.id}`}
              data-tooltip-content={nodeDatum.fullName || nodeDatum.name}
            >
              {nodeDatum.name}
            </span>
            <button
              className="organization-page__node-action"
              onClick={() => handleShowChart(nodeDatum)}
            >
              نمایش
            </button>
          </div>
          <Tooltip id={`tooltip-${nodeDatum.id}`} />
        </div>
      </foreignObject>
    </g>
  );

  const getSubCount = (org) => {
    return org.children.reduce((sum, child) => sum + 1 + getSubCount(child), 0);
  };

  return (
    <div className="organization-page">
      <h2>{title}</h2>
      <div className="organization-page__actions">
        <input
          type="text"
          placeholder="جستجو..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="organization-page__search"
        />
        <button
          className="organization-page__add-btn"
          onClick={() => setIsAddModalOpen(true)}
        >
          افزودن <FaPlus />
        </button>
      </div>

      <div className="organization-page__table">
        {paginatedData.length === 0 ? (
          <div className="organization-page__table-cell--empty">
            داده‌ای یافت نشد
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>نام دستگاه</th>
                <th>تعداد دستگاه تابعه</th>
                <th>جزئیات</th>
                <th>عملیات</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((root) => (
                <tr key={root.id}>
                  <td>{root.name}</td>
                  <td>{getSubCount(root)}</td>
                  <td>
                    <button
                      className="organization-page__table-action"
                      onClick={() => handleShowChart(root)}
                    >
                      نمایش
                    </button>
                  </td>
                  <td>
                    <button
                      className="organization-page__table-action organization-page__table-action--delete"
                      onClick={() => handleDeleteClick(root)}
                      data-tooltip-id={`tooltip-delete-${root.id}`}
                      data-tooltip-content="حذف"
                    >
                      <RiDeleteBin5Line />
                    </button>
                    <Tooltip id={`tooltip-delete-${root.id}`} />
                    <button
                      className="organization-page__table-action organization-page__table-action--edit"
                      onClick={() => handleEditClick(root)}
                      data-tooltip-id={`tooltip-edit-${root.id}`}
                      data-tooltip-content="ویرایش"
                    >
                      <MdOutlineEdit />
                    </button>
                    <Tooltip id={`tooltip-edit-${root.id}`} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {pageCount > 1 && (
        <ReactPaginate
          previousLabel={"قبلی"}
          nextLabel={"بعدی"}
          breakLabel={"..."}
          pageCount={pageCount}
          onPageChange={handlePageChange}
          containerClassName={"organization-page__pagination"}
          pageClassName={"organization-page__pagination-btn"}
          activeClassName={"organization-page__pagination-btn--active"}
          previousClassName={"organization-page__pagination-btn"}
          nextClassName={"organization-page__pagination-btn"}
          breakClassName={"organization-page__pagination-btn"}
          disabledClassName={"organization-page__pagination-btn--disabled"}
        />
      )}
      {selectedOrg && (
        <SubOrganizationsModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedOrg(null);
            setModalMode("view");
          }}
          subOrganizations={selectedOrg.children}
          setSubOrganizations={(subs) => {
            const updatedData = data.map((item) =>
              item.ExecutiveBodyId === selectedOrg.id
                ? { ...item, children: subs }
                : item
            );
            setData(updatedData);
            localStorage.setItem(title, JSON.stringify(updatedData));
          }}
          allData={data}
          setAllData={setData}
          parentId={selectedOrg.id}
          title={selectedOrg.name}
          isEditMode={modalMode === "edit"}
        />
      )}
      <AddOrganizationModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddOrganizations}
      />
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setOrgToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        orgName={orgToDelete?.name || ""}
      />
    </div>
  );
};

export default OrganizationPage;
