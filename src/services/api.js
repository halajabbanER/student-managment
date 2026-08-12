import axios from "axios";

const api = axios.create({
  baseURL: "https://jsonplaceholder.typicode.com",
  timeout: 5000,
});

// GET Students
export const fetchStudentsFromAPI = async () => {
  try {
    const response = await api.get("/users");

    const students = response.data.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      department: "Computer Engineering",
      level: "1st Year",
      status: "Active",
      courses: [],
      source: "api",
    }));

    return students;
  } catch (error) {
    console.error("Fetch Students Error:", error);

    throw new Error("Failed to fetch students");
  }
};

// POST Student
export const createStudentAPI = async (studentData) => {
  try {
    const response = await api.post("/users", studentData);

    return {
      ...studentData,
      id: response.data.id || Date.now(),
      courses: studentData.courses || [],
      source: "api",
    };
  } catch (error) {
    console.error("Create Student Error:", error);

    throw new Error("Failed to create student");
  }
};

// PUT Student
export const updateStudentAPI = async (studentId, updatedData) => {
  try {
    const response = await api.put(`/users/${studentId}`, updatedData);

    return {
      ...updatedData,
      ...response.data,
    };
  } catch (error) {
    console.error("Update Student Error:", error);

    throw new Error("Failed to update student");
  }
};

// DELETE Student
export const deleteStudentAPI = async (studentId) => {
  try {
    await api.delete(`/users/${studentId}`);

    return true;
  } catch (error) {
    console.error("Delete Student Error:", error);

    throw new Error("Failed to delete student");
  }
};

export default api;
