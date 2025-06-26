export const saveToLocalStorage = (volunteerData, organizationData, exam) => {
  localStorage.setItem(`volunteerData_${exam}`, JSON.stringify(volunteerData));
  localStorage.setItem(
    `organizationData_${exam}`,
    JSON.stringify(organizationData)
  );
};
