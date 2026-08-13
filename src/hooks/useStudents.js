import { useCallback, useEffect, useState } from "react";

import useLocalStorage from "./useLocalStorage";

import {
  fetchStudentsFromAPI,
  createStudentAPI,
  updateStudentAPI,
  deleteStudentAPI,
} from "../services/api";

function useStudents() {
  const [students, setStudents] = useLocalStorage("students", []);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // =========================
  // Generate Student ID
  // =========================

  const generateStudentId = useCallback(() => {
    const year = new Date().getFullYear();

    const existingNumbers = students
      .map((student) => student.studentId)
      .filter(Boolean)
      .map((studentId) => {
        const idString = String(studentId);

        return Number(idString.slice(4));
      })
      .filter((number) => !Number.isNaN(number));

    const nextNumber =
      existingNumbers.length > 0 ? Math.max(...existingNumbers) + 1 : 1;

    return `${year}${String(nextNumber).padStart(4, "0")}`;
  }, [students]);

  // =========================
  // Load Students From API
  // =========================

  useEffect(() => {
    const loadStudents = async () => {
      // إذا في بيانات محفوظة لا نعيد تحميل API
      if (students.length > 0) {
        return;
      }

      try {
        setLoading(true);
        setError("");

        const apiStudents = await fetchStudentsFromAPI();

        setStudents(apiStudents);
      } catch (err) {
        console.error("Load Students Error:", err);

        setError("Failed to load students from API");
      } finally {
        setLoading(false);
      }
    };

    loadStudents();
  }, [students.length, setStudents]);

  // =========================
  // Get One Student
  // =========================

  const getStudent = useCallback(
    (id) => {
      return students.find((student) => Number(student.id) === Number(id));
    },
    [students],
  );

  // =========================
  // Get Student By Student ID
  // =========================

  const getStudentByStudentId = useCallback(
    (studentId) => {
      return students.find(
        (student) => String(student.studentId) === String(studentId),
      );
    },
    [students],
  );

  // =========================
  // Add Student
  // =========================

  const addStudent = useCallback(
    async (studentData) => {
      try {
        setLoading(true);
        setError("");

        const generatedStudentId = generateStudentId();

        const newStudentData = {
          ...studentData,

          studentId: generatedStudentId,

          courses: [],
          exams: [],
          schedule: [],

          accountCreated: false,
        };

        const createdStudent = await createStudentAPI(newStudentData);

        const finalStudent = {
          ...createdStudent,

          // نضمن بقاء الرقم الجامعي
          studentId: generatedStudentId,

          courses: createdStudent.courses || [],

          exams: createdStudent.exams || [],

          schedule: createdStudent.schedule || [],

          accountCreated: false,

          source: "local",
        };

        setStudents((prevStudents) => [...prevStudents, finalStudent]);

        return {
          success: true,
          student: finalStudent,
        };
      } catch (err) {
        console.error("Add Student Error:", err);

        setError("Failed to add student");

        return {
          success: false,
          message: "Failed to add student",
        };
      } finally {
        setLoading(false);
      }
    },
    [generateStudentId, setStudents],
  );

  // =========================
  // Update Student
  // =========================

  const updateStudent = useCallback(
    async (id, updatedData) => {
      try {
        setLoading(true);
        setError("");

        const studentId = Number(id);

        const currentStudent = students.find(
          (student) => Number(student.id) === studentId,
        );

        if (!currentStudent) {
          return {
            success: false,
            message: "Student not found",
          };
        }

        let finalData = updatedData;

        // فقط طلاب API الأصليين
        // نرسل لهم PUT
        if (currentStudent.source === "api" && studentId <= 10) {
          finalData = await updateStudentAPI(studentId, updatedData);
        }

        setStudents((prevStudents) =>
          prevStudents.map((student) =>
            Number(student.id) === studentId
              ? {
                  ...student,
                  ...finalData,

                  // ممنوع تغيير Student ID
                  studentId: student.studentId,

                  courses: student.courses || [],

                  exams: student.exams || [],

                  schedule: student.schedule || [],

                  accountCreated: student.accountCreated || false,
                }
              : student,
          ),
        );

        return {
          success: true,
        };
      } catch (err) {
        console.error("Update Student Error:", err);

        setError("Failed to update student");

        return {
          success: false,
          message: "Failed to update student",
        };
      } finally {
        setLoading(false);
      }
    },
    [students, setStudents],
  );

  // =========================
  // Delete Student
  // =========================

  const deleteStudent = useCallback(
    async (id) => {
      try {
        setLoading(true);
        setError("");

        const student = students.find((item) => Number(item.id) === Number(id));

        if (!student) {
          return {
            success: false,
            message: "Student not found",
          };
        }

        // فقط بيانات API الأصلية
        if (student.source === "api" && Number(id) <= 10) {
          await deleteStudentAPI(id);
        }

        setStudents((prevStudents) =>
          prevStudents.filter((student) => Number(student.id) !== Number(id)),
        );

        return {
          success: true,
        };
      } catch (err) {
        console.error("Delete Student Error:", err);

        setError("Failed to delete student");

        return {
          success: false,
          message: "Failed to delete student",
        };
      } finally {
        setLoading(false);
      }
    },
    [students, setStudents],
  );

  // =========================
  // Generate ID For Old Student
  // =========================

  const assignStudentId = useCallback(
    (id) => {
      try {
        const student = students.find((item) => Number(item.id) === Number(id));

        if (!student) {
          return {
            success: false,
            message: "Student not found",
          };
        }

        // عنده رقم أصلًا
        if (student.studentId) {
          return {
            success: false,
            message: "Student already has a Student ID",
          };
        }

        const generatedId = generateStudentId();

        setStudents((prevStudents) =>
          prevStudents.map((student) =>
            Number(student.id) === Number(id)
              ? {
                  ...student,

                  studentId: generatedId,

                  accountCreated: false,
                }
              : student,
          ),
        );

        return {
          success: true,
          studentId: generatedId,
        };
      } catch (err) {
        console.error("Generate Student ID Error:", err);

        return {
          success: false,
          message: "Failed to generate Student ID",
        };
      }
    },
    [students, generateStudentId, setStudents],
  );

  // =========================
  // Mark Student Account Created
  // =========================

  const markAccountCreated = useCallback(
    (studentId) => {
      setStudents((prevStudents) =>
        prevStudents.map((student) =>
          String(student.studentId) === String(studentId)
            ? {
                ...student,
                accountCreated: true,
              }
            : student,
        ),
      );
    },
    [setStudents],
  );

  // =========================
  // Add Course
  // =========================

  const addCourse = useCallback(
    (studentId, courseData) => {
      try {
        setError("");

        setStudents((prevStudents) =>
          prevStudents.map((student) =>
            Number(student.id) === Number(studentId)
              ? {
                  ...student,

                  courses: [
                    ...(student.courses || []),

                    {
                      id: Date.now(),

                      ...courseData,
                    },
                  ],
                }
              : student,
          ),
        );

        return {
          success: true,
        };
      } catch (err) {
        console.error("Add Course Error:", err);

        setError("Failed to add course");

        return {
          success: false,
        };
      }
    },
    [setStudents],
  );

  // =========================
  // Update Course Grade
  // =========================

  const updateCourseGrade = useCallback(
    (studentId, courseId, newGrade) => {
      try {
        setError("");

        setStudents((prevStudents) =>
          prevStudents.map((student) =>
            Number(student.id) === Number(studentId)
              ? {
                  ...student,

                  courses: (student.courses || []).map((course) =>
                    course.id === courseId
                      ? {
                          ...course,

                          grade: Number(newGrade),
                        }
                      : course,
                  ),
                }
              : student,
          ),
        );

        return {
          success: true,
        };
      } catch (err) {
        console.error("Update Grade Error:", err);

        setError("Failed to update grade");

        return {
          success: false,
        };
      }
    },
    [setStudents],
  );

  // =========================
  // Delete Course
  // =========================

  const deleteCourse = useCallback(
    (studentId, courseId) => {
      try {
        setError("");

        setStudents((prevStudents) =>
          prevStudents.map((student) =>
            Number(student.id) === Number(studentId)
              ? {
                  ...student,

                  courses: (student.courses || []).filter(
                    (course) => course.id !== courseId,
                  ),
                }
              : student,
          ),
        );

        return {
          success: true,
        };
      } catch (err) {
        console.error("Delete Course Error:", err);

        setError("Failed to delete course");

        return {
          success: false,
        };
      }
    },
    [setStudents],
  );

  // =========================
  // Retry API
  // =========================

  const refetchStudents = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const apiStudents = await fetchStudentsFromAPI();

      setStudents(apiStudents);
    } catch (err) {
      console.error("API Error:", err);

      setError("Failed to fetch students from API");
    } finally {
      setLoading(false);
    }
  }, [setStudents]);

  return {
    students,
    loading,
    error,

    getStudent,
    getStudentByStudentId,

    addStudent,
    updateStudent,
    deleteStudent,

    generateStudentId,
    assignStudentId,
    markAccountCreated,

    addCourse,
    updateCourseGrade,
    deleteCourse,

    refetchStudents,
  };
}

export default useStudents;
