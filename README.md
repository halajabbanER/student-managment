# 🎓 Student Management System

A modern and responsive **Student Management System** built with **React.js**.

The application allows users to manage student records, courses, grades, and academic information through a simple and user-friendly dashboard.

## ✨ Features

- 🔐 Login & Register
- 🛡️ Protected Routes
- 🚪 Logout
- 💾 LocalStorage
- 🌙 Dark / Light Mode
- 📊 Dashboard Statistics
- 👨‍🎓 Add Students
- ✏️ Edit Students
- 🗑️ Delete Students
- 👁️ View Student Details
- 🔍 Search Students
- 🎯 Filter by Department
- 🎯 Filter by Status
- 🎯 Filter by Academic Level
- 📚 Add Courses
- 📝 Add & Edit Grades
- 📊 Automatic Grade Average
- ❌ Delete Courses
- 🌐 Axios API Integration
- 🔄 GET / POST / PUT / DELETE
- ⏳ Loading Spinner
- ⚠️ API Error Handling
- 🔁 Try Again
- 🚫 404 Page
- 🛡️ Error Boundary
- 📱 Responsive Design
- ⚡ Performance Optimization

---

## 🛠️ Technologies

- React.js
- JavaScript (ES6+)
- Vite
- React Router
- Axios
- CSS3
- Bootstrap Icons
- LocalStorage
- JSONPlaceholder API

---

## ⚛️ React Concepts Used

This project includes several important React concepts:

- Components
- Props
- State
- `useState`
- `useEffect`
- `useMemo`
- `useCallback`
- `useContext`
- Custom Hooks
- Context API
- React Router
- Protected Routes
- `React.memo`
- Error Boundary

---

## 🪝 Custom Hooks

The project uses custom hooks to keep the code clean and reusable.

### useStudents

Handles student and course operations.

### useLocalStorage

Stores and retrieves application data using LocalStorage.

### useForm

Manages form values and changes.

### useAuth

Provides authentication information through AuthContext.

---

## 🌐 API

The project uses **Axios** with the JSONPlaceholder API for practicing API operations.

Supported operations:

- `GET` – Fetch students
- `POST` – Add student
- `PUT` – Update student
- `DELETE` – Delete student

> JSONPlaceholder is a mock API. POST, PUT, and DELETE requests are simulated and are not permanently stored on its server.

LocalStorage is also used to keep application data available after refreshing the page.

---

## 🔐 Authentication

The application includes a simple authentication system with:

- Register
- Login
- Logout
- Form Validation
- Regex Validation
- AuthContext
- useAuth
- PrivateRoute
- LocalStorage session persistence

Users who are not logged in cannot access protected pages such as the Dashboard or Students page.

---

## 🌙 Dark Mode

The application supports **Dark and Light Mode**.

The selected theme is stored in LocalStorage, so the user's theme remains active after refreshing the page.

---

## 📂 Project Structure

```text
src/
│
├── components/
│   ├── auth/
│   ├── common/
│   └── students/
│
├── contexts/
│   └── AuthContext.jsx
│
├── hooks/
│   ├── useAuth.js
│   ├── useForm.js
│   ├── useLocalStorage.js
│   └── useStudents.js
│
├── pages/
│   ├── HomePage.jsx
│   ├── StudentsPage.jsx
│   ├── StudentDetailsPage.jsx
│   ├── StudentFormPage.jsx
│   ├── AddStudentPage.jsx
│   ├── LoginPage.jsx
│   ├── RegisterPage.jsx
│   └── NotFoundPage.jsx
│
├── services/
│   └── api.js
│
├── App.jsx
├── main.jsx
└── index.css

Eng:Hala jabban
