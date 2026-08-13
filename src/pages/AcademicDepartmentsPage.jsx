import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import useDepartments from "../hooks/useDepartments";

import "./AcademicDepartmentsPage.css";

function AcademicDepartmentsPage() {
  const navigate = useNavigate();

  const { departments, addDepartment, updateDepartment, deleteDepartment } =
    useDepartments();

  const [showForm, setShowForm] = useState(false);

  const [editingId, setEditingId] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");

  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    code: "",
    description: "",
    status: "Active",
  });

  const resetForm = () => {
    setFormData({
      name: "",
      code: "",
      description: "",
      status: "Active",
    });

    setEditingId(null);
    setError("");
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    setError("");
  };

  const handleOpenForm = () => {
    resetForm();

    setShowForm(true);
  };

  const handleCloseForm = () => {
    resetForm();

    setShowForm(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    setError("");

    if (!formData.name.trim()) {
      setError("Department name is required.");
      return;
    }

    if (!formData.code.trim()) {
      setError("Department code is required.");
      return;
    }

    if (editingId) {
      const result = updateDepartment(editingId, formData);

      if (!result.success) {
        setError(result.message);
        return;
      }

      alert("Department updated successfully.");
    } else {
      const result = addDepartment(formData);

      if (!result.success) {
        setError(result.message);
        return;
      }

      alert("Department added successfully.");
    }

    resetForm();
    setShowForm(false);
  };

  const handleEdit = (department) => {
    setFormData({
      name: department.name,
      code: department.code,
      description: department.description || "",
      status: department.status || "Active",
    });

    setEditingId(department.id);

    setError("");

    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = (department) => {
    const confirmed = window.confirm(`Delete "${department.name}"?`);

    if (!confirmed) {
      return;
    }

    deleteDepartment(department.id);
  };

  const filteredDepartments = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    if (!search) {
      return departments;
    }

    return departments.filter((department) => {
      return (
        department.name.toLowerCase().includes(search) ||
        department.code.toLowerCase().includes(search)
      );
    });
  }, [departments, searchTerm]);

  return (
    <div className="academic-departments-page">
      {/* Header */}

      <div className="departments-header">
        <div>
          <h1>Departments</h1>

          <p>Create and manage university departments.</p>
        </div>

        <div className="departments-header-actions">
          <button
            type="button"
            className="department-back-btn"
            onClick={() => navigate("/academic")}
          >
            ← Dashboard
          </button>

          <button
            type="button"
            className="department-add-btn"
            onClick={showForm ? handleCloseForm : handleOpenForm}
          >
            {showForm ? "Close Form" : "+ Add Department"}
          </button>
        </div>
      </div>

      {/* Form */}

      {showForm && (
        <form className="department-form" onSubmit={handleSubmit}>
          <div className="department-form-title">
            <div>
              <h2>{editingId ? "Edit Department" : "Add Department"}</h2>

              <p>Enter the department information.</p>
            </div>

            {editingId && <span className="editing-badge">Editing</span>}
          </div>

          {error && <div className="department-error">{error}</div>}

          <div className="department-form-grid">
            <div className="department-form-group">
              <label>Department Name *</label>

              <input
                type="text"
                name="name"
                placeholder="Computer Engineering"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div className="department-form-group">
              <label>Department Code *</label>

              <input
                type="text"
                name="code"
                placeholder="CENG"
                value={formData.code}
                onChange={handleChange}
              />
            </div>

            <div className="department-form-group department-description">
              <label>Description</label>

              <textarea
                name="description"
                placeholder="Enter department description..."
                value={formData.description}
                onChange={handleChange}
                rows="4"
              />
            </div>

            <div className="department-form-group">
              <label>Status</label>

              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="Active">Active</option>

                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="department-form-actions">
            <button
              type="button"
              className="department-cancel-btn"
              onClick={handleCloseForm}
            >
              Cancel
            </button>

            <button type="submit" className="department-save-btn">
              {editingId ? "Save Changes" : "Add Department"}
            </button>
          </div>
        </form>
      )}

      {/* Search / statistics */}

      <div className="departments-tools">
        <div className="departments-search">
          <span>🔍</span>

          <input
            type="text"
            placeholder="Search departments..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </div>

        <div className="department-count">
          <span>Total Departments</span>

          <strong>{departments.length}</strong>
        </div>
      </div>

      {/* Departments */}

      {filteredDepartments.length > 0 ? (
        <div className="departments-grid">
          {filteredDepartments.map((department) => (
            <article className="department-card" key={department.id}>
              <div className="department-card-top">
                <div className="department-icon">🏢</div>

                <span
                  className={`department-status ${department.status.toLowerCase()}`}
                >
                  {department.status}
                </span>
              </div>

              <div className="department-card-content">
                <h2>{department.name}</h2>

                <span className="department-code">{department.code}</span>

                <p>{department.description || "No description available."}</p>
              </div>

              <div className="department-card-actions">
                <button
                  type="button"
                  className="department-edit-btn"
                  onClick={() => handleEdit(department)}
                >
                  ✏️ Edit
                </button>

                <button
                  type="button"
                  className="department-delete-btn"
                  onClick={() => handleDelete(department)}
                >
                  🗑 Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="departments-empty">
          <div>🏢</div>

          <h2>{searchTerm ? "No departments found" : "No departments yet"}</h2>

          <p>
            {searchTerm
              ? "Try another search."
              : "Add your first department to get started."}
          </p>

          {!searchTerm && (
            <button type="button" onClick={handleOpenForm}>
              + Add Department
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default AcademicDepartmentsPage;
