import React, { useState, useEffect } from "react";
import { createUserWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { auth, db } from "../firebase.js";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Register() {

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  /* ===============================
     منع المسجل من فتح التسجيل
  =============================== */
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) navigate("/");
    });
    return () => unsub();
  }, [navigate]);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
    governorate: "",
    parentName: "",
    parentPhone: "",
    dateOfBirth: "",
  });

  const governorates = [
    "القاهرة","الجيزة","الإسكندرية","الشرقية","الدقهلية","القليوبية",
    "المنوفية","كفر الشيخ","الغربية","البحيرة","الفيوم","بني سويف",
    "المنيا","أسيوط","سوهاج","قنا","الأقصر","أسوان","البحر الأحمر",
    "السويس","بورسعيد","الإسماعيلية","دمياط","مطروح",
    "شمال سيناء","جنوب سيناء"
  ];

  const generatePaymentCode = () =>
    Math.random().toString(36).substring(2, 10).toUpperCase();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  /* ===============================
     التسجيل
  =============================== */
  const handleSubmit = async (e) => {

    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (new Date(formData.dateOfBirth) > new Date()) {
      setMessage("❌ تاريخ الميلاد غير صحيح");
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

      const paymentCode =
        role === "student" ? generatePaymentCode() : null;

      const expiresAt =
        role === "student"
          ? new Date(Date.now() + 24 * 60 * 60 * 1000)
          : null;

      /* ===============================
         حفظ المستخدم
      =============================== */
      await setDoc(doc(db, "users", user.uid), {
        ...formData,
        role,
        isSuperAdmin,
        createdAt: new Date(),
        status: role === "student" ? "waiting_payment" : "active",
        paymentCode,
        expiresAt,
        subscriptionEnds: null,
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

      setMessage("✔ تم إنشاء الحساب بنجاح");

      /* ===============================
         واتساب تلقائي
      =============================== */
      if (role === "student") {

        const whatsappText = `
مرحبًا ${formData.fullName} 👋

تم تسجيلك في منصة المستشار التعليمية 🎓

🎂 Birth Date: ${formData.dateOfBirth}

💳 كود الدفع: *${paymentCode}*
⏳ صالح 24 ساعة.

فودافون كاش / InstaPay:
01012002317
`;

        window.open(
          `https://wa.me/${formData.phone.replace(/^0/, "20")}?text=${encodeURIComponent(whatsappText)}`
        );
      }

      setTimeout(() => navigate("/login"), 2500);

    } catch (error) {

      if (error.code === "auth/email-already-in-use") {
        setMessage("❌ هذا البريد مسجل بالفعل — قم بتسجيل الدخول");
      } else {
        setMessage("❌ " + error.message);
      }
    }

    setLoading(false);
  };

  /* ===============================
     UI
  =============================== */
  return (
    <motion.div
      className="min-h-screen flex items-center justify-center bg-gray-900 text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
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
            name="fullName"
            placeholder="الاسم الكامل"
            onChange={handleChange}
            required
            className="w-full p-3 rounded bg-gray-700"
          />

          <input
            type="email"
            name="email"
            placeholder="البريد الإلكتروني"
            onChange={handleChange}
            required
            className="w-full p-3 rounded bg-gray-700"
          />

          <input
            type="password"
            name="password"
            placeholder="كلمة المرور"
            onChange={handleChange}
            required
            className="w-full p-3 rounded bg-gray-700"
          />

          {/* ===== Birth Date ENGLISH ===== */}
          <div className="flex flex-col">
            <label className="mb-1 text-sm text-yellow-400 font-semibold">
              Birth Date (Month / Year / Date)
            </label>

            <input
              type="date"
              name="dateOfBirth"
              lang="en"
              placeholder="Month / Year / Date"
              onChange={handleChange}
              required
              className="w-full p-3 rounded bg-gray-700 text-white [color-scheme:dark]"
            />
          </div>

          <input
            type="tel"
            name="phone"
            placeholder="رقم الهاتف"
            pattern="01[0-9]{9}"
            onChange={handleChange}
            required
            className="w-full p-3 rounded bg-gray-700"
          />

          <select
            name="governorate"
            onChange={handleChange}
            required
            className="w-full p-3 rounded bg-gray-700"
          >
            <option value="">اختر المحافظة</option>
            {governorates.map((g) => (
              <option key={g}>{g}</option>
            ))}
          </select>

          <input
            name="parentName"
            placeholder="اسم ولي الأمر"
            onChange={handleChange}
            required
            className="w-full p-3 rounded bg-gray-700"
          />

          <input
            type="tel"
            name="parentPhone"
            placeholder="رقم ولي الأمر"
            pattern="01[0-9]{9}"
            onChange={handleChange}
            required
            className="w-full p-3 rounded bg-gray-700"
          />

        </div>

        <button
          disabled={loading}
          className="w-full mt-6 py-3 bg-yellow-500 text-black font-bold rounded-lg"
        >
          {loading ? "جارٍ التسجيل..." : "تسجيل"}
        </button>

        {message && (
          <p className="text-center mt-4 text-yellow-400">
            {message}
          </p>
        )}

      </form>
    </motion.div>
  );
}