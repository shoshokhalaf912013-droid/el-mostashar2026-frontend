import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

// styles
import "./styles/index.css";
import "./styles/theme.css";
import "./styles/admin-dashboard.css";
import "./styles/layout.css";

// auth
import { useAuth } from "./contexts/AuthContext";

// layout
import Layout from "./components/Layout.jsx";

// pages
import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";
import Policy from "./pages/Policy.jsx";
import SubscriptionPlans from "./pages/SubscriptionPlans.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Profile from "./pages/Profile.jsx";

// routes
import CoursesRoutes from "./routes/CoursesRoutes.jsx";
import ExamsRoutes from "./routes/ExamsRoutes.jsx";
import AdminRoutes from "./routes/AdminRoutes.jsx";
import StudentRoutes from "./routes/StudentRoutes.jsx";
import SuperAdminRoutes from "./routes/SuperAdminRoutes.jsx";
import TeacherRoutes from "./routes/TeacherRoutes.jsx";

export default function App() {
  const location = useLocation();
  const isHome = location.pathname === "/";

  const { user, role, loading } = useAuth();

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-yellow-400 text-xl">
        ⏳ جاري التحقق من الحساب...
      </div>
    );
  }

  const isSuperAdmin = role === "super-admin";
  const isAdmin = role === "admin";
  const isTeacher = role === "teacher";
  const isStudent = role === "student";

  const canUpload = isAdmin || isSuperAdmin || isTeacher;

  return (
    <Routes>
      {/* auth */}
      <Route path="/login" element={<Login />} />
      <Route path="/student/register" element={<Register />} />

      {/* Layout الرئيسي */}
      <Route
        path="/"
        element={
          <Layout
            user={user}
            role={role}
            isSuperAdmin={isSuperAdmin}
            isAdmin={isAdmin}
            isTeacher={isTeacher}
            isStudent={isStudent}
            canUpload={canUpload}
            isHome={isHome}
          />
        }
      >
        {/* صفحات عامة */}
        <Route index element={<Home />} />
        <Route path="subscription-plans" element={<SubscriptionPlans />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path="policy" element={<Policy />} />

        {/* Modules */}
        <Route path="courses/*" element={<CoursesRoutes />} />
        <Route path="exams/*" element={<ExamsRoutes />} />

        <Route
          path="profile"
          element={user ? <Profile /> : <Navigate to="/login" />}
        />

        {/* ✅ الطالب */}
        <Route path="student/*" element={<StudentRoutes />} />
      </Route>

      {/* dashboards منفصلة */}
      <Route path="/super-admin/*" element={<SuperAdminRoutes />} />
      <Route path="/admin/*" element={<AdminRoutes />} />
      <Route path="/teacher/*" element={<TeacherRoutes />} />

      {/* fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
