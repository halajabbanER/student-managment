import { createContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

function AuthProvider({ children }) {
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
      const users = JSON.parse(localStorage.getItem("users")) || [];

      const defaultAccounts = [
        {
          id: 1,
          name: "System Admin",
          email: "admin@hala.com",
          password: "Admin123",
          role: "admin",
        },
        {
          id: 2,
          name: "Academic Staff",
          email: "academic@hala.com",
          password: "Academic123",
          role: "academic",
        },
      ];

      const updatedUsers = [...users];

      defaultAccounts.forEach((defaultAccount) => {
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
      });

      localStorage.setItem("users", JSON.stringify(updatedUsers));
    } catch (error) {
      console.error("Initialize Users Error:", error);
    }
  }, []);

  // Login
  const login = (identifier, password) => {
    try {
      const users = JSON.parse(localStorage.getItem("users")) || [];

      const foundUser = users.find((item) => {
        // Admin / Academic
        if (item.role === "admin" || item.role === "academic") {
          return (
            item.email?.toLowerCase() === String(identifier).toLowerCase() &&
            item.password === password
          );
        }

        // Student
        if (item.role === "student") {
          return (
            String(item.studentId) === String(identifier) &&
            item.password === password
          );
        }

        return false;
      });

      if (!foundUser) {
        return {
          success: false,
          message: "Invalid login information",
        };
      }

      setUser(foundUser);

      localStorage.setItem("currentUser", JSON.stringify(foundUser));

      return {
        success: true,
        user: foundUser,
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
export { AuthContext, AuthProvider };
