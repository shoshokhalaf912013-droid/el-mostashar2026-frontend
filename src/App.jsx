import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Courses from "./pages/Courses";
import Exam from "./pages/Exam";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Contact from "./pages/Contact";   // ✅ صفحة اتصل بنا
import Policy from "./pages/Policy";     // ✅ صفحة سياسة المنصة
import "./App.css";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">
        {/* ====== شريط التنقل ====== */}
        <nav className="bg-[#111] border-b border-yellow-600 p-4 flex justify-between items-center">
          <h1 className="text-[var(--gold)] text-2xl font-bold">
            منصة المستشار 2026
          </h1>
          <ul className="flex gap-4">
            <li>
              <Link to="/" className="hover:text-[var(--gold)]">
                الرئيسية
              </Link>
            </li>
            <li>
              <Link to="/courses" className="hover:text-[var(--gold)]">
                الدروس
              </Link>
            </li>
            <li>
              <Link to="/exam" className="hover:text-[var(--gold)]">
                الامتحانات
              </Link>
            </li>
            <li>
              <Link to="/login" className="hover:text-[var(--gold)]">
                دخول
              </Link>
            </li>
            <li>
              <Link to="/register" className="hover:text-[var(--gold)]">
                تسجيل جديد
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-[var(--gold)]">
                اتصل بنا
              </Link>
            </li>
            <li>
              <Link to="/policy" className="hover:text-[var(--gold)]">
                سياسة المنصة
              </Link>
            </li>
          </ul>
        </nav>

        {/* ====== محتوى الصفحات ====== */}
        <main className="flex-grow p-6">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/exam" element={<Exam />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/contact" element={<Contact />} />   {/* ✅ صفحة اتصل بنا */}
            <Route path="/policy" element={<Policy />} />     {/* ✅ صفحة سياسة المنصة */}
          </Routes>
        </main>

        {/* ====== الفوتر ====== */}
        <footer className="text-center py-4 border-t border-yellow-600 text-gray-400">
          © 2026 جميع الحقوق محفوظة | تصميم: مستر خلف محروس
        </footer>
      </div>
    </Router>
  );
}
