import useAuth from "../hooks/useAuth";
import useStudents from "../hooks/useStudents";

import "./StudentPortalPage.css";

function StudentPortalPage() {
  const { user } = useAuth();
  const { students } = useStudents();

  const student = students.find(
    (item) => Number(item.id) === Number(user?.studentId),
  );

  if (!student) {
    return (
      <div className="student-portal-page">
        <div className="portal-message">
          <h2>Student information not found</h2>

          <p>Please contact the administrator.</p>
        </div>
      </div>
    );
  }

  const courses = student.courses || [];

  const average =
    courses.length > 0
      ? (
          courses.reduce((total, course) => total + Number(course.grade), 0) /
          courses.length
        ).toFixed(2)
      : "0.00";

  return (
    <div className="student-portal-page">
      {/* Welcome */}

      <div className="portal-welcome">
        <div>
          <span className="portal-label">Student Portal</span>

          <h1>Welcome, {student.name}</h1>

          <p>View your academic information, courses, grades and schedule.</p>
        </div>

        <div className="student-avatar">
          {student.name
            .split(" ")
            .map((word) => word[0])
            .slice(0, 2)
            .join("")
            .toUpperCase()}
        </div>
      </div>

      {/* Statistics */}

      <div className="portal-stats">
        <div className="portal-stat-card">
          <span>Student ID</span>
          <strong>{student.id}</strong>
        </div>

        <div className="portal-stat-card">
          <span>Courses</span>
          <strong>{courses.length}</strong>
        </div>

        <div className="portal-stat-card">
          <span>Average</span>
          <strong>{average}</strong>
        </div>

        <div className="portal-stat-card">
          <span>Status</span>
          <strong>{student.status}</strong>
        </div>
      </div>

      {/* Personal Information */}

      <div className="portal-section">
        <div className="portal-section-header">
          <div>
            <h2>Personal Information</h2>
            <p>Your academic information.</p>
          </div>
        </div>

        <div className="portal-info-grid">
          <div className="portal-info-item">
            <span>Full Name</span>
            <strong>{student.name}</strong>
          </div>

          <div className="portal-info-item">
            <span>Student ID</span>
            <strong>{student.id}</strong>
          </div>

          <div className="portal-info-item">
            <span>Email</span>
            <strong>{student.email || "-"}</strong>
          </div>

          <div className="portal-info-item">
            <span>Department</span>
            <strong>{student.department || "-"}</strong>
          </div>

          <div className="portal-info-item">
            <span>Academic Level</span>
            <strong>{student.level || "-"}</strong>
          </div>

          <div className="portal-info-item">
            <span>Status</span>

            <span
              className={`portal-status ${student.status?.toLowerCase() || ""}`}
            >
              {student.status}
            </span>
          </div>
        </div>
      </div>

      {/* Courses */}

      <div className="portal-section">
        <div className="portal-section-header">
          <div>
            <h2>My Courses & Grades</h2>

            <p>Your registered courses and current grades.</p>
          </div>

          <span className="portal-average">Average: {average} / 100</span>
        </div>

        {courses.length > 0 ? (
          <div className="portal-table-wrapper">
            <table className="portal-table">
              <thead>
                <tr>
                  <th>Course</th>
                  <th>Grade</th>
                  <th>Result</th>
                </tr>
              </thead>

              <tbody>
                {courses.map((course) => (
                  <tr key={course.id}>
                    <td>{course.name}</td>

                    <td>
                      <span className="portal-grade">{course.grade}</span>
                    </td>

                    <td>
                      <span
                        className={
                          Number(course.grade) >= 50
                            ? "portal-result passed"
                            : "portal-result failed"
                        }
                      >
                        {Number(course.grade) >= 50 ? "Passed" : "Failed"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="portal-empty">No courses have been added yet.</div>
        )}
      </div>

      {/* Exams - temporary */}

      <div className="portal-section">
        <div className="portal-section-header">
          <div>
            <h2>My Exams</h2>
            <p>Your upcoming exams.</p>
          </div>
        </div>

        <div className="portal-empty">No exams added yet.</div>
      </div>

      {/* Schedule - temporary */}

      <div className="portal-section">
        <div className="portal-section-header">
          <div>
            <h2>Weekly Schedule</h2>

            <p>Your weekly course schedule.</p>
          </div>
        </div>

        <div className="portal-empty">No schedule added yet.</div>
      </div>
    </div>
  );
}

export default StudentPortalPage;
