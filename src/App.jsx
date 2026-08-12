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
import MainLayout from "./components/common/MainLayout";

function App() {
  return (
    <Routes>
      {/* Public Routes */}

      <Route path="/login" element={<LoginPage />} />

      <Route path="/register" element={<RegisterPage />} />

      {/* Protected Routes */}

      <Route
        element={
          <PrivateRoute>
            <MainLayout />
          </PrivateRoute>
        }
      >
        <Route path="/" element={<HomePage />} />

        <Route path="/students" element={<StudentsPage />} />

        <Route path="/student/new" element={<AddStudentPage />} />

        <Route path="/student/:id" element={<StudentDetailsPage />} />

        <Route path="/student/edit/:id" element={<StudentFormPage />} />
      </Route>
<Route
  path="*"
  element={<NotFoundPage />}
/>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
