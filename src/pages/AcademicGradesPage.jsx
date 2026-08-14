import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import useCourses from "../hooks/useCourses";
import useStudents from "../hooks/useStudents";
import useTeachers from "../hooks/useTeachers";

import "./AcademicGradesPage.css";

function AcademicGradesPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const { courses, updateCourse } = useCourses();
  const { students } = useStudents();
  const { teachers } = useTeachers();

  const [searchTerm, setSearchTerm] = useState("");
  const [courseFilter, setCourseFilter] = useState(() => {
    const params = new URLSearchParams(location.search);

    return params.get("courseId") || "All";
  });
  const [resultFilter, setResultFilter] = useState("All");
  const [draftGrades, setDraftGrades] = useState({});

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const courseId = params.get("courseId");

    if (courseId) {
      setCourseFilter(courseId);
    }
  }, [location.search]);

  const getStudent = useCallback(
    (studentId) => {
      return students.find(
        (student) =>
          String(student.studentId || student.id) === String(studentId),
      );
    },
    [students],
  );

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

  useEffect(() => {
    setDraftGrades((prevDrafts) => {
      const nextDrafts = { ...prevDrafts };

      allGrades.forEach((item) => {
        const key = `${item.courseId}:${item.studentId}`;

        if (!(key in nextDrafts)) {
          nextDrafts[key] = item.grade === null ? "" : String(item.grade);
        }
      });

      return nextDrafts;
    });
  }, [allGrades]);

  const getGradeKey = useCallback((courseId, studentId) => {
    return `${courseId}:${studentId}`;
  }, []);

  const getGradeValue = useCallback(
    (courseId, studentId, fallback) => {
      const key = getGradeKey(courseId, studentId);

      if (key in draftGrades) {
        return draftGrades[key];
      }

      return fallback === null || fallback === undefined ? "" : String(fallback);
    },
    [draftGrades, getGradeKey],
  );

  const handleGradeChange = (courseId, studentId, value) => {
    const key = getGradeKey(courseId, studentId);

    setDraftGrades((prevDrafts) => ({
      ...prevDrafts,
      [key]: value,
    }));
  };

  const handleSaveGrade = (item) => {
    const key = getGradeKey(item.courseId, item.studentId);
    const rawValue = String(draftGrades[key] ?? "").trim();
    const course = courses.find(
      (courseItem) => String(courseItem.id) === String(item.courseId),
    );

    if (!course) {
      alert("Course not found.");
      return;
    }

    if (rawValue !== "") {
      const numericValue = Number(rawValue);

      if (
        Number.isNaN(numericValue) ||
        numericValue < 0 ||
        numericValue > 100
      ) {
        alert("Grades must be between 0 and 100.");
        return;
      }
    }

    const nextGrades = (course.grades || []).filter(
      (grade) => String(grade.studentId) !== String(item.studentId),
    );

    if (rawValue !== "") {
      nextGrades.push({
        studentId: item.studentId,
        grade: Number(rawValue),
      });
    }

    const result = updateCourse(course.id, {
      ...course,
      grades: nextGrades,
    });

    if (!result.success) {
      alert(result.message || "Failed to save grade.");
      return;
    }

    setDraftGrades((prevDrafts) => ({
      ...prevDrafts,
      [key]: rawValue,
    }));

    alert("Grade saved successfully.");
  };

  const handleSaveVisibleGrades = () => {
    const itemsToSave = filteredGrades;

    if (itemsToSave.length === 0) {
      alert("No grades to save.");
      return;
    }

    for (const item of itemsToSave) {
      const key = getGradeKey(item.courseId, item.studentId);
      const rawValue = String(draftGrades[key] ?? "").trim();
      const course = courses.find(
        (courseItem) => String(courseItem.id) === String(item.courseId),
      );

      if (!course) {
        continue;
      }

      if (rawValue !== "") {
        const numericValue = Number(rawValue);

        if (
          Number.isNaN(numericValue) ||
          numericValue < 0 ||
          numericValue > 100
        ) {
          alert(`Invalid grade for ${item.studentName} in ${item.courseCode}.`);
          return;
        }
      }

      const nextGrades = (course.grades || []).filter(
        (grade) => String(grade.studentId) !== String(item.studentId),
      );

      if (rawValue !== "") {
        nextGrades.push({
          studentId: item.studentId,
          grade: Number(rawValue),
        });
      }

      const result = updateCourse(course.id, {
        ...course,
        grades: nextGrades,
      });

      if (!result.success) {
        alert(result.message || "Failed to save grades.");
        return;
      }

      setDraftGrades((prevDrafts) => ({
        ...prevDrafts,
        [key]: rawValue,
      }));
    }

    alert("Visible grades saved successfully.");
  };

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
        courseFilter === "All" || String(item.courseId) === String(courseFilter);

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

  const gradedStudents = allGrades.filter((item) => item.grade !== null);
  const passedStudents = gradedStudents.filter((item) => item.grade >= 50);
  const failedStudents = gradedStudents.filter((item) => item.grade < 50);
  const selectedCourse =
    courseFilter === "All"
      ? null
      : courses.find((course) => String(course.id) === String(courseFilter));

  const average =
    gradedStudents.length > 0
      ? (
          gradedStudents.reduce((total, item) => total + item.grade, 0) /
          gradedStudents.length
        ).toFixed(2)
      : "0.00";

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
      <div className="academic-grades-header">
        <div>
          <h1>Grades Management</h1>

          <p>Enter and review student grades for each course.</p>
        </div>

        <button type="button" onClick={() => navigate("/academic")}>
          Dashboard
        </button>
      </div>

      <div className="academic-grades-stats">
        <div className="academic-grade-stat">
          <div>Average</div>

          <span>Average Grade</span>

          <strong>{average}</strong>
        </div>

        <div className="academic-grade-stat">
          <div>Passed</div>

          <span>Passed</span>

          <strong>{passedStudents.length}</strong>
        </div>

        <div className="academic-grade-stat">
          <div>Failed</div>

          <span>Failed</span>

          <strong>{failedStudents.length}</strong>
        </div>

        <div className="academic-grade-stat">
          <div>Pending</div>

          <span>Pending</span>

          <strong>{allGrades.filter((item) => item.grade === null).length}</strong>
        </div>
      </div>

      <div className="academic-grades-tools">
        <div className="academic-grades-search">
          <span>Search</span>

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

      <p className="academic-grades-note">
        Edit the grade in the table, then press Save for that student.
      </p>

      <div className="academic-grades-actions">
        {selectedCourse && (
          <div className="academic-grades-selected-course">
            <span>Selected Course</span>
            <strong>
              {selectedCourse.code} - {selectedCourse.name}
            </strong>
          </div>
        )}

        <button type="button" onClick={handleSaveVisibleGrades}>
          Save Visible Grades
        </button>
      </div>

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
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredGrades.map((item) => {
                const gradeValue = getGradeValue(
                  item.courseId,
                  item.studentId,
                  item.grade,
                );
                const normalizedGrade =
                  String(gradeValue).trim() === "" ? null : Number(gradeValue);
                const result = getResult(normalizedGrade);

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
                      <span className="academic-grade-id">{item.studentId}</span>
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
                      <input
                        className="academic-grade-input"
                        type="number"
                        min="0"
                        max="100"
                        placeholder="0-100"
                        value={gradeValue}
                        onChange={(event) =>
                          handleGradeChange(
                            item.courseId,
                            item.studentId,
                            event.target.value,
                          )
                        }
                      />
                    </td>

                    <td>
                      <span className={`academic-grade-result ${result.className}`}>
                        {result.text}
                      </span>
                    </td>

                    <td>
                      <button
                        type="button"
                        className="academic-grade-save-btn"
                        onClick={() => handleSaveGrade(item)}
                      >
                        Save
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="academic-grades-empty">
          <div>Grades</div>

          <h2>No Grades Found</h2>

          <p>Select a course and enter student grades to start tracking results.</p>
        </div>
      )}
    </div>
  );
}

export default AcademicGradesPage;
