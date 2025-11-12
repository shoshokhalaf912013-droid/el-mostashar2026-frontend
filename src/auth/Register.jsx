// src/auth/Register.jsx
import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [parentPhone, setParentPhone] = useState("");
  const [governorate, setGovernorate] = useState("");
  const [grade, setGrade] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const governorates = [
    "القاهرة",
    "الجيزة",
    "الإسكندرية",
    "الشرقية",
    "الدقهلية",
    "المنوفية",
    "الغربية",
    "الفيوم",
    "المنيا",
    "أسيوط",
    "سوهاج",
    "قنا",
    "الأقصر",
    "أسوان",
    "البحيرة",
    "بني سويف",
    "كفر الشيخ",
    "مطروح",
    "شمال سيناء",
    "جنوب سيناء",
    "دمياط",
    "الإسماعيلية",
    "بورسعيد",
    "السويس",
    "البحر الأحمر",
    "الوادي الجديد",
  ];

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, "students", res.user.uid), {
        name,
        phone,
        parentPhone,
        governorate,
        grade,
        email,
        uid: res.user.uid,
      });
      navigate("/home");
    } catch (err) {
      console.error(err);
      alert("حدث خطأ أثناء التسجيل. تأكد من صحة البيانات.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-700 to-blue-800">
      <form
        onSubmit={handleRegister}
        className="bg-white rounded-xl p-8 shadow-xl w-full max-w-lg"
      >
        <h2 className="text-2xl font-bold mb-4 text-center text-purple-700">
          إنشاء حساب جديد على منصة المستشار 2026
        </h2>

        <input type="text" placeholder="الاسم بالكامل" className="input" onChange={(e) => setName(e.target.value)} required />
        <input type="tel" placeholder="رقم الهاتف" className="input" onChange={(e) => setPhone(e.target.value)} required />
        <input type="tel" placeholder="رقم ولي الأمر" className="input" onChange={(e) => setParentPhone(e.target.value)} required />

        <select className="input" onChange={(e) => setGovernorate(e.target.value)} required>
          <option value="">اختر المحافظة</option>
          {governorates.map((gov) => (
            <option key={gov} value={gov}>
              {gov}
            </option>
          ))}
        </select>

        <select className="input" onChange={(e) => setGrade(e.target.value)} required>
          <option value="">اختر الصف الدراسي</option>
          <option>الصف الأول الثانوي</option>
          <option>الصف الثاني الثانوي - علمي</option>
          <option>الصف الثاني الثانوي - أدبي</option>
          <option>الصف الثالث الثانوي - أدبي</option>
        </select>

        <input type="email" placeholder="البريد الإلكتروني" className="input" onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="كلمة المرور" className="input" onChange={(e) => setPassword(e.target.value)} required />

        <button type="submit" className="bg-purple-700 text-white w-full py-2 mt-4 rounded hover:bg-purple-800">
          تسجيل
        </button>
      </form>
    </div>
  );
}
