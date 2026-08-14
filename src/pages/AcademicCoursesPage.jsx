import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import useCourses from "../hooks/useCourses";
import useDepartments from "../hooks/useDepartments";
import useTeachers from "../hooks/useTeachers";

import "./AcademicCoursesPage.css";

function AcademicCoursesPage() {
  const navigate = useNavigate();

  const { courses, addCourse, updateCourse, deleteCourse } = useCourses();

  const { departments } = useDepartments();

  const { teachers } = useTeachers();

  const [showForm, setShowForm] = useState(false);

  const [editingId, setEditingId] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");

  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    code: "",
    departmentId: "",
    teacherId: "",
    credits: "",
    semester: "",
    status: "Active",
    description: "",
  });

  // =========================
  // RESET FORM
  // =========================

  const resetForm = () => {
    setFormData({
      name: "",
      code: "",
      departmentId: "",
      teacherId: "",
      credits: "",
      semester: "",
      status: "Active",
      description: "",
    });

    setEditingId(null);

    setError("");
  };

  // =========================
  // INPUT CHANGE
  // =========================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    setError("");
  };

  // =========================
  // OPEN FORM
  // =========================

  const handleOpenForm = () => {
    resetForm();

    setShowForm(true);
  };

  // =========================
  // CLOSE FORM
  // =========================

  const handleCloseForm = () => {
    resetForm();

    setShowForm(false);
  };

  // =========================
  // SUBMIT
  // =========================

  const handleSubmit = (event) => {
    event.preventDefault();

    setError("");

    if (!formData.name.trim()) {
      setError("Course name is required.");

      return;
    }

    if (!formData.code.trim()) {
      setError("Course code is required.");

      return;
    }

    if (!formData.departmentId) {
      setError("Please select a department.");

      return;
    }

    if (!formData.credits) {
      setError("Course credits are required.");

      return;
    }

    if (Number(formData.credits) < 1 || Number(formData.credits) > 10) {
      setError("Credits must be between 1 and 10.");

      return;
    }

    if (!formData.semester) {
      setError("Please select a semester.");

      return;
    }

    if (editingId) {
      const result = updateCourse(editingId, formData);

      if (!result.success) {
        setError(result.message);

        return;
      }

      alert("Course updated successfully.");
    } else {
      const result = addCourse(formData);

      if (!result.success) {
        setError(result.message);

        return;
      }

      alert("Course added successfully.");
    }

    resetForm();

    setShowForm(false);
  };

  // =========================
  // EDIT
  // =========================

  const handleEdit = (course) => {
    setFormData({
      name: course.name,

      code: course.code,

      departmentId: course.departmentId || "",

      teacherId: course.teacherId || "",

      credits: course.credits || "",

      semester: course.semester || "",

      status: course.status || "Active",

      description: course.description || "",
    });

    setEditingId(course.id);

    setError("");

    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =========================
  // DELETE
  // =========================

  const handleDelete = (course) => {
    const confirmed = window.confirm(`Delete "${course.name}"?`);

    if (!confirmed) {
      return;
    }

    deleteCourse(course.id);
  };

  // =========================
  // DEPARTMENT NAME
  // =========================

  const getDepartmentName = (departmentId) => {
    const department = departments.find(
      (item) => String(item.id) === String(departmentId),
    );

    return department ? department.name : "Unknown Department";
  };

  // =========================
  // TEACHER NAME
  // =========================

  const getTeacherName = (teacherId) => {
    if (!teacherId) {
      return "Not Assigned";
    }

    const teacher = teachers.find(
      (item) =>
        String(item.id) === String(teacherId) ||
        String(item.teacherId) === String(teacherId),
    );

    return teacher ? teacher.name : "Not Assigned";
  };

  // =========================
  // FILTER TEACHERS
  // =========================

  const availableTeachers = useMemo(() => {
    const activeTeachers = teachers.filter(
      (teacher) => teacher.status === "Active",
    );

    const normalize = (value) => String(value || "").trim().toLowerCase();

    const selectedDepartment = departments.find(
      (department) => String(department.id) === String(formData.departmentId),
    );

    const departmentTeachers = selectedDepartment
      ? activeTeachers.filter(
          (teacher) =>
            normalize(teacher.department) === normalize(selectedDepartment.name),
        )
      : activeTeachers;

    const currentTeacher = teachers.find(
      (teacher) =>
        String(teacher.id) === String(formData.teacherId) ||
        String(teacher.teacherId) === String(formData.teacherId),
    );

    if (!currentTeacher) {
      return departmentTeachers;
    }

    return [
      currentTeacher,
      ...departmentTeachers.filter(
        (teacher) => String(teacher.id) !== String(currentTeacher.id),
      ),
    ];
  }, [teachers, departments, formData.departmentId, formData.teacherId]);

  // =========================
  // SEARCH
  // =========================

  const filteredCourses = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    if (!search) {
      return courses;
    }

    const getDepartmentName = (departmentId) => {
      const department = departments.find(
        (item) => String(item.id) === String(departmentId),
      );

      return department ? department.name : "Unknown Department";
    };

    const getTeacherName = (teacherId) => {
      if (!teacherId) {
        return "Not Assigned";
      }

      const teacher = teachers.find(
        (item) =>
          String(item.id) === String(teacherId) ||
          String(item.teacherId) === String(teacherId),
      );

      return teacher ? teacher.name : "Not Assigned";
    };

    return courses.filter((course) => {
      const departmentName = getDepartmentName(course.departmentId);

      const teacherName = getTeacherName(course.teacherId);

      return (
        course.name.toLowerCase().includes(search) ||
        course.code.toLowerCase().includes(search) ||
        departmentName.toLowerCase().includes(search) ||
        teacherName.toLowerCase().includes(search)
      );
    });
  }, [courses, searchTerm, departments, teachers]);

  return (
    <div className="academic-courses-page">
      {/* Header */}

      <div className="courses-page-header">
        <div>
          <h1>Courses</h1>

          <p>Create courses and assign departments and teachers.</p>
        </div>

        <div className="courses-header-actions">
          <button
            type="button"
            className="course-back-btn"
            onClick={() => navigate("/academic")}
          >
            ← Dashboard
          </button>

          <button
            type="button"
            className="course-add-btn"
            onClick={showForm ? handleCloseForm : handleOpenForm}
          >
            {showForm ? "Close Form" : "+ Add Course"}
          </button>
        </div>
      </div>

      {/* Form */}

      {showForm && (
        <form className="course-form" onSubmit={handleSubmit}>
          <div className="course-form-title">
            <div>
              <h2>{editingId ? "Edit Course" : "Add New Course"}</h2>

              <p>Enter the academic course information.</p>
            </div>

            {editingId && <span className="course-editing-badge">Editing</span>}
          </div>

          {error && <div className="course-error">{error}</div>}

          <div className="course-form-grid">
            {/* Name */}

            <div className="course-form-group">
              <label>Course Name *</label>

              <input
                type="text"
                name="name"
                placeholder="Data Structures"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            {/* Code */}

            <div className="course-form-group">
              <label>Course Code *</label>

              <input
                type="text"
                name="code"
                placeholder="CENG203"
                value={formData.code}
                onChange={handleChange}
              />
            </div>

            {/* Department */}

            <div className="course-form-group">
              <label>Department *</label>

              <select
                name="departmentId"
                value={formData.departmentId}
                onChange={(event) => {
                  setFormData((prevData) => ({
                    ...prevData,

                    departmentId: event.target.value,

                    teacherId: "",
                  }));

                  setError("");
                }}
              >
                <option value="">Select Department</option>

                {departments
                  .filter((department) => department.status === "Active")
                  .map((department) => (
                    <option key={department.id} value={department.id}>
                      {department.name} ({department.code})
                    </option>
                  ))}
              </select>
            </div>

            {/* Teacher */}

            <div className="course-form-group">
              <label>Teacher</label>

              <select
                name="teacherId"
                value={formData.teacherId}
                onChange={handleChange}
              >
                <option value="">Not Assigned</option>

                {availableTeachers
                  .filter((teacher) => teacher.status === "Active")
                  .map((teacher) => (
                    <option key={teacher.id} value={teacher.id}>
                      {teacher.name}
                      {teacher.title ? ` - ${teacher.title}` : ""}
                    </option>
                  ))}
              </select>
            </div>

            {/* Credits */}

            <div className="course-form-group">
              <label>Credits *</label>

              <input
                type="number"
                name="credits"
                min="1"
                max="10"
                placeholder="3"
                value={formData.credits}
                onChange={handleChange}
              />
            </div>

            {/* Semester */}

            <div className="course-form-group">
              <label>Semester *</label>

              <select
                name="semester"
                value={formData.semester}
                onChange={handleChange}
              >
                <option value="">Select Semester</option>

                <option value="Fall">Fall</option>

                <option value="Spring">Spring</option>

                <option value="Summer">Summer</option>
              </select>
            </div>

            {/* Status */}

            <div className="course-form-group">
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

            {/* Description */}

            <div className="course-form-group course-description-group">
              <label>Description</label>

              <textarea
                name="description"
                rows="4"
                placeholder="Course description..."
                value={formData.description}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="course-form-actions">
            <button
              type="button"
              className="course-cancel-btn"
              onClick={handleCloseForm}
            >
              Cancel
            </button>

            <button type="submit" className="course-save-btn">
              {editingId ? "Save Changes" : "Add Course"}
            </button>
          </div>
        </form>
      )}

      {/* Tools */}

      <div className="courses-tools">
        <div className="courses-search">
          <span>🔍</span>

          <input
            type="text"
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </div>

        <div className="courses-total">
          <span>Total Courses</span>

          <strong>{courses.length}</strong>
        </div>
      </div>

      {/* Cards */}

      {filteredCourses.length > 0 ? (
        <div className="courses-management-grid">
          {filteredCourses.map((course) => (
            <article className="course-management-card" key={course.id}>
              <div className="course-card-header">
                <div className="course-card-icon">📚</div>

                <span
                  className={`course-card-status ${course.status.toLowerCase()}`}
                >
                  {course.status}
                </span>
              </div>

              <div className="course-card-body">
                <span className="course-code-badge">{course.code}</span>

                <h2>{course.name}</h2>

                <div className="course-information">
                  <p>
                    <strong>🏢 Department:</strong>

                    <span>{getDepartmentName(course.departmentId)}</span>
                  </p>

                  <p>
                    <strong>👨‍🏫 Teacher:</strong>

                    <span>{getTeacherName(course.teacherId)}</span>
                  </p>

                  <p>
                    <strong>🎓 Credits:</strong>

                    <span>{course.credits}</span>
                  </p>

                  <p>
                    <strong>📅 Semester:</strong>

                    <span>{course.semester}</span>
                  </p>
                </div>

                {course.description && (
                  <p className="course-card-description">
                    {course.description}
                  </p>
                )}
              </div>

              <div className="course-card-actions">
                <button
                  type="button"
                  className="course-enroll-btn"
                  onClick={() =>
                    navigate(`/academic/courses/${course.id}/enrollment`)
                  }
                >
                  👨‍🎓 Enroll Students
                </button>

                <button
                  type="button"
                  className="course-grade-btn"
                  onClick={() => navigate(`/academic/grades?courseId=${course.id}`)}
                >
                  📝 Grades
                </button>

                <button
                  type="button"
                  className="course-edit-btn"
                  onClick={() => handleEdit(course)}
                >
                  ✏️ Edit
                </button>

                <button
                  type="button"
                  className="course-delete-btn"
                  onClick={() => handleDelete(course)}
                >
                  🗑 Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="courses-empty">
          <div className="courses-empty-icon">📚</div>

          <h2>{searchTerm ? "No courses found" : "No courses yet"}</h2>

          <p>
            {searchTerm
              ? "Try another search."
              : departments.length === 0
                ? "Create a department before adding courses."
                : "Add your first course to get started."}
          </p>

          {!searchTerm && departments.length > 0 && (
            <button type="button" onClick={handleOpenForm}>
              + Add Course
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default AcademicCoursesPage;
