import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";

import "../../styles/sa-student.css";
import "./styles/exam.css";

const ExamPage = () => {
  const { id: examId } = useParams();

  const [exam, setExam] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);

  /* ================= جلب الامتحان ================= */
  useEffect(() => {
    const fetchExam = async () => {
      try {
        const ref = doc(db, "exams", examId);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          setExam(snap.data());
        } else {
          alert("الامتحان غير موجود");
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    if (examId) fetchExam();
  }, [examId]);

  /* ================= اختيار إجابة ================= */
  const handleSelect = (qIndex, choice) => {
    setAnswers((prev) => ({
      ...prev,
      [qIndex]: choice,
    }));
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  if (loading) {
    return <div className="exam-loading">جار تحميل الامتحان...</div>;
  }

  if (!exam) {
    return <div className="exam-loading">لم يتم العثور على الامتحان</div>;
  }

  return (
    <div className="exam-container">
      <h2 className="exam-title">
        {exam.title || "امتحان على الدرس"}
      </h2>

      {exam.description && (
        <p className="exam-desc">{exam.description}</p>
      )}

      {!submitted ? (
        <div className="exam-questions">
          {exam.questions?.map((q, index) => (
            <div key={index} className="exam-question-box">
              <h3 className="exam-question">
                {index + 1}. {q.question}
              </h3>

              <div className="exam-choices">
                {Object.entries(q.options).map(
                  ([key, value]) => (
                    <label key={key} className="exam-choice">
                      <input
                        type="radio"
                        name={`q-${index}`}
                        value={key}
                        onChange={() =>
                          handleSelect(index, key)
                        }
                      />
                      <span>
                        {key}. {value}
                      </span>
                    </label>
                  )
                )}
              </div>
            </div>
          ))}

          <button
            className="exam-submit-btn"
            onClick={handleSubmit}
          >
            إرسال الامتحان
          </button>
        </div>
      ) : (
        <div className="exam-result-box">
          <h3>تم إرسال الامتحان بنجاح ✔</h3>
          <p>سيتم تصحيح الامتحان لاحقًا.</p>
        </div>
      )}
    </div>
  );
};

export default ExamPage;
