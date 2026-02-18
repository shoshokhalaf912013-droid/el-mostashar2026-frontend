import "./LessonsView.css";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  serverTimestamp,
  getDocs,
  getDoc,
} from "firebase/firestore";

import { db } from "@/firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getLessonTitle } from "@/utils/getLessonTitle";

export default function LessonsView() {

  const { gradeId, subjectId, unitId } = useParams();
  const navigate = useNavigate();

  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);

  // ⭐ صلاحيات
  const [role, setRole] = useState(null);

  /* ================= LOAD ROLE ================= */

  useEffect(() => {

    const auth = getAuth();

    const unsub = onAuthStateChanged(auth, async (user) => {

      if (!user) {
        setRole("student");
        return;
      }

      try {
        const userRef = doc(db, "users", user.uid);
        const snap = await getDoc(userRef);

        if (snap.exists()) {
          setRole(snap.data().role || "student");
        } else {
          setRole("student");
        }

      } catch (e) {
        console.error(e);
        setRole("student");
      }
    });

    return () => unsub();

  }, []);

  const isAdmin =
    role === "admin" || role === "super-admin";

  /* ================= REALTIME LESSONS ================= */

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

    const unsub = onSnapshot(q, (snapshot) => {

      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      setLessons(data);
      setLoading(false);
    });

    return () => unsub();

  }, [gradeId, subjectId, unitId]);

  /* ================= ADD ================= */

  const handleAddLesson = async () => {

    if (!isAdmin) return;

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
      videoUrl: "",
      pdfUrl: "",
      createdAt: serverTimestamp(),
    });
  };

  /* ================= DELETE ================= */

  const handleDelete = async (lessonId) => {

    if (!isAdmin) return;

    await deleteDoc(
      doc(
        db,
        "grades",
        gradeId,
        "subjects",
        subjectId,
        "units",
        unitId,
        "lessons",
        lessonId
      )
    );
  };

  /* ================= EDIT ================= */

  const handleEdit = async (lesson) => {

    if (!isAdmin) return;

    const newTitle = prompt("اسم الدرس", lesson.title);
    if (!newTitle) return;

    await updateDoc(
      doc(
        db,
        "grades",
        gradeId,
        "subjects",
        subjectId,
        "units",
        unitId,
        "lessons",
        lesson.id
      ),
      { title: newTitle }
    );
  };

  /* ================= FIX ALL ================= */

  const fixAllLessonsTitles = async () => {

    if (!isAdmin) return;

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

    const snap = await getDocs(lessonsRef);

    for (const d of snap.docs) {

      const data = d.data();

      const newTitle = getLessonTitle(
        subjectId,
        data.order || 1
      );

      await updateDoc(d.ref, { title: newTitle });
    }

    alert("✅ تم التصحيح");
  };

  /* ================= OPEN ================= */

  const openLesson = (lessonId) => {
    navigate(
      `/student/primary-prep/lesson/${gradeId}/${subjectId}/${unitId}/${lessonId}`
    );
  };

  if (loading) {
    return <div className="lessons-container">Loading...</div>;
  }

  /* ================= UI ================= */

  return (
    <div className="lessons-container">

      <button className="back-btn" onClick={() => navigate(-1)}>
        ← رجوع
      </button>

      <h1 className="lessons-title">الدروس</h1>

      {/* ⭐ أزرار الإدارة فقط */}
      {isAdmin && (
        <div className="add-lesson-wrapper">

          <button
            className="add-lesson-btn"
            onClick={handleAddLesson}
          >
            + إضافة درس
          </button>

          <button
            className="add-lesson-btn"
            style={{
              marginInlineStart: "10px",
              background:"#111",
              color:"#FFD700",
              border:"1px solid #FFD700"
            }}
            onClick={fixAllLessonsTitles}
          >
            🔄 تصحيح كل الدروس
          </button>

        </div>
      )}

      <div className="lessons-grid">

        {lessons.map((lesson, index) => (

          <div
            key={lesson.id}
            className="lesson-card"
            onClick={() => openLesson(lesson.id)}
          >

            <div className="lesson-index-circle">
              {index + 1}
            </div>

            {/* ⭐ أدوات الإدارة */}
            {isAdmin && (
              <div
                className="lesson-admin-actions"
                onClick={(e)=>e.stopPropagation()}
              >
                <button onClick={() => handleEdit(lesson)}>✏</button>
                <button onClick={() => handleDelete(lesson.id)}>🗑</button>
              </div>
            )}

            <h3 className="lesson-title">
              {lesson.title}
            </h3>

            <button
              className="lesson-start-btn"
              onClick={(e)=>{
                e.stopPropagation();
                openLesson(lesson.id);
              }}
            >
              ▶ ابدأ
            </button>

          </div>

        ))}

      </div>
    </div>
  );
}
