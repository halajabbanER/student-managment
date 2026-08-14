import { useEffect, useState } from "react";

import AuthContext from "./AuthContext.js";

function readList(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || "[]");
  } catch (error) {
    console.error(`${key} storage error:`, error);
    return [];
  }
}

function writeList(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

const DEFAULT_ADMIN_ACCOUNT = {
  id: 1,
  name: "System Admin",
  email: "admin@hala.com",
  password: "Admin123",
  role: "admin",
};

const DEFAULT_ACADEMIC_ACCOUNT = {
  id: 2,
  name: "Academic Staff",
  email: "academic@hala.com",
  password: "Academic123",
  role: "academic",
};

const DEFAULT_STUDENT_ACCOUNT = {
  id: 20032003,
  name: "Demo Student",
  studentId: "20032003",
  email: "student@hala.com",
  password: "Student123",
  department: "Computer Engineering",
  level: "1st Year",
  status: "Active",
  role: "student",
  accountCreated: true,
  courses: [],
  exams: [],
  schedule: [],
};



export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("currentUser");

      return savedUser ? JSON.parse(savedUser) : null;
    } catch (error) {
      console.error("Current User Error:", error);

      return null;
    }
  });

  // Create default Admin + Academic accounts
  useEffect(() => {
    try {
      const users = readList("users");
      const students = readList("students");

      const updatedUsers = [...users];

      [DEFAULT_ADMIN_ACCOUNT, DEFAULT_ACADEMIC_ACCOUNT].forEach(
        (defaultAccount) => {
          const existingIndex = updatedUsers.findIndex(
            (item) =>
              item.role === defaultAccount.role &&
              item.email?.toLowerCase() === defaultAccount.email.toLowerCase(),
          );

          if (existingIndex >= 0) {
            updatedUsers[existingIndex] = {
              ...updatedUsers[existingIndex],
              ...defaultAccount,
            };
            return;
          }

          updatedUsers.push(defaultAccount);
        },
      );

      writeList("users", updatedUsers);

      const existingStudentIndex = students.findIndex(
        (item) =>
          String(item.studentId) === String(DEFAULT_STUDENT_ACCOUNT.studentId),
      );

      const updatedStudents =
        existingStudentIndex >= 0
          ? students.map((item, index) =>
              index === existingStudentIndex
                ? {
                    ...item,
                    ...DEFAULT_STUDENT_ACCOUNT,
                  }
                : item,
            )
          : [...students, DEFAULT_STUDENT_ACCOUNT];

      writeList("students", updatedStudents);
    } catch (error) {
      console.error("Initialize Users Error:", error);
    }
  }, []);

  // Login
  const login = (identifier, password) => {
    try {
      const cleanIdentifier = String(identifier).trim();
      const cleanPassword = String(password);
      const students = readList("students");
      const teachers = readList("teachers");
      const academicUsers = readList("academicUsers");
      const users = readList("users");

      const student = students.find(
        (item) =>
          String(item.studentId) === cleanIdentifier &&
          String(item.password) === cleanPassword,
      );

      if (student) {
        if (student.status === "Inactive") {
          return {
            success: false,
            message: "Your student account is inactive.",
          };
        }

        const foundUser = {
          ...student,
          role: "student",
        };

        setUser(foundUser);

        localStorage.setItem("currentUser", JSON.stringify(foundUser));

        return {
          success: true,
          user: foundUser,
        };
      }

      const teacher = teachers.find(
        (item) =>
          String(item.teacherId || item.id) === cleanIdentifier &&
          String(item.password) === cleanPassword,
      );

      const registeredTeacher = users.find(
        (item) =>
          item.role === "teacher" &&
          String(item.teacherId || item.id) === cleanIdentifier &&
          String(item.password) === cleanPassword,
      );

      const teacherAccount = teacher || registeredTeacher;

      if (teacherAccount) {
        if (teacherAccount.status === "Inactive") {
          return {
            success: false,
            message: "Your teacher account is inactive.",
          };
        }

        const foundUser = {
          ...teacherAccount,
          role: "teacher",
        };

        setUser(foundUser);

        localStorage.setItem("currentUser", JSON.stringify(foundUser));

        return {
          success: true,
          user: foundUser,
        };
      }

      const academic =
        academicUsers.find(
          (item) =>
            String(item.email || "").toLowerCase() ===
              cleanIdentifier.toLowerCase() &&
            String(item.password) === cleanPassword,
        ) ||
        users.find(
          (item) =>
            item.role === "academic" &&
            String(item.email || "").toLowerCase() ===
              cleanIdentifier.toLowerCase() &&
            String(item.password) === cleanPassword,
        );

      if (academic) {
        const foundUser = {
          ...academic,
          role: "academic",
        };

        setUser(foundUser);

        localStorage.setItem("currentUser", JSON.stringify(foundUser));

        return {
          success: true,
          user: foundUser,
        };
      }

      const legacyAdmin = users.find(
        (item) =>
          item.role === "admin" &&
          String(item.email || "").toLowerCase() ===
            cleanIdentifier.toLowerCase() &&
          String(item.password) === cleanPassword,
      );

      if (legacyAdmin) {
        setUser(legacyAdmin);

        localStorage.setItem("currentUser", JSON.stringify(legacyAdmin));

        return {
          success: true,
          user: legacyAdmin,
        };
      }

      if (!users.length && !students.length && !teachers.length) {
        return {
          success: false,
          message: "Invalid login information",
        };
      }

      return {
        success: false,
        message: "Invalid login information",
      };
    } catch (error) {
      console.error("Login Error:", error);

      return {
        success: false,
        message: "Something went wrong",
      };
    }
  };

  // Student Register
  const register = (userData) => {
    try {
      const users = JSON.parse(localStorage.getItem("users")) || [];

      const students = JSON.parse(localStorage.getItem("students")) || [];

      const studentExists = students.find(
        (student) => String(student.studentId) === String(userData.studentId),
      );

      if (!studentExists) {
        return {
          success: false,
          message:
            "Student ID not found. Please contact Academic Administration.",
        };
      }

      const existingUser = users.find(
        (item) =>
          item.role === "student" &&
          String(item.studentId) === String(userData.studentId),
      );

      if (existingUser) {
        return {
          success: false,
          message: "This Student ID is already registered",
        };
      }

      const newUser = {
        id: Date.now(),
        name: studentExists.name,
        studentId: studentExists.studentId,
        password: userData.password,
        role: "student",
      };

      localStorage.setItem("users", JSON.stringify([...users, newUser]));

      const updatedStudents = students.map((student) =>
        String(student.studentId) === String(userData.studentId)
          ? {
              ...student,
              accountCreated: true,
            }
          : student,
      );

      localStorage.setItem("students", JSON.stringify(updatedStudents));

      return {
        success: true,
        user: newUser,
      };
    } catch (error) {
      console.error("Register Error:", error);

      return {
        success: false,
        message: "Something went wrong",
      };
    }
  };

  // Teacher Register
  const registerTeacher = (userData) => {
    try {
      const users = JSON.parse(localStorage.getItem("users")) || [];
      const teachers = JSON.parse(localStorage.getItem("teachers")) || [];

      const teacherExists = teachers.find(
        (teacher) => String(teacher.teacherId) === String(userData.teacherId),
      );

      if (!teacherExists) {
        return {
          success: false,
          message:
            "Teacher ID not found. Please contact Academic Administration.",
        };
      }

      const existingUser = users.find(
        (item) =>
          item.role === "teacher" &&
          String(item.teacherId) === String(userData.teacherId),
      );

      if (existingUser) {
        return {
          success: false,
          message: "This Teacher ID is already registered",
        };
      }

      const newUser = {
        id: Date.now(),
        name: teacherExists.name,
        teacherId: teacherExists.teacherId,
        password: userData.password,
        role: "teacher",
      };

      localStorage.setItem("users", JSON.stringify([...users, newUser]));

      const updatedTeachers = teachers.map((teacher) =>
        String(teacher.teacherId) === String(userData.teacherId)
          ? {
              ...teacher,
              password: userData.password,
              accountCreated: true,
            }
          : teacher,
      );

      localStorage.setItem("teachers", JSON.stringify(updatedTeachers));

      return {
        success: true,
        user: newUser,
      };
    } catch (error) {
      console.error("Teacher Register Error:", error);

      return {
        success: false,
        message: "Something went wrong",
      };
    }
  };

  // Academic Register
  const registerAcademic = (userData) => {
    try {
      const users = JSON.parse(localStorage.getItem("users")) || [];
      const academicUsers = JSON.parse(
        localStorage.getItem("academicUsers"),
      ) || [];

      const email = String(userData.email || "").trim().toLowerCase();

      const existingAcademic = academicUsers.find(
        (item) => String(item.email || "").trim().toLowerCase() === email,
      );

      if (existingAcademic) {
        return {
          success: false,
          message: "This academic email is already registered",
        };
      }

      const newAcademic = {
        id: Date.now(),
        name: String(userData.name || "").trim(),
        email,
        password: userData.password,
        role: "academic",
      };

      localStorage.setItem(
        "academicUsers",
        JSON.stringify([...academicUsers, newAcademic]),
      );

      const existingUser = users.find(
        (item) =>
          item.role === "academic" &&
          String(item.email || "").trim().toLowerCase() === email,
      );

      const updatedUsers = existingUser
        ? users.map((item) =>
            item.role === "academic" &&
            String(item.email || "").trim().toLowerCase() === email
              ? {
                  ...item,
                  ...newAcademic,
                }
              : item,
          )
        : [...users, newAcademic];

      localStorage.setItem("users", JSON.stringify(updatedUsers));

      return {
        success: true,
        user: newAcademic,
      };
    } catch (error) {
      console.error("Academic Register Error:", error);

      return {
        success: false,
        message: "Something went wrong",
      };
    }
  };

  // Logout
  const logout = () => {
    setUser(null);

    localStorage.removeItem("currentUser");
  };

  const isAuthenticated = Boolean(user);
  const isAdmin = user?.role === "admin";
  const isAcademic = user?.role === "academic";
  const isStudent = user?.role === "student";

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        registerTeacher,
        registerAcademic,
        logout,
        isAuthenticated,
        isAdmin,
        isAcademic,
        isStudent,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
