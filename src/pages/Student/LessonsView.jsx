import "./LessonsView.css";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
  getDocs,
} from "firebase/firestore";

import { db } from "@/firebase";
import { getLessonTitle } from "@/utils/getLessonTitle";
import { usePermissions } from "@/hooks/usePermissions";

export default function LessonsView() {

  const { gradeId, subjectId, unitId } = useParams();
  const navigate = useNavigate();

  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);

  /* 🔥 PERMISSIONS FROM CENTRAL SYSTEM */
  const { canManageLessons } = usePermissions();

  /* ================= LOAD LESSONS ================= */

  useEffect(() => {

    if (!gradeId || !subjectId || !unitId) return;

    const lessonsRef = collection(
      db,
      "grades",
      gradeId,
      "subjects",
      subjectId,
      "units",
      unitId,
      "lessons"
    );

    const q = query(lessonsRef, orderBy("order"));

    const unsub = onSnapshot(q, async (snapshot) => {

      const lessonsData = snapshot.docs.map(d => ({
        id: d.id,
        ...d.data(),
      }));

      /* ===== LIVE LINK ===== */

      const liveSnap = await getDocs(collection(db, "liveClasses"));

      const liveMap = {};
      liveSnap.forEach(doc => {
        const data = doc.data();
        if (data.lessonId) {
          liveMap[data.lessonId] = {
            hasLive: true,
            liveClassId: doc.id,
          };
        }
      });

      const merged = lessonsData.map(l => ({
        ...l,
        ...(liveMap[l.id] || {
          hasLive: false,
          liveClassId: null,
        }),
      }));

      setLessons(merged);
      setLoading(false);
    });

    return () => unsub();

  }, [gradeId, subjectId, unitId]);

  /* ================= ADD LESSON ================= */

  const handleAddLesson = async () => {

    if (!canManageLessons) return;

    const lessonsRef = collection(
      db,
      "grades",
      gradeId,
      "subjects",
      subjectId,
      "units",
      unitId,
      "lessons"
    );

    const nextOrder =
      lessons.length > 0
        ? Math.max(...lessons.map(l => l.order || 0)) + 1
        : 1;

    await addDoc(lessonsRef, {
      title: getLessonTitle(subjectId, nextOrder),
      order: nextOrder,
      createdAt: serverTimestamp(),
    });
  };

  /* ================= NAVIGATION ================= */

  const openLesson = (lessonId) => {

    let stage = "secondary";

    if (gradeId.startsWith("pri") || gradeId.startsWith("prep")) {
      stage = "primary-prep";
    }

    if (gradeId.startsWith("bac")) {
      stage = "bac";
    }

    navigate(
      `/student/${stage}/lesson/${gradeId}/${subjectId}/${unitId}/${lessonId}`
    );
  };

  const openLive = (liveClassId) => {
    navigate(`/student/live/${liveClassId}`);
  };

  if (loading)
    return <div className="lessons-container">Loading...</div>;

  /* ================= UI ================= */

  return (
    <div className="lessons-container">

      <button className="back-btn" onClick={() => navigate(-1)}>
        ← رجوع
      </button>

      <h1 className="lessons-title">الدروس</h1>

      {canManageLessons && (
        <button className="add-btn" onClick={handleAddLesson}>
          + إضافة درس
        </button>
      )}

      <div className="lessons-grid">

        {lessons.map((lesson, index) => (

          <div key={lesson.id} className="lesson-card">

            <div
              onClick={() => openLesson(lesson.id)}
              style={{ cursor: "pointer" }}
            >
              <div className="lesson-index-circle">
                {index + 1}
              </div>

              <h3 className="lesson-title">
                {lesson.title}
              </h3>
            </div>

            <div className="lesson-actions">

              <button
                className="lesson-start-btn"
                onClick={() => openLesson(lesson.id)}
              >
                ▶ ابدأ
              </button>

              {lesson.hasLive && (
                <button
                  className="lesson-start-btn"
                  style={{
                    marginTop: "10px",
                    borderColor: "#00ffd0",
                    color: "#00ffd0",
                  }}
                  onClick={() => openLive(lesson.liveClassId)}
                >
                  🔴 دخول الحصة المباشرة
                </button>
              )}

            </div>

          </div>

        ))}

      </div>
    </div>
  );
}