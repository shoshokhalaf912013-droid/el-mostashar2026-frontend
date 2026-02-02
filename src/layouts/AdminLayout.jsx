import React from "react";
import { Outlet, useNavigate } from "react-router-dom";

function NavItem({ label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full text-right px-4 py-2 rounded hover:bg-gray-800 transition"
    >
      {label}
    </button>
  );
}

export default function AdminLayout() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen bg-black text-white" dir="rtl">
      {/* Sidebar */}
      <aside className="w-64 bg-[#111] border-l border-gray-700 p-4">
        <h2 className="text-xl font-bold text-yellow-400 mb-6">
          Admin Panel
        </h2>

        <nav className="space-y-3">
          <NavItem
            label="الرئيسية"
            onClick={() => navigate("/admin")}
          />

          <NavItem
            label="إدارة المستخدمين"
            onClick={() => navigate("/admin/users")}
          />

          <NavItem
            label="إدارة الوحدات والدروس"
            onClick={() => navigate("/admin/lessons-manager")}
          />

          <NavItem
            label="التقارير"
            onClick={() => navigate("/admin/reports")}
          />
        </nav>
      </aside>

      {/* Content */}
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}
