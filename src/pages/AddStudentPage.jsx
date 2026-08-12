import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useStudents from "../hooks/useStudents";
import "./StudentFormPage.css";

function AddStudentPage() {
  const navigate = useNavigate();

  const { addStudent, loading } = useStudents();

  // Student form data
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    department: "",
    level: "",
    status: "Active",
  });

  // Validation errors
  const [errors, setErrors] = useState({});

  // Change input values
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    // Remove error when user starts typing
    setErrors({
      ...errors,
      [name]: "",
    });
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};

    // Email Regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Full name is required";
    } else if (formData.name.trim().length < 3) {
      newErrors.name = "Name must be at least 3 characters";
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    // Department validation
    if (!formData.department.trim()) {
      newErrors.department = "Department is required";
    }

    // Academic level validation
    if (!formData.level) {
      newErrors.level = "Academic level is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // Submit form
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Stop if validation fails
    if (!validateForm()) {
      return;
    }

    await addStudent(formData);

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

          <select name="level" value={formData.level} onChange={handleChange}>
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

          <select name="status" value={formData.status} onChange={handleChange}>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Graduated">Graduated</option>
          </select>
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
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddStudentPage;
