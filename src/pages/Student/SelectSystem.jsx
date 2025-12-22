import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export default function SelectSystem() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const systems = [
    {
      id: "general",
      name: "الثانوية العامة",
      description: "النظام التقليدي للثانوية العامة",
    },
    {
      id: "bac",
      name: "البكالوريا المصرية",
      description: "نظام البكالوريا الجديد المعتمد",
    },
  ];

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        navigate("/login");
        return;
      }

      setUser(currentUser);

      try {
        const snap = await getDoc(doc(db, "users", currentUser.uid));
        if (!snap.exists()) {
          navigate("/login");
          return;
        }

        const data = snap.data();

        // 🔒 هذه الصفحة خاصة بالثانوي فقط
        if (data.stageId !== "secondary") {
          navigate("/student/select-stage");
          return;
        }
      } catch (error) {
        console.error("SELECT SYSTEM ERROR:", error);
        navigate("/student/select-stage");
      } finally {
        setLoading(false);
      }
    });

    return () => unsub();
  }, [navigate]);

  const handleSelectSystem = async (systemId) => {
    if (!user) return;

    try {
      await updateDoc(doc(db, "users", user.uid), {
        systemId,   // general | bac
        gradeId: null,
        trackId: null,
        subjectId: null,
        teacherId: null,
      });

      // بعد اختيار النظام → نذهب لاختيار الصف
      navigate("/student/select-grade");
    } catch (error) {
      console.error("SAVE SYSTEM ERROR:", error);
      alert("حدث خطأ أثناء حفظ النظام");
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-yellow-400 text-xl">
        ⏳ جاري تحميل الأنظمة...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white px-6 py-10">
      <h1 className="text-3xl md:text-4xl font-extrabold text-center mb-12 text-yellow-400">
        اختر النظام التعليمي
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-4xl mx-auto">
        {systems.map((system) => (
          <div
            key={system.id}
            onClick={() => handleSelectSystem(system.id)}
            className="
              bg-gradient-to-br from-[#111] to-[#0b0b0b]
              border border-yellow-700/40
              rounded-2xl
              p-10
              cursor-pointer
              text-center
              transform transition-all duration-300
              hover:-translate-y-2
              hover:scale-[1.03]
              hover:border-yellow-500
              hover:shadow-[0_10px_30px_rgba(234,179,8,0.25)]
            "
          >
            <h2 className="text-2xl font-bold text-yellow-300 mb-3">
              {system.name}
            </h2>

            <p className="text-gray-400 text-sm">
              {system.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
