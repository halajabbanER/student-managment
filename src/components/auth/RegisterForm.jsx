import { useState } from "react";
import { useNavigate } from "react-router-dom";

import useAuth from "../../hooks/useAuth";
import useForm from "../../hooks/useForm";

import "./Auth.css";

function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const { values, handleChange, resetForm } = useForm({
    name: "",
    studentId: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

    if (!values.name.trim()) {
      newErrors.name = "Full name is required";
    } else if (values.name.trim().length < 3) {
      newErrors.name = "Name must be at least 3 characters";
    }

    if (!values.studentId.trim()) {
      newErrors.studentId = "Student ID is required";
    }

    if (!values.password) {
      newErrors.password = "Password is required";
    } else if (!passwordRegex.test(values.password)) {
      newErrors.password =
        "Password must contain at least 8 characters, uppercase, lowercase and a number";
    }

    if (!values.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (values.password !== values.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (event) => {
    handleChange(event);

    const { name } = event.target;

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
      general: "",
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    const result = register({
      name: values.name.trim(),

      studentId: Number(values.studentId),

      password: values.password,

      role: "student",
    });

    if (!result.success) {
      setErrors({
        general: result.message,
      });

      return;
    }

    alert("Student account created successfully!");

    resetForm();

    navigate("/login");
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Create Student Account</h1>

        <p className="auth-subtitle">Register using your Student ID</p>

        {errors.general && <p className="login-error">{errors.general}</p>}

        <form onSubmit={handleSubmit} autoComplete="off">
          <div className="form-group">
            <label>Full Name</label>

            <input
              type="text"
              name="name"
              placeholder="Enter your full name"
              value={values.name}
              onChange={handleInputChange}
            />

            {errors.name && <p className="error-message">{errors.name}</p>}
          </div>

          <div className="form-group">
            <label>Student ID</label>

            <input
              type="number"
              name="studentId"
              placeholder="Enter your Student ID"
              value={values.studentId}
              onChange={handleInputChange}
              autoComplete="off"
            />

            {errors.studentId && (
              <p className="error-message">{errors.studentId}</p>
            )}
          </div>

          <div className="form-group">
            <label>Password</label>

            <input
              type="password"
              name="password"
              placeholder="Enter password"
              value={values.password}
              onChange={handleInputChange}
              autoComplete="new-password"
            />

            {errors.password && (
              <p className="error-message">{errors.password}</p>
            )}
          </div>

          <div className="form-group">
            <label>Confirm Password</label>

            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm password"
              value={values.confirmPassword}
              onChange={handleInputChange}
              autoComplete="new-password"
            />

            {errors.confirmPassword && (
              <p className="error-message">{errors.confirmPassword}</p>
            )}
          </div>

          <button type="submit" className="auth-btn">
            Register
          </button>
        </form>

        <p className="auth-link">
          Already have an account?{" "}
          <span onClick={() => navigate("/login")}>Login</span>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
