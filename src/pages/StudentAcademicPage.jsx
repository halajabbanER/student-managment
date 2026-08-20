import { useNavigate, useParams } from "react-router-dom";
import { FiArrowLeft, FiBookOpen, FiCalendar, FiFileText, FiAward } from "react-icons/fi";

import useStudentPortalData from "../hooks/useStudentPortalData";

import "./StudentAcademicPage.css";

const PAGE_CONFIG = {
  grades: {
    title: "My Grades",
    subtitle: "Your results in enrolled courses.",
    icon: FiAward,
  },
  exams: {
    title: "My Exams",
    subtitle: "Exams for your enrolled courses.",
    icon: FiFileText,
  },
  schedule: {
    title: "My Schedule",
    subtitle: "Your weekly class schedule.",
    icon: FiCalendar,
  },
  announcements: {
    title: "Announcements",
    subtitle: "Updates for you and your enrolled courses.",
    icon: FiBookOpen,
  },
};

function EmptyState({ message }) {
  return (
    <div className="student-academic-empty">
      <FiBookOpen aria-hidden="true" />
      <h2>Nothing to show yet</h2>
      <p>{message}</p>
    </div>
  );
}

function StudentAcademicPage() {
  const { section } = useParams();
  const navigate = useNavigate();
  const {
    student,
    studentCourses,
    exams,
    schedules,
    announcements,
    getCourseGrade,
  } = useStudentPortalData();
  const config = PAGE_CONFIG[section] || PAGE_CONFIG.grades;
  const PageIcon = config.icon;

  if (!student) {
    return <EmptyState message="Student information could not be found." />;
  }

  return (
    <div className="student-academic-page">
      <header className="student-academic-header">
        <button type="button" onClick={() => navigate("/student-portal")}>
          <FiArrowLeft aria-hidden="true" />
          Back to portal
        </button>
        <div className="student-academic-heading">
          <span><PageIcon aria-hidden="true" /></span>
          <div>
            <h1>{config.title}</h1>
            <p>{config.subtitle}</p>
          </div>
        </div>
      </header>

      {section === "grades" &&
        (studentCourses.length ? (
          <div className="student-academic-list">
            {studentCourses.map((course) => {
              const grade = getCourseGrade(course);
              return (
                <article key={course.id} className="student-academic-row">
                  <div>
                    <span>{course.code}</span>
                    <h2>{course.name}</h2>
                  </div>
                  <strong className={grade === null ? "pending" : grade >= 50 ? "pass" : "fail"}>
                    {grade === null ? "Not graded" : grade}
                  </strong>
                </article>
              );
            })}
          </div>
        ) : (
          <EmptyState message="Grades will appear after Academic enrolls you in a course." />
        ))}

      {section === "exams" &&
        (exams.length ? (
          <div className="student-academic-grid">
            {exams.map((exam, index) => (
              <article key={`${exam.courseId}-${exam.id || index}`} className="student-academic-card">
                <span>{exam.courseCode}</span>
                <h2>{exam.title || exam.name || "Exam"}</h2>
                <dl>
                  <div><dt>Type</dt><dd>{exam.type || "Exam"}</dd></div>
                  <div><dt>Date</dt><dd>{exam.date || "Not set"}</dd></div>
                  <div><dt>Time</dt><dd>{exam.time || "Not set"}</dd></div>
                  <div><dt>Room</dt><dd>{exam.room || "Not set"}</dd></div>
                </dl>
              </article>
            ))}
          </div>
        ) : (
          <EmptyState message="No exams have been added to your courses yet." />
        ))}

      {section === "schedule" &&
        (schedules.length ? (
          <div className="student-academic-list">
            {schedules.map((item, index) => (
              <article key={`${item.courseId}-${item.id || index}`} className="student-academic-row schedule-row">
                <div>
                  <span>{item.courseCode}</span>
                  <h2>{item.courseName}</h2>
                  <p>{item.teacherName}</p>
                </div>
                <div className="schedule-details">
                  <strong>{item.day}</strong>
                  <span>{item.startTime} - {item.endTime}</span>
                  <span>{item.room}</span>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <EmptyState message="Academic has not added a schedule to your courses yet." />
        ))}

      {section === "announcements" &&
        (announcements.length ? (
          <div className="student-academic-list">
            {announcements.map((item, index) => (
              <article key={item.id || index} className="student-announcement">
                <span>{item.personal ? "Personal" : item.courseCode}</span>
                <h2>{item.title || "Announcement"}</h2>
                <p>{item.message || item.content || item.description}</p>
                {item.date && <time>{item.date}</time>}
              </article>
            ))}
          </div>
        ) : (
          <EmptyState message="There are no announcements for you yet." />
        ))}
    </div>
  );
}

export default StudentAcademicPage;
