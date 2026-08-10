import { useNavigate, useParams } from "react-router-dom";
import useStudents from "../hooks/useStudents";
import "./StudentDetailsPage.css";

function StudentDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { getStudent } = useStudents();

  const student = getStudent(id);

  if (!student) {
    return (
      <div className="student-details-page">
        <h2>Student not found</h2>

        <button onClick={() => navigate("/students")}>Back to Students</button>
      </div>
    );
  }

  return (
    <div className="student-details-page">
      <h1>Student Details</h1>

      <div className="student-details-card">
        <h2>{student.name}</h2>

        <div className="student-info">
          <strong>ID:</strong>
          <span>{student.id}</span>
        </div>

        <div className="student-info">
          <strong>Email:</strong>
          <span>{student.email}</span>
        </div>

        <div className="student-info">
          <strong>Department:</strong>
          <span>{student.department}</span>
        </div>

        <div className="student-info">
          <strong>Academic Level:</strong>
          <span>{student.level}</span>
        </div>

        <div className="student-info">
          <strong>Status:</strong>

          <span className="student-status">{student.status}</span>
        </div>

        <div className="details-buttons">
          <button
            className="edit-student-btn"
            onClick={() => navigate(`/student/edit/${student.id}`)}
          >
            Edit Student
          </button>

          <button
            className="back-students-btn"
            onClick={() => navigate("/students")}
          >
            ← Back to Students
          </button>
        </div>
      </div>
    </div>
  );
}

export default StudentDetailsPage;
