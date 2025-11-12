import React, { useEffect, useState } from "react";
import { doc, setDoc, addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { useParams, useNavigate } from "react-router-dom";

export default function Exam() {
  const { examId } = useParams();
  const userId = "anon-student"; // لاحقًا استبداله بـ uid من auth
  const navigate = useNavigate();

  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(60 * 30); // 30 دقيقة

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(t => Math.max(0, t - 1)), 1000);

    const autosave = setInterval(() => {
      saveAnswersToServer(answers);
    }, 60_000); // كل دقيقة

    return () => { clearInterval(timer); clearInterval(autosave); };
  }, [answers]);

  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) {
        addDoc(collection(db, "cheatingLogs"), { userId, examId, event: "tab_hidden", time: serverTimestamp() });
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [examId]);

  useEffect(() => {
    if (timeLeft === 0) {
      // إغلاق الامتحان
      saveAnswersToServer(answers);
      alert("انتهى الوقت — يتم إغلاق الامتحان");
      navigate("/");
    }
  }, [timeLeft]);

  async function saveAnswersToServer(answers) {
    try {
      await setDoc(doc(db, `exams/${examId || "default"}/submissions`, userId), {
        answers, updatedAt: serverTimestamp()
      }, { merge: true });
      console.log("تم الحفظ التلقائي");
    } catch (err) {
      console.error(err);
    }
  }

  const critical = timeLeft < 60 * 5;
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">الامتحان: {examId}</h2>
      <div className={`text-lg font-bold ${critical ? "text-red-500" : "text-[var(--gold)]"}`}>
        الوقت المتبقي: {Math.floor(timeLeft/60)}:{String(timeLeft%60).padStart(2,"0")}
      </div>

      <div className="mt-4">
        <label className="block mb-2">السؤال 1</label>
        <textarea className="input" value={answers.q1||""} onChange={e=>setAnswers({...answers, q1: e.target.value})} />
      </div>
    </div>
  );
}
