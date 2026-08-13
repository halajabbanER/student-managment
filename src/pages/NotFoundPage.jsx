import { useNavigate } from "react-router-dom";

import useAuth from "../hooks/useAuth";

import "./NotFoundPage.css";

function NotFoundPage() {
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin, isAcademic, isStudent } = useAuth();

  const handleBack = () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (isAdmin) {
      navigate("/");
      return;
    }

    if (isAcademic) {
      navigate("/academic");
      return;
    }

    if (isStudent) {
      navigate("/student-portal");
      return;
    }

    navigate("/login");
  };

  return (
    <div className="not-found-page">
      <div className="not-found-card">
        <h1>404</h1>

        <h2>Page Not Found</h2>

        <p>The page you are looking for does not exist.</p>

        <button type="button" onClick={handleBack}>
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}

export default NotFoundPage;
