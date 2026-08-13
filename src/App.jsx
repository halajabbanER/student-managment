import { Routes, Route } from "react-router-dom";

/* Authentication */
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AdminLoginPage from "./components/auth/AdminLoginPage";

/* Admin Pages */
import HomePage from "./pages/HomePage";
import StudentsPage from "./pages/StudentsPage";
import AddStudentPage from "./pages/AddStudentPage";
import StudentDetailsPage from "./pages/StudentDetailsPage";
import StudentFormPage from "./pages/StudentFormPage";

/* Academic */
import AcademicDashboardPage from "./pages/AcademicDashboardPage";

/* Student */
import StudentPortalPage from "./pages/StudentPortalPage";

/* Other */
import NotFoundPage from "./pages/NotFoundPage";

import MainLayout from "./components/common/MainLayout";
import RoleRoute from "./components/auth/RoleRoute";
import AcademicStudentsPage from "./pages/AcademicStudentsPage";
function App() {
  return (
    <Routes>
      {/* =========================
          Public Pages
      ========================= */}

      <Route path="/login" element={<LoginPage />} />

      <Route path="/register" element={<RegisterPage />} />

      <Route path="/admin-login" element={<AdminLoginPage />} />

      {/* =========================
          Student
      ========================= */}

      <Route
        path="/student/new"
        element={
          <RoleRoute allowedRoles={["admin", "academic"]}>
            <AddStudentPage />
          </RoleRoute>
        }
      />

      <Route
        path="/student/:id"
        element={
          <RoleRoute allowedRoles={["admin", "academic"]}>
            <StudentDetailsPage />
          </RoleRoute>
        }
      />

      <Route
        path="/student/edit/:id"
        element={
          <RoleRoute allowedRoles={["admin", "academic"]}>
            <StudentFormPage />
          </RoleRoute>
        }
      />

      {/* =========================
          Academic
      ========================= */}

      <Route
        path="/academic"
        element={
          <RoleRoute allowedRoles={["academic"]}>
            <AcademicDashboardPage />
          </RoleRoute>
        }
      />
      <Route
        path="/academic/students"
        element={
          <RoleRoute allowedRoles={["academic"]}>
            <AcademicStudentsPage />
          </RoleRoute>
        }
      />
      {/* =========================
          Admin
      ========================= */}

      <Route
        element={
          <RoleRoute allowedRoles={["admin"]}>
            <MainLayout />
          </RoleRoute>
        }
      >
        <Route path="/" element={<HomePage />} />

        <Route path="/students" element={<StudentsPage />} />

        <Route path="/student/new" element={<AddStudentPage />} />

        <Route path="/student/:id" element={<StudentDetailsPage />} />

        <Route path="/student/edit/:id" element={<StudentFormPage />} />
      </Route>

      {/* =========================
          404
      ========================= */}

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
