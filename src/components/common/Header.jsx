import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import useAuth from "../../hooks/useAuth";

import "./Header.css";

function Header() {
  const navigate = useNavigate();

  const { user, logout } = useAuth();

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [darkMode]);

  const toggleTheme = () => {
    const newDarkMode = !darkMode;

    setDarkMode(newDarkMode);

    localStorage.setItem("theme", newDarkMode ? "dark" : "light");
  };

  const handleLogout = () => {
    logout();

    navigate("/login", {
      replace: true,
    });
  };

  return (
    <header className="main-header">
      <Link to="/" className="header-logo">
        🎓 Student Management
      </Link>

      <div className="header-user">
        {user && (
          <span>
            Welcome, <strong>{user.name}</strong>
          </span>
        )}

        <button
          className="theme-btn"
          onClick={toggleTheme}
          title={darkMode ? "Light Mode" : "Dark Mode"}
        >
          {darkMode ? "☀️" : "🌙"}
        </button>

        {user && (
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        )}
      </div>
    </header>
  );
}

export default Header;
