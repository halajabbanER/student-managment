import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import useCourses from "../hooks/useCourses";
import useTeachers from "../hooks/useTeachers";

import "./AcademicSchedulesPage.css";

function AcademicSchedulesPage() {
  const navigate = useNavigate();

  const { courses, updateCourse } = useCourses();
  const { teachers } = useTeachers();

  const [formData, setFormData] = useState({
    courseId: "",
    day: "Monday",
    startTime: "",
    endTime: "",
    room: "",
  });

  const [error, setError] = useState("");
  const [editingTarget, setEditingTarget] = useState(null);

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  // =========================
  // TEACHER NAME
  // =========================

  const getTeacherName = (teacherId) => {
    const teacher = teachers.find(
      (item) =>
        String(item.id) === String(teacherId) ||
        String(item.teacherId) === String(teacherId),
    );

    return teacher?.name || "Not Assigned";
  };

  // =========================
  // ALL SCHEDULES
  // =========================

  const allSchedules = useMemo(() => {
    return courses.flatMap((course) =>
      (course.schedule || []).map((schedule, scheduleIndex) => ({
        ...schedule,
        scheduleTarget: `${course.id}:${scheduleIndex}`,

        courseId: course.id,
        courseName: course.name,
        courseCode: course.code,

        teacherId: course.teacherId,
      })),
    );
  }, [courses]);

  // =========================
  // FORM CHANGE
  // =========================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
  };

  // =========================
  // RESET FORM
  // =========================

  const resetForm = () => {
    setFormData({
      courseId: "",
      day: "Monday",
      startTime: "",
      endTime: "",
      room: "",
    });

    setEditingTarget(null);
    setError("");
  };

  // =========================
  // SAVE SCHEDULE
  // =========================

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!formData.courseId) {
      setError("Please select a course.");
      return;
    }

    if (!formData.startTime) {
      setError("Start time is required.");
      return;
    }

    if (!formData.endTime) {
      setError("End time is required.");
      return;
    }

    if (formData.endTime <= formData.startTime) {
      setError("End time must be after start time.");
      return;
    }

    if (!formData.room.trim()) {
      setError("Room is required.");
      return;
    }

    const course = courses.find(
      (item) => String(item.id) === String(formData.courseId),
    );

    if (!course) {
      setError("Course not found.");
      return;
    }

    // EDIT
    if (editingTarget) {
      const updatedSchedule = (course.schedule || []).map((item, itemIndex) =>
        `${course.id}:${itemIndex}` === editingTarget
          ? {
              id: item.id ?? Date.now(),

              ...item,

              day: formData.day,
              startTime: formData.startTime,
              endTime: formData.endTime,
              room: formData.room.trim(),
            }
          : item,
      );

      const result = updateCourse(course.id, {
        ...course,
        schedule: updatedSchedule,
      });

      if (!result.success) {
        setError(result.message || "Failed to update schedule.");
        return;
      }

      resetForm();

      alert("Schedule updated successfully.");

      return;
    }

    // ADD

    const newSchedule = {
      id: Date.now(),

      day: formData.day,

      startTime: formData.startTime,

      endTime: formData.endTime,

      room: formData.room.trim(),
    };

    const result = updateCourse(course.id, {
      ...course,

      schedule: [...(course.schedule || []), newSchedule],
    });

    if (!result.success) {
      setError(result.message || "Failed to add schedule.");

      return;
    }

    resetForm();

    alert("Schedule added successfully.");
  };

  // =========================
  // EDIT
  // =========================

  const handleEdit = (schedule) => {
    setEditingTarget(schedule.scheduleTarget);

    setFormData({
      courseId: String(schedule.courseId),

      day: schedule.day,

      startTime: schedule.startTime,

      endTime: schedule.endTime,

      room: schedule.room,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =========================
  // DELETE
  // =========================

  const handleDelete = (schedule) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this schedule?",
    );

    if (!confirmed) {
      return;
    }

    const course = courses.find(
      (item) => String(item.id) === String(schedule.courseId),
    );

    if (!course) {
      return;
    }

    const updatedSchedule = (course.schedule || []).filter(
      (item, itemIndex) => `${course.id}:${itemIndex}` !== schedule.scheduleTarget,
    );

    updateCourse(course.id, {
      ...course,

      schedule: updatedSchedule,
    });

    if (String(editingTarget) === String(schedule.scheduleTarget)) {
      resetForm();
    }
  };

  return (
    <div className="academic-schedules-page">
      {/* HEADER */}

      <div className="academic-schedules-header">
        <div>
          <h1>Class Schedules</h1>

          <p>Manage course times, days and classrooms.</p>
        </div>

        <button type="button" onClick={() => navigate("/academic")}>
          ← Dashboard
        </button>
      </div>

      {/* FORM */}

      <form className="academic-schedule-form" onSubmit={handleSubmit}>
        <div className="schedule-form-title">
          <div>
          <h2>{editingTarget ? "Edit Schedule" : "Add Schedule"}</h2>

            <p>Assign a course to a day, time and classroom.</p>
          </div>

          {editingTarget && (
            <button
              type="button"
              className="schedule-cancel-edit"
              onClick={resetForm}
            >
              Cancel Edit
            </button>
          )}
        </div>

        {error && <div className="schedule-error">{error}</div>}

        <div className="schedule-form-grid">
          {/* COURSE */}

          <div className="schedule-form-group">
            <label>Course *</label>

            <select
              name="courseId"
              value={formData.courseId}
              onChange={handleChange}
              disabled={Boolean(editingTarget)}
            >
              <option value="">Select Course</option>

              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.code} - {course.name}
                </option>
              ))}
            </select>
          </div>

          {/* DAY */}

          <div className="schedule-form-group">
            <label>Day *</label>

            <select name="day" value={formData.day} onChange={handleChange}>
              {days.map((day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </select>
          </div>

          {/* START */}

          <div className="schedule-form-group">
            <label>Start Time *</label>

            <input
              type="time"
              name="startTime"
              value={formData.startTime}
              onChange={handleChange}
            />
          </div>

          {/* END */}

          <div className="schedule-form-group">
            <label>End Time *</label>

            <input
              type="time"
              name="endTime"
              value={formData.endTime}
              onChange={handleChange}
            />
          </div>

          {/* ROOM */}

          <div className="schedule-form-group">
            <label>Room *</label>

            <input
              type="text"
              name="room"
              placeholder="Example: B201"
              value={formData.room}
              onChange={handleChange}
            />
          </div>

          <div className="schedule-submit-wrapper">
            <button type="submit">
              {editingTarget ? "Save Changes" : "+ Add Schedule"}
            </button>
          </div>
        </div>
      </form>

      {/* SCHEDULE */}

      <section className="academic-schedule-section">
        <div className="schedule-section-header">
          <div>
            <h2>Weekly Schedule</h2>

            <p>{allSchedules.length} scheduled class(es)</p>
          </div>
        </div>

        {allSchedules.length > 0 ? (
          <div className="schedule-days">
            {days.map((day) => {
              const daySchedules = allSchedules
                .filter((schedule) => schedule.day === day)
                .sort((a, b) => a.startTime.localeCompare(b.startTime));

              return (
                <div className="schedule-day-card" key={day}>
                  <div className="schedule-day-header">
                    <h3>{day}</h3>

                    <span>{daySchedules.length}</span>
                  </div>

                  {daySchedules.length > 0 ? (
                    <div className="schedule-day-list">
                      {daySchedules.map((schedule) => (
                        <div
                          className="schedule-class-card"
                          key={schedule.scheduleTarget}
                        >
                          <div className="schedule-class-time">
                            <strong>{schedule.startTime}</strong>

                            <span>{schedule.endTime}</span>
                          </div>

                          <div className="schedule-class-info">
                            <span className="schedule-course-code">
                              {schedule.courseCode}
                            </span>

                            <h4>{schedule.courseName}</h4>

                            <p>👨‍🏫 {getTeacherName(schedule.teacherId)}</p>

                            <p>🏫 Room: {schedule.room}</p>
                          </div>

                          <div className="schedule-actions">
                            <button
                              type="button"
                              className="schedule-edit-btn"
                              onClick={() => handleEdit(schedule)}
                            >
                              ✏️
                            </button>

                            <button
                              type="button"
                              className="schedule-delete-btn"
                              onClick={() => handleDelete(schedule)}
                            >
                              🗑️
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="schedule-no-classes">No classes</div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="schedule-empty">
            <div>📅</div>

            <h3>No Schedule Yet</h3>

            <p>Add the first course to the weekly schedule.</p>
          </div>
        )}
      </section>
    </div>
  );
}

export default AcademicSchedulesPage;
