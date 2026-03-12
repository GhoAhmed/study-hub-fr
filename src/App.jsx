import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Courses from "./pages/Courses";
import CourseDetail from "./pages/CourseDetail";
import InstructorDashboard from "./pages/instructor/InstructorDashboard";
import InstructorCourses from "./pages/instructor/InstructorCourses";
import InstructorCourseForm from "./pages/instructor/InstructorCourseForm";
import StudentDashboard from "./pages/student/StudentDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminInstructors from "./pages/admin/AdminInstructors";
import InstructorCourseDetail from "./pages/instructor/InstructorCourseDetail";
import StudentCourseView from "./pages/student/StudentCourseView";

const PrivateRoute = ({ children, role }) => {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to="/login" />;
  return children;
};

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/instructor"
        element={
          <PrivateRoute role="instructor">
            <InstructorDashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/instructor/courses"
        element={
          <PrivateRoute role="instructor">
            <InstructorCourses />
          </PrivateRoute>
        }
      />
      <Route
        path="/instructor/courses/create"
        element={
          <PrivateRoute role="instructor">
            <InstructorCourseForm />
          </PrivateRoute>
        }
      />
      <Route
        path="/instructor/courses/edit/:id"
        element={
          <PrivateRoute role="instructor">
            <InstructorCourseForm />
          </PrivateRoute>
        }
      />
      <Route
        path="/instructor/courses/:id/content"
        element={
          <PrivateRoute role="instructor">
            <InstructorCourseDetail />
          </PrivateRoute>
        }
      />
      <Route
        path="/student"
        element={
          <PrivateRoute role="student">
            <StudentDashboard />
          </PrivateRoute>
        }
      />
      <Route path="/courses" element={<Courses />} />
      <Route path="/courses/:id" element={<CourseDetail />} />
      <Route
        path="/student"
        element={
          <PrivateRoute role="student">
            <StudentDashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/student/courses/:id"
        element={
          <PrivateRoute role="student">
            <StudentCourseView />
          </PrivateRoute>
        }
      />

      <Route
        path="/admin"
        element={
          <PrivateRoute role="admin">
            <AdminDashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <PrivateRoute role="admin">
            <AdminUsers />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/instructors"
        element={
          <PrivateRoute role="admin">
            <AdminInstructors />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}
