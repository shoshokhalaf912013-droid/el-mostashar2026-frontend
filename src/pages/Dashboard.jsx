import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [student, setStudent] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const data = localStorage.getItem("studentData");
    if (data) {
      setStudent(JSON.parse(data));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("studentData");
    navigate("/");
  };

  if (!student) {
    return (
      <div className="text-center text-yellow-400 mt-10 text-xl">
        لم يتم العثور على بيانات الطالب 😅
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-[#111] p-6 rounded-2xl shadow-lg border border-yellow-600 mt-8">
      <h1 className="text-2xl font-bold text-[var(--gold)] text-center mb-6">
        🎓 لوحة تحكم الطالب
      </h1>

      <p className="text-lg text-center text-gray-300 mb-4">
        مرحبًا بك يا <span className="text-yellow-400">{student.name}</span> 👋
      </p>

      <div className="space-y-2 text-gray-400 mb-6">
        <p>📞 رقم التليفون: {student.phone}</p>
        <p>🏠 المحافظة: {student.governorate}</p>
        <p>👨‍👩‍👧 ولي الأمر: {student.guardian}</p>
        <p>📧 البريد الإلكتروني: {student.email}</p>
      </div>

      <div className="text-center">
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-white font-bold"
        >
          تسجيل الخروج
        </button>
      </div>
    </div>
  );
}
