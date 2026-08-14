import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

import useAuth from "../hooks/useAuth";
import useTeachers from "../hooks/useTeachers";
import useCourses from "../hooks/useCourses";
import useStudents from "../hooks/useStudents";

import "./AcademicPortalPage.css";

function AcademicPortalPage() {
  const navigate = useNavigate();

  const { user, logout } = useAuth();
  const { teachers } = useTeachers();
  const { courses } = useCourses();
  const { students } = useStudents();

  const academicProfile = useMemo(() => {
    const currentEmail = String(user?.email || "").trim().toLowerCase();

    const byTeacherId = teachers.find(
      (item) => String(item.teacherId || item.id) === String(user?.teacherId),
    );

    const byEmail = currentEmail
      ? teachers.find(
          (item) =>
            String(item.email || "").trim().toLowerCase() === currentEmail,
        )
      : null;

    const byId = teachers.find((item) => String(item.id) === String(user?.id));

    return byTeacherId || byEmail || byId || user || null;
  }, [teachers, user]);

  const teacherCourses = useMemo(() => {
    if (!academicProfile) {
      return [];
    }

    const profileTeacherId = academicProfile.teacherId || academicProfile.id;

    return courses.filter(
      (course) =>
        String(course.teacherId) === String(profileTeacherId) ||
        String(course.teacherId) === String(academicProfile.teacherId),
    );
  }, [courses, academicProfile]);

  const getCourseStudents = (course) => {
    const enrolledIds = course.students || [];

    return students.filter((student) => {
      const studentIdentifier = student.studentId || student.id;

      return enrolledIds.some((id) => String(id) === String(studentIdentifier));
    });
  };

  const totalStudents = useMemo(() => {
    const ids = new Set();

    teacherCourses.forEach((course) => {
      (course.students || []).forEach((studentId) => {
        ids.add(String(studentId));
      });
    });

    return ids.size;
  }, [teacherCourses]);

  const totalExams = useMemo(() => {
    return teacherCourses.reduce(
      (total, course) => total + (course.exams?.length || 0),
      0,
    );
  }, [teacherCourses]);

  const academicName = academicProfile?.name || user?.name || "Academic Staff";
  const academicId =
    academicProfile?.teacherId || academicProfile?.id || user?.teacherId || "-";
  const academicDepartment =
    academicProfile?.department || user?.department || "-";
  const academicTitle = academicProfile?.title || user?.title || "-";
  const academicStatus = academicProfile?.status || user?.status || "Active";
  const hasAcademicRecord = Boolean(
    academicProfile?.teacherId || academicProfile?.id,
  );

  const handleLogout = () => {
    logout();

    navigate("/login", {
      replace: true,
    });
  };

  return (
    <div className="teacher-portal-page">
      <header className="teacher-portal-header">
        <div>
          <h2>👨‍🏫 Academic Dashboard</h2>

          <p>
            Welcome, <strong>{academicName}</strong>
          </p>
        </div>

        <button type="button" onClick={handleLogout}>
          Logout
        </button>
      </header>

      <div className="teacher-portal-shortcuts">
        <button type="button" onClick={() => navigate("/academic/grades")}>
          View Grades
        </button>

        <button type="button" onClick={() => navigate("/academic/courses")}>
          Manage Courses
        </button>
      </div>

      <main className="teacher-portal-content">
        <section className="teacher-profile-section">
          <div className="teacher-profile-avatar">
            {academicName
              ?.split(" ")
              .map((word) => word[0])
              .slice(0, 2)
              .join("")
              .toUpperCase()}
          </div>

          <div>
            <h1>{academicName}</h1>

            <p>
              <strong>Academic ID:</strong> {academicId}
            </p>

            <p>
              <strong>Department:</strong> {academicDepartment}
            </p>

            <p>
              <strong>Title:</strong> {academicTitle}
            </p>

            <span>{academicStatus}</span>
          </div>
        </section>

        <section className="teacher-statistics">
          <div className="teacher-stat-card">
            <div>📚</div>

            <span>My Courses</span>

            <strong>{teacherCourses.length}</strong>
          </div>

          <div className="teacher-stat-card">
            <div>🎓</div>

            <span>My Students</span>

            <strong>{totalStudents}</strong>
          </div>

          <div className="teacher-stat-card">
            <div>📝</div>

            <span>Exams</span>

            <strong>{totalExams}</strong>
          </div>

          <div className="teacher-stat-card">
            <div>📊</div>

            <span>Status</span>

            <strong className="teacher-status-text">{academicStatus}</strong>
          </div>
        </section>

        <section className="teacher-courses-section">
          <div className="teacher-section-title">
            <div>
              <h2>My Courses</h2>

              <p>Courses assigned to you by Academic Administration.</p>
            </div>

            <span>{teacherCourses.length} Courses</span>
          </div>

          {!hasAcademicRecord ? (
            <div className="teacher-empty-courses">
              <div>📚</div>

              <h3>No Academic Profile Linked</h3>

              <p>
                Your account is active, but it is not linked to a staff record
                yet.
              </p>
            </div>
          ) : null}

          {teacherCourses.length > 0 ? (
            <div className="teacher-courses-grid">
              {teacherCourses.map((course) => {
                const courseStudents = getCourseStudents(course);

                return (
                  <article className="teacher-course-card" key={course.id}>
                    <div className="teacher-course-top">
                      <div className="teacher-course-icon">📘</div>

                      <span className="teacher-course-code">{course.code}</span>
                    </div>

                    <h3>{course.name}</h3>

                    <div className="teacher-course-details">
                      <p>
                        <span>🎓 Credits</span>

                        <strong>{course.credits}</strong>
                      </p>

                      <p>
                        <span>📅 Semester</span>

                        <strong>{course.semester}</strong>
                      </p>

                      <p>
                        <span>👨‍🎓 Students</span>

                        <strong>{courseStudents.length}</strong>
                      </p>

                      <p>
                        <span>📝 Exams</span>

                        <strong>{course.exams?.length || 0}</strong>
                      </p>
                    </div>

                    <div className="teacher-course-actions">
                      <button
                        type="button"
                        className="teacher-view-students-btn"
                        onClick={() =>
                          navigate(`/academic/course/${course.id}/students`)
                        }
                      >
                        👨‍🎓 Students
                      </button>

                      <button
                        type="button"
                        className="teacher-grades-btn"
                        onClick={() =>
                          navigate(`/academic/course/${course.id}/grades`)
                        }
                      >
                        📊 Grades
                      </button>

                      <button
                        type="button"
                        className="teacher-exams-btn"
                        onClick={() =>
                          navigate(`/academic/course/${course.id}/exams`)
                        }
                      >
                        📝 Exams
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="teacher-empty-courses">
              <div>📚</div>

              <h3>No Courses Assigned</h3>

              <p>No courses have been assigned to you yet.</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default AcademicPortalPage;
