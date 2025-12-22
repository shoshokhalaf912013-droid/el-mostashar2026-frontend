import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
} from "firebase/firestore";
import { db } from "../../firebase";

/* ✅ التعديل الوحيد هنا */
import { useAuth } from "../../contexts/AuthContext";

export default function LessonFlow() {
  const { gradeId, subjectKey, unitId, lessonId } = useParams();
  const navigate = useNavigate();
  const { user, role } = useAuth();

  const [parts, setParts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!lessonId) return;

    const loadParts = async () => {
      try {
        setLoading(true);

        const snap = await getDocs(
          query(
            collection(db, "lesson_parts"),
            where("lessonId", "==", lessonId),
            orderBy("partNumber")
          )
        );

        setParts(
          snap.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
        );
      } catch (err) {
        console.error("❌ خطأ تحميل أجزاء الدرس:", err);
      } finally {
        setLoading(false);
      }
    };

    loadParts();
  }, [lessonId]);

  if (loading) {
    return (
      <div className="text-center text-yellow-400 mt-20">
        جاري تحميل محتوى الدرس...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white px-6 py-10" dir="rtl">
      <h1 className="text-2xl font-bold text-yellow-400 text-center mb-10">
        محتوى الدرس
      </h1>

      {parts.length === 0 ? (
        <div className="text-center text-red-400">
          لا يوجد محتوى مضاف لهذا الدرس بعد
        </div>
      ) : (
        <div className="space-y-6">
          {parts.map((part, index) => (
            <div
              key={part.id}
              className="bg-gray-800 border border-gray-700 rounded-xl p-6"
            >
              <h2 className="text-lg font-bold text-yellow-300 mb-3">
                {index + 1}️⃣ {part.title}
              </h2>

              {part.videoUrl && (
                <video
                  controls
                  className="w-full rounded-lg"
                  src={part.videoUrl}
                />
              )}

              {part.content && (
                <p className="mt-4 text-gray-300 leading-loose">
                  {part.content}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="text-center mt-14">
        <button
          onClick={() => navigate(-1)}
          className="bg-yellow-500 text-black px-8 py-3 rounded-xl font-bold hover:scale-105 transition"
        >
          رجوع
        </button>
      </div>
    </div>
  );
}
