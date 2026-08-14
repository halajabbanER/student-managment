import { useCallback } from "react";
import useLocalStorage from "./useLocalStorage";

function useStudents() {
  const [students, setStudents] = useLocalStorage("students", []);

  const readUsers = useCallback(() => {
    try {
      const rawUsers = JSON.parse(localStorage.getItem("users") || "[]");

      return Array.isArray(rawUsers) ? rawUsers : [];
    } catch (error) {
      console.error("Users storage error:", error);

      return [];
    }
  }, []);

  const writeUsers = useCallback((users) => {
    localStorage.setItem("users", JSON.stringify(users));
  }, []);

  const syncStudentUser = useCallback(
    (student) => {
      const users = readUsers();
      const matchingIndex = users.findIndex(
        (user) =>
          user.role === "student" &&
          (String(user.studentId || "").trim().toLowerCase() ===
            String(student.studentId || "").trim().toLowerCase() ||
            String(user.email || "").trim().toLowerCase() ===
              String(student.email || "").trim().toLowerCase() ||
            String(user.id) === String(student.id)),
      );

      const studentUser = {
        id: student.id,
        name: student.name,
        studentId: student.studentId,
        email: student.email,
        password: student.password,
        department: student.department,
        level: student.level,
        status: student.status,
        role: "student",
        accountCreated: true,
      };

      const updatedUsers =
        matchingIndex >= 0
          ? users.map((user, index) =>
              index === matchingIndex ? { ...user, ...studentUser } : user,
            )
          : [...users, studentUser];

      writeUsers(updatedUsers);
    },
    [readUsers, writeUsers],
  );

  const removeStudentUser = useCallback(
    (studentKey) => {
      const users = readUsers();
      const targetKey = String(studentKey);

      const updatedUsers = users.filter((user) => {
        if (user.role !== "student") {
          return true;
        }

        const userId = String(user.id ?? "");
        const userStudentId = String(user.studentId ?? "");

        return userId !== targetKey && userStudentId !== targetKey;
      });

      writeUsers(updatedUsers);
    },
    [readUsers, writeUsers],
  );

  const generateStudentId = useCallback(() => {
    const year = new Date().getFullYear();
    const existingIds = new Set(
      students
        .map((student) => String(student.studentId || "").trim())
        .filter(Boolean),
    );

    let nextNumber = 1;
    let studentId = "";

    do {
      studentId = `S${year}${String(nextNumber).padStart(4, "0")}`;
      nextNumber += 1;
    } while (existingIds.has(studentId));

    return studentId;
  }, [students]);

  // =========================
  // ADD STUDENT
  // =========================

  const addStudent = useCallback(
    (studentData) => {
      const users = readUsers();

      const studentIdExists = students.some(
        (student) =>
          String(student.studentId).toLowerCase() ===
          String(studentData.studentId).trim().toLowerCase(),
      );

      if (studentIdExists) {
        return {
          success: false,
          message: "Student ID already exists.",
        };
      }

      const userStudentIdExists = users.some(
        (user) =>
          user.role === "student" &&
          String(user.studentId || "").trim().toLowerCase() ===
            String(studentData.studentId).trim().toLowerCase(),
      );

      if (userStudentIdExists) {
        return {
          success: false,
          message: "Student ID already exists.",
        };
      }

      const emailExists = students.some(
        (student) =>
          student.email?.toLowerCase() ===
          studentData.email?.trim().toLowerCase(),
      );

      if (emailExists) {
        return {
          success: false,
          message: "Student email already exists.",
        };
      }

      const userEmailExists = users.some(
        (user) =>
          String(user.email || "").trim().toLowerCase() ===
            String(studentData.email || "").trim().toLowerCase() &&
          user.role === "student",
      );

      if (userEmailExists) {
        return {
          success: false,
          message: "Student email already exists.",
        };
      }

      const newStudent = {
        id: Date.now(),

        studentId: studentData.studentId.trim(),

        password: studentData.password,

        name: studentData.name.trim(),

        email: studentData.email.trim(),

        department: studentData.department,

        level: studentData.level,

        status: studentData.status || "Active",

        role: "student",

        courses: studentData.courses || [],

        exams: studentData.exams || [],

        schedule: studentData.schedule || [],

        accountCreated:
          studentData.accountCreated ?? Boolean(studentData.password),

        createdAt: new Date().toISOString(),
      };

      setStudents((prevStudents) => [...prevStudents, newStudent]);
      syncStudentUser(newStudent);

      return {
        success: true,
        student: newStudent,
      };
    },
    [readUsers, setStudents, students, syncStudentUser],
  );

  // =========================
  // GET STUDENT
  // =========================

  const getStudent = useCallback(
    (id) => {
      return students.find(
        (student) =>
          String(student.id) === String(id) ||
          String(student.studentId) === String(id),
      );
    },
    [students],
  );

  // =========================
  // UPDATE STUDENT
  // =========================

  const updateStudent = useCallback(
    (id, updatedData) => {
      const studentIdExists = students.some(
        (student) =>
          String(student.id) !== String(id) &&
          String(student.studentId).toLowerCase() ===
            String(updatedData.studentId).trim().toLowerCase(),
      );

      if (studentIdExists) {
        return {
          success: false,
          message: "Another student already uses this Student ID.",
        };
      }

      setStudents((prevStudents) =>
        prevStudents.map((student) =>
          String(student.id) === String(id)
            ? {
                ...student,

                ...updatedData,

                studentId: updatedData.studentId?.trim() || student.studentId,

                name: updatedData.name?.trim() || student.name,

                email: updatedData.email?.trim() || student.email,

                password: updatedData.password || student.password,

                role: "student",
              }
            : student,
        ),
      );

      const updatedStudent = {
        ...students.find((student) => String(student.id) === String(id)),
        ...updatedData,
        studentId: updatedData.studentId?.trim() || students.find((student) => String(student.id) === String(id))?.studentId,
        name: updatedData.name?.trim() || students.find((student) => String(student.id) === String(id))?.name,
        email: updatedData.email?.trim() || students.find((student) => String(student.id) === String(id))?.email,
      };

      if (updatedStudent?.id) {
        syncStudentUser(updatedStudent);
      }

      return {
        success: true,
      };
    },
    [setStudents, students, syncStudentUser],
  );

  // =========================
  // DELETE STUDENT
  // =========================

  const deleteStudent = useCallback(
    (id) => {
      const studentToDelete = students.find(
        (student) =>
          String(student.id) === String(id) ||
          String(student.studentId) === String(id),
      );

      const studentKeys = [
        String(id),
        String(studentToDelete?.id || ""),
        String(studentToDelete?.studentId || ""),
      ].filter(Boolean);

      const matchesStudentKey = (value) =>
        studentKeys.some((key) => String(value) === key);

      setStudents((prevStudents) =>
        prevStudents.filter(
          (student) =>
            !matchesStudentKey(student.id) &&
            !matchesStudentKey(student.studentId),
        ),
      );

      removeStudentUser(id);

      try {
        const coursesRaw = JSON.parse(localStorage.getItem("courses") || "[]");
        const courses = Array.isArray(coursesRaw) ? coursesRaw : [];

        const updatedCourses = courses.map((course) => ({
          ...course,
          students: (Array.isArray(course.students) ? course.students : []).filter(
            (studentRef) => !matchesStudentKey(studentRef),
          ),
          grades: (Array.isArray(course.grades) ? course.grades : []).filter(
            (grade) => grade && !matchesStudentKey(grade.studentId),
          ),
        }));

        localStorage.setItem("courses", JSON.stringify(updatedCourses));

        const usersRaw = JSON.parse(localStorage.getItem("users") || "[]");
        const users = Array.isArray(usersRaw) ? usersRaw : [];

        const updatedUsers = users.filter((user) => {
          if (user.role !== "student") {
            return true;
          }

          return (
            !matchesStudentKey(user.id) && !matchesStudentKey(user.studentId)
          );
        });

        localStorage.setItem("users", JSON.stringify(updatedUsers));

        const currentUserRaw = localStorage.getItem("currentUser");

        if (currentUserRaw) {
          const currentUser = JSON.parse(currentUserRaw);

          if (
            currentUser?.role === "student" &&
            (matchesStudentKey(currentUser.id) ||
              matchesStudentKey(currentUser.studentId))
          ) {
            localStorage.removeItem("currentUser");
          }
        }
      } catch (error) {
        console.error("Delete student cleanup error:", error);
      }

      return {
        success: true,
      };
    },
    [removeStudentUser, students, setStudents],
  );

  // =========================
  // ASSIGN STUDENT ID
  // =========================

  const assignStudentId = useCallback(
    (id) => {
      const student = students.find((item) => String(item.id) === String(id));

      if (!student) {
        return {
          success: false,
          message: "Student not found",
        };
      }

      if (student.studentId) {
        return {
          success: false,
          message: "Student already has a Student ID",
        };
      }

      const studentId = generateStudentId();

      setStudents((prevStudents) =>
        prevStudents.map((item) =>
          String(item.id) === String(id)
            ? {
                ...item,
                studentId,
                accountCreated: item.accountCreated || false,
              }
            : item,
        ),
      );

      const updatedStudent = {
        ...student,
        studentId,
      };

      syncStudentUser(updatedStudent);

      return {
        success: true,
        studentId,
      };
    },
    [generateStudentId, students, setStudents, syncStudentUser],
  );

  // =========================
  // ADD COURSE
  // =========================

  const addCourse = useCallback(
    (studentId, courseData) => {
      const newCourse = {
        id: Date.now(),
        ...courseData,
      };

      setStudents((prevStudents) =>
        prevStudents.map((student) =>
          String(student.id) === String(studentId) ||
          String(student.studentId) === String(studentId)
            ? {
                ...student,

                courses: [...(student.courses || []), newCourse],
              }
            : student,
        ),
      );

      return {
        success: true,
      };
    },
    [setStudents],
  );

  // =========================
  // UPDATE COURSE GRADE
  // =========================

  const updateCourseGrade = useCallback(
    (studentId, courseId, newGrade) => {
      setStudents((prevStudents) =>
        prevStudents.map((student) =>
          String(student.id) === String(studentId) ||
          String(student.studentId) === String(studentId)
            ? {
                ...student,

                courses: (student.courses || []).map((course) =>
                  String(course.id) === String(courseId)
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

      return {
        success: true,
      };
    },
    [setStudents],
  );

  // =========================
  // DELETE COURSE
  // =========================

  const deleteCourse = useCallback(
    (studentId, courseId) => {
      setStudents((prevStudents) =>
        prevStudents.map((student) =>
          String(student.id) === String(studentId) ||
          String(student.studentId) === String(studentId)
            ? {
                ...student,

                courses: (student.courses || []).filter(
                  (course) => String(course.id) !== String(courseId),
                ),
              }
            : student,
        ),
      );

      return {
        success: true,
      };
    },
    [setStudents],
  );

  return {
    students,

    addStudent,
    getStudent,
    updateStudent,
    deleteStudent,
    assignStudentId,

    addCourse,
    updateCourseGrade,
    deleteCourse,
  };
}

export default useStudents;
