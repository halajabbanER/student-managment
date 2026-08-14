import { useCallback } from "react";
import useLocalStorage from "./useLocalStorage";

function useTeachers() {
  const [teachers, setTeachers] = useLocalStorage("teachers", []);

  const generateTeacherId = useCallback(() => {
    const year = new Date().getFullYear();

    const existingNumbers = teachers
      .map((teacher) => teacher.teacherId)
      .filter(Boolean)
      .map((teacherId) => {
        const idString = String(teacherId);

        return Number(idString.slice(5));
      })
      .filter((number) => !Number.isNaN(number));

    const nextNumber =
      existingNumbers.length > 0 ? Math.max(...existingNumbers) + 1 : 1;

    return `T${year}${String(nextNumber).padStart(4, "0")}`;
  }, [teachers]);

  const addTeacher = useCallback(
    (teacherData) => {
      const teacherId = generateTeacherId();

      const newTeacher = {
        id: Date.now(),
        teacherId,

        name: teacherData.name,
        email: teacherData.email,
        department: teacherData.department,
        title: teacherData.title,
        status: teacherData.status || "Active",
        password: teacherData.password || "",

        courses: [],

        accountCreated: Boolean(teacherData.password),
      };

      setTeachers((prevTeachers) => [...prevTeachers, newTeacher]);

      return {
        success: true,
        teacher: newTeacher,
      };
    },
    [generateTeacherId, setTeachers],
  );

  const assignTeacherId = useCallback(
    (id) => {
      const teacher = teachers.find((item) => Number(item.id) === Number(id));

      if (!teacher) {
        return {
          success: false,
          message: "Teacher not found",
        };
      }

      if (teacher.teacherId) {
        return {
          success: false,
          message: "Teacher already has a Teacher ID",
        };
      }

      const teacherId = generateTeacherId();

      setTeachers((prevTeachers) =>
        prevTeachers.map((item) =>
          Number(item.id) === Number(id)
            ? {
                ...item,
                teacherId,
                accountCreated: false,
              }
            : item,
        ),
      );

      return {
        success: true,
        teacherId,
      };
    },
    [teachers, generateTeacherId, setTeachers],
  );

  const updateTeacher = useCallback(
    (id, updatedData) => {
      setTeachers((prevTeachers) =>
        prevTeachers.map((teacher) =>
          Number(teacher.id) === Number(id)
            ? {
                ...teacher,
                ...updatedData,

                // Teacher ID ما بيتغير
                teacherId: teacher.teacherId,
              }
            : teacher,
        ),
      );

      return {
        success: true,
      };
    },
    [setTeachers],
  );

  const deleteTeacher = useCallback(
    (id) => {
      setTeachers((prevTeachers) =>
        prevTeachers.filter((teacher) => Number(teacher.id) !== Number(id)),
      );

      return {
        success: true,
      };
    },
    [setTeachers],
  );

  const getTeacher = useCallback(
    (id) => {
      return teachers.find((teacher) => Number(teacher.id) === Number(id));
    },
    [teachers],
  );

  const getTeacherByTeacherId = useCallback(
    (teacherId) => {
      return teachers.find(
        (teacher) => String(teacher.teacherId) === String(teacherId),
      );
    },
    [teachers],
  );

  return {
    teachers,

    addTeacher,
    updateTeacher,
    deleteTeacher,

    getTeacher,
    getTeacherByTeacherId,

    generateTeacherId,
    assignTeacherId,
  };
}

export default useTeachers;
