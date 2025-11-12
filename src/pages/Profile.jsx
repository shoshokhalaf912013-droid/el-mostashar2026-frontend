import React from "react";

export default function Profile() {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="card mb-4 flex items-center gap-6">
        <img src="/teacher.png" alt="teacher" className="w-24 h-24 rounded-lg object-cover" />
        <div>
          <h3 className="text-xl font-bold">أ. مستر خلف</h3>
          <p className="text-sm text-[rgba(255,255,255,0.7)]">مدرس التاريخ والجغرافيا</p>
          <div className="mt-2 text-sm">البريد: you@example.com</div>
        </div>
      </div>

      <div className="card">
        <h4 className="font-semibold mb-2">تقدم الطالب</h4>
        <ul className="text-[rgba(255,255,255,0.8)]">
          <li>دروس مكتملة: 12</li>
          <li>اختبارات: 4</li>
          <li>متوسط الدرجات: 82%</li>
        </ul>
      </div>
    </div>
  );
}
