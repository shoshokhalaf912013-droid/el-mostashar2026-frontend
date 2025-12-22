import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

export default function SelectStage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔒 stageId موحّد مع باقي المنصة
  const stages = [
    { id: "primary", name: "المرحلة الابتدائية" },
    { id: "preparatory", name: "المرحلة الإعدادية" },
    {
      id: "secondary",
      name: "المرحلة الثانوية (عام + بكالوريا)",
    },
  ];

  // 🔐 حماية الصفحة
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        navigate("/login");
        return;
      }
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsub();
  }, [navigate]);

  const handleSelectStage = async (stageId) => {
    if (!user) return;

    try {
      await setDoc(
        doc(db, "users", user.uid),
        {
          role: "student",
          stageId, // primary / preparatory / secondary
          gradeId: null,
          systemId: null,
          trackId: null,
          subjectId: null,
          teacherId: null,
          email: user.email || null,
          createdAt: new Date(),
        },
        { merge: true }
      );

      // ✅ القرار الآمن الحالي:
      // كل المراحل → اختيار الصف مباشرة
      navigate("/student/select-grade");
    } catch (error) {
      console.error("SELECT STAGE ERROR:", error);
      alert("حدث خطأ أثناء حفظ المرحلة");
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-yellow-400 text-xl">
        ⏳ جاري التحميل...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white px-6 py-10">
      <h1 className="text-3xl md:text-4xl font-extrabold text-center mb-12 text-yellow-400">
        اختر المرحلة الدراسية
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {stages.map((stage, index) => (
          <div
            key={stage.id}
            onClick={() => handleSelectStage(stage.id)}
            className="
              bg-gradient-to-br from-[#111] to-[#0b0b0b]
              border border-yellow-700/40
              rounded-2xl
              p-8
              cursor-pointer
              text-center
              transform transition-all duration-300
              hover:-translate-y-2
              hover:scale-[1.03]
              hover:border-yellow-500
              hover:shadow-[0_10px_30px_rgba(234,179,8,0.25)]
            "
            style={{
              animation: `fadeUp 0.4s ease ${index * 0.1}s both`,
            }}
          >
            <h2 className="text-xl font-bold text-yellow-300">
              {stage.name}
            </h2>
          </div>
        ))}
      </div>

      <style>
        {`
          @keyframes fadeUp {
            from {
              opacity: 0;
              transform: translateY(18px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </div>
  );
}
