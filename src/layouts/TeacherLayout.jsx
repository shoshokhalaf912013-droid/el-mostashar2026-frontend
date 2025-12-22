import React from "react";
import { Outlet, useNavigate } from "react-router-dom";

export default function TeacherLayout() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen bg-black text-white" dir="rtl">
      {/* Sidebar */}
      <aside className="w-64 bg-[#111] border-l border-gray-700 p-4">
        <h2 className="text-xl font-bold text-yellow-400 mb-6">
          لوحة المعلم
        </h2>

        <nav className="space-y-3">
          <NavItem label="إدارة الدروس" onClick={() => navigate("/lessons/manage")} />
          <NavItem label="فيديوهاتي" onClick={() => navigate("/lessons/manage")} />
          <NavItem label="الكويزات" onClick={() => navigate("/lessons/manage")} />
        </nav>
      </aside>

      {/* Content */}
      <main className="flex-1 p-6">
        {/* Navbar */}
        <div className="mb-6 border-b border-gray-700 pb-3">
          <h1 className="text-lg text-yellow-300">
            لوحة تحكم المعلم
          </h1>
        </div>

        <Outlet />
      </main>
    </div>
  );
}

function NavItem({ label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="block w-full text-right px-3 py-2 rounded
                 hover:bg-gray-800 transition"
    >
      {label}
    </button>
  );
}
