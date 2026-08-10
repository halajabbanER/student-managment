import useLocalStorage from "./useLocalStorage";

function useStudents() {
  const [students, setStudents] = useLocalStorage("students", []);

  const addStudent = (newStudent) => {
    const student = {
      id: Date.now(),
      courses: [],
      ...newStudent,
    };

    setStudents([...students, student]);
  };

  const deleteStudent = (id) => {
    setStudents(students.filter((student) => student.id !== Number(id)));
  };

  const updateStudent = (id, updatedData) => {
    setStudents(
      students.map((student) =>
        student.id === Number(id) ? { ...student, ...updatedData } : student,
      ),
    );
  };

  const getStudent = (id) => {
    return students.find((student) => student.id === Number(id));
  };

  // Add Course
  const addCourse = (studentId, courseData) => {
    setStudents(
      students.map((student) =>
        student.id === Number(studentId)
          ? {
              ...student,
              courses: [
                ...(student.courses || []),
                {
                  id: Date.now(),
                  ...courseData,
                },
              ],
            }
          : student,
      ),
    );
  };

  // Update Course Grade
  const updateCourseGrade = (studentId, courseId, newGrade) => {
    setStudents(
      students.map((student) =>
        student.id === Number(studentId)
          ? {
              ...student,
              courses: (student.courses || []).map((course) =>
                course.id === courseId
                  ? {
                      ...course,
                      grade: Number(newGrade),
                    }
                  : course,
              ),
            }
          : student,
      ),
    );
  };

  // Delete Course
  const deleteCourse = (studentId, courseId) => {
    setStudents(
      students.map((student) =>
        student.id === Number(studentId)
          ? {
              ...student,
              courses: (student.courses || []).filter(
                (course) => course.id !== courseId,
              ),
            }
          : student,
      ),
    );
  };

  return {
    students,
    addStudent,
    deleteStudent,
    updateStudent,
    getStudent,
    addCourse,
    updateCourseGrade,
    deleteCourse,
  };
}

export default useStudents;
