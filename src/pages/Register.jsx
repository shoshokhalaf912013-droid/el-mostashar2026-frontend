// src/pages/Register.jsx
import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";
import { motion } from "framer-motion";

export default function Register() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
    governorate: "",
    parentName: "",
    parentPhone: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const governorates = [
    "القاهرة", "الجيزة", "الإسكندرية", "الشرقية", "الدقهلية",
    "القليوبية", "المنوفية", "كفر الشيخ", "الغربية", "البحيرة",
    "الفيوم", "بني سويف", "المنيا", "أسيوط", "سوهاج",
    "قنا", "الأقصر", "أسوان", "البحر الأحمر", "السويس",
    "بورسعيد", "الإسماعيلية", "دمياط", "مطروح",
    "شمال سيناء", "جنوب سيناء"
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      await setDoc(doc(db, "users", user.uid), {
        ...formData,
        createdAt: new Date(),
      });

      setMessage("✅ تم إنشاء الحساب بنجاح!");
      setFormData({
        fullName: "",
        email: "",
        password: "",
        phone: "",
        governorate: "",
        parentName: "",
        parentPhone: "",
      });
    } catch (error) {
      setMessage("❌ حدث خطأ أثناء إنشاء الحساب: " + error.message);
    }

    setLoading(false);
  };

  return (
    <motion.div
      className="min-h-screen flex items-center justify-center bg-gray-900 text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-8 rounded-2xl shadow-lg w-full max-w-lg"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-[var(--gold)]">
          إنشاء حساب جديد 👤
        </h2>

        <div className="space-y-4">
          <input
            type="text"
            name="fullName"
            placeholder="الاسم الكامل"
            value={formData.fullName}
            onChange={handleChange}
            required
            className="w-full p-3 rounded bg-gray-700 border border-gray-600"
          />

          <input
            type="email"
            name="email"
            placeholder="البريد الإلكتروني"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full p-3 rounded bg-gray-700 border border-gray-600"
          />

          <input
            type="password"
            name="password"
            placeholder="كلمة المرور"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full p-3 rounded bg-gray-700 border border-gray-600"
          />

          <input
            type="text"
            name="phone"
            placeholder="رقم الهاتف"
            value={formData.phone}
            onChange={handleChange}
            required
            className="w-full p-3 rounded bg-gray-700 border border-gray-600"
          />

          <select
            name="governorate"
            value={formData.governorate}
            onChange={handleChange}
            required
            className="w-full p-3 rounded bg-gray-700 border border-gray-600"
          >
            <option value="">اختر المحافظة</option>
            {governorates.map((gov) => (
              <option key={gov} value={gov}>
                {gov}
              </option>
            ))}
          </select>

          <input
            type="text"
            name="parentName"
            placeholder="اسم ولي الأمر"
            value={formData.parentName}
            onChange={handleChange}
            required
            className="w-full p-3 rounded bg-gray-700 border border-gray-600"
          />

          <input
            type="text"
            name="parentPhone"
            placeholder="رقم ولي الأمر"
            value={formData.parentPhone}
            onChange={handleChange}
            required
            className="w-full p-3 rounded bg-gray-700 border border-gray-600"
          />
        </div>

        <button
          type="submit"
          className="w-full mt-6 py-3 bg-[var(--gold)] text-black font-bold rounded-lg hover:bg-yellow-400 transition"
          disabled={loading}
        >
          {loading ? "جارٍ التسجيل..." : "تسجيل"}
        </button>

        {message && (
          <p className="text-center mt-4 text-sm text-yellow-400">{message}</p>
        )}
      </form>
    </motion.div>
  );
}
