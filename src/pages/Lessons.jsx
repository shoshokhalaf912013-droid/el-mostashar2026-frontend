import React from "react";

export default function Lessons() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-[var(--gold)]">قائمة الدروس</h2>
      <p className="text-[rgba(255,255,255,0.8)]">هنا يمكنك رفع الدروس وتنظيمها حسب الصف والوحدة.</p>
      <div className="mt-4 grid md:grid-cols-2 gap-4">
        <div className="card">الدرس 1: الحضارة القديمة</div>
        <div className="card">الدرس 2: العصور الوسطى</div>
      </div>
    </div>
  );
}
