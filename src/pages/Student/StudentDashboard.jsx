import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

// 🔹 Sidebar (قراءة فقط)
import LessonsSidebar from "./LessonsSidebar";

export default function StudentDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        navigate("/login");
        return;
      }

      try {
        const snap = await getDoc(doc(db, "users", user.uid));

        if (!snap.exists()) {
          navigate("/login");
          return;
        }

        const data = snap.data();

        // 🔍 تشخيص فقط – بدون أي تحويل
        console.log("🔥 StudentDashboard user data:", data);
        console.log("🎯 gradeId value:", data.gradeId);
      } catch (e) {
        console.error("❌ StudentDashboard error:", e);
      } finally {
        setLoading(false);
      }
    });

    return () => unsub();
  }, [navigate]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-yellow-400 text-xl">
        ⏳ جاري التحميل...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-black text-white">

      {/* 🔹 Sidebar تجريبي (قراءة فقط) */}
      <LessonsSidebar subjectId="ykghsHWpCvsOl4nMVgeQ" />

      {/* 🔹 المحتوى الحالي */}
      <main className="flex-1 text-center mt-20 space-y-6">
        <h1 className="text-3xl font-bold text-yellow-400">
          مرحبًا بك 👋
        </h1>

        <p className="text-gray-400">
          من فضلك اختر المرحلة والصف لعرض المواد الدراسية
        </p>

        <button
          onClick={() => navigate("/student/select-stage")}
          className="px-8 py-3 bg-yellow-500 text-black rounded-xl font-bold"
        >
          الدخول إلى المواد الدراسية
        </button>
      </main>

    </div>
  );
}
