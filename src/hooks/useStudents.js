import { useCallback } from "react";
import useLocalStorage from "./useLocalStorage";

function useStudents() {
  const [students, setStudents] = useLocalStorage("students", []);

  // =========================
  // ADD STUDENT
  // =========================

  const addStudent = useCallback(
    (studentData) => {
      const studentIdExists = students.some(
        (student) =>
          String(student.studentId).toLowerCase() ===
          String(studentData.studentId).trim().toLowerCase(),
      );

      if (studentIdExists) {
        return {
          success: false,
          message: "Student ID already exists.",
        };
      }

      const emailExists = students.some(
        (student) =>
          student.email?.toLowerCase() ===
          studentData.email?.trim().toLowerCase(),
      );

      if (emailExists) {
        return {
          success: false,
          message: "Student email already exists.",
        };
      }

      const newStudent = {
        id: Date.now(),

        studentId: studentData.studentId.trim(),

        password: studentData.password,

        name: studentData.name.trim(),

        email: studentData.email.trim(),

        department: studentData.department,

        level: studentData.level,

        status: studentData.status || "Active",

        role: "student",

        courses: studentData.courses || [],

        exams: studentData.exams || [],

        schedule: studentData.schedule || [],

        createdAt: new Date().toISOString(),
      };

      setStudents((prevStudents) => [...prevStudents, newStudent]);

      return {
        success: true,
        student: newStudent,
      };
    },
    [students, setStudents],
  );

  // =========================
  // GET STUDENT
  // =========================

  const getStudent = useCallback(
    (id) => {
      return students.find(
        (student) =>
          String(student.id) === String(id) ||
          String(student.studentId) === String(id),
      );
    },
    [students],
  );

  // =========================
  // UPDATE STUDENT
  // =========================

  const updateStudent = useCallback(
    (id, updatedData) => {
      const studentIdExists = students.some(
        (student) =>
          String(student.id) !== String(id) &&
          String(student.studentId).toLowerCase() ===
            String(updatedData.studentId).trim().toLowerCase(),
      );

      if (studentIdExists) {
        return {
          success: false,
          message: "Another student already uses this Student ID.",
        };
      }

      setStudents((prevStudents) =>
        prevStudents.map((student) =>
          String(student.id) === String(id)
            ? {
                ...student,

                ...updatedData,

                studentId: updatedData.studentId?.trim() || student.studentId,

                name: updatedData.name?.trim() || student.name,

                email: updatedData.email?.trim() || student.email,

                password: updatedData.password || student.password,

                role: "student",
              }
            : student,
        ),
      );

      return {
        success: true,
      };
    },
    [students, setStudents],
  );

  // =========================
  // DELETE STUDENT
  // =========================

  const deleteStudent = useCallback(
    (id) => {
      setStudents((prevStudents) =>
        prevStudents.filter((student) => String(student.id) !== String(id)),
      );

      return {
        success: true,
      };
    },
    [setStudents],
  );

  // =========================
  // ADD COURSE
  // =========================

  const addCourse = useCallback(
    (studentId, courseData) => {
      const newCourse = {
        id: Date.now(),
        ...courseData,
      };

      setStudents((prevStudents) =>
        prevStudents.map((student) =>
          String(student.id) === String(studentId) ||
          String(student.studentId) === String(studentId)
            ? {
                ...student,

                courses: [...(student.courses || []), newCourse],
              }
            : student,
        ),
      );

      return {
        success: true,
      };
    },
    [setStudents],
  );

  // =========================
  // UPDATE COURSE GRADE
  // =========================

  const updateCourseGrade = useCallback(
    (studentId, courseId, newGrade) => {
      setStudents((prevStudents) =>
        prevStudents.map((student) =>
          String(student.id) === String(studentId) ||
          String(student.studentId) === String(studentId)
            ? {
                ...student,

                courses: (student.courses || []).map((course) =>
                  String(course.id) === String(courseId)
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
    },
    [setStudents],
  );

  // =========================
  // DELETE COURSE
  // =========================

  const deleteCourse = useCallback(
    (studentId, courseId) => {
      setStudents((prevStudents) =>
        prevStudents.map((student) =>
          String(student.id) === String(studentId) ||
          String(student.studentId) === String(studentId)
            ? {
                ...student,

                courses: (student.courses || []).filter(
                  (course) => String(course.id) !== String(courseId),
                ),
              }
            : student,
        ),
      );

      return {
        success: true,
      };
    },
    [setStudents],
  );

  return {
    students,

    addStudent,
    getStudent,
    updateStudent,
    deleteStudent,

    addCourse,
    updateCourseGrade,
    deleteCourse,
  };
}

export default useStudents;
