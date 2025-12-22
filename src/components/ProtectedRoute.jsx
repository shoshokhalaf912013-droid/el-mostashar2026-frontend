// src/components/ProtectedRoute.jsx

import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function ProtectedRoute({ children, roles = [] }) {
  const { user, role } = useAuth();

  // مرحلة التحميل
  if (user === undefined || role === undefined) {
    return (
      <div className="text-center text-yellow-400 p-6 text-xl">
        ⏳ جاري التحقق من صلاحيات الوصول...
      </div>
    );
  }

  // لم يسجل دخول
  if (!user) return <Navigate to="/login" replace />;

  // تحقق الصلاحيات
  if (roles.length > 0 && !roles.includes(role?.toLowerCase())) {
    return <Navigate to="/" replace />;
  }

  // مسموح له بالدخول
  return children;
}
