import { useNavigate } from "react-router-dom";

import useStudents from "../hooks/useStudents";

import "./AcademicStudentsPage.css";

function AcademicStudentsPage() {
  const navigate = useNavigate();

  const { students, loading, assignStudentId } = useStudents();

  const handleGenerateId = (studentId) => {
    const result = assignStudentId(studentId);

    if (!result.success) {
      alert(result.message);
      return;
    }

    alert(`Student ID generated successfully: ${result.studentId}`);
  };

  if (loading) {
    return (
      <div className="academic-students-page">
        <h2>Loading students...</h2>
      </div>
    );
  }

  return (
    <div className="academic-students-page">
      <div className="academic-students-header">
        <div>
          <h1>Students</h1>

          <p>Manage students and create Student IDs.</p>
        </div>

        <div className="academic-students-actions">
          <button
            type="button"
            className="back-btn"
            onClick={() => navigate("/academic")}
          >
            Dashboard
          </button>

          <button
            type="button"
            className="add-btn"
            onClick={() => navigate("/student/new")}
          >
            + Add Student
          </button>
        </div>
      </div>

      {students.length > 0 ? (
        <div className="academic-students-table-wrapper">
          <table className="academic-students-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Student ID</th>
                <th>Department</th>
                <th>Level</th>
                <th>Status</th>
                <th>Account</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {students.map((student) => (
                <tr key={student.id}>
                  <td>
                    <strong>{student.name}</strong>
                  </td>

                  <td>
                    {student.studentId ? (
                      <span className="student-id-badge">
                        {student.studentId}
                      </span>
                    ) : (
                      <span className="no-id">Not assigned</span>
                    )}
                  </td>

                  <td>{student.department || "-"}</td>

                  <td>{student.level || "-"}</td>

                  <td>{student.status || "-"}</td>

                  <td>
                    {student.accountCreated ? (
                      <span className="account-created">Created</span>
                    ) : (
                      <span className="account-not-created">Not Created</span>
                    )}
                  </td>

                  <td>
                    <div className="academic-table-actions">
                      {!student.studentId && (
                        <button
                          type="button"
                          className="generate-id-btn"
                          onClick={() => handleGenerateId(student.id)}
                        >
                          Generate ID
                        </button>
                      )}

                      <button
                        type="button"
                        className="view-student-btn"
                        onClick={() => navigate(`/student/${student.id}`)}
                      >
                        View
                      </button>

                      <button
                        type="button"
                        className="edit-student-btn"
                        onClick={() => navigate(`/student/edit/${student.id}`)}
                      >
                        Edit
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="academic-empty">
          <h3>No students found</h3>

          <p>Add your first student to get started.</p>
        </div>
      )}
    </div>
  );
}

export default AcademicStudentsPage;
