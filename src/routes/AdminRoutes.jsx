import { Routes, Route, Navigate } from "react-router-dom";

import AdminLayout from "../layouts/AdminLayout.jsx";

import AdminDashboard from "../pages/Admin/AdminDashboard.jsx";
import AddExam from "../pages/Admin/AddExam.jsx";
import AddLesson from "../pages/Admin/AddLesson.jsx";
import AddQuestion from "../pages/Admin/AddQuestion.jsx";

/* ✅ صفحة إدارة الوحدات والدروس */
import AdminSubjectBuilder from "../pages/Admin/AdminSubjectBuilder.jsx";

/* ✅ إدارة الدروس فقط */
import AdminLessonsManager from "../pages/Admin/AdminLessonsManager.jsx";

import RequireRole from "../components/shared/RequireRole";

export default function AdminRoutes() {
  return (
    <Routes>
      <Route
        element={
          <RequireRole allowedRoles={["admin", "super-admin"]}>
            <AdminLayout />
          </RequireRole>
        }
      >
        {/* الرئيسية */}
        <Route index element={<AdminDashboard />} />

        <Route path="dashboard" element={<Navigate to="/admin" replace />} />

        {/* الامتحانات */}
        <Route path="add-exam" element={<AddExam />} />

        {/* الدروس */}
        <Route path="add-lesson" element={<AddLesson />} />

        {/* الأسئلة */}
        <Route path="add-question" element={<AddQuestion />} />

        {/* إدارة الدروس فقط */}
        <Route
          path="lessons-manager"
          element={<AdminLessonsManager />}
        />

        {/* ⭐ إدارة الوحدات + الدروس (رابط ثابت وواضح) */}
        <Route
          path="subjects-builder"
          element={<AdminSubjectBuilder />}
        />

        {/* مسار ديناميكي (اختياري – للاستخدام المتقدم لاحقًا) */}
        <Route
          path="subjects/:gradeId/:subjectKey"
          element={<AdminSubjectBuilder />}
        />
      </Route>
    </Routes>
  );
}
