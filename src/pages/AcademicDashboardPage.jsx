import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaArrowRightLong,
  FaBookOpen,
  FaBuilding,
  FaCalendarDays,
  FaChartColumn,
  FaChalkboardUser,
  FaFlaskVial,
  FaUserGraduate,
} from "react-icons/fa6";

import useAuth from "../hooks/useAuth";
import useStudents from "../hooks/useStudents";

import "./AcademicDashboardPage.css";

function safeReadList(key) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : [];
  } catch (error) {
    console.error(`${key} storage error:`, error);
    return [];
  }
}

function useCountUp(target, duration = 700) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (target <= 0) {
      setCount(0);
      return undefined;
    }

    let current = 0;
    const incrementTime = Math.max(Math.floor(duration / target), 30);

    const timer = window.setInterval(() => {
      current += 1;
      setCount(current);

      if (current >= target) {
        window.clearInterval(timer);
      }
    }, incrementTime);

    return () => window.clearInterval(timer);
  }, [target, duration]);

  return count;
}

function AcademicDashboardPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { students } = useStudents();

  const teachers = safeReadList("teachers");
  const departments = safeReadList("departments");
  const courses = safeReadList("courses");

  const academicStats = [
    { label: "Students", value: useCountUp(students.length), icon: FaUserGraduate, color: "#5b4df7" },
    { label: "Teachers", value: useCountUp(teachers.length), icon: FaChalkboardUser, color: "#0f9d58" },
    { label: "Departments", value: useCountUp(departments.length), icon: FaBuilding, color: "#f59e0b" },
    { label: "Courses", value: useCountUp(courses.length), icon: FaBookOpen, color: "#ec4899" },
  ];

  const academicSections = [
    {
      title: "Students",
      description: "Manage student records and create Student IDs.",
      icon: FaUserGraduate,
      color: "#5b4df7",
      path: "/academic/students",
    },
    {
      title: "Teachers",
      description: "Manage academic staff and teacher information.",
      icon: FaChalkboardUser,
      color: "#0f9d58",
      path: "/academic/teachers",
    },
    {
      title: "Departments",
      description: "Manage university departments.",
      icon: FaBuilding,
      color: "#f59e0b",
      path: "/academic/departments",
    },
    {
      title: "Courses",
      description: "Create and manage academic courses.",
      icon: FaBookOpen,
      color: "#ec4899",
      path: "/academic/courses",
    },
    {
      title: "Exams",
      description: "Manage exams, dates and course exams.",
      icon: FaFlaskVial,
      color: "#06b6d4",
      path: "/academic/exams",
    },
    {
      title: "Grades",
      description: "Manage student grades and academic results.",
      icon: FaChartColumn,
      color: "#ef4444",
      path: "/academic/grades",
    },
    {
      title: "Schedules",
      description: "Manage weekly course schedules.",
      icon: FaCalendarDays,
      color: "#8b5cf6",
      path: "/academic/schedules",
    },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="academic-page">
      <header className="academic-header">
        <div>
          <h2>Academic Management</h2>
        </div>

        <div className="academic-user">
          <span>
            Welcome, <strong>{user?.name}</strong>
          </span>

          <button type="button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      <main className="academic-content">
        <div className="academic-title">
          <div>
            <h1>Academic Dashboard</h1>
            <p>Manage students, teachers, courses, exams, grades and schedules.</p>
          </div>

          <span className="academic-role">Academic Staff</span>
        </div>

        <div className="academic-stats">
          {academicStats.map((stat) => {
            const StatIcon = stat.icon;

            return (
              <div className="academic-stat-card" key={stat.label}>
                <div>
                  <span>{stat.label}</span>
                  <strong>{stat.value}</strong>
                </div>

                <div className="academic-stat-icon">
                  <StatIcon aria-hidden="true" style={{ color: stat.color }} />
                </div>
              </div>
            );
          })}
        </div>

        <section className="academic-management">
          <div className="academic-section-title">
            <h2>Academic Management</h2>
            <p>Select a section to manage academic data.</p>
          </div>

          <div className="academic-grid">
            {academicSections.map((section) => {
              const SectionIcon = section.icon;
              const handleSectionClick =
                section.title === "Grades"
                  ? () => navigate("/academic/grades")
                  : section.title === "Schedules"
                    ? () => navigate("/academic/schedules")
                  : () => navigate(section.path);

              return (
                <button
                  type="button"
                  className="academic-card"
                  key={section.title}
                  onClick={handleSectionClick}
                >
                  <div className="academic-card-icon">
                    <SectionIcon aria-hidden="true" style={{ color: section.color }} />
                  </div>

                  <div>
                    <h3>{section.title}</h3>
                    <p>{section.description}</p>
                  </div>

                  <span className="academic-arrow">
                    <FaArrowRightLong aria-hidden="true" />
                  </span>
                </button>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}

export default AcademicDashboardPage;
