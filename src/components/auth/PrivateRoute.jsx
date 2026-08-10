import { Navigate } from "react-router-dom";

function PrivateRoute({ children }) {
  const currentUser = localStorage.getItem("currentUser");

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default PrivateRoute;
