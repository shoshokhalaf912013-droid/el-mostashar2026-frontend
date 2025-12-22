import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { auth, db } from "../firebase.js";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
    governorate: "",
    parentName: "",
    parentPhone: "",
    dateOfBirth: "", // تاريخ الميلاد
  });

  const governorates = [
    "القاهرة","الجيزة","الإسكندرية","الشرقية","الدقهلية","القليوبية","المنوفية",
    "كفر الشيخ","الغربية","البحيرة","الفيوم","بني سويف","المنيا","أسيوط",
    "سوهاج","قنا","الأقصر","أسوان","البحر الأحمر","السويس",
    "بورسعيد","الإسماعيلية","دمياط","مطروح","شمال سيناء","جنوب سيناء"
  ];

  const generatePaymentCode = () => {
    return Math.random().toString(36).substring(2, 10).toUpperCase();
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    // تحقق من تاريخ الميلاد
    if (new Date(formData.dateOfBirth) > new Date()) {
      setMessage("❌ تاريخ الميلاد لا يمكن أن يكون في المستقبل");
      setLoading(false);
      return;
    }

    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      let role = "student";
      let isSuperAdmin = false;

      if (formData.email.toLowerCase() === "khalafmahrous2000@gmail.com") {
        role = "superadmin";
        isSuperAdmin = true;
      }

      const paymentCode = role === "student" ? generatePaymentCode() : null;
      const expiresAt =
        role === "student"
          ? new Date(Date.now() + 24 * 60 * 60 * 1000)
          : null;

      // ===============================
      // ✅ هنا الإضافة الوحيدة الضرورية
      // ===============================
      await setDoc(doc(db, "users", user.uid), {
        // البيانات الحالية (كما كانت)
        ...formData,
        role,
        isSuperAdmin,
        createdAt: new Date(),
        status: role === "student" ? "waiting_payment" : "active",
        paymentCode,
        expiresAt,
        subscriptionEnds: null,

        // مفاتيح التسلسل التعليمي (إضافة فقط)
        stageId: null,
        gradeId: null,
        subjectId: null,
        teacherId: null,
      });

      localStorage.setItem(
        "user",
        JSON.stringify({
          uid: user.uid,
          email: formData.email,
          role,
          isSuperAdmin,
        })
      );

      setMessage("✔ تم إنشاء الحساب بنجاح!");

      if (role === "student") {
        const whatsappText = `
مرحبًا ${formData.fullName} 👋

تم تسجيلك في منصة المستشار التعليمية 🎓

🎂 تاريخ ميلادك: ${formData.dateOfBirth}

💳 كود الدفع الخاص بك: *${paymentCode}*
⏳ صالح لمدة 24 ساعة فقط.

📌 طرق الدفع:
- فودافون كاش: 01012002317
- InstaPay: 01012002317

📩 بعد الدفع برجاء إرسال صورة إيصال الدفع على هذا الرقم ليتم تفعيل حسابك.

بالتوفيق دائمًا ⭐`;

        window.open(
          `https://wa.me/${formData.phone.replace(
            /^0/,
            "20"
          )}?text=${encodeURIComponent(whatsappText)}`
        );
      }

      setTimeout(() => navigate("/login"), 2500);
    } catch (error) {
      setMessage("❌ خطأ: " + error.message);
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
        <h2 className="text-3xl font-bold mb-6 text-center text-yellow-400">
          إنشاء حساب جديد
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
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
            required
            className="w-full p-3 rounded bg-gray-700 border border-gray-600"
          />

          <input
            type="tel"
            name="phone"
            placeholder="رقم الهاتف (واتساب)"
            pattern="01[0-9]{9}"
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
            type="tel"
            name="parentPhone"
            placeholder="رقم ولي الأمر"
            pattern="01[0-9]{9}"
            value={formData.parentPhone}
            onChange={handleChange}
            required
            className="w-full p-3 rounded bg-gray-700 border border-gray-600"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-6 py-3 bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-400 transition"
        >
          {loading ? "جارٍ التسجيل..." : "تسجيل"}
        </button>

        {message && (
          <p className="text-center mt-4 text-sm text-yellow-400">
            {message}
          </p>
        )}
      </form>
    </motion.div>
  );
}
