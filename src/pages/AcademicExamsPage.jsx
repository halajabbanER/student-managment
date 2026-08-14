import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import useCourses from "../hooks/useCourses";

import "./AcademicExamsPage.css";

const initialFormData = {
  courseId: "",
  title: "",
  type: "Midterm",
  date: "",
  time: "",
  room: "",
  totalScore: "100",
};

function AcademicExamsPage() {
  const navigate = useNavigate();
  const { courses, updateCourse } = useCourses();

  const [formData, setFormData] = useState(initialFormData);
  const [error, setError] = useState("");

  const allExams = useMemo(() => {
    return courses.flatMap((course) =>
      (course.exams || []).map((exam) => ({
        ...exam,
        courseId: course.id,
        courseName: course.name,
        courseCode: course.code,
      })),
    );
  }, [courses]);

  const selectedCourse = useMemo(() => {
    return courses.find(
      (course) => String(course.id) === String(formData.courseId),
    );
  }, [courses, formData.courseId]);

  const filteredExams = useMemo(() => {
    return allExams.filter((exam) =>
      !formData.courseId ? true : String(exam.courseId) === String(formData.courseId),
    );
  }, [allExams, formData.courseId]);

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

    if (!formData.courseId) {
      setError("Please select a course.");
      return;
    }

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

    const exam = {
      id: Date.now(),
      title: formData.title.trim(),
      type: formData.type,
      date: formData.date,
      time: formData.time,
      room: formData.room.trim(),
      totalScore: Number(formData.totalScore) || 100,
      createdAt: new Date().toISOString(),
    };

    const result = updateCourse(selectedCourse.id, {
      ...selectedCourse,
      exams: [...(selectedCourse.exams || []), exam],
    });

    if (!result.success) {
      setError(result.message || "Failed to add exam.");
      return;
    }

    setFormData((prevData) => ({
      ...initialFormData,
      courseId: prevData.courseId,
    }));
  };

  const handleDeleteExam = (course, examId) => {
    const confirmed = window.confirm("Delete this exam?");

    if (!confirmed) {
      return;
    }

    const result = updateCourse(course.id, {
      ...course,
      exams: (course.exams || []).filter(
        (exam) => String(exam.id) !== String(examId),
      ),
    });

    if (!result.success) {
      setError(result.message || "Failed to delete exam.");
    }
  };

  return (
    <div className="academic-exams-page">
      <div className="academic-exams-header">
        <div>
          <h1>Exams</h1>

          <p>Create and manage exams by course.</p>
        </div>

        <button type="button" onClick={() => navigate("/academic")}>
          Back to Dashboard
        </button>
      </div>

      <div className="academic-exams-summary">
        <div>
          <span>Courses</span>
          <strong>{courses.length}</strong>
        </div>

        <div>
          <span>Total Exams</span>
          <strong>{allExams.length}</strong>
        </div>
      </div>

      <div className="academic-exams-layout">
        <form className="academic-exam-form" onSubmit={handleSubmit}>
          <h2>Add Exam</h2>

          <p>Select a course and enter exam details.</p>

          {error && <div className="academic-exam-error">{error}</div>}

          <div className="academic-exam-field">
            <label>Course</label>

            <select name="courseId" value={formData.courseId} onChange={handleChange}>
              <option value="">Select course</option>

              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.code} - {course.name}
                </option>
              ))}
            </select>
          </div>

          <div className="academic-exam-field">
            <label>Title</label>

            <input
              type="text"
              name="title"
              placeholder="Midterm 1"
              value={formData.title}
              onChange={handleChange}
            />
          </div>

          <div className="academic-exam-field">
            <label>Type</label>

            <select name="type" value={formData.type} onChange={handleChange}>
              <option value="Quiz">Quiz</option>
              <option value="Midterm">Midterm</option>
              <option value="Final">Final</option>
              <option value="Project">Project</option>
            </select>
          </div>

          <div className="academic-exam-grid">
            <div className="academic-exam-field">
              <label>Date</label>

              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
              />
            </div>

            <div className="academic-exam-field">
              <label>Time</label>

              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="academic-exam-grid">
            <div className="academic-exam-field">
              <label>Room</label>

              <input
                type="text"
                name="room"
                placeholder="B201"
                value={formData.room}
                onChange={handleChange}
              />
            </div>

            <div className="academic-exam-field">
              <label>Total Score</label>

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

          <button type="submit" className="academic-exam-save">
            Add Exam
          </button>
        </form>

        <section className="academic-exams-list">
          <div className="academic-exams-list-header">
            <h2>Existing Exams</h2>

            <p>{filteredExams.length} exam(s)</p>
          </div>

          {filteredExams.length > 0 ? (
            <div className="academic-exams-cards">
              {filteredExams.map((exam) => {
                const course = courses.find(
                  (item) => String(item.id) === String(exam.courseId),
                );

                return (
                  <article className="academic-exam-card" key={exam.id}>
                    <div className="academic-exam-top">
                      <span className="academic-exam-code">{exam.courseCode}</span>
                      <span className="academic-exam-type">{exam.type}</span>
                    </div>

                    <h3>{exam.title}</h3>
                    <p>{exam.courseName}</p>

                    <div className="academic-exam-meta">
                      <span>{exam.date}</span>
                      <span>{exam.time}</span>
                      <span>{exam.room}</span>
                      <span>{exam.totalScore} pts</span>
                    </div>

                    <button
                      type="button"
                      className="academic-exam-delete"
                      onClick={() => handleDeleteExam(course, exam.id)}
                    >
                      Delete
                    </button>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="academic-exams-empty">
              <h3>No exams yet</h3>

              <p>Create the first exam from the form.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default AcademicExamsPage;
