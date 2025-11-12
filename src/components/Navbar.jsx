import React from "react";
import { Link, NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <header className="border-b border-[rgba(212,175,55,0.06)]">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-md bg-gradient-to-br from-[#d4af37] to-[#b8892b] flex items-center justify-center font-bold text-black">
            M
          </div>
          <div>
            <div className="text-lg font-bold text-[var(--gold)]">المستشار 2026</div>
            <div className="text-sm text-[rgba(255,255,255,0.65)]">منصة تعليمية — التاريخ والجغرافيا</div>
          </div>
        </div>

        <nav className="flex items-center gap-4">
          <NavLink to="/" className={({isActive}) => isActive ? "text-[var(--gold)] font-semibold" : "hover:text-[var(--gold)]"}>
            الرئيسية
          </NavLink>
          <NavLink to="/lessons" className={({isActive}) => isActive ? "text-[var(--gold)] font-semibold" : "hover:text-[var(--gold)]"}>
            الدروس
          </NavLink>
          <NavLink to="/tests" className={({isActive}) => isActive ? "text-[var(--gold)] font-semibold" : "hover:text-[var(--gold)]"}>
            الامتحانات
          </NavLink>
          <NavLink to="/videos" className={({isActive}) => isActive ? "text-[var(--gold)] font-semibold" : "hover:text-[var(--gold)]"}>
            الفيديوهات
          </NavLink>
          <NavLink to="/profile" className={({isActive}) => isActive ? "text-[var(--gold)] font-semibold" : "hover:text-[var(--gold)]"}>
            الملف الشخصي
          </NavLink>

          <div className="ml-4">
            <button className="btn-gold">دخول</button>
          </div>
        </nav>
      </div>
    </header>
  );
}
