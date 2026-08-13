import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import useCourses from "../hooks/useCourses";
import useStudents from "../hooks/useStudents";
import useDepartments from "../hooks/useDepartments";
import useTeachers from "../hooks/useTeachers";

import "./CourseEnrollmentPage.css";

function CourseEnrollmentPage() {
  const { id } = useParams();

  const navigate = useNavigate();

  const { getCourse, setCourseStudents } = useCourses();

  const { students } = useStudents();

  const { departments } = useDepartments();

  const { teachers } = useTeachers();

  const course = getCourse(id);

  const [searchTerm, setSearchTerm] = useState("");

  const [selectedStudents, setSelectedStudents] = useState(() => {
    return course?.students || [];
  });

  if (!course) {
    return (
      <div className="course-enrollment-page">
        <div className="enrollment-message">
          <h2>Course not found</h2>

          <button onClick={() => navigate("/academic/courses")}>
            Back to Courses
          </button>
        </div>
      </div>
    );
  }

  const department = departments.find(
    (item) => String(item.id) === String(course.departmentId),
  );

  const teacher = teachers.find(
    (item) =>
      String(item.id) === String(course.teacherId) ||
      String(item.teacherId) === String(course.teacherId),
  );

  const availableStudents = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    return students.filter((student) => {
      const sameDepartment =
        !department || student.department === department.name;

      const matchesSearch =
        !search ||
        student.name?.toLowerCase().includes(search) ||
        String(student.studentId || student.id).includes(search);

      return sameDepartment && matchesSearch;
    });
  }, [students, searchTerm, department]);

  const handleToggleStudent = (student) => {
    const studentId = student.studentId || student.id;

    const selected = selectedStudents.some(
      (id) => String(id) === String(studentId),
    );

    if (selected) {
      setSelectedStudents((prevStudents) =>
        prevStudents.filter((id) => String(id) !== String(studentId)),
      );

      return;
    }

    setSelectedStudents((prevStudents) => [...prevStudents, studentId]);
  };

  const handleSelectAll = () => {
    const allStudentIds = availableStudents.map(
      (student) => student.studentId || student.id,
    );

    setSelectedStudents(allStudentIds);
  };

  const handleClearAll = () => {
    setSelectedStudents([]);
  };

  const handleSave = () => {
    const result = setCourseStudents(course.id, selectedStudents);

    if (!result.success) {
      alert("Failed to save enrollment.");

      return;
    }

    alert("Course enrollment saved successfully.");

    navigate("/academic/courses");
  };

  return (
    <div className="course-enrollment-page">
      <div className="enrollment-header">
        <div>
          <span className="enrollment-course-code">{course.code}</span>

          <h1>Course Enrollment</h1>

          <p>
            Add or remove students from <strong>{course.name}</strong>.
          </p>
        </div>

        <button
          className="enrollment-back-btn"
          onClick={() => navigate("/academic/courses")}
        >
          ← Courses
        </button>
      </div>

      <div className="enrollment-course-info">
        <div>
          <span>Course</span>
          <strong>{course.name}</strong>
        </div>

        <div>
          <span>Department</span>
          <strong>{department?.name || "-"}</strong>
        </div>

        <div>
          <span>Teacher</span>
          <strong>{teacher?.name || "Not Assigned"}</strong>
        </div>

        <div>
          <span>Enrolled</span>
          <strong>{selectedStudents.length}</strong>
        </div>
      </div>

      <div className="enrollment-toolbar">
        <div className="enrollment-search">
          <span>🔍</span>

          <input
            type="text"
            placeholder="Search student name or ID..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </div>

        <div className="enrollment-toolbar-buttons">
          <button type="button" onClick={handleSelectAll}>
            Select All
          </button>

          <button type="button" onClick={handleClearAll}>
            Clear
          </button>
        </div>
      </div>

      {availableStudents.length > 0 ? (
        <div className="enrollment-students-grid">
          {availableStudents.map((student) => {
            const studentId = student.studentId || student.id;

            const selected = selectedStudents.some(
              (id) => String(id) === String(studentId),
            );

            return (
              <button
                type="button"
                className={`enrollment-student-card ${
                  selected ? "selected" : ""
                }`}
                key={student.id}
                onClick={() => handleToggleStudent(student)}
              >
                <div className="enrollment-checkbox">{selected ? "✓" : ""}</div>

                <div className="enrollment-student-avatar">
                  {student.name
                    ?.split(" ")
                    .map((word) => word[0])
                    .slice(0, 2)
                    .join("")
                    .toUpperCase()}
                </div>

                <div className="enrollment-student-info">
                  <h3>{student.name}</h3>

                  <p>
                    Student ID:{" "}
                    <strong>{student.studentId || student.id}</strong>
                  </p>

                  <span>{student.level || "-"}</span>
                </div>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="enrollment-empty">
          <h2>No students found</h2>

          <p>There are no matching students for this course department.</p>
        </div>
      )}

      <div className="enrollment-footer">
        <div>
          <strong>{selectedStudents.length}</strong> student(s) selected
        </div>

        <div className="enrollment-footer-actions">
          <button
            type="button"
            className="enrollment-cancel-btn"
            onClick={() => navigate("/academic/courses")}
          >
            Cancel
          </button>

          <button
            type="button"
            className="enrollment-save-btn"
            onClick={handleSave}
          >
            Save Enrollment
          </button>
        </div>
      </div>
    </div>
  );
}

export default CourseEnrollmentPage;
