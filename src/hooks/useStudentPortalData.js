import { useCallback, useMemo } from "react";

import useAuth from "./useAuth";
import useCourses from "./useCourses";
import useStudents from "./useStudents";
import useTeachers from "./useTeachers";

function useStudentPortalData() {
  const { user } = useAuth();
  const { students } = useStudents();
  const { courses } = useCourses();
  const { teachers } = useTeachers();

  const student = useMemo(
    () =>
      students.find(
        (item) =>
          String(item.studentId || item.id) === String(user?.studentId),
      ),
    [students, user],
  );

  const studentId = student?.studentId || student?.id;
  const studentKeys = useMemo(
    () =>
      new Set(
        [student?.id, student?.studentId]
          .filter((value) => value !== undefined && value !== null)
          .map(String),
      ),
    [student],
  );

  const studentCourses = useMemo(() => {
    if (!studentId) {
      return [];
    }

    return courses.filter((course) =>
      (course.students || []).some(
        (enrolledId) => studentKeys.has(String(enrolledId)),
      ),
    );
  }, [courses, studentId, studentKeys]);

  const getCourseGrade = useCallback(
    (course) => {
      const grade = (course.grades || []).find(
        (item) => studentKeys.has(String(item.studentId)),
      );

      return grade?.grade === "" || grade?.grade === undefined
        ? null
        : Number(grade.grade);
    },
    [studentKeys],
  );

  const average = useMemo(() => {
    const grades = studentCourses
      .map(getCourseGrade)
      .filter((grade) => grade !== null && Number.isFinite(grade));

    if (grades.length === 0) {
      return "0.00";
    }

    return (
      grades.reduce((total, grade) => total + grade, 0) / grades.length
    ).toFixed(2);
  }, [getCourseGrade, studentCourses]);

  const getTeacherName = useCallback(
    (teacherId) => {
      const teacher = teachers.find(
        (item) =>
          String(item.id) === String(teacherId) ||
          String(item.teacherId) === String(teacherId),
      );

      return teacher?.name || "Not Assigned";
    },
    [teachers],
  );

  const exams = useMemo(
    () =>
      studentCourses.flatMap((course) =>
        (course.exams || []).map((exam) => ({
          ...exam,
          courseId: course.id,
          courseCode: course.code,
          courseName: course.name,
        })),
      ),
    [studentCourses],
  );

  const schedules = useMemo(
    () =>
      studentCourses.flatMap((course) =>
        (course.schedule || []).map((schedule) => ({
          ...schedule,
          courseId: course.id,
          courseCode: course.code,
          courseName: course.name,
          teacherName: getTeacherName(course.teacherId),
        })),
      ),
    [getTeacherName, studentCourses],
  );

  const announcements = useMemo(() => {
    const courseAnnouncements = studentCourses.flatMap((course) =>
      (course.announcements || []).map((announcement) => ({
        ...announcement,
        courseId: course.id,
        courseCode: course.code,
        courseName: course.name,
      })),
    );

    const personalAnnouncements = (student?.announcements || []).map(
      (announcement) => ({ ...announcement, personal: true }),
    );

    return [...personalAnnouncements, ...courseAnnouncements];
  }, [student, studentCourses]);

  return {
    student,
    studentCourses,
    average,
    exams,
    schedules,
    announcements,
    getCourseGrade,
    getTeacherName,
  };
}

export default useStudentPortalData;
