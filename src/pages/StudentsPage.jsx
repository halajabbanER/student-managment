import { useMemo, useState } from "react";

import { useNavigate } from "react-router-dom";

import StudentCard from "../components/students/StudentCard";
import StudentFilter from "../components/students/StudentFilter";
import LoadingSpinner from "../common/LoadingSpinner";
import ErrorMessage from "../common/ErrorMessage";

import useStudents from "../hooks/useStudents";

import "./StudentsPage.css";

function StudentsPage() {
  const navigate = useNavigate();

  const { students, loading, error, deleteStudent, refetchStudents } =
    useStudents();

  const [searchTerm, setSearchTerm] = useState("");

  const [departmentFilter, setDepartmentFilter] = useState("All");

  const [statusFilter, setStatusFilter] = useState("All");

  const [levelFilter, setLevelFilter] = useState("All");

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this student?",
    );

    if (!confirmDelete) {
      return;
    }

    const result = await deleteStudent(id);

    if (!result.success) {
      alert(result.message);
    }
  };

  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const search = searchTerm.toLowerCase();

      const matchesSearch =
        student.name?.toLowerCase().includes(search) ||
        student.email?.toLowerCase().includes(search) ||
        String(student.id).includes(search);

      const matchesDepartment =
        departmentFilter === "All" || student.department === departmentFilter;

      const matchesStatus =
        statusFilter === "All" || student.status === statusFilter;

      const matchesLevel =
        levelFilter === "All" || student.level === levelFilter;

      return (
        matchesSearch && matchesDepartment && matchesStatus && matchesLevel
      );
    });
  }, [students, searchTerm, departmentFilter, statusFilter, levelFilter]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={refetchStudents} />;
  }

  return (
    <div className="students-page">
      <div className="students-header">
        <div>
          <h1>Students</h1>

          <p>Manage and search student records.</p>
        </div>

        <button
          className="add-student-btn"
          onClick={() => navigate("/student/new")}
        >
          + Add New Student
        </button>
      </div>

      <StudentFilter
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        departmentFilter={departmentFilter}
        setDepartmentFilter={setDepartmentFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        levelFilter={levelFilter}
        setLevelFilter={setLevelFilter}
      />

      <p className="student-count">
        Showing {filteredStudents.length} of {students.length} students
      </p>

      {filteredStudents.length > 0 ? (
        <div className="students-grid">
          {filteredStudents.map((student) => (
            <StudentCard
              key={student.id}
              student={student}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <div className="no-students">
          <h3>No students found</h3>

          <p>Try changing your search or filters.</p>
        </div>
      )}
    </div>
  );
}

export default StudentsPage;
