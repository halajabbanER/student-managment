import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useStudents from "../hooks/useStudents";
import "./StudentFormPage.css";


function StudentFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { getStudent, updateStudent } = useStudents();

  const currentStudent = getStudent(id);

  const [formData, setFormData] = useState({
    name: currentStudent?.name || "",
    email: currentStudent?.email || "",
    department: currentStudent?.department || "",
    level: currentStudent?.level || "",
    status: currentStudent?.status || "",
  });

  if (!currentStudent) {
    return (
      <div>
        <h2>Student not found</h2>

        <button onClick={() => navigate("/students")}>Back to Students</button>
      </div>
    );
  }

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    updateStudent(Number(id), formData);

    alert("Student updated successfully!");

    navigate("/students");
  };

  return (
    <div className="student-form-page">
      <h1>Edit Student</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Full Name</label>

          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Email</label>

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Department</label>

          <input
            type="text"
            name="department"
            value={formData.department}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Academic Level</label>

          <select name="level" value={formData.level} onChange={handleChange}>
            <option value="">Select Level</option>
            <option value="1st Year">1st Year</option>
            <option value="2nd Year">2nd Year</option>
            <option value="3rd Year">3rd Year</option>
            <option value="4th Year">4th Year</option>
          </select>
        </div>

        <div>
          <label>Status</label>

          <select name="status" value={formData.status} onChange={handleChange}>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Graduated">Graduated</option>
          </select>
        </div>

        <button type="submit">Save Changes</button>

        <button type="button" onClick={() => navigate("/students")}>
          Cancel
        </button>
      </form>
    </div>
  );
}

export default StudentFormPage;
