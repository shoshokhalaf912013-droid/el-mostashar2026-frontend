import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../../components/superadmin/Sidebar";

export default function SuperAdminLayout() {
  return (
    <div className="flex min-h-screen bg-black text-white">
      
      {/* ✅ القائمة الجانبية القديمة */}
      <Sidebar />

      {/* ✅ محتوى الصفحات */}
      <div className="flex-1 p-6">
        <Outlet />
      </div>

    </div>
  );
}
