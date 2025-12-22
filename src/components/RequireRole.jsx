import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function RequireRole({ allow, children }) {
  const { role, loading, user } = useAuth();

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-yellow-400">
        ⏳ جاري التحقق من الصلاحيات...
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  if (!allow.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}
