import { useState } from "react";
import { useNavigate } from "react-router-dom";

import useAuth from "../../hooks/useAuth";
import useForm from "../../hooks/useForm";

import "./Auth.css";

function AdminLoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const { values, handleChange, resetForm } = useForm({
    email: "",
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

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!values.email.trim()) {
      newErrors.email = "Admin email is required";
    } else if (!emailRegex.test(values.email)) {
      newErrors.email = "Please enter a valid email";
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

    const result = login(values.email.trim(), values.password);

    if (!result.success) {
      setErrors({
        general: result.message,
      });

      return;
    }

    if (result.user.role !== "admin") {
      setErrors({
        general: "This account does not have administrator access.",
      });

      return;
    }

    resetForm();

    navigate("/", {
      replace: true,
    });
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Admin Login</h1>

        <p className="auth-subtitle">Sign in to the administration panel.</p>

        {errors.general && <p className="login-error">{errors.general}</p>}

        <form onSubmit={handleSubmit} autoComplete="off">
          <div className="form-group">
            <label>Admin Email</label>

            <input
              type="email"
              name="email"
              placeholder="admin@example.com"
              value={values.email}
              onChange={handleInputChange}
              autoComplete="off"
            />

            {errors.email && <p className="error-message">{errors.email}</p>}
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
            Admin Login
          </button>
        </form>

        <p className="auth-link">
          Student or Academic Staff?{" "}
          <span onClick={() => navigate("/login")}>User Login</span>
        </p>
      </div>
    </div>
  );
}

export default AdminLoginPage;
