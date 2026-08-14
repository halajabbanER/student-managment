import { Navigate } from "react-router-dom";

import useAuth from "../../hooks/useAuth";

function RoleRoute({ allowedRoles, children }) {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    if (user?.role === "admin") {
      return <Navigate to="/" replace />;
    }

    if (user?.role === "academic") {
      return <Navigate to="/academic" replace />;
    }

    if (user?.role === "teacher") {
      return <Navigate to="/academic" replace />;
    }

    return <Navigate to="/login" replace />;
  }

  return children;
}

export default RoleRoute;
