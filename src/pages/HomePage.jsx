import { useNavigate } from "react-router-dom";
import {
  FaUsers,
  FaUserCheck,
  FaUserClock,
  FaGraduationCap,
  FaBuilding,
  FaArrowRight,
  FaUserPlus,
} from "react-icons/fa";

import useStudents from "../hooks/useStudents";
import "./HomePage.css";

function HomePage() {
  const navigate = useNavigate();
  const { students } = useStudents();

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

  const statistics = [
    {
      title: "Total Students",
      value: totalStudents,
      icon: <FaUsers />,
      className: "total-card",
    },
    {
      title: "Active Students",
      value: activeStudents,
      icon: <FaUserCheck />,
      className: "active-card",
    },
    {
      title: "Inactive Students",
      value: inactiveStudents,
      icon: <FaUserClock />,
      className: "inactive-card",
    },
    {
      title: "Graduated Students",
      value: graduatedStudents,
      icon: <FaGraduationCap />,
      className: "graduated-card",
    },
    {
      title: "Departments",
      value: departments,
      icon: <FaBuilding />,
      className: "department-card",
    },
  ];

  return (
    <div className="home-page">
      <div className="dashboard-hero">
        <div>
          <span className="dashboard-label">Dashboard</span>

          <h1>Student Management System</h1>

          <p>
            Manage students, track academic status and view important
            statistics from one place.
          </p>
        </div>

        <button
          className="hero-add-btn"
          onClick={() => navigate("/student/new")}
        >
          <FaUserPlus />
          Add Student
        </button>
      </div>

      <div className="stats-container">
        {statistics.map((item) => (
          <div className={`stat-card ${item.className}`} key={item.title}>
            <div className="stat-top">
              <div className="stat-icon">{item.icon}</div>

              <span className="stat-dot"></span>
            </div>

            <h3>{item.title}</h3>

            <div className="stat-bottom">
              <p>{item.value}</p>

              <span className="stat-text">Current</span>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-bottom">
        <div className="quick-card">
          <div>
            <span className="quick-label">Student Management</span>

            <h2>Manage your students</h2>

            <p>View, search, edit or remove student records.</p>
          </div>

          <button onClick={() => navigate("/students")}>
            View Students
            <FaArrowRight />
          </button>
        </div>

        <div className="summary-card">
          <h3>Student Summary</h3>

          <div className="summary-row">
            <span>Active</span>
            <strong>{activeStudents}</strong>
          </div>

          <div className="summary-bar">
            <div
              className="summary-progress"
              style={{
                width:
                  totalStudents > 0
                    ? `${(activeStudents / totalStudents) * 100}%`
                    : "0%",
              }}
            ></div>
          </div>

          <p>
            {totalStudents > 0
              ? Math.round((activeStudents / totalStudents) * 100)
              : 0}
            % of students are currently active.
          </p>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
