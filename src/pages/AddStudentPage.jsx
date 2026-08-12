import { useState } from "react";
import { useNavigate } from "react-router-dom";

import useStudents from "../hooks/useStudents";

import "./StudentFormPage.css";

function AddStudentPage() {
  const navigate = useNavigate();

  const { addStudent, loading } = useStudents();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    department: "",
    level: "",
    status: "Active",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.name.trim()) {
      newErrors.name = "Full name is required";
    } else if (formData.name.trim().length < 3) {
      newErrors.name = "Name must be at least 3 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.department) {
      newErrors.department = "Department is required";
    }

    if (!formData.level) {
      newErrors.level = "Academic level is required";
    }

    if (!formData.status) {
      newErrors.status = "Status is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    const result = await addStudent({
      name: formData.name.trim(),
      email: formData.email.trim(),
      department: formData.department,
      level: formData.level,
      status: formData.status,
    });

    if (!result.success) {
      alert(result.message);
      return;
    }

    alert("Student added successfully!");

    navigate("/students");
  };

  return (
    <div className="student-form-page">
      <h1>Add New Student</h1>

      <form onSubmit={handleSubmit}>
        {/* Full Name */}
        <div className="form-group">
          <label>Full Name</label>

          <input
            type="text"
            name="name"
            placeholder="Enter full name"
            value={formData.name}
            onChange={handleChange}
            disabled={loading}
          />

          {errors.name && <p className="error-message">{errors.name}</p>}
        </div>

        {/* Email */}
        <div className="form-group">
          <label>Email</label>

          <input
            type="email"
            name="email"
            placeholder="example@gmail.com"
            value={formData.email}
            onChange={handleChange}
            disabled={loading}
          />

          {errors.email && <p className="error-message">{errors.email}</p>}
        </div>

        {/* Department */}
        <div className="form-group">
          <label>Department</label>

          <select
            name="department"
            value={formData.department}
            onChange={handleChange}
            disabled={loading}
          >
            <option value="">Select Department</option>

            <option value="Computer Engineering">Computer Engineering</option>

            <option value="Software Engineering">Software Engineering</option>

            <option value="Electrical Engineering">
              Electrical Engineering
            </option>

            <option value="Civil Engineering">Civil Engineering</option>
          </select>

          {errors.department && (
            <p className="error-message">{errors.department}</p>
          )}
        </div>

        {/* Academic Level */}
        <div className="form-group">
          <label>Academic Level</label>

          <select
            name="level"
            value={formData.level}
            onChange={handleChange}
            disabled={loading}
          >
            <option value="">Select Level</option>

            <option value="1st Year">1st Year</option>

            <option value="2nd Year">2nd Year</option>

            <option value="3rd Year">3rd Year</option>

            <option value="4th Year">4th Year</option>
          </select>

          {errors.level && <p className="error-message">{errors.level}</p>}
        </div>

        {/* Status */}
        <div className="form-group">
          <label>Status</label>

          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            disabled={loading}
          >
            <option value="Active">Active</option>

            <option value="Inactive">Inactive</option>

            <option value="Graduated">Graduated</option>
          </select>

          {errors.status && <p className="error-message">{errors.status}</p>}
        </div>

        {/* Buttons */}
        <div className="form-buttons">
          <button type="submit" className="save-btn" disabled={loading}>
            {loading ? "Saving..." : "Add Student"}
          </button>

          <button
            type="button"
            className="cancel-btn"
            onClick={() => navigate("/students")}
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddStudentPage;
