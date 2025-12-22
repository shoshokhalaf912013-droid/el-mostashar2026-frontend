import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../firebase";
import { doc, updateDoc, getDoc } from "firebase/firestore";

export default function AddQuestion() {
  const { id: examId } = useParams();

  const [question, setQuestion] = useState("");
  const [answerA, setAnswerA] = useState("");
  const [answerB, setAnswerB] = useState("");
  const [answerC, setAnswerC] = useState("");
  const [answerD, setAnswerD] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState("");

  const [questions, setQuestions] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ================= جلب الأسئلة ================= */
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const ref = doc(db, "exams", examId);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          setQuestions(snap.data().questions || []);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    if (examId) fetchQuestions();
  }, [examId]);

  /* ================= حفظ (إضافة / تعديل) ================= */
  const handleSaveQuestion = async () => {
    if (!question || !correctAnswer) {
      alert("يجب إدخال نص السؤال والإجابة الصحيحة");
      return;
    }

    const newQuestion = {
      question,
      options: { A: answerA, B: answerB, C: answerC, D: answerD },
      correctAnswer,
    };

    const updatedQuestions =
      editingIndex === null
        ? [...questions, newQuestion]
        : questions.map((q, i) => (i === editingIndex ? newQuestion : q));

    try {
      await updateDoc(doc(db, "exams", examId), {
        questions: updatedQuestions,
      });

      setQuestions(updatedQuestions);
      resetForm();
    } catch (e) {
      console.error(e);
      alert("حدث خطأ أثناء الحفظ");
    }
  };

  /* ================= حذف سؤال ================= */
  const handleDelete = async (index) => {
    if (!window.confirm("هل أنت متأكد من حذف هذا السؤال؟")) return;

    const updated = questions.filter((_, i) => i !== index);

    try {
      await updateDoc(doc(db, "exams", examId), {
        questions: updated,
      });
      setQuestions(updated);
    } catch (e) {
      console.error(e);
    }
  };

  /* ================= بدء تعديل ================= */
  const startEdit = (q, index) => {
    setEditingIndex(index);
    setQuestion(q.question);
    setAnswerA(q.options.A);
    setAnswerB(q.options.B);
    setAnswerC(q.options.C);
    setAnswerD(q.options.D);
    setCorrectAnswer(q.correctAnswer);
  };

  const resetForm = () => {
    setEditingIndex(null);
    setQuestion("");
    setAnswerA("");
    setAnswerB("");
    setAnswerC("");
    setAnswerD("");
    setCorrectAnswer("");
  };

  /* ================= الواجهة ================= */
  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      <h1 className="text-2xl font-bold mb-4">إدارة أسئلة الكويز</h1>

      {/* ===== الفورم ===== */}
      <div className="space-y-4 mb-10">
        <input
          className="w-full p-3 bg-gray-800 rounded"
          placeholder="نص السؤال"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
        <input className="w-full p-3 bg-gray-800 rounded" placeholder="A" value={answerA} onChange={(e) => setAnswerA(e.target.value)} />
        <input className="w-full p-3 bg-gray-800 rounded" placeholder="B" value={answerB} onChange={(e) => setAnswerB(e.target.value)} />
        <input className="w-full p-3 bg-gray-800 rounded" placeholder="C" value={answerC} onChange={(e) => setAnswerC(e.target.value)} />
        <input className="w-full p-3 bg-gray-800 rounded" placeholder="D" value={answerD} onChange={(e) => setAnswerD(e.target.value)} />
        <input
          className="w-full p-3 bg-gray-800 rounded"
          placeholder="الإجابة الصحيحة (A/B/C/D)"
          value={correctAnswer}
          onChange={(e) => setCorrectAnswer(e.target.value.toUpperCase())}
        />

        <button
          onClick={handleSaveQuestion}
          className="w-full bg-blue-600 p-3 rounded"
        >
          {editingIndex === null ? "➕ إضافة السؤال" : "💾 حفظ التعديل"}
        </button>

        {editingIndex !== null && (
          <button
            onClick={resetForm}
            className="w-full bg-gray-700 p-2 rounded"
          >
            إلغاء التعديل
          </button>
        )}
      </div>

      {/* ===== القائمة ===== */}
      <div className="bg-[#111] p-5 rounded-xl border border-gray-700">
        <h2 className="font-bold mb-4 text-green-400">📋 الأسئلة</h2>

        {loading ? (
          <p>جار التحميل…</p>
        ) : questions.length === 0 ? (
          <p className="text-gray-400">لا توجد أسئلة</p>
        ) : (
          <ul className="space-y-3">
            {questions.map((q, i) => (
              <li key={i} className="p-3 bg-gray-800 rounded">
                <p className="font-semibold">{i + 1}. {q.question}</p>
                <p className="text-sm text-gray-400">
                  الإجابة الصحيحة: {q.correctAnswer}
                </p>

                <div className="flex gap-3 mt-2">
                  <button
                    onClick={() => startEdit(q, i)}
                    className="px-3 py-1 bg-yellow-600 rounded"
                  >
                    ✏️ تعديل
                  </button>
                  <button
                    onClick={() => handleDelete(i)}
                    className="px-3 py-1 bg-red-600 rounded"
                  >
                    🗑️ حذف
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
