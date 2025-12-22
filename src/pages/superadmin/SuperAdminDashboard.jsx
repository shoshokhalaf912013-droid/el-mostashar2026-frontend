import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../../components/superadmin/Sidebar";
import Topbar from "../../components/superadmin/Topbar";
import Navbar from "../../components/Navbar";
import UsersRolesViewer from "../../components/admin/UsersRolesViewer";

export default function SuperAdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-900 text-white overflow-x-hidden">

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

          <div className="p-6 space-y-8">

            {/* 🔐 أداة السوبر أدمن – عرض المستخدمين والأدوار */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
              <h2 className="text-lg font-bold text-yellow-400 mb-4">
                إدارة المستخدمين والأدوار
              </h2>

              <UsersRolesViewer />
            </div>

            {/* ⬇️ الصفحات الفرعية */}
            <Outlet />

          </div>
        </div>

      </div>
    </div>
  );
}
