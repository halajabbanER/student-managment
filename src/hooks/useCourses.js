import { useCallback } from "react";
import useLocalStorage from "./useLocalStorage";

function useCourses() {
  const [courses, setCourses] = useLocalStorage("courses", []);

  const addCourse = useCallback(
    (courseData) => {
      const codeExists = courses.some(
        (course) =>
          course.code.toLowerCase() === courseData.code.trim().toLowerCase(),
      );

      if (codeExists) {
        return {
          success: false,
          message: "Course code already exists.",
        };
      }

      const newCourse = {
        id: Date.now(),

        name: courseData.name.trim(),

        code: courseData.code.trim().toUpperCase(),

        departmentId: courseData.departmentId,

        teacherId: courseData.teacherId || "",

        credits: Number(courseData.credits),

        semester: courseData.semester,

        status: courseData.status || "Active",

        description: courseData.description?.trim() || "",

        students: [],

        exams: [],

        quizzes: [],

        createdAt: new Date().toISOString(),
      };

      setCourses((prevCourses) => [...prevCourses, newCourse]);

      return {
        success: true,
        course: newCourse,
      };
    },
    [courses, setCourses],
  );

  const updateCourse = useCallback(
    (id, updatedData) => {
      const duplicateCode = courses.some(
        (course) =>
          Number(course.id) !== Number(id) &&
          course.code.toLowerCase() === updatedData.code.trim().toLowerCase(),
      );

      if (duplicateCode) {
        return {
          success: false,
          message: "Another course already uses this code.",
        };
      }

      setCourses((prevCourses) =>
        prevCourses.map((course) =>
          Number(course.id) === Number(id)
            ? {
                ...course,
                ...updatedData,

                name: updatedData.name.trim(),

                code: updatedData.code.trim().toUpperCase(),

                departmentId: updatedData.departmentId,

                teacherId: updatedData.teacherId || "",

                credits: Number(updatedData.credits),

                semester: updatedData.semester,

                status: updatedData.status || "Active",

                description: updatedData.description?.trim() || "",

                exams: updatedData.exams ?? course.exams ?? [],

                grades: updatedData.grades ?? course.grades ?? [],

                quizzes: updatedData.quizzes ?? course.quizzes ?? [],
              }
            : course,
        ),
      );

      return {
        success: true,
      };
    },
    [courses, setCourses],
  );

  const deleteCourse = useCallback(
    (id) => {
      setCourses((prevCourses) =>
        prevCourses.filter((course) => Number(course.id) !== Number(id)),
      );

      return {
        success: true,
      };
    },
    [setCourses],
  );

  const getCourse = useCallback(
    (id) => {
      return courses.find((course) => Number(course.id) === Number(id));
    },
    [courses],
  );

  const enrollStudent = useCallback(
    (courseId, studentId) => {
      const course = courses.find(
        (item) => Number(item.id) === Number(courseId),
      );

      if (!course) {
        return {
          success: false,
          message: "Course not found.",
        };
      }

      const alreadyEnrolled = (course.students || []).some(
        (id) => String(id) === String(studentId),
      );

      if (alreadyEnrolled) {
        return {
          success: false,
          message: "Student is already enrolled in this course.",
        };
      }

      setCourses((prevCourses) =>
        prevCourses.map((item) =>
          Number(item.id) === Number(courseId)
            ? {
                ...item,
                students: [...(item.students || []), studentId],
              }
            : item,
        ),
      );

      return {
        success: true,
      };
    },
    [courses, setCourses],
  );

  const removeStudentFromCourse = useCallback(
    (courseId, studentId) => {
      setCourses((prevCourses) =>
        prevCourses.map((course) =>
          Number(course.id) === Number(courseId)
            ? {
                ...course,
                students: (course.students || []).filter(
                  (id) => String(id) !== String(studentId),
                ),
              }
            : course,
        ),
      );

      return {
        success: true,
      };
    },
    [setCourses],
  );

  const setCourseStudents = useCallback(
    (courseId, studentIds) => {
      setCourses((prevCourses) =>
        prevCourses.map((course) =>
          Number(course.id) === Number(courseId)
            ? {
                ...course,
                students: studentIds,
              }
            : course,
        ),
      );

      return {
        success: true,
      };
    },
    [setCourses],
  );

  const getStudentCourses = useCallback(
    (studentId) => {
      return courses.filter((course) =>
        (course.students || []).some((id) => String(id) === String(studentId)),
      );
    },
    [courses],
  );

  const getTeacherCourses = useCallback(
    (teacherId) => {
      return courses.filter(
        (course) => String(course.teacherId) === String(teacherId),
      );
    },
    [courses],
  );

  return {
    courses,

    addCourse,
    updateCourse,
    deleteCourse,
    getCourse,

    enrollStudent,
    removeStudentFromCourse,
    setCourseStudents,

    getStudentCourses,
    getTeacherCourses,
  };
}

export default useCourses;
