import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import useAuth from "../hooks/useAuth";
import useTeachers from "../hooks/useTeachers";
import useCourses from "../hooks/useCourses";
import useStudents from "../hooks/useStudents";

import "./AcademicCourseQuizzesPage.css";

const initialQuizForm = {
  title: "",
  date: "",
  totalScore: "10",
};

function AcademicCourseQuizzesPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { user } = useAuth();
  const { teachers } = useTeachers();
  const { courses, updateCourse } = useCourses();
  const { students } = useStudents();

  const course = useMemo(
    () => courses.find((item) => String(item.id) === String(id)),
    [courses, id],
  );

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
    } catch {
      return false;
    }
  };

  const isAdmin = user?.role === "admin";

  const [quizForm, setQuizForm] = useState(initialQuizForm);
  const [selectedQuizId, setSelectedQuizId] = useState("");
  const [draftScores, setDraftScores] = useState({});
  const [error, setError] = useState("");

  const quizzes = useMemo(() => course?.quizzes || [], [course]);

  const courseStudents = useMemo(() => {
    if (!course) {
      return [];
    }

    return students.filter((student) => {
      const studentIdentifier = student.studentId || student.id;

      return (course.students || []).some(
        (studentId) => String(studentId) === String(studentIdentifier),
      );
    });
  }, [course, students]);

  useEffect(() => {
    if (!quizzes.length) {
      setSelectedQuizId("");
      setDraftScores({});
      return;
    }

    const currentExists = quizzes.some(
      (quiz) => String(quiz.id) === String(selectedQuizId),
    );

    if (!currentExists) {
      setSelectedQuizId(String(quizzes[0].id));
    }
  }, [quizzes, selectedQuizId]);

  useEffect(() => {
    if (!selectedQuizId) {
      setDraftScores({});
      return;
    }

    const quiz = quizzes.find(
      (item) => String(item.id) === String(selectedQuizId),
    );

    if (!quiz) {
      setDraftScores({});
      return;
    }

    const nextDrafts = {};

    courseStudents.forEach((student) => {
      const studentIdentifier = student.studentId || student.id;
      const scoreEntry = (quiz.scores || []).find(
        (score) => String(score.studentId) === String(studentIdentifier),
      );

      nextDrafts[String(studentIdentifier)] =
        scoreEntry?.score === "" || scoreEntry?.score === undefined
          ? ""
          : String(scoreEntry.score);
    });

    setDraftScores(nextDrafts);
  }, [courseStudents, quizzes, selectedQuizId]);

  if (!course) {
    return (
      <div className="quiz-page">
        <div className="quiz-message">
          <h2>Course not found</h2>

          <button type="button" onClick={() => navigate("/academic")}>
            Back to Academic Dashboard
          </button>
        </div>
      </div>
    );
  }

  const teacherHasAccess = courseMatchesTeacherAccess(course) || isAdmin;

  if (!teacherHasAccess) {
    return (
      <div className="quiz-page">
        <div className="quiz-message">
          <h2>Access Denied</h2>

          <p>You are not assigned to this course.</p>

          <button type="button" onClick={() => navigate("/academic")}>
            Back to Academic Dashboard
          </button>
        </div>
      </div>
    );
  }

  const selectedQuiz = quizzes.find(
    (quiz) => String(quiz.id) === String(selectedQuizId),
  );

  const handleQuizFormChange = (event) => {
    const { name, value } = event.target;

    setQuizForm((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    setError("");
  };

  const handleAddQuiz = (event) => {
    event.preventDefault();
    setError("");

    if (!quizForm.title.trim()) {
      setError("Quiz title is required.");
      return;
    }

    if (!quizForm.date) {
      setError("Quiz date is required.");
      return;
    }

    const totalScore = Number(quizForm.totalScore);

    if (Number.isNaN(totalScore) || totalScore < 1 || totalScore > 100) {
      setError("Total score must be between 1 and 100.");
      return;
    }

    const newQuiz = {
      id: Date.now(),
      title: quizForm.title.trim(),
      date: quizForm.date,
      totalScore,
      scores: [],
      createdAt: new Date().toISOString(),
    };

    const result = updateCourse(course.id, {
      ...course,
      quizzes: [...quizzes, newQuiz],
    });

    if (!result.success) {
      setError(result.message || "Failed to add quiz.");
      return;
    }

    setQuizForm(initialQuizForm);
    setSelectedQuizId(String(newQuiz.id));
    alert("Quiz added successfully.");
  };

  const handleScoreChange = (studentId, value) => {
    setDraftScores((prevDrafts) => ({
      ...prevDrafts,
      [String(studentId)]: value,
    }));
  };

  const handleSaveScores = () => {
    if (!selectedQuiz) {
      setError("Please select a quiz first.");
      return;
    }

    const nextScores = [];

    for (const student of courseStudents) {
      const studentIdentifier = student.studentId || student.id;
      const rawValue = String(
        draftScores[String(studentIdentifier)] ?? "",
      ).trim();

      if (rawValue !== "") {
        const numericValue = Number(rawValue);

        if (
          Number.isNaN(numericValue) ||
          numericValue < 0 ||
          numericValue > selectedQuiz.totalScore
        ) {
          setError(
            `Invalid score for ${student.name}. Maximum is ${selectedQuiz.totalScore}.`,
          );
          return;
        }

        nextScores.push({
          studentId: studentIdentifier,
          score: numericValue,
        });
      }
    }

    const updatedQuizzes = quizzes.map((quiz) =>
      String(quiz.id) === String(selectedQuiz.id)
        ? {
            ...quiz,
            scores: nextScores,
          }
        : quiz,
    );

    const result = updateCourse(course.id, {
      ...course,
      quizzes: updatedQuizzes,
    });

    if (!result.success) {
      setError(result.message || "Failed to save quiz scores.");
      return;
    }

    alert("Quiz scores saved successfully.");
  };

  const handleDeleteQuiz = (quizId) => {
    const confirmed = window.confirm("Delete this quiz?");

    if (!confirmed) {
      return;
    }

    const updatedQuizzes = quizzes.filter(
      (quiz) => String(quiz.id) !== String(quizId),
    );

    updateCourse(course.id, {
      ...course,
      quizzes: updatedQuizzes,
    });

    if (String(selectedQuizId) === String(quizId)) {
      setSelectedQuizId(updatedQuizzes[0] ? String(updatedQuizzes[0].id) : "");
    }
  };

  return (
    <div className="quiz-page">
      <div className="quiz-header">
        <div>
          <span className="quiz-course-code">{course.code}</span>

          <h1>Course Quizzes</h1>

          <p>
            Manage quiz titles and student marks for{" "}
            <strong>{course.name}</strong>.
          </p>
        </div>

        <button type="button" onClick={() => navigate("/academic")}>
          Back to Dashboard
        </button>
      </div>

      <div className="quiz-summary">
        <div>
          <span>Students</span>
          <strong>{courseStudents.length}</strong>
        </div>

        <div>
          <span>Quizzes</span>
          <strong>{quizzes.length}</strong>
        </div>
      </div>

      <div className="quiz-layout">
        <form className="quiz-form" onSubmit={handleAddQuiz}>
          <h2>Add Quiz</h2>

          <p>Create a quiz session for this course.</p>

          {error && <div className="quiz-error">{error}</div>}

          <div className="quiz-field">
            <label>Quiz Title</label>

            <input
              type="text"
              name="title"
              placeholder="Quiz 1"
              value={quizForm.title}
              onChange={handleQuizFormChange}
            />
          </div>

          <div className="quiz-field">
            <label>Date</label>

            <input
              type="date"
              name="date"
              value={quizForm.date}
              onChange={handleQuizFormChange}
            />
          </div>

          <div className="quiz-field">
            <label>Total Score</label>

            <input
              type="number"
              name="totalScore"
              min="1"
              max="100"
              value={quizForm.totalScore}
              onChange={handleQuizFormChange}
            />
          </div>

          <button type="submit" className="quiz-save-btn">
            Add Quiz
          </button>
        </form>

        <div className="quiz-panel">
          <div className="quiz-panel-header">
            <div>
              <h2>Quizzes</h2>

              <p>{quizzes.length} quiz(s)</p>
            </div>

            {selectedQuiz && (
              <span className="quiz-selected-badge">
                Selected: {selectedQuiz.title}
              </span>
            )}
          </div>

          {quizzes.length > 0 ? (
            <div className="quiz-list">
              {quizzes.map((quiz) => (
                <button
                  type="button"
                  key={quiz.id}
                  className={`quiz-card ${
                    String(selectedQuizId) === String(quiz.id) ? "active" : ""
                  }`}
                  onClick={() => setSelectedQuizId(String(quiz.id))}
                >
                  <div>
                    <strong>{quiz.title}</strong>
                    <span>{quiz.date}</span>
                  </div>

                  <small>{quiz.totalScore} pts</small>

                  <span
                    className="quiz-delete-link"
                    onClick={(event) => {
                      event.stopPropagation();
                      handleDeleteQuiz(quiz.id);
                    }}
                  >
                    Delete
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <div className="quiz-empty">
              <h3>No Quizzes Yet</h3>

              <p>Create the first quiz for this course.</p>
            </div>
          )}
        </div>
      </div>

      <div className="quiz-score-area">
        <div className="quiz-score-head">
          <div>
            <h2>Student Quiz Marks</h2>

            <p>
              {selectedQuiz
                ? `Enter marks for ${selectedQuiz.title}.`
                : "Select a quiz to start entering marks."}
            </p>
          </div>

          <button
            type="button"
            onClick={handleSaveScores}
            disabled={!selectedQuiz}
          >
            Save Marks
          </button>
        </div>

        {selectedQuiz ? (
          courseStudents.length > 0 ? (
            <div className="quiz-table-wrapper">
              <table className="quiz-table">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Student ID</th>
                    <th>Score</th>
                    <th>Result</th>
                  </tr>
                </thead>

                <tbody>
                  {courseStudents.map((student) => {
                    const studentIdentifier = student.studentId || student.id;
                    const scoreValue =
                      draftScores[String(studentIdentifier)] ?? "";

                    return (
                      <tr key={student.id}>
                        <td>
                          <strong>{student.name}</strong>
                        </td>

                        <td>{studentIdentifier}</td>

                        <td>
                          <input
                            className="quiz-score-input"
                            type="number"
                            min="0"
                            max={selectedQuiz.totalScore}
                            placeholder={`0-${selectedQuiz.totalScore}`}
                            value={scoreValue}
                            onChange={(event) =>
                              handleScoreChange(
                                studentIdentifier,
                                event.target.value,
                              )
                            }
                          />
                        </td>

                        <td>
                          {String(scoreValue).trim() === "" ? (
                            <span className="quiz-result pending">Pending</span>
                          ) : Number(scoreValue) >=
                            selectedQuiz.totalScore / 2 ? (
                            <span className="quiz-result passed">Pass</span>
                          ) : (
                            <span className="quiz-result failed">Fail</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="quiz-empty">
              <h3>No Students Enrolled</h3>

              <p>Enroll students in this course before entering quiz marks.</p>
            </div>
          )
        ) : (
          <div className="quiz-empty">
            <h3>Select a Quiz</h3>

            <p>Choose a quiz from the list above to enter marks.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AcademicCourseQuizzesPage;
