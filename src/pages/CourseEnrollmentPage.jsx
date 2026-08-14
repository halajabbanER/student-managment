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

  // =========================
  // DEPARTMENT
  // =========================

  const department = course
    ? departments.find((item) => String(item.id) === String(course.departmentId))
    : null;

  // =========================
  // TEACHER
  // =========================

  const teacher = course
    ? teachers.find(
        (item) =>
          String(item.id) === String(course.teacherId) ||
          String(item.teacherId) === String(course.teacherId),
      )
    : null;

  // =========================
  // AVAILABLE STUDENTS
  // =========================
  // هنا نعرض كل الطلاب
  // بدون فلترة حسب القسم

  const availableStudents = useMemo(() => {
    if (!course) {
      return [];
    }

    const search = searchTerm.trim().toLowerCase();

    return students.filter((student) => {
      const studentName = student.name?.toLowerCase() || "";

      const studentId = String(student.studentId || student.id).toLowerCase();

      const studentEmail = student.email?.toLowerCase() || "";

      const matchesSearch =
        !search ||
        studentName.includes(search) ||
        studentId.includes(search) ||
        studentEmail.includes(search);

      return matchesSearch;
    });
  }, [students, searchTerm, course]);

  // =========================
  // COURSE NOT FOUND
  // =========================

  if (!course) {
    return (
      <div className="course-enrollment-page">
        <div className="enrollment-message">
          <h2>Course not found</h2>

          <button type="button" onClick={() => navigate("/academic/courses")}>
            Back to Courses
          </button>
        </div>
      </div>
    );
  }

  // =========================
  // SELECT / UNSELECT STUDENT
  // =========================

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

  // =========================
  // SELECT ALL
  // =========================

  const handleSelectAll = () => {
    const visibleStudentIds = availableStudents.map(
      (student) => student.studentId || student.id,
    );

    setSelectedStudents((prevStudents) => {
      const combined = [...prevStudents, ...visibleStudentIds];

      return [
        ...new Map(
          combined.map((studentId) => [String(studentId), studentId]),
        ).values(),
      ];
    });
  };

  // =========================
  // CLEAR ALL
  // =========================

  const handleClearAll = () => {
    setSelectedStudents([]);
  };

  // =========================
  // SAVE
  // =========================

  const handleSave = () => {
    const result = setCourseStudents(course.id, selectedStudents);

    if (!result.success) {
      alert(result.message || "Failed to save enrollment.");

      return;
    }

    alert("Course enrollment saved successfully.");

    navigate("/academic/courses");
  };

  return (
    <div className="course-enrollment-page">
      {/* =====================
          HEADER
      ====================== */}

      <div className="enrollment-header">
        <div>
          <span className="enrollment-course-code">{course.code}</span>

          <h1>Course Enrollment</h1>

          <p>
            Add or remove students from <strong>{course.name}</strong>.
          </p>
        </div>

        <button
          type="button"
          className="enrollment-back-btn"
          onClick={() => navigate("/academic/courses")}
        >
          ← Courses
        </button>
      </div>

      {/* =====================
          COURSE INFO
      ====================== */}

      <div className="enrollment-course-info">
        <div>
          <span>Course</span>

          <strong>{course.name}</strong>
        </div>

        <div>
          <span>Department</span>

          <strong>{department?.name || course.department || "-"}</strong>
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

      {/* =====================
          SEARCH + ACTIONS
      ====================== */}

      <div className="enrollment-toolbar">
        <div className="enrollment-search">
          <span>🔍</span>

          <input
            type="text"
            placeholder="Search student name, ID or email..."
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

      {/* =====================
          STUDENTS
      ====================== */}

      {availableStudents.length > 0 ? (
        <div className="enrollment-students-grid">
          {availableStudents.map((student) => {
            const studentId = student.studentId || student.id;

            const selected = selectedStudents.some(
              (id) => String(id) === String(studentId),
            );

            const initials =
              student.name
                ?.split(" ")
                .filter(Boolean)
                .map((word) => word[0])
                .slice(0, 2)
                .join("")
                .toUpperCase() || "ST";

            return (
              <button
                type="button"
                className={`enrollment-student-card ${
                  selected ? "selected" : ""
                }`}
                key={student.id}
                onClick={() => handleToggleStudent(student)}
              >
                {/* CHECKBOX */}

                <div className="enrollment-checkbox">{selected ? "✓" : ""}</div>

                {/* AVATAR */}

                <div className="enrollment-student-avatar">{initials}</div>

                {/* INFORMATION */}

                <div className="enrollment-student-info">
                  <h3>{student.name}</h3>

                  <p>
                    Student ID:{" "}
                    <strong>{student.studentId || student.id}</strong>
                  </p>

                  <p>
                    Department: <strong>{student.department || "-"}</strong>
                  </p>

                  <span>{student.level || "-"}</span>
                </div>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="enrollment-empty">
          <div
            style={{
              fontSize: "45px",
              marginBottom: "10px",
            }}
          >
            👨‍🎓
          </div>

          <h2>No students found</h2>

          <p>
            {students.length === 0
              ? "There are no students in the system yet."
              : "No students match your search."}
          </p>
        </div>
      )}

      {/* =====================
          FOOTER
      ====================== */}

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

