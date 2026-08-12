import { createContext, useState } from "react";

export const AuthContext = createContext();

function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("currentUser");

      return savedUser ? JSON.parse(savedUser) : null;
    } catch (error) {
      console.error("Error reading current user:", error);
      return null;
    }
  });

  const login = (email, password) => {
    try {
      const normalizedEmail = String(email).trim().toLowerCase();
      const users = JSON.parse(localStorage.getItem("users")) || [];

      const foundUser = users.find(
        (user) =>
          user.email.trim().toLowerCase() === normalizedEmail &&
          user.password === password,
      );

      if (!foundUser) {
        return {
          success: false,
          message: "Invalid email or password",
        };
      }

      setUser(foundUser);

      localStorage.setItem("currentUser", JSON.stringify(foundUser));

      return {
        success: true,
        user: foundUser,
      };
    } catch (error) {
      console.error("Login error:", error);

      return {
        success: false,
        message: "Something went wrong",
      };
    }
  };

  const register = (userData) => {
    try {
      const users = JSON.parse(localStorage.getItem("users")) || [];

      const existingUser = users.find(
        (user) => user.email.toLowerCase() === userData.email.toLowerCase(),
      );

      if (existingUser) {
        return {
          success: false,
          message: "This email is already registered",
        };
      }

      const newUser = {
        id: Date.now(),
        name: userData.name,
        email: userData.email,
        password: userData.password,
      };

      const updatedUsers = [...users, newUser];

      localStorage.setItem("users", JSON.stringify(updatedUsers));

      return {
        success: true,
      };
    } catch (error) {
      console.error("Register error:", error);

      return {
        success: false,
        message: "Something went wrong",
      };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("currentUser");
  };

  const isAuthenticated = Boolean(user);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
