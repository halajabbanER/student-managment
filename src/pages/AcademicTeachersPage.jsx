import { useState } from "react";
import { useNavigate } from "react-router-dom";

import useTeachers from "../hooks/useTeachers";

import "./AcademicTeachersPage.css";

function AcademicTeachersPage() {
  const navigate = useNavigate();

  const { teachers, addTeacher, deleteTeacher, assignTeacherId } =
    useTeachers();

  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    department: "",
    title: "",
    password: "",
    status: "Active",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.department ||
      !formData.title ||
      !formData.password.trim()
    ) {
      alert("Please fill in all required fields");
      return;
    }

    const result = addTeacher({
      name: formData.name.trim(),
      email: formData.email.trim(),
      department: formData.department,
      title: formData.title,
      password: formData.password.trim(),
      status: formData.status,
    });

    if (!result.success) {
      return;
    }

    alert(
      `Academic staff added successfully.\nAcademic ID: ${result.teacher.teacherId}\nPassword: ${result.teacher.password}`,
    );

    setFormData({
      name: "",
      email: "",
      department: "",
      title: "",
      password: "",
      status: "Active",
    });

    setShowForm(false);
  };

  const handleGenerateId = (id) => {
    const result = assignTeacherId(id);

    if (!result.success) {
      alert(result.message);
      return;
    }

    alert(`Academic ID generated successfully: ${result.teacherId}`);
  };

  const handleDelete = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this academic staff member?",
    );

    if (!confirmed) {
      return;
    }

    deleteTeacher(id);
  };

  return (
    <div className="academic-teachers-page">
      <div className="teachers-page-header">
        <div>
          <h1>Academic Staff</h1>

          <p>Manage academic staff records.</p>
        </div>

        <div className="teachers-header-actions">
          <button
            type="button"
            className="teachers-back-btn"
            onClick={() => navigate("/academic")}
          >
             Dashboard
          </button>

          <button
            type="button"
            className="teachers-add-btn"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? "Close Form" : "+ Add Academic"}
          </button>
        </div>
      </div>

      {showForm && (
        <form className="teacher-form" onSubmit={handleSubmit} autoComplete="off">
          <h2>Add New Academic</h2>

          <div className="teacher-form-grid">
            <div className="teacher-form-group">
              <label>Full Name</label>

              <input
                type="text"
                name="name"
                placeholder="Enter academic name"
                value={formData.name}
                onChange={handleChange}
                autoComplete="off"
              />
            </div>

            <div className="teacher-form-group">
              <label>Email</label>

              <input
                type="email"
                name="email"
                placeholder="academic@university.com"
                value={formData.email}
                onChange={handleChange}
                autoComplete="off"
              />
            </div>

            <div className="teacher-form-group">
              <label>Password</label>

              <input
                type="password"
                name="password"
                placeholder="Create academic password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="new-password"
              />
            </div>

            <div className="teacher-form-group">
              <label>Department</label>

              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
              >
                <option value="">Select Department</option>

                <option value="Computer Engineering">
                  Computer Engineering
                </option>

                <option value="Software Engineering">
                  Software Engineering
                </option>

                <option value="Electrical Engineering">
                  Electrical Engineering
                </option>

                <option value="Civil Engineering">Civil Engineering</option>
              </select>
            </div>

            <div className="teacher-form-group">
              <label>Academic Title</label>

              <select
                name="title"
                value={formData.title}
                onChange={handleChange}
              >
                <option value="">Select Title</option>

                <option value="Professor">Professor</option>

                <option value="Associate Professor">Associate Professor</option>

                <option value="Assistant Professor">Assistant Professor</option>

                <option value="Lecturer">Lecturer</option>
              </select>
            </div>

            <div className="teacher-form-group">
              <label>Status</label>

              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="Active">Active</option>

                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          <button type="submit" className="teacher-save-btn">
            Add Academic
          </button>
        </form>
      )}

      {teachers.length > 0 ? (
        <div className="teachers-table-wrapper">
          <table className="teachers-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Academic ID</th>
                <th>Email</th>
                <th>Department</th>
                <th>Title</th>
                <th>Status</th>
                <th>Account</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {teachers.map((teacher) => (
                <tr key={teacher.id}>
                  <td>
                    <strong>{teacher.name}</strong>
                  </td>

                  <td>
                    {teacher.teacherId ? (
                      <span className="teacher-id-badge">
                        {teacher.teacherId}
                      </span>
                    ) : (
                      <span className="teacher-no-id">Not assigned</span>
                    )}
                  </td>

                  <td>{teacher.email}</td>

                  <td>{teacher.department}</td>

                  <td>{teacher.title}</td>

                  <td>
                    <span
                      className={`teacher-status ${teacher.status.toLowerCase()}`}
                    >
                      {teacher.status}
                    </span>
                  </td>

                  <td>
                    <span
                      className={
                        teacher.accountCreated
                          ? "teacher-account-created"
                          : "teacher-account-pending"
                      }
                    >
                      {teacher.accountCreated ? "Created" : "Not Created"}
                    </span>
                  </td>

                  <td>
                    <div className="teacher-table-actions">
                      {!teacher.teacherId && (
                        <button
                          type="button"
                          className="teacher-generate-btn"
                          onClick={() => handleGenerateId(teacher.id)}
                        >
                          Generate ID
                        </button>
                      )}

                      <button
                        type="button"
                        className="teacher-delete-btn"
                        onClick={() => handleDelete(teacher.id)}
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
        <div className="teachers-empty">
          <h3>No academic staff found</h3>

          <p>Add your first academic staff member to get started.</p>
        </div>
      )}
    </div>
  );
}

export default AcademicTeachersPage;
