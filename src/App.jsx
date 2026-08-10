import { Routes, Route } from "react-router-dom";

import HomePage from "./pages/HomePage";
import StudentsPage from "./pages/StudentsPage";
import StudentDetailsPage from "./pages/StudentDetailsPage";
import StudentFormPage from "./pages/StudentFormPage";
import AddStudentPage from "./pages/AddStudentPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import NotFoundPage from "./pages/NotFoundPage";

import PrivateRoute from "./components/auth/PrivateRoute";

function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Private */}
      <Route
        path="/"
        element={
          <PrivateRoute>
            <HomePage />
          </PrivateRoute>
        }
      />

      <Route
        path="/students"
        element={
          <PrivateRoute>
            <StudentsPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/student/new"
        element={
          <PrivateRoute>
            <AddStudentPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/student/:id"
        element={
          <PrivateRoute>
            <StudentDetailsPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/student/edit/:id"
        element={
          <PrivateRoute>
            <StudentFormPage />
          </PrivateRoute>
        }
      />

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
