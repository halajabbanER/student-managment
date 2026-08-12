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
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

    // Name
    if (!values.name.trim()) {
      newErrors.name = "Full name is required";
    } else if (values.name.trim().length < 3) {
      newErrors.name = "Name must be at least 3 characters";
    }

    // Email
    if (!values.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(values.email)) {
      newErrors.email = "Please enter a valid email";
    }

    // Password
    if (!values.password) {
      newErrors.password = "Password is required";
    } else if (!passwordRegex.test(values.password)) {
      newErrors.password =
        "Password must contain at least 8 characters, uppercase, lowercase and a number";
    }

    // Confirm Password
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
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    const result = register({
      name: values.name.trim(),
      email: values.email.trim(),
      password: values.password,
    });

    if (!result.success) {
      setErrors({
        email: result.message,
      });

      return;
    }

    alert("Account created successfully!");

    resetForm();

    navigate("/login");
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Create Account</h1>

        <p className="auth-subtitle">Create your account to manage students.</p>

        <form onSubmit={handleSubmit}>
          {/* Full Name */}
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

          {/* Email */}
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

          {/* Password */}
          <div className="form-group">
            <label>Password</label>

            <input
              type="password"
              name="password"
              placeholder="Enter password"
              value={values.password}
              onChange={handleInputChange}
            />

            {errors.password && (
              <p className="error-message">{errors.password}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="form-group">
            <label>Confirm Password</label>

            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm password"
              value={values.confirmPassword}
              onChange={handleInputChange}
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
