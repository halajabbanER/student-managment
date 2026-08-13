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
      newErrors.identifier = "Student ID or Academic Email is required";
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

    if (result.user.role === "student") {
      navigate("/student-portal", {
        replace: true,
      });

      return;
    }

    if (result.user.role === "academic") {
      navigate("/academic", {
        replace: true,
      });

      return;
    }

    setErrors({
      general: "Please use the Admin Login page.",
    });
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Student & Academic Login</h1>

        <p className="auth-subtitle">
          Students use Student ID, academic staff use email.
        </p>

        {errors.general && <p className="login-error">{errors.general}</p>}

        <form onSubmit={handleSubmit} autoComplete="off">
          <div className="form-group">
            <label>Student ID or Academic Email</label>

            <input
              type="text"
              name="identifier"
              placeholder="Student ID or academic@email.com"
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
        </form>

        <p className="auth-link">
          Student without an account?{" "}
          <span onClick={() => navigate("/register")}>Register</span>
        </p>

        <p className="auth-link">
          Administrator?{" "}
          <span onClick={() => navigate("/admin-login")}>Admin Login</span>
        </p>

        <p className="auth-link">
          Roles ready to use?{" "}
          <span onClick={() => navigate("/roles")}>Open Roles Hub</span>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
