import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { motion } from "framer-motion";

import { db } from "../../firebase";
import { useAuth } from "../../contexts/AuthContext";

import LessonCard from "./LessonCard";
import AddLessonModal from "../Dashboard/Lessons/AddLessonModal";

/* 🟡 زر ذهبي موحّد */
import GoldActionButton from "../../components/ui/GoldActionButton";

import "./LessonsView.css";

export default function LessonsView() {
  const { gradeId, subjectId, unitId } = useParams();
  const { isSuperAdmin, isAdmin, isTeacher } = useAuth();

  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openAdd, setOpenAdd] = useState(false);

  /* ===== صلاحية الإضافة ===== */
  const canAddLesson = isSuperAdmin || isAdmin || isTeacher;

  /* ===== جلب الدروس ===== */
  useEffect(() => {
    if (!unitId) return;

    setLoading(true);

    const q = query(
      collection(db, "lessons"),
      where("gradeId", "==", gradeId),
      where("subjectId", "==", subjectId),
      where("unitId", "==", unitId),
      where("active", "==", true),
      orderBy("lessonOrder", "asc")
    );

    const unsub = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setLessons(data);
        setLoading(false);
      },
      (error) => {
        console.error("❌ Lessons snapshot error:", error);
        setLessons([]);
        setLoading(false);
      }
    );

    return () => unsub();
  }, [gradeId, subjectId, unitId]);

  return (
    <div className="lessons-page">
      {/* ===== Header ===== */}
      <div className="lessons-header">
        <h1 className="lessons-title">📘 الدروس</h1>

        {canAddLesson && (
          <GoldActionButton onClick={() => setOpenAdd(true)}>
            إضافة درس
          </GoldActionButton>
        )}
      </div>

      {/* ===== Content ===== */}
      {loading ? (
        <div className="lessons-loading">جارٍ تحميل الدروس…</div>
      ) : lessons.length === 0 ? (
        <div className="lessons-empty">لا توجد دروس بعد</div>
      ) : (
        <div className="lessons-list">
          {lessons.map((lesson, index) => (
            <motion.div
              key={lesson.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.07 }}
            >
              <LessonCard
                lesson={lesson}
                index={index}
              />
            </motion.div>
          ))}
        </div>
      )}

      {/* ===== Add Lesson Modal ===== */}
      {openAdd && (
        <AddLessonModal
          gradeId={gradeId}
          subjectId={subjectId}
          unitId={unitId}
          onClose={() => setOpenAdd(false)}
        />
      )}
    </div>
  );
}
