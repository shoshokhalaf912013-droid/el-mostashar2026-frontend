import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { getAuth, signOut } from "firebase/auth";

export default function Profile() {
  const { user, role } = useAuth();

  if (!user) return null;

  /* =========================
     LOGOUT REAL (Firebase)
  ========================== */
  const logoutNow = async () => {
    try {
      await signOut(getAuth());

      console.log("✅ USER LOGGED OUT COMPLETELY");

      // إعادة تحميل التطبيق لمسح أى Session
      window.location.reload();
    } catch (err) {
      console.error("❌ Logout Error:", err);
   _toggle
    }
  };

  const roleName = {
    "super-admin": "مدير النظام (سوبر أدمن)",
    admin: "مشرف",
    teacher: "معلم",
    student: "طالب",
  }[role] || "مستخدم";

  return (
    <div className="max-w-2xl mx-auto">

      {/* ===== CARD ===== */}
      <div className="card mb-4 flex items-center gap-6">

        <img
          src={user.photoURL || "/teacher.png"}
          alt="profile"
          className="w-24 h-24 rounded-lg object-cover"
        />

        <div>
          <h3 className="text-xl font-bold">
            {user.displayName || "المستخدم"}
          </h3>

          <p className="text-sm text-[rgba(255,255,255,0.7)]">
            {roleName}
          </p>

          <div className="mt-2 text-sm">
            البريد: {user.email}
          </div>
        </div>
      </div>

      {/* ===== STUDENT DATA ===== */}
      {role === "student" && (
        <div className="card">
          <h4 className="font-semibold mb-2">تقدم الطالب</h4>
          <ul>
            <li>دروس مكتملة: 12</li>
            <li>اختبارات: 4</li>
            <li>متوسط الدرجات: 82%</li>
          </ul>
        </div>
      )}

      {/* ===== REAL LOGOUT BUTTON ===== */}
      <div className="mt-6 text-center">
        <button
          onClick={logoutNow}
          className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-bold"
        >
          تسجيل خروج حقيقى
        </button>
      </div>

    </div>
  );
}
