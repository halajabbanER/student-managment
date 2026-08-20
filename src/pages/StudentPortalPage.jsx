import { useNavigate } from "react-router-dom";

import useAuth from "../hooks/useAuth";
import useStudentPortalData from "../hooks/useStudentPortalData";

import "./StudentPortalPage.css";

function StudentPortalPage() {
  const navigate = useNavigate();

  const { logout } = useAuth();
  const {
    student,
    studentCourses,
    average,
    exams,
    getCourseGrade,
    getTeacherName,
  } = useStudentPortalData();

  // =========================
  // LOGOUT
  // =========================

  const handleLogout = () => {
    logout();

    navigate("/login", {
      replace: true,
    });
  };

  // =========================
  // STUDENT NOT FOUND
  // =========================

  if (!student) {
    return (
      <div className="student-portal-page">
        <div className="student-portal-error">
          <h2>Student information not found</h2>

          <p>Please contact Academic Administration.</p>

          <button onClick={handleLogout}>Logout</button>
        </div>
      </div>
    );
  }

  return (
    <div className="student-portal-page">
      {/* =====================
          HEADER
      ====================== */}

      <header className="student-portal-header">
        <div>
          <h2>🎓 Student Portal</h2>

          <p>
            Welcome, <strong>{student.name}</strong>
          </p>
        </div>

        <button type="button" onClick={handleLogout}>
          Logout
        </button>
      </header>

      <main className="student-portal-content">
        {/* =====================
            PROFILE
        ====================== */}

        <section className="student-profile">
          <div className="student-profile-avatar">
            {student.name
              ?.split(" ")
              .map((word) => word[0])
              .slice(0, 2)
              .join("")
              .toUpperCase()}
          </div>

          <div className="student-profile-info">
            <h1>{student.name}</h1>

            <p>
              <strong>Student ID:</strong> {student.studentId || student.id}
            </p>

            <p>
              <strong>Department:</strong> {student.department || "-"}
            </p>

            <p>
              <strong>Academic Level:</strong> {student.level || "-"}
            </p>

            <span>{student.status || "Active"}</span>
          </div>
        </section>

        {/* =====================
            STATISTICS
        ====================== */}

        <section className="student-statistics">
          <div className="student-stat-card">
            <div>📚</div>

            <span>My Courses</span>

            <strong>{studentCourses.length}</strong>
          </div>

          <div className="student-stat-card">
            <div>📊</div>

            <span>Average</span>

            <strong>{average}</strong>
          </div>

          <div className="student-stat-card">
            <div>📝</div>

            <span>Exams</span>

            <strong>
              {exams.length}
            </strong>
          </div>

          <div className="student-stat-card">
            <div>🎓</div>

            <span>Status</span>

            <strong className="student-active-text">
              {student.status || "Active"}
            </strong>
          </div>
        </section>

        {/* =====================
            COURSES
        ====================== */}

        <section className="student-courses-section">
          <div className="student-section-title">
            <div>
              <h2>My Courses</h2>

              <p>Courses you are currently enrolled in.</p>
            </div>

            <span>{studentCourses.length} Courses</span>
          </div>

          {studentCourses.length > 0 ? (
            <div className="student-courses-grid">
              {studentCourses.map((course) => {
                const grade = getCourseGrade(course) ?? "-";
                return (
                  <article className="student-course-card" key={course.id}>
                    <div className="student-course-top">
                      <div className="student-course-icon">📘</div>

                      <span className="student-course-code">{course.code}</span>
                    </div>

                    <h3>{course.name}</h3>

                    <div className="student-course-details">
                      <p>
                        <span>👨‍🏫 Teacher</span>

                        <strong>{getTeacherName(course.teacherId)}</strong>
                      </p>

                      <p>
                        <span>🎓 Credits</span>

                        <strong>{course.credits}</strong>
                      </p>

                      <p>
                        <span>📅 Semester</span>

                        <strong>{course.semester}</strong>
                      </p>

                      <p>
                        <span>📊 Grade</span>

                        <strong
                          className={
                            grade !== "-" && Number(grade) >= 50
                              ? "grade-pass"
                              : grade !== "-"
                                ? "grade-fail"
                                : ""
                          }
                        >
                          {grade}
                        </strong>
                      </p>
                    </div>

                    <div className="student-course-footer">
                      <span>{course.status}</span>

                      <span>{course.exams?.length || 0} Exams</span>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="student-no-courses">
              <div>📚</div>

              <h3>No Courses Yet</h3>

              <p>You are not enrolled in any courses yet.</p>
            </div>
          )}
        </section>

        {/* =====================
            QUICK SECTIONS
        ====================== */}

        <section className="student-portal-menu">
          <button className="student-menu-card" type="button" onClick={() => navigate("/student-portal/grades")}>
            <div>📊</div>

            <h3>Grades</h3>

            <p>View your course grades and academic results.</p>
          </button>

          <button className="student-menu-card" type="button" onClick={() => navigate("/student-portal/exams")}>
            <div>📝</div>

            <h3>Exams</h3>

            <p>View upcoming exams and exam information.</p>
          </button>

          <button className="student-menu-card" type="button" onClick={() => navigate("/student-portal/schedule")}>
            <div>📅</div>

            <h3>Schedule</h3>

            <p>View your weekly course schedule.</p>
          </button>

          <button className="student-menu-card" type="button" onClick={() => navigate("/student-portal/announcements")}>
            <div>📢</div>

            <h3>Announcements</h3>

            <p>View announcements from your teachers.</p>
          </button>
        </section>
      </main>
    </div>
  );
}

export default StudentPortalPage;
