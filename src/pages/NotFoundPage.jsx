import { useNavigate } from "react-router-dom";
import "./NotFoundPage.css";

function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="not-found-page">
      <div className="not-found-card">
        <h1>404</h1>

        <h2>Page Not Found</h2>

        <p>The page you are looking for does not exist.</p>

        <button onClick={() => navigate("/")}>Back to Dashboard</button>
      </div>
    </div>
  );
}

export default NotFoundPage;
