import React, { useState } from "react";
import { MdOutlineEdit } from "react-icons/md";
import { RiDeleteBin5Line } from "react-icons/ri";
import { FaPlus } from "react-icons/fa";
import { Tooltip } from "react-tooltip";
import ReactPaginate from "react-paginate";
import "./DynamicList.scss";
import SubOrganizationsModal from "./SubOrganizationsModal";

const DynamicList = ({
  title,
  data,
  setData,
  columns,
  openModal,
  isVariable,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSubOrganizations, setSelectedSubOrganizations] = useState([]);
  const itemsPerPage = 10;

  const topLevelData =
    title === "دستگاه اجرایی" ? data.filter((item) => !item.parent) : data;

  const filteredData = topLevelData.filter((item) =>
    Object.values(item).some((value) =>
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const pageCount = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = currentPage * itemsPerPage;
  const paginatedData = filteredData.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  const handleDelete = (id) => {
    if (window.confirm(`آیا مطمئن هستید که می‌خواهید این مورد را حذف کنید؟`)) {
      const getAllSubIds = (parentId) => {
        const subs = [];
        const findSubs = (id) => {
          const directSubs = data.filter((item) => item.parent === id);
          directSubs.forEach((sub) => {
            subs.push(sub.id);
            findSubs(sub.id);
          });
        };
        findSubs(parentId);
        return subs;
      };
      const subIds = getAllSubIds(id);
      const itemToDelete = data.find((item) => item.id === id);
      let updatedData = data.filter(
        (item) => item.id !== id && !subIds.includes(item.id)
      );

      if (itemToDelete.parent) {
        const parentIndex = updatedData.findIndex(
          (item) => item.id === itemToDelete.parent
        );
        if (parentIndex !== -1) {
          const newSubCount = updatedData.filter(
            (item) => item.parent === itemToDelete.parent
          ).length;
          updatedData[parentIndex] = {
            ...updatedData[parentIndex],
            subCount: newSubCount,
          };
        }
      }

      setData(updatedData);
      localStorage.setItem(title, JSON.stringify(updatedData));

      // اصلاح پجینیشن
      const newPageCount = Math.ceil(
        updatedData.filter((item) => !item.parent).length / itemsPerPage
      );
      if (currentPage >= newPageCount && newPageCount > 0) {
        setCurrentPage(newPageCount - 1); // تنظیم به آخرین صفحه معتبر
      } else if (newPageCount === 0) {
        setCurrentPage(0); // اگر هیچ داده‌ای نیست، به صفحه اول برو
      }
    }
  };

  const handleEdit = (item) => {
    if (title === "دستگاه اجرایی") return;
    openModal("edit", item);
  };

  const handleAdd = () => {
    if (title === "دستگاه اجرایی") return;
    openModal("add");
  };

  const getAllSubOrganizations = (parentId) => {
    const subs = [];
    const findSubs = (id, depth = 1) => {
      const directSubs = data.filter((item) => item.parent === id);
      directSubs.forEach((sub) => {
        subs.push({ ...sub, depth });
        findSubs(sub.id, depth + 1);
      });
    };
    findSubs(parentId);
    return subs;
  };

  const handleShowSubOrganizations = (item) => {
    const subOrganizations = getAllSubOrganizations(item.id);
    setSelectedSubOrganizations(subOrganizations);
    setModalOpen(true);
  };

  const showActions = true;

  return (
    <div className="dynamic-list">
      <div className="dynamic-list__header">
        <h3 className="dynamic-list__title">{title}</h3>
        <div className="dynamic-list__actions">
          <input
            type="text"
            placeholder="جستجو..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="dynamic-list__search"
          />
          <button className="add-button" onClick={handleAdd}>
            افزودن <FaPlus />
          </button>
        </div>
      </div>

      <table className="dynamic-list__table">
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th key={index} className="dynamic-list__table-header">
                {column.header}
              </th>
            ))}
            {showActions && (
              <th className="dynamic-list__table-header">عملیات</th>
            )}
          </tr>
        </thead>
        <tbody>
          {paginatedData.length > 0 ? (
            paginatedData.map((item, index) => (
              <tr key={item.id} className="dynamic-list__table-row">
                {columns.map((column, colIndex) => (
                  <td key={colIndex} className="dynamic-list__table-cell">
                    {column.render
                      ? column.render(
                          item,
                          startIndex + index,
                          handleShowSubOrganizations
                        )
                      : column.rawValue
                      ? column.rawValue(item)
                      : item[column.key]}
                  </td>
                ))}
                {showActions && (
                  <td className="dynamic-list__table-cell">
                    <div className="dynamic-list__table-actions">
                      <button
                        className="dynamic-list__action-btn dynamic-list__action-btn--edit"
                        data-tooltip-id={`edit-${item.id}`}
                        data-tooltip-content="ویرایش"
                        onClick={() => handleEdit(item)}
                      >
                        <MdOutlineEdit />
                      </button>
                      <Tooltip
                        id={`edit-${item.id}`}
                        place="top"
                        effect="solid"
                        className="dynamic-list__tooltip"
                      />
                      <button
                        className="dynamic-list__action-btn dynamic-list__action-btn--delete"
                        data-tooltip-id={`delete-${item.id}`}
                        data-tooltip-content="حذف"
                        onClick={() => handleDelete(item.id)}
                      >
                        <RiDeleteBin5Line />
                      </button>
                      <Tooltip
                        id={`delete-${item.id}`}
                        place="top"
                        effect="solid"
                        className="dynamic-list__tooltip"
                      />
                    </div>
                  </td>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={columns.length + (showActions ? 1 : 0)}
                className="dynamic-list__table-cell dynamic-list__table-cell--empty"
              >
                داده‌ای یافت نشد
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {pageCount > 1 && (
        <ReactPaginate
          previousLabel={"قبلی"}
          nextLabel={"بعدی"}
          breakLabel={"..."}
          pageCount={pageCount}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={handlePageChange}
          containerClassName={"dynamic-list__pagination"}
          pageClassName={"dynamic-list__pagination-btn"}
          activeClassName={"dynamic-list__pagination-btn--active"}
          previousClassName={"dynamic-list__pagination-btn"}
          nextClassName={"dynamic-list__pagination-btn"}
          breakClassName={"dynamic-list__pagination-btn"}
          disabledClassName={"dynamic-list__pagination-btn--disabled"}
        />
      )}

      <SubOrganizationsModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        subOrganizations={selectedSubOrganizations}
        setSubOrganizations={setSelectedSubOrganizations}
        allData={data}
        setAllData={setData}
        parentId={null}
        title={title}
      />
    </div>
  );
};

export default DynamicList;
