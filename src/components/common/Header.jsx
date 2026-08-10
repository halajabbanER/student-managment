import { Link, useNavigate } from "react-router-dom";
import "./Header.css";

function Header() {
  const navigate = useNavigate();

  const currentUser = JSON.parse(localStorage.getItem("currentUser")) || null;

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    navigate("/login");
  };

  return (
    <header className="main-header">
    
      <Link to="/" className="header-logo">
        🎓 Student Management
      </Link>

  
      <nav className="header-nav">
        <Link to="/students">Students</Link>

        <Link to="/home"> Dahboard</Link>
      </nav>


      <div className="header-user">
        {currentUser && (
          <>
            <span>
              Welcome, <strong>{currentUser.name}</strong>
            </span>

            <button onClick={handleLogout}>Logout</button>
          </>
        )}
      </div>
    </header>
  );
}

export default Header;
