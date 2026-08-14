import { Routes, Route } from "react-router-dom";

/* Authentication */
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AcademicRegisterPage from "./pages/AcademicRegisterPage";
import TeacherRegisterPage from "./pages/TeacherRegisterPage";

import AdminLoginPage from "./components/auth/AdminLoginPage";

/* Admin */
import HomePage from "./pages/HomePage";
import StudentsPage from "./pages/StudentsPage";
import AddStudentPage from "./pages/AddStudentPage";
import StudentDetailsPage from "./pages/StudentDetailsPage";
import StudentFormPage from "./pages/StudentFormPage";

/* Academic */
import AcademicDashboardPage from "./pages/AcademicDashboardPage";
import AcademicStudentsPage from "./pages/AcademicStudentsPage";
import AcademicTeachersPage from "./pages/AcademicTeachersPage";
import AcademicDepartmentsPage from "./pages/AcademicDepartmentsPage";
import AcademicCoursesPage from "./pages/AcademicCoursesPage";
import CourseEnrollmentPage from "./pages/CourseEnrollmentPage";

/* Student */
import StudentPortalPage from "./pages/StudentPortalPage";

/* Teacher */
import TeacherPortalPage from "./pages/TeacherPortalPage";

/* Other */
import NotFoundPage from "./pages/NotFoundPage";

/* Components */
import MainLayout from "./components/common/MainLayout";
import RoleRoute from "./components/auth/RoleRoute";

function App() {
  return (
    <Routes>
      {/* PUBLIC */}

      <Route path="/login" element={<LoginPage />} />

      <Route path="/register" element={<RegisterPage />} />

      <Route path="/academic-register" element={<AcademicRegisterPage />} />

      <Route path="/teacher-register" element={<TeacherRegisterPage />} />

      <Route path="/admin-login" element={<AdminLoginPage />} />

      {/* STUDENT */}

      <Route
        path="/student-portal"
        element={
          <RoleRoute allowedRoles={["student"]}>
            <StudentPortalPage />
          </RoleRoute>
        }
      />

      {/* TEACHER */}

      <Route
        path="/teacher-portal"
        element={
          <RoleRoute allowedRoles={["teacher"]}>
            <TeacherPortalPage />
          </RoleRoute>
        }
      />

      {/* ACADEMIC */}

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

      <Route
        path="/academic/departments"
        element={
          <RoleRoute allowedRoles={["academic"]}>
            <AcademicDepartmentsPage />
          </RoleRoute>
        }
      />

      <Route
        path="/academic/courses"
        element={
          <RoleRoute allowedRoles={["academic"]}>
            <AcademicCoursesPage />
          </RoleRoute>
        }
      />

      <Route
        path="/academic/courses/:id/enrollment"
        element={
          <RoleRoute allowedRoles={["academic"]}>
            <CourseEnrollmentPage />
          </RoleRoute>
        }
      />

      {/* ADMIN + ACADEMIC */}

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

      {/* ADMIN */}

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

      {/* 404 */}

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
