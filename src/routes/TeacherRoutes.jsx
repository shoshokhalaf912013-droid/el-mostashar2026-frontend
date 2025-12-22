// src/routes/TeacherRoutes.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

import TeacherLayout from "../components/teacher/TeacherLayout";

import TeacherDashboard from "../pages/teacher/TeacherDashboard";
import TeacherLessons from "../pages/teacher/TeacherLessons";
import TeacherExams from "../pages/teacher/TeacherExams";
import AddLesson from "../pages/teacher/AddLesson";

export default function TeacherRoutes() {
  const { role, loading } = useAuth();

  if (loading) return null;

  if (role !== "teacher" && role !== "admin" && role !== "super-admin") {
    return <Navigate to="/" replace />;
  }

  return (
    <Routes>
      <Route element={<TeacherLayout />}>
        <Route index element={<TeacherDashboard />} />
        <Route path="lessons" element={<TeacherLessons />} />
        <Route path="lessons/add" element={<AddLesson />} />
        <Route path="exams" element={<TeacherExams />} />
      </Route>
    </Routes>
  );
}
