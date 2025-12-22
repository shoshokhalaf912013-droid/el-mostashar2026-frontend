import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";

/*
  ===============================
  الصفوف حسب المرحلة
  المفاتيح المعتمدة فقط:
  primary | preparatory | secondary
  ===============================
*/
const GRADES_BY_STAGE = {
  primary: [
    { id: "p1", name: "الصف الأول الابتدائي" },
    { id: "p2", name: "الصف الثاني الابتدائي" },
    { id: "p3", name: "الصف الثالث الابتدائي" },
    { id: "p4", name: "الصف الرابع الابتدائي" },
    { id: "p5", name: "الصف الخامس الابتدائي" },
    { id: "p6", name: "الصف السادس الابتدائي" },
  ],

  preparatory: [
    { id: "prep1", name: "الصف الأول الإعدادي" },
    { id: "prep2", name: "الصف الثاني الإعدادي" },
    { id: "prep3", name: "الصف الثالث الإعدادي" },
  ],

  secondary: [
    { id: "sec1", name: "الصف الأول الثانوي" },
    { id: "bac2", name: "الصف الثاني الثانوي (بكالوريا)" },
    { id: "bac3", name: "الصف الثالث الثانوي (بكالوريا)" },
  ],
};

export default function SelectGrade() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [stageId, setStageId] = useState(null);
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ===============================
     التحقق من المستخدم + المرحلة
     =============================== */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        navigate("/login", { replace: true });
        return;
      }

      setUser(currentUser);

      try {
        const userRef = doc(db, "users", currentUser.uid);
        const snap = await getDoc(userRef);

        if (!snap.exists()) {
          navigate("/student/select-stage", { replace: true });
          return;
        }

        const data = snap.data();

        // حماية صارمة
        if (!data.stageId || !GRADES_BY_STAGE[data.stageId]) {
          navigate("/student/select-stage", { replace: true });
          return;
        }

        setStageId(data.stageId);
        setGrades(GRADES_BY_STAGE[data.stageId]);
      } catch (err) {
        console.error("SELECT_GRADE_ERROR:", err);
        navigate("/student/select-stage", { replace: true });
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  /* ===============================
     اختيار الصف
     =============================== */
  const handleSelectGrade = async (grade) => {
    if (!user || !grade?.id) return;

    try {
      await updateDoc(doc(db, "users", user.uid), {
        gradeId: grade.id,
        subjectId: null,
        teacherId: null,
        trackId: null,
      });

      // 🔒 مسار مطلق – لا يعتمد على URL الحالي
      navigate(`/student/subjects/${grade.id}`, { replace: true });
    } catch (err) {
      console.error("UPDATE_GRADE_ERROR:", err);
      alert("حدث خطأ أثناء حفظ الصف");
    }
  };

  /* ===============================
     تحميل
     =============================== */
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-yellow-400 text-xl">
        ⏳ جاري تحميل الصفوف...
      </div>
    );
  }

  /* ===============================
     الواجهة
     =============================== */
  return (
    <div className="min-h-screen bg-black text-white px-6 py-10">
      <h1 className="text-3xl font-extrabold text-center mb-12 text-yellow-400">
        اختر الصف الدراسي
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {grades.map((grade) => (
          <div
            key={grade.id}
            onClick={() => handleSelectGrade(grade)}
            className="
              bg-[#111]
              border border-yellow-600/40
              rounded-2xl
              p-7
              cursor-pointer
              text-center
              transition
              hover:border-yellow-500
              hover:shadow-yellow-500/30
            "
          >
            <h2 className="text-lg font-bold text-yellow-300">
              {grade.name}
            </h2>
          </div>
        ))}
      </div>
    </div>
  );
}
