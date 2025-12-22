import React from "react";
import { Outlet } from "react-router-dom";

/**
 * StudentLayout
 * ----------------------------
 * Layout ثابت لكل صفحات الطالب
 * - لا يحتوي Sidebar حاليًا (سنضيفه لاحقًا بشكل صحيح)
 * - فقط حاوية آمنة للـ Outlet
 * - لا منطق – لا state – لا Firebase
 * ----------------------------
 * هذا الملف آمن 100% ولن يسبب أي انهيار
 */

export default function StudentLayout() {
  return (
    <div className="min-h-screen bg-black text-white">
      <main className="w-full min-h-screen p-6">
        <Outlet />
      </main>
    </div>
  );
}
