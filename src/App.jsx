import { Routes, Route } from "react-router-dom";

import HomePage from "./pages/HomePage";
import StudentsPage from "./pages/StudentsPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import NotFoundPage from "./pages/NotFoundPage";
import StudentDetailsPage from "./pages/StudentDetailsPage";
import StudentFormPage from "./pages/StudentFormPage";
import AddStudentPage from "./pages/AddStudentPage";
function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/students" element={<StudentsPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/student/:id" element={<StudentDetailsPage />} />
      <Route path="/student/edit/:id" element={<StudentFormPage />} />
      <Route path="*" element={<NotFoundPage />} />
      <Route path="/student/new" element={<AddStudentPage />} />
    </Routes>
  );
}

export default App;
