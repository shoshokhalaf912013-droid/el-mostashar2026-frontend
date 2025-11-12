import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("تم تسجيل الدخول بنجاح!");
      navigate("/dashboard");
    } catch (error) {
      alert("خطأ في الدخول: " + error.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
      <h2 className="text-2xl font-bold mb-6 text-yellow-400">تسجيل الدخول</h2>
      <form
        onSubmit={handleLogin}
        className="bg-[#111] p-6 rounded-lg shadow-md w-80 flex flex-col gap-4"
      >
        <input
          type="email"
          placeholder="البريد الإلكتروني"
          className="p-2 rounded bg-gray-800 border border-yellow-600"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="كلمة المرور"
          className="p-2 rounded bg-gray-800 border border-yellow-600"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="submit"
          className="bg-yellow-600 hover:bg-yellow-700 text-black font-bold py-2 rounded"
        >
          دخول
        </button>
        <p className="text-center mt-3 text-gray-400">
          ليس لديك حساب؟{" "}
          <Link to="/signup" className="text-yellow-400 hover:underline">
            إنشاء حساب جديد
          </Link>
        </p>
      </form>
    </div>
  );
}
