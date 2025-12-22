import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar({ role, isSuperAdmin }) {
  const navigate = useNavigate();

  // نحتفظ بالمصدر الاحتياطي بدون الاعتماد عليه وحده
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  // 🔒 تطبيع الدور (آمن)
  const normalizedRole = role || user?.role || "";

  const isSuper =
    isSuperAdmin ||
    normalizedRole === "super-admin" ||
    normalizedRole === "superadmin";

  const isStudent = normalizedRole === "student";

  return (
    <nav className="navbar" dir="rtl">
      {/* الشعار */}
      <div className="text-gold font-bold text-xl">المستشار 2026</div>

      {/* روابط الموقع */}
      <ul className="nav-links">
        <li><Link to="/">الرئيسية</Link></li>
        <li><Link to="/about">عن الموقع</Link></li>
        <li><Link to="/policy">سياسة الخصوصية</Link></li>
        <li><Link to="/contact">اتصل بنا</Link></li>

        {/* ✅ بوابة ثابتة للمواد التعليمية (للطلاب فقط) */}
        {isStudent && (
          <li>
            <Link to="/student/select-stage" className="student-subjects-link">
              المواد التعليمية
            </Link>
          </li>
        )}
      </ul>

      {/* الأزرار */}
      <div className="flex items-center gap-3">
        {/* 👑 زر السوبر أدمن (المسار الصحيح فقط) */}
        {isSuper && (
          <Link
            to="/super-admin"
            className="superadmin-btn flex items-center gap-1"
          >
            ⚡ لوحة تحكم السوبر أدمن
          </Link>
        )}

        <Link to="/profile" className="btn-gold text-black px-4 py-2">
          الملف الشخصي
        </Link>

        <button
          onClick={handleLogout}
          className="border border-gold text-gold px-4 py-2 rounded-xl hover:bg-gold hover:text-black duration-200"
        >
          تسجيل خروج
        </button>
      </div>
    </nav>
  );
}
