import { useCallback } from "react";
import useLocalStorage from "./useLocalStorage";

function useDepartments() {
  const [departments, setDepartments] = useLocalStorage("departments", []);

  const addDepartment = useCallback(
    (departmentData) => {
      const nameExists = departments.some(
        (department) =>
          department.name.toLowerCase() ===
          departmentData.name.trim().toLowerCase(),
      );

      if (nameExists) {
        return {
          success: false,
          message: "Department already exists.",
        };
      }

      const codeExists = departments.some(
        (department) =>
          department.code.toLowerCase() ===
          departmentData.code.trim().toLowerCase(),
      );

      if (codeExists) {
        return {
          success: false,
          message: "Department code already exists.",
        };
      }

      const newDepartment = {
        id: Date.now(),

        name: departmentData.name.trim(),

        code: departmentData.code.trim().toUpperCase(),

        description: departmentData.description?.trim() || "",

        status: departmentData.status || "Active",

        createdAt: new Date().toISOString(),
      };

      setDepartments((prevDepartments) => [...prevDepartments, newDepartment]);

      return {
        success: true,
        department: newDepartment,
      };
    },
    [departments, setDepartments],
  );

  const updateDepartment = useCallback(
    (id, updatedData) => {
      const duplicateName = departments.some(
        (department) =>
          Number(department.id) !== Number(id) &&
          department.name.toLowerCase() ===
            updatedData.name.trim().toLowerCase(),
      );

      if (duplicateName) {
        return {
          success: false,
          message: "Another department already uses this name.",
        };
      }

      const duplicateCode = departments.some(
        (department) =>
          Number(department.id) !== Number(id) &&
          department.code.toLowerCase() ===
            updatedData.code.trim().toLowerCase(),
      );

      if (duplicateCode) {
        return {
          success: false,
          message: "Another department already uses this code.",
        };
      }

      setDepartments((prevDepartments) =>
        prevDepartments.map((department) =>
          Number(department.id) === Number(id)
            ? {
                ...department,

                name: updatedData.name.trim(),

                code: updatedData.code.trim().toUpperCase(),

                description: updatedData.description?.trim() || "",

                status: updatedData.status || "Active",
              }
            : department,
        ),
      );

      return {
        success: true,
      };
    },
    [departments, setDepartments],
  );

  const deleteDepartment = useCallback(
    (id) => {
      setDepartments((prevDepartments) =>
        prevDepartments.filter(
          (department) => Number(department.id) !== Number(id),
        ),
      );

      return {
        success: true,
      };
    },
    [setDepartments],
  );

  const getDepartment = useCallback(
    (id) => {
      return departments.find(
        (department) => Number(department.id) === Number(id),
      );
    },
    [departments],
  );

  return {
    departments,

    addDepartment,
    updateDepartment,
    deleteDepartment,
    getDepartment,
  };
}

export default useDepartments;
