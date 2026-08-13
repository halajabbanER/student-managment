import { useNavigate } from "react-router-dom";

import useAuth from "../hooks/useAuth";
import useTeachers from "../hooks/useTeachers";

import "./TeacherPortalPage.css";

function TeacherPortalPage() {
  const navigate = useNavigate();

  const { user, logout } = useAuth();

  const { getTeacherByTeacherId } = useTeachers();

  const teacher = getTeacherByTeacherId(user?.teacherId);

  const handleLogout = () => {
    logout();

    navigate("/login", {
      replace: true,
    });
  };

  return (
    <div className="teacher-portal">
      <header className="teacher-portal-header">
        <div>
          <h2>🎓 Teacher Portal</h2>

          <p>
            Welcome, <strong>{teacher?.name || user?.name}</strong>
          </p>
        </div>

        <button type="button" onClick={handleLogout}>
          Logout
        </button>
      </header>

      <main className="teacher-portal-content">
        <section className="teacher-profile-card">
          <div className="teacher-avatar">👨‍🏫</div>

          <div>
            <h1>{teacher?.name || user?.name}</h1>

            <p>
              <strong>Teacher ID:</strong> {user?.teacherId}
            </p>

            <p>
              <strong>Department:</strong> {teacher?.department || "-"}
            </p>

            <p>
              <strong>Academic Title:</strong> {teacher?.title || "-"}
            </p>

            <span>{teacher?.status || "Active"}</span>
          </div>
        </section>

        <section className="teacher-portal-grid">
          <div className="teacher-portal-card">
            <div className="portal-icon">📚</div>

            <h3>My Courses</h3>

            <p>View the courses assigned to you.</p>

            <strong>{teacher?.courses?.length || 0}</strong>
          </div>

          <div className="teacher-portal-card">
            <div className="portal-icon">🎓</div>

            <h3>My Students</h3>

            <p>View students registered in your courses.</p>
          </div>

          <div className="teacher-portal-card">
            <div className="portal-icon">📊</div>

            <h3>Grades</h3>

            <p>Add and update grades for your students.</p>
          </div>

          <div className="teacher-portal-card">
            <div className="portal-icon">📝</div>

            <h3>Exams</h3>

            <p>Create and manage course exams.</p>
          </div>

          <div className="teacher-portal-card">
            <div className="portal-icon">📅</div>

            <h3>Schedule</h3>

            <p>View your weekly teaching schedule.</p>
          </div>

          <div className="teacher-portal-card">
            <div className="portal-icon">📢</div>

            <h3>Announcements</h3>

            <p>Share announcements with students.</p>
          </div>
        </section>
      </main>
    </div>
  );
}

export default TeacherPortalPage;
