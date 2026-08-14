import { useState } from "react";
import { useNavigate } from "react-router-dom";

import useAuth from "../../hooks/useAuth";
import useForm from "../../hooks/useForm";

import "./Auth.css";

function LoginPage() {
  const navigate = useNavigate();

  const { login } = useAuth();

  const { values, handleChange, resetForm } = useForm({
    identifier: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (event) => {
    handleChange(event);

    const { name } = event.target;

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
      general: "",
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!values.identifier.trim()) {
      newErrors.identifier = "University ID or Academic Email is required";
    }

    if (!values.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    const result = login(values.identifier.trim(), values.password);

    if (!result.success) {
      setErrors({
        general: result.message,
      });

      return;
    }

    resetForm();

    // Student
    if (result.user.role === "student") {
      navigate("/student-portal", {
        replace: true,
      });

      return;
    }

    // Teacher
    if (result.user.role === "teacher") {
      navigate("/teacher-portal", {
        replace: true,
      });

      return;
    }

    // Academic
    if (result.user.role === "academic") {
      navigate("/academic", {
        replace: true,
      });

      return;
    }

    // Admin
    if (result.user.role === "admin") {
      navigate("/", {
        replace: true,
      });

      return;
    }

    setErrors({
      general: "Unknown account type",
    });
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>University Login</h1>

        <p className="auth-subtitle">
          Students and teachers use their university ID. Academic staff use
          email.
        </p>

        <p className="auth-subtitle" style={{ marginTop: "-0.5rem" }}>
          Demo academic login: <strong>academic@hala.com</strong> /{" "}
          <strong>Academic123</strong>
        </p>

        <p className="auth-subtitle" style={{ marginTop: "-0.75rem" }}>
          Demo student login: <strong>20032003</strong> /{" "}
          <strong>Student123</strong>
        </p>

        {errors.general && <p className="login-error">{errors.general}</p>}

        <form onSubmit={handleSubmit} autoComplete="off">
          <div className="form-group">
            <label>Student ID / Teacher ID / Academic Email</label>

            <input
              type="text"
              name="identifier"
              placeholder="Enter university ID or academic email"
              value={values.identifier}
              onChange={handleInputChange}
              autoComplete="off"
            />

            {errors.identifier && (
              <p className="error-message">{errors.identifier}</p>
            )}
          </div>

          <div className="form-group">
            <label>Password</label>

            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={values.password}
              onChange={handleInputChange}
              autoComplete="current-password"
            />

            {errors.password && (
              <p className="error-message">{errors.password}</p>
            )}
          </div>

          <button type="submit" className="auth-btn">
            Login
          </button>

          <p className="auth-link">
            Student without an account?{" "}
            <span onClick={() => navigate("/register")}>Register</span>
          </p>

          <p className="auth-link">
            Academic staff?{" "}
            <span onClick={() => navigate("/academic-register")}>
              Create account
            </span>
          </p>

          <p className="auth-link">
            Administrator?{" "}
            <span onClick={() => navigate("/admin-login")}>Admin Login</span>
          </p>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
