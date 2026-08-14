import { useState } from "react";
import { useNavigate } from "react-router-dom";

import useAuth from "../hooks/useAuth";

import "../components/auth/Auth.css";

function TeacherRegisterPage() {
  const navigate = useNavigate();

  const { registerTeacher } = useAuth();

  const [teacherId, setTeacherId] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!teacherId.trim()) {
      newErrors.teacherId = "Academic ID is required";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    const result = registerTeacher({
      teacherId: teacherId.trim(),
      password,
    });

    if (!result.success) {
      setErrors({
        general: result.message,
      });

      return;
    }

    alert("Academic account created successfully!");

    setTeacherId("");
    setPassword("");
    setConfirmPassword("");
    setErrors({});

    navigate("/login");
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Academic Registration</h1>

        <p className="auth-subtitle">
          Create your account using the Academic ID provided by Academic
          Administration.
        </p>

        {errors.general && <p className="login-error">{errors.general}</p>}

        <form onSubmit={handleSubmit} autoComplete="off">
          <div className="form-group">
            <label>Academic ID</label>

            <input
              type="text"
              placeholder="Example: A20260001"
              value={teacherId}
              onChange={(event) => {
                setTeacherId(event.target.value);

                setErrors((prevErrors) => ({
                  ...prevErrors,
                  teacherId: "",
                  general: "",
                }));
              }}
              autoComplete="off"
            />

            {errors.teacherId && (
              <p className="error-message">{errors.teacherId}</p>
            )}
          </div>

          <div className="form-group">
            <label>Password</label>

            <input
              type="password"
              placeholder="Create password"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);

                setErrors((prevErrors) => ({
                  ...prevErrors,
                  password: "",
                  general: "",
                }));
              }}
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
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(event) => {
                setConfirmPassword(event.target.value);

                setErrors((prevErrors) => ({
                  ...prevErrors,
                  confirmPassword: "",
                  general: "",
                }));
              }}
              autoComplete="new-password"
            />

            {errors.confirmPassword && (
              <p className="error-message">{errors.confirmPassword}</p>
            )}
          </div>

          <button type="submit" className="auth-btn">
            Create Academic Account
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

export default TeacherRegisterPage;
