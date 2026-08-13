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

/* Academic Pages */
import AcademicDashboardPage from "./pages/AcademicDashboardPage";
import AcademicStudentsPage from "./pages/AcademicStudentsPage";
import AcademicTeachersPage from "./pages/AcademicTeachersPage";

/* Student */
import StudentPortalPage from "./pages/StudentPortalPage";

/* Other */
import NotFoundPage from "./pages/NotFoundPage";
import RolesHubPage from "./pages/RolesHubPage";

/* Components */
import MainLayout from "./components/common/MainLayout";
import RoleRoute from "./components/auth/RoleRoute";

function App() {
  return (
    <Routes>
      {/* =========================
          Public Routes
      ========================= */}

      <Route path="/login" element={<LoginPage />} />

      <Route path="/register" element={<RegisterPage />} />

      <Route path="/admin-login" element={<AdminLoginPage />} />

      <Route path="/roles" element={<RolesHubPage />} />

      {/* =========================
          Student Portal
      ========================= */}

      <Route
        path="/student-portal"
        element={
          <RoleRoute allowedRoles={["student"]}>
            <StudentPortalPage />
          </RoleRoute>
        }
      />

      {/* =========================
          Shared Student Management
          Admin + Academic
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
          Academic Routes
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

      <Route
        path="/academic/teachers"
        element={
          <RoleRoute allowedRoles={["academic"]}>
            <AcademicTeachersPage />
          </RoleRoute>
        }
      />

      {/* =========================
          Admin Routes
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
      </Route>

      {/* =========================
          404
      ========================= */}

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
