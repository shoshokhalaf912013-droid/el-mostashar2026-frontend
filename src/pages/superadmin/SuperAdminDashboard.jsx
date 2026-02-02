import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../../components/superadmin/Sidebar";
import Topbar from "../../components/superadmin/Topbar";
import Navbar from "../../components/Navbar";
import UsersRolesViewer from "../../components/admin/UsersRolesViewer";

export default function SuperAdminDashboard() {
  const [selectedUnit, setSelectedUnit] = useState(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white overflow-x-hidden">

      {/* ✅ Navbar */}
      <Navbar role="super-admin" isSuperAdmin={true} />

      {/* ✅ الهيكل الرئيسي */}
      <div className="flex w-full">

        {/* ✅ Sidebar */}
        <div className="w-72 flex-shrink-0">
          <Sidebar />
        </div>

        {/* ✅ المحتوى */}
        <div className="flex-1 min-w-0">
          <Topbar />

          <div className="p-8 space-y-10">

            {/* 🔐 إدارة المستخدمين */}
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-xl blur opacity-30 group-hover:opacity-60 transition"></div>
              <div className="relative bg-gray-900 border border-yellow-500/40 rounded-xl p-6">
                <h2 className="text-2xl font-extrabold text-yellow-400 mb-6 tracking-wide">
                  🛡️ صلاحيات المنصة
                </h2>
                <UsersRolesViewer />
              </div>
            </div>

            {/* 🧩 Control Panels */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

              {/* Units Panel */}
              <div
                className="relative group cursor-pointer"
                onClick={() =>
                  setSelectedUnit({ id: "u1", name: "الوحدة الأولى" })
                }
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-2xl blur opacity-25 group-hover:opacity-70 transition-all duration-500"></div>

                <div className="relative bg-gray-900 rounded-2xl border border-yellow-500/50 p-8 transform transition-all duration-500 group-hover:-translate-y-1 group-hover:scale-[1.02]">
                  <h3 className="text-3xl font-black text-yellow-400 mb-4">
                    📦 الوحدات
                  </h3>
                  <p className="text-gray-400 text-sm">
                    إدارة الوحدات داخل المادة المختارة
                  </p>
                </div>
              </div>

              {/* Lessons Panel */}
              {selectedUnit && (
                <div className="relative group animate-fadeIn">
                  <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-2xl blur opacity-25 group-hover:opacity-70 transition-all duration-500"></div>

                  <div className="relative bg-gray-900 rounded-2xl border border-yellow-500/50 p-8 transform transition-all duration-500 group-hover:-translate-y-1 group-hover:scale-[1.02]">
                    <h3 className="text-3xl font-black text-yellow-400 mb-4">
                      📘 دروس {selectedUnit.name}
                    </h3>

                    <div className="space-y-3">
                      <div className="p-4 rounded-lg bg-black/60 hover:bg-yellow-500 hover:text-black transition">
                        الدرس الأول
                      </div>
                      <div className="p-4 rounded-lg bg-black/60 hover:bg-yellow-500 hover:text-black transition">
                        الدرس الثاني
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* ⬇️ أي صفحات قديمة ما زالت تعمل */}
            <Outlet />

          </div>
        </div>

      </div>
    </div>
  );
}
