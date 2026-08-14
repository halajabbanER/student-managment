import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaBuilding,
  FaChartPie,
  FaCheckCircle,
  FaClock,
  FaGraduationCap,
  FaSearch,
  FaShieldAlt,
  FaTasks,
  FaUserPlus,
  FaUsers,
  FaArrowRight,
} from "react-icons/fa";

import useStudents from "../hooks/useStudents";
import "./HomePage.css";

function HomePage() {
  const navigate = useNavigate();
  const { students } = useStudents();
  const [query, setQuery] = useState("");

  const totalStudents = students.length;
  const activeStudents = students.filter(
    (student) => student.status === "Active",
  ).length;
  const inactiveStudents = students.filter(
    (student) => student.status === "Inactive",
  ).length;
  const graduatedStudents = students.filter(
    (student) => student.status === "Graduated",
  ).length;
  const departments = new Set(students.map((student) => student.department))
    .size;

  const visibleStudents = useMemo(() => {
    const search = query.trim().toLowerCase();

    if (!search) {
      return students.slice(0, 5);
    }

    return students
      .filter((student) => {
        const fields = [
          student.firstName,
          student.lastName,
          student.studentId,
          student.department,
          student.status,
        ];

        return fields.some((field) =>
          String(field || "")
            .toLowerCase()
            .includes(search),
        );
      })
      .slice(0, 5);
  }, [query, students]);

  const quickStats = [
    { label: "Total", value: totalStudents, icon: <FaUsers />, tone: "blue" },
    {
      label: "Active",
      value: activeStudents,
      icon: <FaCheckCircle />,
      tone: "green",
    },
    {
      label: "Inactive",
      value: inactiveStudents,
      icon: <FaClock />,
      tone: "amber",
    },
    {
      label: "Graduated",
      value: graduatedStudents,
      icon: <FaGraduationCap />,
      tone: "violet",
    },
  ];

  return (
    <div className="dashboard-shell">
      <aside className="dashboard-sidebar">
        <div className="sidebar-brand">
          <div className="brand-icon">
            <FaShieldAlt />
          </div>

          <div>
            <h2>Student Management</h2>
            <p>Admin dashboard</p>
          </div>
        </div>

        <div className="sidebar-card primary-card">
          <span>Overview</span>
          <strong>{totalStudents}</strong>
          <p>Total students managed from one place.</p>
        </div>

        <div className="sidebar-card sidebar-list">
          <div className="sidebar-list-row">
            <FaChartPie />
            <span>Departments</span>
            <strong>{departments}</strong>
          </div>
          <div className="sidebar-list-row">
            <FaGraduationCap />
            <span>Academic</span>
            <strong>Open</strong>
          </div>
          <div className="sidebar-list-row">
            <FaTasks />
            <span>Student Portal</span>
            <strong>Open</strong>
          </div>
        </div>

        <div className="sidebar-card progress-card">
          <span>Activity</span>
          <strong>
            {totalStudents > 0
              ? Math.round((activeStudents / totalStudents) * 100)
              : 0}
            %
          </strong>
          <div className="sidebar-progress">
            <div
              className="sidebar-progress-bar"
              style={{
                width:
                  totalStudents > 0
                    ? `${(activeStudents / totalStudents) * 100}%`
                    : "0%",
              }}
            />
          </div>
          <p>Students are currently active.</p>
        </div>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-header">
          <div>
            <span className="header-badge">Dashboard</span>
            <h1>Student Management System</h1>
            <p>
              Manage students, track academic status and open academic pages
              from one dashboard.
            </p>
          </div>

          <div className="header-actions">
          
            <button className="header-primary" onClick={() => navigate("/student/new")}>
              <FaUserPlus />
              Add Student
            </button>
          </div>
        </header>

        <section className="top-controls">
          <div className="search-bar">
            <FaSearch />
            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search student, ID, department..."
            />
          </div>

          <div className="tab-row">
            <button className="tab active">Students</button>
            <button className="tab" onClick={() => navigate("/academic")}>
              Academic
            </button>
            <button className="tab" onClick={() => navigate("/teacher-portal")}>
              Teachers
            </button>
          </div>
        </section>

        <section className="stats-row">
          {quickStats.map((item) => (
            <article className={`mini-stat ${item.tone}`} key={item.label}>
              <div className="mini-stat-icon">{item.icon}</div>
              <div className="mini-stat-copy">
                <span>{item.label}</span>
                <strong>{item.value}</strong>
              </div>
            </article>
          ))}
        </section>

        <section className="content-grid">
          <article className="panel task-panel">
            <div className="panel-head">
              <div>
                <span className="panel-kicker">Tasks</span>
                <h3>Latest students</h3>
              </div>

              <button className="panel-link" onClick={() => navigate("/students")}>
                View all
                <FaArrowRight />
              </button>
            </div>

            <div className="task-list">
              {visibleStudents.length > 0 ? (
                visibleStudents.map((student) => (
                  <button
                    type="button"
                    className="task-item"
                    key={student.id}
                    onClick={() => navigate(`/student/${student.id}`)}
                  >
                    <div className="task-check">
                      <FaUsers />
                    </div>

                    <div className="task-copy">
                      <strong>
                        {student.firstName} {student.lastName}
                      </strong>
                      <span>
                        {student.studentId} - {student.department || "No department"}
                      </span>
                    </div>

                    <span className={`task-status ${String(student.status || "").toLowerCase()}`}>
                      {student.status || "Unknown"}
                    </span>
                  </button>
                ))
              ) : (
                <div className="empty-state">
                  <FaUsers />
                  <p>No students found.</p>
                </div>
              )}
            </div>
          </article>

          <article className="panel side-panel">
            <div className="panel-head">
              <div>
                <span className="panel-kicker">Quick Access</span>
                <h3>Academic & Student</h3>
              </div>
            </div>

            <button className="side-link academic" onClick={() => navigate("/academic")}>
              <div className="side-link-icon">
                <FaBuilding />
              </div>
              <div className="side-link-copy">
                <strong>Academic</strong>
                <span>Teachers, departments, academic students</span>
              </div>
            </button>

            <button className="side-link student" onClick={() => navigate("/students")}>
              <div className="side-link-icon">
                <FaUsers />
              </div>
              <div className="side-link-copy">
                <strong>Student</strong>
                <span>Student list, IDs, and account status</span>
              </div>
            </button>

            <div className="panel-footer">
              <strong>Student Summary</strong>
              <div className="footer-row">
                <span>Active</span>
                <strong>{activeStudents}</strong>
              </div>
              <div className="progress-track">
                <div
                  className="progress-fill"
                  style={{
                    width:
                      totalStudents > 0
                        ? `${(activeStudents / totalStudents) * 100}%`
                        : "0%",
                  }}
                />
              </div>
              <p>
                {totalStudents > 0
                  ? Math.round((activeStudents / totalStudents) * 100)
                  : 0}
                % of students are currently active.
              </p>
            </div>
          </article>
        </section>
      </main>
    </div>
  );
}

export default HomePage;
