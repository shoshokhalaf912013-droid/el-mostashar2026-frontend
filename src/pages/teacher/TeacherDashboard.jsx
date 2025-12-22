import React from "react";
import { useNavigate } from "react-router-dom";

import RoleSidebar from "../../components/shared/RoleSidebar";
import RoleNavbar from "../../components/shared/RoleNavbar";

export default function TeacherDashboard() {
  const navigate = useNavigate();

  const cards = [
    {
      title: "إدارة الدروس",
      desc: "إضافة وتعديل المحتوى التعليمي",
      path: "/lessons/manage",
    },
    {
      title: "فيديوهاتي",
      desc: "رفع ومراجعة الفيديوهات",
      path: "/lessons/video",
    },
    {
      title: "الكويزات",
      desc: "إدارة الأسئلة والاختبارات",
      path: "/lessons/manage",
    },
  ];

  return (
    <div className="flex min-h-screen bg-black text-white" dir="rtl">
      {/* Sidebar ذكي */}
      <RoleSidebar role="teacher" />

      {/* المحتوى */}
      <div className="flex-1">
        <RoleNavbar role="teacher" />

        <div className="p-8">
          <h1 className="text-3xl font-bold text-blue-400 mb-10 text-center">
            لوحة تحكم المعلم
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {cards.map((card, i) => (
              <div
                key={i}
                onClick={() => navigate(card.path)}
                className="cursor-pointer bg-[#111] border border-blue-600/40 rounded-2xl p-6
                           hover:border-blue-500 hover:shadow-lg transition"
              >
                <h2 className="text-xl font-bold text-blue-300 mb-2">
                  {card.title}
                </h2>
                <p className="text-gray-300 text-sm">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
