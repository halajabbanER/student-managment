import { useNavigate, useParams } from "react-router-dom";

import useAuth from "../hooks/useAuth";
import useStudents from "../hooks/useStudents";

import "./StudentDetailsPage.css";

function StudentDetailsPage() {
  const { id } = useParams();

  const navigate = useNavigate();
  const { user } = useAuth();
  const { getStudent, deleteStudent } = useStudents();

  const student = getStudent(id);

  if (!student) {
    return (
      <div className="student-details-page">
        <h2>Student not found</h2>

        <button
          type="button"
          onClick={() => {
            if (user?.role === "academic") {
              navigate("/academic/students");
              return;
            }

            
            navigate("/students");
          }}
        >
          Back to Students
        </button>
      </div>
    );
  }

  const statusClass = (student.status || "").toLowerCase();

  const handleBack = () => {
    if (user?.role === "academic") {
      navigate("/academic/students");
      return;
    }

    if (user?.role === "admin") {
      navigate("/students");
      return;
    }

    navigate("/");
  };

  const handleDeleteStudent = () => {
    const confirmDelete = window.confirm(
      `Delete ${student.name} from the system? This will remove the student, enrollments, and grades.`,
    );

    if (!confirmDelete) {
      return;
    }

    const result = deleteStudent(student.id);

    if (!result.success) {
      alert(result.message || "Failed to delete student.");
      return;
    }

    if (user?.role === "academic") {
      navigate("/academic/students");
      return;
    }

    navigate("/students");
  };

  return (
    <div className="student-details-page">
      <div className="student-details-page-header">
        <div>
          <h1>Student Details</h1>
          <p>View and manage student academic information.</p>
        </div>

        <button
          type="button"
          className="student-document-btn"
          onClick={() => navigate(`/student/${student.id}/document`)}
        >
          Student Certificate
        </button>
      </div>

      <div className="student-details-card">
        <div className="student-details-name">
          <div>
            <h2>{student.name}</h2>

            {student.studentId && (
              <span className="details-student-id">
                Student ID: {student.studentId}
              </span>
            )}
          </div>
        </div>

        <div className="student-info">
          <strong>System ID:</strong>
          <span>{student.id}</span>
        </div>

        <div className="student-info">
          <strong>Student ID:</strong>
          <span>{student.studentId || "-"}</span>
        </div>

        <div className="student-info">
          <strong>Email:</strong>
          <span>{student.email || "-"}</span>
        </div>

        <div className="student-info">
          <strong>Department:</strong>
          <span>{student.department || "-"}</span>
        </div>

        <div className="student-info">
          <strong>Academic Level:</strong>
          <span>{student.level || "-"}</span>
        </div>

        <div className="student-info">
          <strong>Status:</strong>
          <span className={`student-status ${statusClass}`}>
            {student.status || "-"}
          </span>
        </div>

        <div className="details-buttons">
          <button
            type="button"
            className="student-document-btn"
            onClick={() => navigate(`/student/${student.id}/document`)}
          >
            Student Certificate
          </button>

          <button
            type="button"
            className="edit-student-btn"
            onClick={() => navigate(`/student/edit/${student.id}`)}
          >
            Edit Student
          </button>

          <button
            type="button"
            className="delete-student-btn"
            onClick={handleDeleteStudent}
          >
            Delete Student
          </button>

          <button
            type="button"
            className="back-students-btn"
            onClick={handleBack}
          >
            Back to Students
          </button>
        </div>
      </div>
    </div>
  );
}

export default StudentDetailsPage;
