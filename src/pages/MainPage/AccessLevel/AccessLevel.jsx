import React, { useState, useEffect } from "react";
import { FaPlus, FaFilter, FaUser, FaTrash } from "react-icons/fa";
import Header from "../../../components/mainPageComps/Header/Header";
import "./AccessLevel.scss";
import UserModal from "./UserModal/UserModal";

const AccessLevel = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    accessLevel: "",
  });
  const [users, setUsers] = useState(() => {
    const savedUsers = localStorage.getItem("users");
    return savedUsers
      ? JSON.parse(savedUsers)
      : [
          {
            firstName: "علی",
            lastName: "رفیعی",
            fatherName: "حسن",
            nationalId: "1234567890",
            idNumber: "0012345678",
            mobileNumber: "09123456789",
            workPhone: "02112345678",
            job: "کارمند",
            workPlace: "تهران",
            accessLevel: "سازمان اداری و استخدامی",
            image: null,
          },
          {
            firstName: "محمد",
            lastName: "احمدی",
            fatherName: "رضا",
            nationalId: "0987654321",
            idNumber: "0023456789",
            mobileNumber: "09129876543",
            workPhone: "02187654321",
            job: "مدیر",
            workPlace: "اصفهان",
            accessLevel: "ادمین",
            image: null,
          },
          {
            firstName: "سارا",
            lastName: "خانم",
            fatherName: "علی",
            nationalId: "1122334455",
            idNumber: "0034567890",
            mobileNumber: "09121122334",
            workPhone: "02111223344",
            job: "کارشناس",
            workPlace: "شیراز",
            accessLevel: "وزارت نیرو",
            image: null,
          },
          {
            firstName: "رضا",
            lastName: "نوری",
            fatherName: "محمد",
            nationalId: "5566778899",
            idNumber: "0045678901",
            mobileNumber: "09125566778",
            workPhone: "02155667788",
            job: "سرپرست",
            workPlace: "مشهد",
            accessLevel: "دستگاه تابعه",
            image: null,
          },
          {
            firstName: "زهرا",
            lastName: "کریمی",
            fatherName: "حسین",
            nationalId: "3344556677",
            idNumber: "0056789012",
            mobileNumber: "09123344556",
            workPhone: "02133445566",
            job: "کارمند",
            workPlace: "تبریز",
            accessLevel: "مجری آزمون",
            image: null,
          },
          {
            firstName: "علی",
            lastName: "صفایی",
            fatherName: "فریبرز",
            nationalId: "3342345677",
            idNumber: "0056789012",
            mobileNumber: "09123344556",
            workPhone: "02133445566",
            job: "کارمند",
            workPlace: "تبریز",
            accessLevel: "مجری ارزیابی",
            image: null,
          },
          {
            firstName: "سارا",
            lastName: "عظیمی",
            fatherName: "رضا",
            nationalId: "3342345677",
            idNumber: "0056789012",
            mobileNumber: "09123344556",
            workPhone: "02133445566",
            job: "کارمند",
            workPlace: "تبریز",
            accessLevel: "طراح سوال",
            image: null,
          },
          {
            firstName: "فریبا",
            lastName: "رهایی",
            fatherName: "علی",
            nationalId: "3342334677",
            idNumber: "0056789012",
            mobileNumber: "09123344556",
            workPhone: "02133445566",
            job: "کارمند",
            workPlace: "تبریز",
            accessLevel: "ارزیاب",
            image: null,
          },
        ];
  });
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("users", JSON.stringify(users));
  }, [users]);

  const filterConfig = [
    {
      key: "accessLevel",
      label: "سطح دسترسی",
      options: [
        { value: "", label: "همه" },
        ...[...new Set(users.map((user) => user.accessLevel))].map((level) => ({
          value: level,
          label: level,
        })),
      ],
    },
  ];

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const filteredUsers = users.filter((user) => {
    const matchesFilters =
      !filters.accessLevel || user.accessLevel.includes(filters.accessLevel);
    const matchesSearch =
      !searchTerm ||
      `${user.firstName} ${user.lastName} ${user.fatherName} ${user.nationalId}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    return matchesFilters && matchesSearch;
  });

  const openAddModal = () => {
    setSelectedUser(null);
    setIsModalOpen(true);
  };

  const openEditModal = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const handleSaveUser = (userData) => {
    if (selectedUser) {
      // ویرایش کاربر
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.nationalId === userData.nationalId ? userData : user
        )
      );
    } else {
      setUsers((prevUsers) => [...prevUsers, userData]);
    }
    closeModal();
  };

  const handleDelete = (nationalId) => {
    setUsers((prevUsers) => {
      const updatedUsers = prevUsers.filter(
        (user) => user.nationalId !== nationalId
      );
      return updatedUsers;
    });
  };

  return (
    <div className="access-level__container">
      <Header />
      <div className="executive-management__titleWrapper">
        <button className="assign-permit__add-btn" onClick={openAddModal}>
          <FaPlus /> افزودن
        </button>
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
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="access-level__cards-container">
        {filteredUsers.map((user, index) => (
          <div key={index} className="candidate-card">
            <div className="candidate-card__image">
              {user.image ? (
                <img
                  src={user.image}
                  alt={`${user.firstName} ${user.lastName}`}
                />
              ) : (
                <span className="candidate-card__default-icon">
                  <FaUser />
                </span>
              )}
            </div>
            <p className="candidate-card__info">
              {" "}
              نام:
              <span>{user.firstName}</span>
            </p>
            <p className="candidate-card__info">
              نام خانوادگی:
              <span>{user.lastName}</span>
            </p>
            <p className="candidate-card__info">
              {" "}
              نام پدر:
              <span>{user.fatherName}</span>
            </p>
            <p className="candidate-card__info">
              {" "}
              سطح دسترسی:
              <span>{user.accessLevel}</span>
            </p>
            <div className="candidate-card__buttons">
              <button
                className="candidate-card__button"
                onClick={() => openEditModal(user)}
              >
                ویرایش
              </button>
              <button
                className="candidate-card__delete-button"
                onClick={() => handleDelete(user.nationalId)}
              >
                حذف
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <UserModal
          user={selectedUser}
          onSave={handleSaveUser}
          onClose={closeModal}
        />
      )}
    </div>
  );
};

export default AccessLevel;
