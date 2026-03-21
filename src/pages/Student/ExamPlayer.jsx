import "./ExamPlayer.css";

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import ExamTimer from "../../components/ExamTimer";
import QuestionCard from "../../components/QuestionCard";

import { loadExam, saveResult } from "../../services/examService";
import { useAuth } from "../../contexts/AuthContext";

export default function ExamPlayer() {

  const { examId, gradeId, subjectId, unitId, lessonId } = useParams();

  const navigate = useNavigate();
  const { user } = useAuth();

  const [exam, setExam] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);

  /* =========================
      رابط الرجوع إلى الدرس
  ========================= */

  const backToLesson =
    gradeId && subjectId && unitId && lessonId
      ? `/student/primary-prep/lesson/${gradeId}/${subjectId}/${unitId}/${lessonId}`
      : "/student/dashboard";

  /* =========================
        خلط المصفوفة
  ========================= */

  const shuffleArray = (array = []) => {

    const arr = [...array];

    for (let i = arr.length - 1; i > 0; i--) {

      const j = Math.floor(Math.random() * (i + 1));

      [arr[i], arr[j]] = [arr[j], arr[i]];

    }

    return arr;

  };

  /* =========================
        تحميل الامتحان
  ========================= */

  useEffect(() => {

    const initExam = async () => {

      if (!user || !examId) {

        navigate(backToLesson);
        return;

      }

      try {

        /* منع إعادة الامتحان */

        const previous = await loadExam(["results", user.uid + "_" + examId]);

        if (previous) {

          alert("لقد قمت بأداء هذا الامتحان من قبل");

          navigate("/student/exam-result", {
            state: {
              score: previous.score,
              total: previous.total
            }
          });

          return;

        }

        /* تحميل الامتحان */

        const data = await loadExam(["exams", examId]);

        if (!data) {

          alert("لا يوجد امتحان لهذا الدرس");

          navigate(backToLesson);
          return;

        }

        let questions = data.questions || [];

        /* خلط الاختيارات */

        questions = questions.map((q) => {

          const shuffledOptions = shuffleArray(q.options || []);

          return {
            ...q,
            options: shuffledOptions
          };

        });

        /* خلط الأسئلة */

        questions = shuffleArray(questions);

        setExam({
          ...data,
          questions
        });

      } catch (err) {

        console.error(err);
        alert("حدث خطأ أثناء تحميل الامتحان");

        navigate(backToLesson);

      } finally {

        setLoading(false);

      }

    };

    initExam();

  }, [user, examId]);

  /* =========================
        حماية الامتحان
  ========================= */

  useEffect(() => {

    if (!exam) return;

    const preventCopy = (e) => e.preventDefault();
    const preventRightClick = (e) => e.preventDefault();

    const preventPrint = (e) => {

      if (e.key === "PrintScreen") {
        alert("تصوير الشاشة غير مسموح");
      }

    };

    const preventTab = () => {

      if (document.hidden) {

        alert("تم الخروج من الامتحان");
        submitExam();

      }

    };

    document.addEventListener("copy", preventCopy);
    document.addEventListener("contextmenu", preventRightClick);
    document.addEventListener("keyup", preventPrint);
    document.addEventListener("visibilitychange", preventTab);

    return () => {

      document.removeEventListener("copy", preventCopy);
      document.removeEventListener("contextmenu", preventRightClick);
      document.removeEventListener("keyup", preventPrint);
      document.removeEventListener("visibilitychange", preventTab);

    };

  }, [exam]);

  /* =========================
        اختيار الإجابة
  ========================= */

  const selectAnswer = (qIndex, optionKey) => {

    setAnswers({
      ...answers,
      [qIndex]: optionKey
    });

  };

  /* =========================
        حساب الدرجة
  ========================= */

  const calculateScore = () => {

    if (!exam || !exam.questions) return 0;

    let score = 0;

    exam.questions.forEach((q, i) => {

      if (answers[i] === q.correctAnswer) {
        score++;
      }

    });

    return score;

  };

  /* =========================
        تسليم الامتحان
  ========================= */

  const submitExam = async () => {

    if (submitted || !exam) return;

    setSubmitted(true);

    const score = calculateScore();

    try {

      await saveResult({

        id: user.uid + "_" + examId,

        userId: user.uid,
        examId: examId,

        score: score,
        total: exam.questions.length,

        answers: answers,
        date: Date.now()

      });

      navigate("/student/exam-result", {
        state: {
          score,
          total: exam.questions.length
        }
      });

    } catch (err) {

      console.error(err);
      alert("فشل حفظ النتيجة");

    }

  };

  /* =========================
        شاشة التحميل
  ========================= */

  if (loading) {

    return (
      <div className="exam-loading">
        جاري تحميل الامتحان...
      </div>
    );

  }

  /* =========================
        إذا لا يوجد امتحان
  ========================= */

  if (!exam) {

    return (
      <div className="exam-loading">

        لا يوجد امتحان لهذا الدرس

        <br />

        <button
          className="back-btn"
          onClick={() => navigate(backToLesson)}
        >
          العودة إلى الدرس
        </button>

      </div>
    );

  }

  /* =========================
        حساب التقدم
  ========================= */

  const answeredCount = Object.keys(answers).length;
  const totalQuestions = exam.questions?.length || 0;

  const progress = totalQuestions
    ? Math.round((answeredCount / totalQuestions) * 100)
    : 0;

  return (

    <div className="exam-player">

      <h1 className="exam-title">
        {exam.title}
      </h1>

      <ExamTimer
        minutes={exam.duration || 60}
        onFinish={submitExam}
      />

      <div className="exam-progress">

        <div className="exam-progress-info">
          {answeredCount} / {totalQuestions} سؤال
        </div>

        <div className="exam-progress-bar">

          <div
            className="exam-progress-fill"
            style={{ width: progress + "%" }}
          />

        </div>

      </div>

      <div className="questions-container">

        {exam.questions.map((q, i) => (

          <QuestionCard
            key={i}
            index={i}
            question={q}
            selected={answers[i]}
            onSelect={selectAnswer}
          />

        ))}

      </div>

      <button
        className="submit-exam"
        onClick={submitExam}
        disabled={submitted}
      >
        تسليم الامتحان
      </button>

    </div>

  );

}