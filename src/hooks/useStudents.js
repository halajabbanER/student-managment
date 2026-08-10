import useLocalStorage from "./useLocalStorage";

function useStudents() {
  const [students, setStudents] = useLocalStorage("students", [
    {
      id: 1,
      name: "Ali Ahmad",
      email: "ali@gmail.com",
      department: "Computer Engineering",
      level: "3rd Year",
      status: "Active",
    },
    {
      id: 2,
      name: "Sara Omar",
      email: "sara@gmail.com",
      department: "Software Engineering",
      level: "2nd Year",
      status: "Active",
    },
    {
      id: 3,
      name: "Lina Hasan",
      email: "lina@gmail.com",
      department: "Computer Engineering",
      level: "4th Year",
      status: "Graduated",
    },
    {
      id: 4,
      name: "Omar Khaled",
      email: "omar@gmail.com",
      department: "Electrical Engineering",
      level: "1st Year",
      status: "Inactive",
    },
  ]);

  const addStudent = (newStudent) => {
    const student = {
      id: Date.now(),
      ...newStudent,
    };

    setStudents([...students, student]);
  };

  const deleteStudent = (id) => {
    setStudents(students.filter((student) => student.id !== id));
  };

  const updateStudent = (id, updatedData) => {
    setStudents(
      students.map((student) =>
        student.id === id ? { ...student, ...updatedData } : student,
      ),
    );
  };

  const getStudent = (id) => {
    return students.find((student) => student.id === Number(id));
  };

  return {
    students,
    addStudent,
    deleteStudent,
    updateStudent,
    getStudent,
  };
}

export default useStudents;
