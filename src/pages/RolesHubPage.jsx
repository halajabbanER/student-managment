import { useNavigate } from "react-router-dom";
import {
  FaArrowRightLong,
  FaChalkboardUser,
  FaCircleCheck,
  FaRightFromBracket,
  FaUserGraduate,
  FaUserShield,
  FaUsers,
} from "react-icons/fa6";

import useAuth from "../hooks/useAuth";

import "./RolesHubPage.css";

function RolesHubPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, isAdmin, isAcademic, isStudent } =
    useAuth();

  const roleCards = [
    {
      title: "Admin",
      description: "Full dashboard access and student management.",
      icon: FaUserShield,
      color: "#4f46e5",
      action: "Admin Login",
      to: "/admin-login",
    },
    {
      title: "Academic",
      description: "Manage students, teachers, departments, and courses.",
      icon: FaUsers,
      color: "#0f9d58",
      action: "Academic Login",
      to: "/login",
    },
    {
      title: "Student",
      description: "View portal, grades, schedule, and personal data.",
      icon: FaUserGraduate,
      color: "#f59e0b",
      action: "Student Login",
      to: "/login",
    },
    {
      title: "Teacher",
      description: "Teacher management is ready inside the academic panel.",
      icon: FaChalkboardUser,
      color: "#ec4899",
      action: "Open Teacher Page",
      to: "/academic/teachers",
    },
  ];

  const quickActions = [
    {
      title: "تسجيل طالب",
      description: "Register using Student ID.",
      to: "/register",
    },
    {
      title: "تسجيل مدرس",
      description: "Add teachers from the academic panel.",
      to: "/academic/teachers",
    },
    {
      title: "Login حسب نوع المستخدم",
      description: "Choose the login page that matches the role.",
      to: "/login",
    },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="roles-page">
      <section className="roles-hero">
        <div>
          <span className="roles-label">Roles Ready</span>
          <h1>Roles جاهزة للاستخدام</h1>
          <p>
            اختر الدور المناسب بسرعة. الصفحة تجمع الدخول، التسجيل، والانتقال
            للأقسام الأساسية في مكان واحد.
          </p>
        </div>

        <div className="roles-hero-status">
          <div className="status-chip">
            <FaCircleCheck />
            <span>{isAuthenticated ? "Signed in" : "Not signed in"}</span>
          </div>

          {isAuthenticated && (
            <div className="status-user">
              Welcome, <strong>{user?.name}</strong>
            </div>
          )}

          {isAuthenticated && (
            <button type="button" className="logout-chip" onClick={handleLogout}>
              <FaRightFromBracket />
              Logout
            </button>
          )}
        </div>
      </section>

      <section className="roles-grid">
        {roleCards.map((card) => {
          const CardIcon = card.icon;

          return (
            <button
              type="button"
              className="role-card"
              key={card.title}
              onClick={() => navigate(card.to)}
            >
              <div className="role-card-icon">
                <CardIcon aria-hidden="true" style={{ color: card.color }} />
              </div>

              <div className="role-card-body">
                <h2>{card.title}</h2>
                <p>{card.description}</p>
                <span className="role-card-action">{card.action}</span>
              </div>

              <span className="role-card-arrow">
                <FaArrowRightLong aria-hidden="true" />
              </span>
            </button>
          );
        })}
      </section>

      <section className="roles-actions">
        {quickActions.map((action) => (
          <button
            type="button"
            className="action-card"
            key={action.title}
            onClick={() => navigate(action.to)}
          >
            <h3>{action.title}</h3>
            <p>{action.description}</p>
          </button>
        ))}
      </section>

      <section className="roles-summary">
        <h2>جاهز للاستخدام</h2>
        <div className="summary-tags">
          <span>{isAdmin ? "Admin active" : "Admin ready"}</span>
          <span>{isAcademic ? "Academic active" : "Academic ready"}</span>
          <span>{isStudent ? "Student active" : "Student ready"}</span>
        </div>
      </section>
    </div>
  );
}

export default RolesHubPage;
