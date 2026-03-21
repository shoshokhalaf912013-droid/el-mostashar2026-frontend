// src/routes/TeacherRoutes.jsx

import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

import TeacherLayout from "../components/teacher/TeacherLayout";

import TeacherDashboard from "../pages/teacher/TeacherDashboard";
import TeacherLessons from "../pages/teacher/TeacherLessons";
import TeacherExams from "../pages/teacher/TeacherExams";
import AddLesson from "../pages/teacher/AddLesson";

/* ===== EXAM SYSTEM ===== */

import ExamBuilder from "../pages/teacher/ExamBuilder";
import ExamEdit from "../pages/teacher/ExamEdit";
import ExamPreview from "../pages/teacher/ExamPreview";

/* ===== LIVE SYSTEM ===== */

import TeacherLiveRoom from "../features/liveClass/TeacherLiveRoom";
import TeacherLiveRoomWrapper from "../features/liveClass/TeacherLiveRoomWrapper";

export default function TeacherRoutes() {

  const { role, loading } = useAuth();

  /* ================= WAIT AUTH ================= */

  if (loading || !role) {
    return <div style={{ padding: 40 }}>Loading...</div>;
  }

  /* ================= ROLE PROTECTION ================= */

  const allowedRoles = ["teacher", "admin", "super-admin"];

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  /* ================= ROUTES ================= */

  return (
    <Routes>

      <Route element={<TeacherLayout />}>

        {/* ===== Dashboard ===== */}

        <Route index element={<TeacherDashboard />} />

        {/* ===== Lessons ===== */}

        <Route path="lessons" element={<TeacherLessons />} />
        <Route path="lessons/add" element={<AddLesson />} />

        {/* ===== Exams ===== */}

        <Route path="exams" element={<TeacherExams />} />

        {/* ===== EXAM BUILDER ===== */}

        <Route
          path="exam-builder/:gradeId/:subjectId/:unitId/:lessonId"
          element={<ExamBuilder />}
        />

        <Route
          path="exam-edit/:gradeId/:subjectId/:unitId/:lessonId"
          element={<ExamEdit />}
        />

        <Route
          path="exam-preview/:gradeId/:subjectId/:unitId/:lessonId"
          element={<ExamPreview />}
        />

        {/* ===== LIVE SYSTEM ===== */}

        <Route path="live" element={<TeacherLiveRoom />} />

        <Route
          path="live/:lessonId"
          element={<TeacherLiveRoomWrapper />}
        />

      </Route>

    </Routes>
  );

}