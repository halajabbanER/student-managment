import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import useAuth from "../hooks/useAuth";
import useTeachers from "../hooks/useTeachers";
import useCourses from "../hooks/useCourses";

import "./AcademicCourseExamsPage.css";

function AcademicCourseExamsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { user } = useAuth();
  const { teachers } = useTeachers();
  const { courses, updateCourse } = useCourses();

  const course = useMemo(() => {
    return courses.find((item) => String(item.id) === String(id));
  }, [courses, id]);

  const teacher = useMemo(() => {
    const currentEmail = String(user?.email || "")
      .trim()
      .toLowerCase();

    return (
      teachers.find(
        (item) => String(item.teacherId || item.id) === String(user?.teacherId),
      ) ||
      (currentEmail
        ? teachers.find(
            (item) =>
              String(item.email || "")
                .trim()
                .toLowerCase() === currentEmail,
          )
        : null) ||
      teachers.find((item) => String(item.id) === String(user?.id)) ||
      user ||
      null
    );
  }, [teachers, user]);

  const normalizeText = (value) =>
    String(value || "")
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "");

  const teacherDepartment = teacher?.department || user?.department || "";

  const courseMatchesTeacherAccess = (targetCourse) => {
    if (!targetCourse) {
      return false;
    }

    if (user?.role === "admin") {
      return true;
    }

    const userTeacherId = user?.teacherId || user?.id;

    if (
      String(targetCourse.teacherId) === String(teacher?.id) ||
      String(targetCourse.teacherId) === String(teacher?.teacherId) ||
      String(targetCourse.teacherId) === String(userTeacherId) ||
      String(targetCourse.teacherId) === String(user?.id)
    ) {
      return true;
    }

    if (!teacherDepartment || !targetCourse.departmentId) {
      return false;
    }

    try {
      const departments = JSON.parse(
        localStorage.getItem("departments") || "[]",
      );
      const department = departments.find(
        (item) => String(item.id) === String(targetCourse.departmentId),
      );

      if (!department) {
        return false;
      }

      return (
        normalizeText(teacherDepartment) === normalizeText(department.name) ||
        normalizeText(teacherDepartment) === normalizeText(department.code) ||
        normalizeText(teacherDepartment).includes(
          normalizeText(department.name),
        ) ||
        normalizeText(department.name).includes(
          normalizeText(teacherDepartment),
        ) ||
        normalizeText(teacherDepartment).includes(
          normalizeText(department.code),
        ) ||
        normalizeText(department.code).includes(
          normalizeText(teacherDepartment),
        )
      );
    } catch (error) {
      return false;
    }
  };

  const [formData, setFormData] = useState({
    title: "",
    type: "Midterm",
    date: "",
    time: "",
    room: "",
    totalScore: "100",
  });

  const [error, setError] = useState("");

  if (!course) {
    return (
      <div className="teacher-exams-page">
        <div className="teacher-exams-message">
          <h2>Course not found</h2>

          <button onClick={() => navigate("/academic")}>
            Back to Academic Dashboard
          </button>
        </div>
      </div>
    );
  }

  const teacherHasAccess = courseMatchesTeacherAccess(course);

  if (!teacherHasAccess) {
    return (
      <div className="teacher-exams-page">
        <div className="teacher-exams-message">
          <h2>Access Denied</h2>

          <p>You are not assigned to this course.</p>

          <button onClick={() => navigate("/academic")}>
            Back to Academic Dashboard
          </button>
        </div>
      </div>
    );
  }

  const exams = course.exams || [];

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    setError("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!formData.title.trim()) {
      setError("Exam title is required.");
      return;
    }

    if (!formData.date) {
      setError("Exam date is required.");
      return;
    }

    if (!formData.time) {
      setError("Exam time is required.");
      return;
    }

    if (!formData.room.trim()) {
      setError("Exam room is required.");
      return;
    }

    if (Number(formData.totalScore) <= 0 || Number(formData.totalScore) > 100) {
      setError("Total score must be between 1 and 100.");
      return;
    }

    const newExam = {
      id: Date.now(),
      title: formData.title.trim(),
      type: formData.type,
      date: formData.date,
      time: formData.time,
      room: formData.room.trim(),
      totalScore: Number(formData.totalScore),
      createdAt: new Date().toISOString(),
    };

    const result = updateCourse(course.id, {
      ...course,
      exams: [...(course.exams || []), newExam],
    });

    if (!result.success) {
      setError(result.message || "Failed to add exam.");

      return;
    }

    setFormData({
      title: "",
      type: "Midterm",
      date: "",
      time: "",
      room: "",
      totalScore: "100",
    });

    alert("Exam added successfully.");
  };

  const handleDeleteExam = (examId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this exam?",
    );

    if (!confirmed) {
      return;
    }

    const updatedExams = exams.filter(
      (exam) => String(exam.id) !== String(examId),
    );

    updateCourse(course.id, {
      ...course,
      exams: updatedExams,
    });
  };

  return (
    <div className="teacher-exams-page">
      <div className="teacher-exams-header">
        <div>
          <span className="teacher-exams-course-code">{course.code}</span>

          <h1>Course Exams</h1>

          <p>
            Manage exams for <strong>{course.name}</strong>.
          </p>
        </div>

        <button type="button" onClick={() => navigate("/academic")}>
          ← Academic Dashboard
        </button>
      </div>

      <div className="teacher-exams-layout">
        <form className="teacher-exam-form" onSubmit={handleSubmit}>
          <h2>Add New Exam</h2>

          <p>Create a new exam for this course.</p>

          {error && <div className="teacher-exam-error">{error}</div>}

          <div className="teacher-exam-form-group">
            <label>Exam Title *</label>

            <input
              type="text"
              name="title"
              placeholder="Example: First Midterm"
              value={formData.title}
              onChange={handleChange}
            />
          </div>

          <div className="teacher-exam-form-group">
            <label>Exam Type *</label>

            <select name="type" value={formData.type} onChange={handleChange}>
              <option value="Quiz">Quiz</option>

              <option value="Midterm">Midterm</option>

              <option value="Final">Final</option>

              <option value="Project">Project</option>
            </select>
          </div>

          <div className="teacher-exam-form-row">
            <div className="teacher-exam-form-group">
              <label>Date *</label>

              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
              />
            </div>

            <div className="teacher-exam-form-group">
              <label>Time *</label>

              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="teacher-exam-form-row">
            <div className="teacher-exam-form-group">
              <label>Room *</label>

              <input
                type="text"
                name="room"
                placeholder="B201"
                value={formData.room}
                onChange={handleChange}
              />
            </div>

            <div className="teacher-exam-form-group">
              <label>Total Score *</label>

              <input
                type="number"
                name="totalScore"
                min="1"
                max="100"
                value={formData.totalScore}
                onChange={handleChange}
              />
            </div>
          </div>

          <button type="submit" className="teacher-exam-save-btn">
            + Add Exam
          </button>
        </form>

        <div className="teacher-exams-list-section">
          <div className="teacher-exams-list-header">
            <div>
              <h2>Exams</h2>

              <p>{exams.length} exam(s)</p>
            </div>
          </div>

          {exams.length > 0 ? (
            <div className="teacher-exams-grid">
              {exams.map((exam) => (
                <article className="teacher-exam-card" key={exam.id}>
                  <div className="teacher-exam-card-top">
                    <div className="teacher-exam-icon">📝</div>

                    <span>{exam.type}</span>
                  </div>

                  <h3>{exam.title}</h3>

                  <div className="teacher-exam-details">
                    <p>
                      <span>📅 Date</span>
                      <strong>{exam.date}</strong>
                    </p>

                    <p>
                      <span>🕐 Time</span>
                      <strong>{exam.time}</strong>
                    </p>

                    <p>
                      <span>🏫 Room</span>
                      <strong>{exam.room}</strong>
                    </p>

                    <p>
                      <span>📊 Score</span>
                      <strong>{exam.totalScore}</strong>
                    </p>
                  </div>

                  <button
                    type="button"
                    className="teacher-exam-delete-btn"
                    onClick={() => handleDeleteExam(exam.id)}
                  >
                    🗑 Delete Exam
                  </button>
                </article>
              ))}
            </div>
          ) : (
            <div className="teacher-exams-empty">
              <div>📝</div>

              <h3>No Exams Yet</h3>

              <p>Create the first exam for this course.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AcademicCourseExamsPage;
