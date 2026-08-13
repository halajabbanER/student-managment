import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import useStudents from "../hooks/useStudents";
import "./StudentDetailsPage.css";

function StudentDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getStudent, addCourse, updateCourseGrade, deleteCourse } =
    useStudents();

  const [courseName, setCourseName] = useState("");
  const [grade, setGrade] = useState("");

  const student = getStudent(id);

  if (!student) {
    return (
      <div className="student-details-page">
        <h2>Student not found</h2>

        <button type="button" onClick={() => navigate("/students")}>
          Back to Students
        </button>
      </div>
    );
  }

  const courses = student.courses || [];
  const statusClass = (student.status || "").toLowerCase();
  const average =
    courses.length > 0
      ? (
          courses.reduce((total, course) => total + Number(course.grade), 0) /
          courses.length
        ).toFixed(2)
      : "0.00";

  const handleAddCourse = () => {
    if (!courseName.trim()) {
      alert("Course name is required");
      return;
    }

    if (grade === "" || Number(grade) < 0 || Number(grade) > 100) {
      alert("Grade must be between 0 and 100");
      return;
    }

    addCourse(student.id, {
      name: courseName.trim(),
      grade: Number(grade),
    });

    setCourseName("");
    setGrade("");
  };

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
          <span className={`student-status ${statusClass}`}>
            {student.status}
          </span>
        </div>

        <div className="student-info">
          <strong>Average:</strong>
          <span className="student-average">{average} / 100</span>
        </div>

        <div className="courses-section">
          <div className="courses-header">
            <div>
              <h2>Courses</h2>
              <p>Manage student courses and grades.</p>
            </div>

            <span className="average-badge">Average: {average} / 100</span>
          </div>

          <div className="add-course-form">
            <input
              type="text"
              placeholder="Course name"
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
            />

            <input
              type="number"
              placeholder="Grade"
              min="0"
              max="100"
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
            />

            <button onClick={handleAddCourse}>+ Add Course</button>
          </div>

          {student.courses && student.courses.length > 0 ? (
            <div className="courses-table-wrapper">
              <table className="courses-table">
                <thead>
                  <tr>
                    <th>Course</th>
                    <th>Grade</th>
                    <th>Result</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {student.courses.map((course) => (
                    <tr key={course.id}>
                      <td>{course.name}</td>

                      <td>
                        <span className="grade-badge">{course.grade}</span>
                      </td>

                      <td>
                        <span
                          className={
                            Number(course.grade) >= 50
                              ? "result passed"
                              : "result failed"
                          }
                        >
                          {Number(course.grade) >= 50 ? "Passed" : "Failed"}
                        </span>
                      </td>

                      <td>
                        <div className="course-actions">
                          <button
                            className="edit-grade-btn"
                            onClick={() => {
                              const newGrade = prompt(
                                "Enter new grade:",
                                course.grade,
                              );

                              if (
                                newGrade !== null &&
                                newGrade !== "" &&
                                Number(newGrade) >= 0 &&
                                Number(newGrade) <= 100
                              ) {
                                updateCourseGrade(
                                  student.id,
                                  course.id,
                                  newGrade,
                                );
                              }
                            }}
                          >
                            Edit
                          </button>

                          <button
                            className="delete-course-btn"
                            onClick={() => {
                              const confirmDelete = window.confirm(
                                "Are you sure you want to delete this course?",
                              );

                              if (confirmDelete) {
                                deleteCourse(student.id, course.id);
                              }
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="no-courses">
              <p>No courses added yet.</p>
            </div>
          )}
        </div>

        <div className="details-buttons">
          <button
            type="button"
            className="edit-student-btn"
            onClick={() => navigate(`/student/edit/${student.id}`)}
          >
            Edit Student
            
          </button>

          <button
            type="button"
            className="back-students-btn"
            onClick={() => navigate("/students")}
          >
            Back to Students
          </button>
        </div>
      </div>
    </div>
  );
}

export default StudentDetailsPage;
