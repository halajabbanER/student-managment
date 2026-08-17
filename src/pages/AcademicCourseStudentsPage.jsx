import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import useAuth from "../hooks/useAuth";
import useTeachers from "../hooks/useTeachers";
import useCourses from "../hooks/useCourses";
import useStudents from "../hooks/useStudents";

import "./AcademicCourseStudentsPage.css";

function AcademicCourseStudentsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { user } = useAuth();
  const { teachers } = useTeachers();
  const { getCourse, updateCourse } = useCourses();

  const { students } = useStudents();

  const course = getCourse(id);

  const teacher = useMemo(() => {
    const currentEmail = String(user?.email || "")
      .trim()
      .toLowerCase();

    return (
      teachers.find(
        (item) => String(item.teacherId || item.id) === String(user?.teacherId),
      ) ||
      (currentEmail
        ? teachers.find(
            (item) =>
              String(item.email || "")
                .trim()
                .toLowerCase() === currentEmail,
          )
        : null) ||
      teachers.find((item) => String(item.id) === String(user?.id)) ||
      user ||
      null
    );
  }, [teachers, user]);

  const normalizeText = (value) =>
    String(value || "")
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "");

  const teacherDepartment = teacher?.department || user?.department || "";

  const courseMatchesTeacherAccess = (targetCourse) => {
    if (!targetCourse) {
      return false;
    }

    if (user?.role === "admin") {
      return true;
    }

    const userTeacherId = user?.teacherId || user?.id;

    if (
      String(targetCourse.teacherId) === String(teacher?.id) ||
      String(targetCourse.teacherId) === String(teacher?.teacherId) ||
      String(targetCourse.teacherId) === String(userTeacherId) ||
      String(targetCourse.teacherId) === String(user?.id)
    ) {
      return true;
    }

    const departmentName = targetCourse.departmentName || "";
    const departmentId = targetCourse.departmentId;

    if (!teacherDepartment) {
      return false;
    }

    if (departmentName) {
      const sameDepartment =
        normalizeText(teacherDepartment) === normalizeText(departmentName) ||
        normalizeText(teacherDepartment).includes(
          normalizeText(departmentName),
        ) ||
        normalizeText(departmentName).includes(
          normalizeText(teacherDepartment),
        );

      if (sameDepartment) {
        return true;
      }
    }

    if (!departmentId) {
      return false;
    }

    const departments = (() => {
      try {
        return JSON.parse(localStorage.getItem("departments") || "[]");
      } catch (error) {
        return [];
      }
    })();

    const department = departments.find(
      (item) => String(item.id) === String(departmentId),
    );

    if (!department) {
      return false;
    }

    return (
      normalizeText(teacherDepartment) === normalizeText(department.name) ||
      normalizeText(teacherDepartment) === normalizeText(department.code) ||
      normalizeText(teacherDepartment).includes(
        normalizeText(department.name),
      ) ||
      normalizeText(department.name).includes(
        normalizeText(teacherDepartment),
      ) ||
      normalizeText(teacherDepartment).includes(
        normalizeText(department.code),
      ) ||
      normalizeText(department.code).includes(normalizeText(teacherDepartment))
    );
  };

  const [grades, setGrades] = useState(() => {
    const initialGrades = {};

    (course?.grades || []).forEach((item) => {
      initialGrades[String(item.studentId)] = item.grade;
    });

    return initialGrades;
  });

  if (!course) {
    return (
      <div className="teacher-course-students-page">
        <div className="teacher-course-message">
          <h2>Course not found</h2>

          <button onClick={() => navigate("/academic")}>
            Back to Academic Dashboard
          </button>
        </div>
      </div>
    );
  }

  const teacherHasAccess = courseMatchesTeacherAccess(course);

  if (!teacherHasAccess) {
    return (
      <div className="teacher-course-students-page">
        <div className="teacher-course-message">
          <h2>Access Denied</h2>

          <p>You are not assigned to this course.</p>

          <button onClick={() => navigate("/academic")}>
            Back to Academic Dashboard
          </button>
        </div>
      </div>
    );
  }

  const courseStudents = students.filter((student) => {
    const studentIdentifier = student.studentId || student.id;

    return (course.students || []).some(
      (studentId) => String(studentId) === String(studentIdentifier),
    );
  });

  const handleGradeChange = (studentId, value) => {
    setGrades((prevGrades) => ({
      ...prevGrades,
      [studentId]: value,
    }));
  };

  const handleSaveGrades = () => {
    const gradeList = courseStudents.map((student) => {
      const studentIdentifier = student.studentId || student.id;

      const value = grades[String(studentIdentifier)];

      return {
        studentId: studentIdentifier,

        grade: value === "" || value === undefined ? "" : Number(value),
      };
    });

    const invalidGrade = gradeList.find(
      (item) =>
        item.grade !== "" &&
        (Number(item.grade) < 0 || Number(item.grade) > 100),
    );

    if (invalidGrade) {
      alert("Grades must be between 0 and 100.");

      return;
    }

    const result = updateCourse(course.id, {
      ...course,
      grades: gradeList,
    });

    if (!result.success) {
      alert(result.message || "Failed to save grades.");

      return;
    }

    alert("Grades saved successfully.");
  };

  return (
    <div className="teacher-course-students-page">
      <div className="teacher-course-students-header">
        <div>
          <span className="teacher-course-code-badge">{course.code}</span>

          <h1>{course.name}</h1>

          <p>Manage students and course grades.</p>
        </div>

        <button
          type="button"
          className="teacher-course-back-btn"
          onClick={() => navigate("/academic")}
        >
          ← Academic Dashboard
        </button>
      </div>

      <div className="teacher-course-summary">
        <div>
          <span>Course</span>
          <strong>{course.name}</strong>
        </div>

        <div>
          <span>Academic</span>
          <strong>{teacher.name}</strong>
        </div>

        <div>
          <span>Students</span>
          <strong>{courseStudents.length}</strong>
        </div>

        <div>
          <span>Semester</span>
          <strong>{course.semester || "-"}</strong>
        </div>
      </div>

      {courseStudents.length > 0 ? (
        <>
          <div className="teacher-students-table-wrapper">
            <table className="teacher-students-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Student ID</th>
                  <th>Level</th>
                  <th>Grade</th>
                  <th>Result</th>
                </tr>
              </thead>

              <tbody>
                {courseStudents.map((student) => {
                  const studentIdentifier = student.studentId || student.id;

                  const grade = grades[String(studentIdentifier)] ?? "";

                  return (
                    <tr key={student.id}>
                      <td>
                        <div className="teacher-student-name">
                          <div className="teacher-student-avatar">
                            {student.name
                              ?.split(" ")
                              .map((word) => word[0])
                              .slice(0, 2)
                              .join("")
                              .toUpperCase()}
                          </div>

                          <strong>{student.name}</strong>
                        </div>
                      </td>

                      <td>
                        <span className="teacher-student-id">
                          {studentIdentifier}
                        </span>
                      </td>

                      <td>{student.level || "-"}</td>

                      <td>
                        <input
                          className="teacher-grade-input"
                          type="number"
                          min="0"
                          max="100"
                          placeholder="0-100"
                          value={grade}
                          onChange={(event) =>
                            handleGradeChange(
                              String(studentIdentifier),
                              event.target.value,
                            )
                          }
                        />
                      </td>

                      <td>
                        {grade === "" ? (
                          <span className="teacher-result pending">
                            Pending
                          </span>
                        ) : Number(grade) >= 50 ? (
                          <span className="teacher-result passed">Passed</span>
                        ) : (
                          <span className="teacher-result failed">Failed</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="teacher-grade-footer">
            <span>Enter grades between 0 and 100.</span>

            <button type="button" onClick={handleSaveGrades}>
              Save Grades
            </button>
          </div>
        </>
      ) : (
        <div className="teacher-course-empty">
          <div>👨‍🎓</div>

          <h3>No Students Enrolled</h3>

          <p>
            Academic Administration has not enrolled students in this course
            yet.
          </p>
        </div>
      )}
    </div>
  );
}

export default AcademicCourseStudentsPage;
