import { useNavigate } from "react-router-dom";

function StudentCard({ student, onDelete }) {
  const navigate = useNavigate();

  return (
    <div className="student-card">
      <h2>{student.name}</h2>

      <p>
        <strong>Department:</strong> {student.department}
      </p>

      <p>
        <strong>Level:</strong> {student.level}
      </p>

      <p>
        <strong>Status:</strong> {student.status}
      </p>

      <div className="student-actions">
        {/* View */}
        <button
          className="view-btn"
          onClick={() => navigate(`/student/${student.id}`)}
        >
          View
        </button>

        {/* Edit */}
        <button
          className="edit-btn"
          onClick={() => navigate(`/student/edit/${student.id}`)}
        >
          Edit
        </button>

        {/* Delete */}
        <button className="delete-btn" onClick={() => onDelete(student.id)}>
          Delete
        </button>
      </div>
    </div>
  );
}

export default StudentCard;
