// منع ErrorBoundary من عرض صفحة الخطأ لهذه الصفحة
export const suppressErrorBoundaries = true;
// src/pages/Student/StudentLessonFlow.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import "./styles/flow.css";

export default function StudentLessonFlow() {
  const { lessonId } = useParams();
  const navigate = useNavigate();

  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadLesson = async () => {
      try {
        setLoading(true);

        const ref = doc(db, "lessons", lessonId);
        const snap = await getDoc(ref);

        // 🔥 بدل الخطأ → رجوع للخلف إذا البيانات غير موجودة
        if (!snap.exists()) {
          navigate(-1);
          return;
        }

        if (mounted) setLesson(snap.data());
      } catch (err) {
        console.error("Firestore error:", err);
        navigate(-1); // fallback آمن
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadLesson();
    return () => (mounted = false);
  }, [lessonId, navigate]);

  // التنقل بين الصفحات
  const goHomework = () => navigate(`/student/lesson/${lessonId}/homework`);
  const goExam = () => navigate(`/student/lesson/${lessonId}/exam`);
  const goReport = () => navigate(`/student/lesson/${lessonId}/report`);

  const steps = [
    {
      number: 1,
      title: "مشاهدة الدرس",
      description: lesson?.description || "لا يوجد وصف متاح.",
      button: "التالي: حل الواجب ➜",
      action: goHomework,
    },
    {
      number: 2,
      title: "حل الواجب",
      description: "قم بحل الواجب الخاص بالدرس.",
      button: "الانتقال للامتحان ➜",
      action: goExam,
    },
    {
      number: 3,
      title: "الامتحان",
      description: "ابدأ امتحان الدرس.",
      button: "عرض التقرير ➜",
      action: goReport,
    },
    {
      number: 4,
      title: "تقرير الدرس",
      description: "شاهد تقرير أدائك في الدرس.",
      button: "إنهاء",
      action: () => navigate(-1),
    },
  ];

  if (loading)
    return (
      <div className="flow-container">
        <div className="flow-box">
          <p className="flow-loading">جارِ تحميل بيانات الدرس...</p>
        </div>
      </div>
    );

  const videoUrl = lesson?.videoUrl || lesson?.video || "";

  return (
    <div className="flow-container">
      <h2 className="flow-title">{lesson?.title || "اسم الدرس"}</h2>

      {/* فيديو الدرس */}
      <div className="flow-box">
        <h3 className="flow-subtitle">🎬 فيديو الدرس</h3>

        {videoUrl ? (
          <div className="video-box">
            <video controls className="flow-video">
              <source src={videoUrl} type="video/mp4" />
              المتصفح لا يدعم تشغيل الفيديو.
            </video>
          </div>
        ) : (
          <div className="video-placeholder">
            <p>لا يوجد فيديو لهذا الدرس بعد.</p>
          </div>
        )}

        <div className="flow-actions">
          <button className="flow-btn gold-btn" onClick={steps[0].action}>
            {steps[0].button}
          </button>
        </div>
      </div>

      {/* خطوات التعلم */}
      <div className="flow-box mt-4">
        <h3 className="flow-subtitle">🔁 خطوات التعلم</h3>

        {steps.map((s) => (
          <div className="flow-step" key={s.number}>
            <div className="step-left">
              <span className="step-number">{s.number}</span>
              <div className="step-label">{s.title}</div>
            </div>

            <div className="step-actions">
              <button className="flow-small-btn" onClick={s.action}>
                {s.number === 1 ? "شاهد الدرس" : "ابدأ"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
