import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
} from "firebase/firestore";
import { db } from "../../firebase";
import { useAuth } from "../../contexts/AuthContext";

export default function LessonsView() {
  const { gradeId, subjectKey, unitId } = useParams();
  const navigate = useNavigate();
  const { isSuperAdmin, isStudent } = useAuth();

  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!gradeId || !subjectKey || !unitId) return;

    const loadData = async () => {
      try {
        setLoading(true);

        const lessonsSnap = await getDocs(
          query(
            collection(db, "lessons"),
            where("gradeId", "==", gradeId),
            where("subjectKey", "==", subjectKey),
            where("unitId", "==", unitId),
            orderBy("lessonNumber")
          )
        );

        const lessonsData = [];

        for (const lessonDoc of lessonsSnap.docs) {
          const partsSnap = await getDocs(
            query(
              collection(db, "lesson_parts"),
              where("lessonId", "==", lessonDoc.id),
              orderBy("partNumber")
            )
          );

          lessonsData.push({
            id: lessonDoc.id,
            title: lessonDoc.data().title,
            parts: partsSnap.docs.map((p) => ({
              id: p.id,
              title: p.data().title,
            })),
          });
        }

        setLessons(lessonsData);
      } catch (err) {
        console.error("❌ خطأ تحميل الدروس:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [gradeId, subjectKey, unitId]);

  if (loading) {
    return (
      <div className="text-yellow-400 text-center mt-20">
        جاري تحميل الدروس...
      </div>
    );
  }

  if (lessons.length === 0) {
    return (
      <div className="text-red-400 text-center mt-20">
        لا توجد دروس داخل هذه الوحدة
      </div>
    );
  }

  return (
    <div className="bg-black text-white min-h-screen px-6 py-10" dir="rtl">
      <h1 className="text-2xl font-bold text-yellow-400 text-center mb-10">
        الدروس
      </h1>

      {lessons.map((lesson) => (
        <div
          key={lesson.id}
          className="mb-6 bg-gray-800 rounded-xl p-5 border border-gray-700"
        >
          <div className="text-yellow-300 font-bold mb-3">
            {lesson.title}
          </div>

          <ul className="pr-6 text-gray-300">
            {lesson.parts.map((part) => (
              <li key={part.id}>▸ {part.title}</li>
            ))}
          </ul>

          {/* ===== أزرار الإدارة ===== */}
          {!isStudent && (
            <div className="flex gap-3 mt-4">
              <button className="bg-blue-600 px-4 py-2 rounded font-bold">
                تعديل
              </button>

              {isSuperAdmin && (
                <button className="bg-red-600 px-4 py-2 rounded font-bold">
                  حذف
                </button>
              )}
            </div>
          )}
        </div>
      ))}

      <div className="text-center mt-12">
        <button
          onClick={() => navigate(-1)}
          className="bg-yellow-500 text-black px-8 py-3 rounded font-bold"
        >
          رجوع
        </button>
      </div>
    </div>
  );
}
