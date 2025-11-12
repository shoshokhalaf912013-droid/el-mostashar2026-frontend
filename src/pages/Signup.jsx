import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    guardian: "",
    governorate: "",
    password: "",
  });

  const governorates = [
    "القاهرة", "الجيزة", "الإسكندرية", "الدقهلية", "الشرقية", "المنوفية", "القليوبية",
    "البحيرة", "الغربية", "بورسعيد", "دمياط", "الإسماعيلية", "السويس", "كفر الشيخ",
    "الفيوم", "بني سويف", "المنيا", "أسيوط", "سوهاج", "قنا", "الأقصر", "أسوان",
    "البحر الأحمر", "الوادى الجديد", "مطروح", "شمال سيناء", "جنوب سيناء"
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.password) {
      alert("من فضلك أكمل جميع البيانات المطلوبة");
      return;
    }

    localStorage.setItem("studentData", JSON.stringify(formData));
    navigate("/dashboard");
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#0a0a0a] text-white">
      <form
        onSubmit={handleSubmit}
        className="bg-[#111] p-8 rounded-2xl shadow-lg w-full max-w-md border border-yellow-600"
      >
        <h2 className="text-2xl font-bold text-center text-[var(--gold)] mb-6">
          📝 تسجيل حساب جديد
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-yellow-400 mb-1">الاسم الكامل</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 rounded bg-[#222] border border-gray-600 text-white"
              placeholder="اكتب اسمك بالكامل"
            />
          </div>

          <div>
            <label className="block text-yellow-400 mb-1">البريد الإلكتروني</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 rounded bg-[#222] border border-gray-600 text-white"
              placeholder="example@email.com"
            />
          </div>

          <div>
            <label className="block text-yellow-400 mb-1">رقم الهاتف</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full p-2 rounded bg-[#222] border border-gray-600 text-white"
              placeholder="01000000000"
            />
          </div>

          <div>
            <label className="block text-yellow-400 mb-1">اسم ولي الأمر</label>
            <input
              type="text"
              name="guardian"
              value={formData.guardian}
              onChange={handleChange}
              className="w-full p-2 rounded bg-[#222] border border-gray-600 text-white"
              placeholder="اكتب اسم ولي الأمر"
            />
          </div>

          <div>
            <label className="block text-yellow-400 mb-1">المحافظة</label>
            <select
              name="governorate"
              value={formData.governorate}
              onChange={handleChange}
              className="w-full p-2 rounded bg-[#222] border border-gray-600 text-white"
            >
              <option value="">اختر المحافظة</option>
              {governorates.map((gov, i) => (
                <option key={i} value={gov}>
                  {gov}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-yellow-400 mb-1">كلمة المرور</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-2 rounded bg-[#222] border border-gray-600 text-white"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-yellow-600 hover:bg-yellow-700 py-2 rounded-lg text-white font-bold"
          >
            إنشاء الحساب
          </button>
        </div>

        <p className="text-center text-gray-400 mt-4">
          لديك حساب بالفعل؟{" "}
          <a href="/login" className="text-yellow-400 hover:underline">
            تسجيل الدخول
          </a>
        </p>
      </form>
    </div>
  );
}
