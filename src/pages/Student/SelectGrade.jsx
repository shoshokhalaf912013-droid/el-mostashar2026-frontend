import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { db } from "../../firebase";
import { useSecondary } from "../../contexts/SecondaryContext";

export default function SelectGrade() {
  const navigate = useNavigate();
  const { stageId, systemId } = useParams();
  const { setGradeId, setSystemId } = useSecondary();

  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (systemId) {
      setSystemId(systemId); // تثبيت النظام
    }

    const fetchGrades = async () => {
      try {
        let q;

        // ===== ثانوي عام =====
        if (systemId === "general") {
          q = query(
            collection(db, "grades"),
            where("stageId", "==", "secondary"),
            where("systemId", "==", "general"),
            where("active", "==", true),
            orderBy("order", "asc")
          );
        }
        // ===== ابتدائي + إعدادي =====
        else {
          q = query(
            collection(db, "grades"),
            where("stageId", "==", stageId),
            where("active", "==", true),
            orderBy("order", "asc")
          );
        }

        const snap = await getDocs(q);
        setGrades(
          snap.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }))
        );
      } catch (e) {
        console.error("❌ Error loading grades:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchGrades();
  }, [stageId, systemId, setSystemId]);

  if (loading) {
    return <div className="text-white text-center mt-20">تحميل...</div>;
  }

  return (
    <div className="min-h-screen bg-black p-10">
      <h1 className="text-3xl font-bold text-yellow-400 text-center mb-10">
        اختر الصف
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {grades.map(grade => (
          <div
            key={grade.id}
            onClick={() => {
              setGradeId(grade.id); // ⭐ الربط الحاسم
              navigate(
                systemId === "general"
                  ? `/student/secondary/subjects/${grade.id}`
                  : `/student/primary-prep/subjects/${grade.id}`
              );
            }}
            className="cursor-pointer rounded-xl border border-yellow-500/40 bg-zinc-900 p-8 text-center hover:scale-105 transition"
          >
            <h2 className="text-xl text-yellow-300">{grade.title}</h2>
          </div>
        ))}
      </div>
    </div>
  );
}
