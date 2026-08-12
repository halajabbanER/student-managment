import { useState } from "react";
import { useNavigate } from "react-router-dom";

import useAuth from "../../hooks/useAuth";
import useForm from "../../hooks/useForm";

import "./Auth.css";

function LoginPage() {
  const navigate = useNavigate();

  const { login } = useAuth();

  const { values, handleChange, resetForm } = useForm({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!values.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(values.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!values.password) {
      newErrors.password = "Password is required";
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

    const result = login(values.email, values.password);

    if (!result.success) {
      setErrors({
        general: result.message,
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
        <h1>Welcome Back</h1>

        <p className="auth-subtitle">Login to manage your students.</p>

        {errors.general && <p className="login-error">{errors.general}</p>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>

            <input
              type="email"
              name="email"
              placeholder="example@gmail.com"
              value={values.email}
              onChange={handleInputChange}
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
          Don't have an account?{" "}
          <span onClick={() => navigate("/register")}>Register</span>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
