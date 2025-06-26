import React, { useState, useEffect } from "react";
import { useAuth } from "../../../../AuthContext";

const OrganizationModal = ({
  isOpen,
  onClose,
  province,
  gender,
  initialUnorganized,
  organizationData,
  setOrganizationData,
  volunteerData,
  setVolunteerData,
  onSave,
}) => {
  const { user } = useAuth();
  const isAdminUser = user?.role === "کاربر سازمان اداری و استخدامی";
  const storageKey = `organization_${province}_${gender}`;

  // محاسبه مقدار اولیه unorganized از volunteerData
  const currentUnorganized =
    volunteerData
      .find((item) => item.name === province)
      ?.candidates.find((c) => c.gender === gender)?.unorganized ??
    initialUnorganized;

  // ذخیره مقدار اولیه unorganized برای بازگشت به حالت اولیه
  const initialUnorganizedState =
    volunteerData
      .find((item) => item.name === province)
      ?.candidates.find((c) => c.gender === gender)?.total ??
    initialUnorganized;

  const [localSelectedCenters, setLocalSelectedCenters] = useState([]);
  const [localUnorganized, setLocalUnorganized] = useState(currentUnorganized);

  // لود حوزه‌های انتخاب‌شده قبلی و همگام‌سازی با volunteerData
  useEffect(() => {
    if (isOpen && province && gender && volunteerData.length > 0) {
      // محاسبه مجدد currentUnorganized
      const updatedUnorganized =
        volunteerData
          .find((item) => item.name === province)
          ?.candidates.find((c) => c.gender === gender)?.unorganized ??
        initialUnorganized;

      // لود داده‌ها از localStorage
      const savedData = JSON.parse(localStorage.getItem(storageKey)) || {};
      let initialSelectedCenters = savedData.localSelectedCenters || [];

      // اگه localStorage خالیه، از organizationData حوزه‌های انتخاب‌شده رو لود کن
      if (initialSelectedCenters.length === 0) {
        const provinceData = organizationData.find(
          (p) => p.name === province
        ) || {
          centers: [],
        };
        const previouslyAssignedCenters = provinceData.centers
          .filter((center) => center.gender === gender && center.occupied > 0)
          .map((center) => ({
            ...center,
            assigned: center.occupied, // مقدار assigned برابر با occupied فعلی
          }));
        initialSelectedCenters = previouslyAssignedCenters;
      }

      setLocalSelectedCenters(initialSelectedCenters);
      setLocalUnorganized(updatedUnorganized);
    }
  }, [
    isOpen,
    province,
    gender,
    volunteerData,
    organizationData,
    initialUnorganized,
    storageKey,
  ]);

  // ذخیره داده‌ها در localStorage
  useEffect(() => {
    if (isOpen) {
      localStorage.setItem(
        storageKey,
        JSON.stringify({
          localSelectedCenters,
          localUnorganized,
        })
      );
    }
  }, [localSelectedCenters, localUnorganized, storageKey, isOpen]);

  if (!isOpen || !province) return null;

  const provinceData = organizationData.find((p) => p.name === province) || {
    centers: [],
  };
  const centers = provinceData.centers.filter(
    (center) => center.gender === gender
  );

  const totalVolunteers =
    volunteerData
      .find((item) => item.name === province)
      ?.candidates.find((c) => c.gender === gender)?.total || 0;

  const handleCheckboxChange = (center, isChecked) => {
    setLocalSelectedCenters((prev) => {
      let newCenters = [...prev];
      if (isChecked) {
        const availableCapacity = Math.max(
          0,
          center.capacity - center.occupied
        );
        const assignable = Math.min(availableCapacity, localUnorganized);
        if (assignable > 0) {
          newCenters = [...prev, { ...center, assigned: assignable }];
        }
      } else {
        newCenters = prev.filter((c) => c.name !== center.name);
      }
      return newCenters;
    });

    setLocalUnorganized((prev) => {
      if (isChecked) {
        const availableCapacity = Math.max(
          0,
          center.capacity - center.occupied
        );
        const assignable = Math.min(availableCapacity, prev);
        return Math.max(0, prev - assignable);
      } else {
        const removedCenter = localSelectedCenters.find(
          (c) => c.name === center.name
        );
        const assigned = removedCenter?.assigned || 0;
        return Math.min(initialUnorganizedState, prev + assigned);
      }
    });
  };

  const handleConfirm = () => {
    if (
      localSelectedCenters.length === 0 &&
      localUnorganized === currentUnorganized
    ) {
      onClose();
      return;
    }

    // آپدیت volunteerData
    setVolunteerData((prev) => {
      const newData = prev.map((item) => {
        if (item.name === province) {
          const updated = { ...item };
          const totalAssigned = localSelectedCenters.reduce(
            (sum, c) => sum + c.assigned,
            0
          );
          const candidate = updated.candidates.find((c) => c.gender === gender);
          if (candidate) {
            candidate.unorganized = initialUnorganizedState - totalAssigned;
          }
          return updated;
        }
        return item;
      });
      return newData;
    });

    // آپدیت organizationData
    setOrganizationData((prev) => {
      const updated = prev.map((prov) => {
        if (prov.name === province) {
          const updatedCenters = prov.centers.map((center) => {
            const selected = localSelectedCenters.find(
              (c) => c.name === center.name
            );
            if (center.gender === gender) {
              if (selected) {
                return {
                  ...center,
                  occupied: selected.assigned, // مقدار جدید assigned جایگزین می‌شود
                  total: selected.assigned,
                };
              } else {
                // ریست کردن مقادیر برای حوزه‌هایی که انتخاب نشده‌اند
                return {
                  ...center,
                  occupied: 0,
                  total: 0,
                };
              }
            }
            return center;
          });
          return { ...prov, centers: updatedCenters };
        }
        return prov;
      });
      return updated;
    });

    // ذخیره داده‌ها
    onSave();
    localStorage.removeItem(storageKey); // پاک کردن localStorage
    setLocalSelectedCenters([]);
    setLocalUnorganized(initialUnorganizedState);
    onClose();
  };

  const handleCancel = () => {
    localStorage.removeItem(storageKey);
    setLocalSelectedCenters([]);
    setLocalUnorganized(initialUnorganizedState);
    onClose();
  };

  return (
    <div className="modal-overlay OrganizationModal">
      <div className="modal-content">
        <h2 className="OrganizationModal-modal-title">
          حوزه‌های {province} ({gender})
        </h2>
        <p className="modal-text">
          داوطلبان ساماندهی‌نشده باقی‌مانده: {localUnorganized}
        </p>
        <p className="modal-text total">تعداد کل داوطلبان: {totalVolunteers}</p>
        <table className="volunteer-table">
          <thead>
            <tr>
              {!isAdminUser && <th>انتخاب</th>}
              <th>نام حوزه</th>
              <th>شهر/شهرستان</th>
              <th>ظرفیت حوزه</th>
              <th>ظرفیت اشغالی</th>
              <th>جنسیت</th>
            </tr>
          </thead>
          <tbody>
            {centers.length > 0 ? (
              centers.map((center, index) => {
                const availableCapacity = Math.max(
                  0,
                  center.capacity - center.occupied
                );
                const isDisabled =
                  availableCapacity <= 0 &&
                  !localSelectedCenters.some((c) => c.name === center.name);
                const isChecked = localSelectedCenters.some(
                  (c) => c.name === center.name
                );
                const tempOccupied = isChecked
                  ? localSelectedCenters.find((c) => c.name === center.name)
                      ?.assigned || 0
                  : 0; // فقط مقدار assigned جدید نمایش داده می‌شود
                return (
                  <tr key={center.name + index}>
                    {!isAdminUser && (
                      <td>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) =>
                            handleCheckboxChange(center, e.target.checked)
                          }
                          disabled={isDisabled}
                        />
                      </td>
                    )}
                    <td>{center.name}</td>
                    <td>{center.city}</td>
                    <td>{center.capacity}</td>
                    <td>{tempOccupied}</td>
                    <td>{center.gender}</td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={isAdminUser ? 5 : 6}>
                  داده‌ای برای این استان و جنسیت موجود نیست
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="modal-buttons">
          <button
            className="modal-confirm-button"
            onClick={handleConfirm}
            disabled={
              localSelectedCenters.length === 0 &&
              localUnorganized === currentUnorganized
            }
          >
            ثبت
          </button>
          <button className="modal-close-button" onClick={handleCancel}>
            لغو
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrganizationModal;
