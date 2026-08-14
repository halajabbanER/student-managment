import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import useCourses from "../hooks/useCourses";
import useStudents from "../hooks/useStudents";
import useTeachers from "../hooks/useTeachers";

import "./AcademicGradesPage.css";

function AcademicGradesPage() {
  const navigate = useNavigate();

  const { courses } = useCourses();
  const { students } = useStudents();
  const { teachers } = useTeachers();

  const [searchTerm, setSearchTerm] = useState("");
  const [courseFilter, setCourseFilter] = useState("All");
  const [resultFilter, setResultFilter] = useState("All");

  // =========================
  // GET STUDENT
  // =========================

  const getStudent = useCallback(
    (studentId) => {
      return students.find(
        (student) =>
          String(student.studentId || student.id) === String(studentId),
      );
    },
    [students],
  );

  // =========================
  // GET TEACHER
  // =========================

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

  // =========================
  // ALL GRADES
  // =========================

  const allGrades = useMemo(() => {
    const result = [];

    courses.forEach((course) => {
      (course.students || []).forEach((studentId) => {
        const student = getStudent(studentId);

        if (!student) {
          return;
        }

        const gradeData = (course.grades || []).find(
          (grade) =>
            String(grade.studentId) === String(student.studentId || student.id),
        );

        const grade =
          gradeData?.grade === "" || gradeData?.grade === undefined
            ? null
            : Number(gradeData.grade);

        result.push({
          id: `${course.id}-${student.id}`,

          studentId: student.studentId || student.id,

          studentName: student.name,

          department: student.department,

          level: student.level,

          courseId: course.id,

          courseCode: course.code,

          courseName: course.name,

          teacherId: course.teacherId,

          grade,
        });
      });
    });

    return result;
  }, [courses, getStudent]);

  // =========================
  // FILTER
  // =========================

  const filteredGrades = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    return allGrades.filter((item) => {
      const teacherName = getTeacherName(item.teacherId);

      const matchesSearch =
        !search ||
        item.studentName?.toLowerCase().includes(search) ||
        String(item.studentId).toLowerCase().includes(search) ||
        item.courseName?.toLowerCase().includes(search) ||
        item.courseCode?.toLowerCase().includes(search) ||
        teacherName.toLowerCase().includes(search);

      const matchesCourse =
        courseFilter === "All" ||
        String(item.courseId) === String(courseFilter);

      let matchesResult = true;

      if (resultFilter === "Passed") {
        matchesResult = item.grade !== null && item.grade >= 50;
      }

      if (resultFilter === "Failed") {
        matchesResult = item.grade !== null && item.grade < 50;
      }

      if (resultFilter === "Pending") {
        matchesResult = item.grade === null;
      }

      return matchesSearch && matchesCourse && matchesResult;
    });
  }, [allGrades, searchTerm, courseFilter, resultFilter, getTeacherName]);

  // =========================
  // STATISTICS
  // =========================

  const gradedStudents = allGrades.filter((item) => item.grade !== null);

  const passedStudents = gradedStudents.filter((item) => item.grade >= 50);

  const failedStudents = gradedStudents.filter((item) => item.grade < 50);

  const average =
    gradedStudents.length > 0
      ? (
          gradedStudents.reduce((total, item) => total + item.grade, 0) /
          gradedStudents.length
        ).toFixed(2)
      : "0.00";

  // =========================
  // RESULT
  // =========================

  const getResult = (grade) => {
    if (grade === null) {
      return {
        text: "Pending",
        className: "pending",
      };
    }

    if (grade >= 50) {
      return {
        text: "Passed",
        className: "passed",
      };
    }

    return {
      text: "Failed",
      className: "failed",
    };
  };

  return (
    <div className="academic-grades-page">
      {/* HEADER */}

      <div className="academic-grades-header">
        <div>
          <h1>Grades Management</h1>

          <p>View student grades across all courses.</p>
        </div>

        <button type="button" onClick={() => navigate("/academic")}>
          ← Dashboard
        </button>
      </div>

      {/* STATISTICS */}

      <div className="academic-grades-stats">
        <div className="academic-grade-stat">
          <div>📊</div>

          <span>Average Grade</span>

          <strong>{average}</strong>
        </div>

        <div className="academic-grade-stat">
          <div>✅</div>

          <span>Passed</span>

          <strong>{passedStudents.length}</strong>
        </div>

        <div className="academic-grade-stat">
          <div>❌</div>

          <span>Failed</span>

          <strong>{failedStudents.length}</strong>
        </div>

        <div className="academic-grade-stat">
          <div>⏳</div>

          <span>Pending</span>

          <strong>
            {allGrades.filter((item) => item.grade === null).length}
          </strong>
        </div>
      </div>

      {/* FILTERS */}

      <div className="academic-grades-tools">
        <div className="academic-grades-search">
          <span>🔍</span>

          <input
            type="text"
            placeholder="Search student, ID, course or teacher..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </div>

        <select
          value={courseFilter}
          onChange={(event) => setCourseFilter(event.target.value)}
        >
          <option value="All">All Courses</option>

          {courses.map((course) => (
            <option key={course.id} value={course.id}>
              {course.code} - {course.name}
            </option>
          ))}
        </select>

        <select
          value={resultFilter}
          onChange={(event) => setResultFilter(event.target.value)}
        >
          <option value="All">All Results</option>

          <option value="Passed">Passed</option>

          <option value="Failed">Failed</option>

          <option value="Pending">Pending</option>
        </select>
      </div>

      {/* TABLE */}

      {filteredGrades.length > 0 ? (
        <div className="academic-grades-table-wrapper">
          <table className="academic-grades-table">
            <thead>
              <tr>
                <th>Student</th>

                <th>Student ID</th>

                <th>Course</th>

                <th>Teacher</th>

                <th>Level</th>

                <th>Grade</th>

                <th>Result</th>
              </tr>
            </thead>

            <tbody>
              {filteredGrades.map((item) => {
                const result = getResult(item.grade);

                return (
                  <tr key={item.id}>
                    <td>
                      <div className="academic-grade-student">
                        <div className="academic-grade-avatar">
                          {item.studentName
                            ?.split(" ")
                            .map((word) => word[0])
                            .slice(0, 2)
                            .join("")
                            .toUpperCase()}
                        </div>

                        <div>
                          <strong>{item.studentName}</strong>

                          <span>{item.department}</span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <span className="academic-grade-id">
                        {item.studentId}
                      </span>
                    </td>

                    <td>
                      <div className="academic-grade-course">
                        <strong>{item.courseCode}</strong>

                        <span>{item.courseName}</span>
                      </div>
                    </td>

                    <td>{getTeacherName(item.teacherId)}</td>

                    <td>{item.level || "-"}</td>

                    <td>
                      {item.grade === null ? (
                        <span className="academic-grade-pending">-</span>
                      ) : (
                        <strong className="academic-grade-number">
                          {item.grade}
                        </strong>
                      )}
                    </td>

                    <td>
                      <span
                        className={`academic-grade-result ${result.className}`}
                      >
                        {result.text}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="academic-grades-empty">
          <div>📊</div>

          <h2>No Grades Found</h2>

          <p>Student grades entered by teachers will appear here.</p>
        </div>
      )}
    </div>
  );
}

export default AcademicGradesPage;
