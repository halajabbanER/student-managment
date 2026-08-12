import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import "./Header.css";

function Header() {
  const navigate = useNavigate();

  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();

    navigate("/login");
  };

  return (
    <header className="main-header">
      <Link to="/" className="header-logo">
        🎓 Student Management
      </Link>

      <nav className="header-nav">
        <Link to="/home">Dashboard</Link>
        <Link to="/students">Students</Link>
      </nav>

      <div className="header-user">
        {user && (
          <>
            <span>
              Welcome, <strong>{user.name}</strong>
            </span>

            <button onClick={handleLogout}>Logout</button>
          </>
        )}
      </div>
    </header>
  );
}

export default Header;
