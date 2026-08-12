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

  // Load students from API
  useEffect(() => {
    const loadStudents = async () => {
      if (students.length > 0) {
        return;
      }

      try {
        setLoading(true);
        setError("");

        const apiStudents = await fetchStudentsFromAPI();

        setStudents(apiStudents);
      } catch (err) {
        console.error(err);

        setError("Failed to load students from API");
      } finally {
        setLoading(false);
      }
    };

    loadStudents();
  }, [students.length, setStudents]);

  // GET one student
  const getStudent = useCallback(
    (id) => {
      return students.find((student) => student.id === Number(id));
    },
    [students],
  );

  // ADD student
  const addStudent = useCallback(
    async (newStudent) => {
      try {
        setLoading(true);
        setError("");

        const createdStudent = await createStudentAPI({
          ...newStudent,
          courses: [],
        });

        setStudents((prevStudents) => [...prevStudents, createdStudent]);

        return {
          success: true,
        };
      } catch (err) {
        console.error(err);

        setError("Failed to add student");

        return {
          success: false,
          message: "Failed to add student",
        };
      } finally {
        setLoading(false);
      }
    },
    [setStudents],
  );

  // UPDATE student
  const updateStudent = useCallback(
    async (id, updatedData) => {
      try {
        setLoading(true);
        setError("");

        const updatedStudent = await updateStudentAPI(id, updatedData);

        setStudents((prevStudents) =>
          prevStudents.map((student) =>
            student.id === Number(id)
              ? {
                  ...student,
                  ...updatedStudent,
                }
              : student,
          ),
        );

        return {
          success: true,
        };
      } catch (err) {
        console.error(err);

        setError("Failed to update student");

        return {
          success: false,
          message: "Failed to update student",
        };
      } finally {
        setLoading(false);
      }
    },
    [setStudents],
  );

  // DELETE student
  const deleteStudent = useCallback(
    async (id) => {
      try {
        setLoading(true);
        setError("");

        await deleteStudentAPI(id);

        setStudents((prevStudents) =>
          prevStudents.filter((student) => student.id !== Number(id)),
        );

        return {
          success: true,
        };
      } catch (err) {
        console.error(err);

        setError("Failed to delete student");

        return {
          success: false,
          message: "Failed to delete student",
        };
      } finally {
        setLoading(false);
      }
    },
    [setStudents],
  );

  // ADD Course
  const addCourse = useCallback(
    (studentId, courseData) => {
      try {
        setError("");

        setStudents((prevStudents) =>
          prevStudents.map((student) =>
            student.id === Number(studentId)
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
      } catch (err) {
        console.error(err);

        setError("Failed to add course");
      }
    },
    [setStudents],
  );

  // UPDATE Course Grade
  const updateCourseGrade = useCallback(
    (studentId, courseId, newGrade) => {
      try {
        setError("");

        setStudents((prevStudents) =>
          prevStudents.map((student) =>
            student.id === Number(studentId)
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
      } catch (err) {
        console.error(err);

        setError("Failed to update grade");
      }
    },
    [setStudents],
  );

  // DELETE Course
  const deleteCourse = useCallback(
    (studentId, courseId) => {
      try {
        setError("");

        setStudents((prevStudents) =>
          prevStudents.map((student) =>
            student.id === Number(studentId)
              ? {
                  ...student,
                  courses: (student.courses || []).filter(
                    (course) => course.id !== courseId,
                  ),
                }
              : student,
          ),
        );
      } catch (err) {
        console.error(err);

        setError("Failed to delete course");
      }
    },
    [setStudents],
  );

  // Retry API
  const refetchStudents = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const apiStudents = await fetchStudentsFromAPI();

      setStudents(apiStudents);
    } catch (err) {
      console.error(err);

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
    addStudent,
    updateStudent,
    deleteStudent,

    addCourse,
    updateCourseGrade,
    deleteCourse,

    refetchStudents,
  };
}

export default useStudents;
