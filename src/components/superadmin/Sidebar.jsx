import { Link, useLocation } from "react-router-dom";
import { getAuth } from "firebase/auth";

export default function Sidebar() {
  const { pathname } = useLocation();

  const auth = getAuth();
  const user = auth.currentUser;

  // 🔐 إيميل مالك المنصة فقط
  const OWNER_EMAIL = "khalafmahrous2000@gmail.com";

  const isOwner =
    user &&
    user.email &&
    user.email.toLowerCase() === OWNER_EMAIL.toLowerCase();

  const MenuItem = ({ to, label }) => {
    const active = pathname.startsWith(to);

    return (
      <Link
        to={to}
        className={`block p-3 rounded-lg transition 
        ${
          active
            ? "bg-yellow-500 text-black"
            : "bg-gray-800 hover:bg-gray-700 text-white"
        }`}
      >
        {label}
      </Link>
    );
  };

  return (
    <div className="w-64 bg-gray-900 p-4 border-r border-gray-700 min-h-screen">
      <h2 className="text-xl font-bold mb-6 text-yellow-400">
        👑 Super Admin
      </h2>

      <nav className="space-y-3">
        <MenuItem to="/super-admin/dashboard" label="لوحة التحكم" />

        <MenuItem to="/super-admin/users" label="إدارة المستخدمين" />
        <MenuItem to="/super-admin/teachers" label="إدارة المدرسين" />
        <MenuItem to="/super-admin/students" label="إدارة الطلاب" />

        <MenuItem to="/super-admin/lessons" label="إدارة الدروس" />
        <MenuItem to="/super-admin/exams" label="إدارة الاختبارات" />

        <MenuItem to="/super-admin/payments" label="الدفع والاشتراكات" />
        <MenuItem to="/super-admin/plans" label="الباقات" />
        <MenuItem to="/super-admin/settings" label="إعدادات الموقع" />

        {/* 🔒 زر صامت + مخفي — للمالك فقط */}
        {isOwner && (
          <>
            <div className="border-t border-gray-700 my-4"></div>

            <MenuItem
              to="/super-admin/users"
              label="⚠️ التحكم في الصلاحيات (خاص)"
            />
          </>
        )}
      </nav>
    </div>
  );
}
