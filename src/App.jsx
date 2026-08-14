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
import AcademicExamsPage from "./pages/AcademicExamsPage";
import CourseEnrollmentPage from "./pages/CourseEnrollmentPage";

/* Student */
import StudentPortalPage from "./pages/StudentPortalPage";
import StudentDocumentPage from "./pages/StudentDocumentPage";
/* Teacher */
import TeacherPortalPage from "./pages/TeacherPortalPage";
import TeacherCourseStudentsPage from "./pages/TeacherCourseStudentsPage";
import TeacherExamsPage from "./pages/TeacherExamsPage";
import AcademicGradesPage from "./pages/AcademicGradesPage";
import AcademicSchedulesPage from "./pages/AcademicSchedulesPage";
/* Other */
import NotFoundPage from "./pages/NotFoundPage";

/* Components */
import MainLayout from "./components/common/MainLayout";
import Footer from "./components/common/Footer";
import RoleRoute from "./components/auth/RoleRoute";

function App() {
  return (
    <div className="app-shell">
      <div className="app-content">
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
          <Route
            path="/student/:id/document"
            element={
              <RoleRoute allowedRoles={["admin", "academic", "student"]}>
                <StudentDocumentPage />
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

          <Route
            path="/teacher/course/:id/students"
            element={
              <RoleRoute allowedRoles={["teacher"]}>
                <TeacherCourseStudentsPage />
              </RoleRoute>
            }
          />

          <Route
            path="/teacher/course/:id/grades"
            element={
              <RoleRoute allowedRoles={["teacher"]}>
                <TeacherCourseStudentsPage />
              </RoleRoute>
            }
          />
          <Route
            path="/teacher/course/:id/exams"
            element={
              <RoleRoute allowedRoles={["teacher"]}>
                <TeacherExamsPage />
              </RoleRoute>
            }
          />
          <Route
            path="/academic/grades"
            element={
              <RoleRoute allowedRoles={["admin", "academic"]}>
                <AcademicGradesPage />
              </RoleRoute>
            }
          />

          <Route
            path="/academic/schedules"
            element={
              <RoleRoute allowedRoles={["admin", "academic"]}>
                <AcademicSchedulesPage />
              </RoleRoute>
            }
          />

          {/* ACADEMIC */}

          <Route
            path="/academic"
            element={
              <RoleRoute allowedRoles={["admin", "academic"]}>
                <AcademicDashboardPage />
              </RoleRoute>
            }
          />

          <Route
            path="/academic/students"
            element={
              <RoleRoute allowedRoles={["admin", "academic"]}>
                <AcademicStudentsPage />
              </RoleRoute>
            }
          />

          <Route
            path="/academic/teachers"
            element={
              <RoleRoute allowedRoles={["admin", "academic"]}>
                <AcademicTeachersPage />
              </RoleRoute>
            }
          />

          <Route
            path="/academic/departments"
            element={
              <RoleRoute allowedRoles={["admin", "academic"]}>
                <AcademicDepartmentsPage />
              </RoleRoute>
            }
          />

          <Route
            path="/academic/courses"
            element={
              <RoleRoute allowedRoles={["admin", "academic"]}>
                <AcademicCoursesPage />
              </RoleRoute>
            }
          />

          <Route
            path="/academic/courses/:id/enrollment"
            element={
              <RoleRoute allowedRoles={["admin", "academic"]}>
                <CourseEnrollmentPage />
              </RoleRoute>
            }
          />

          <Route
            path="/academic/exams"
            element={
              <RoleRoute allowedRoles={["admin", "academic"]}>
                <AcademicExamsPage />
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
      </div>

      <Footer />
    </div>
  );
}

export default App;
