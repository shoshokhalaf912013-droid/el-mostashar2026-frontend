import React, { useState } from "react";

const AddExam = () => {
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState([]);

  const addQuestion = () => {
    setQuestions([
      ...questions,
      { id: Date.now(), question: "", a: "", b: "", c: "", d: "", correct: "" },
    ]);
  };

  const updateQuestion = (id, field, value) => {
    setQuestions(
      questions.map((q) =>
        q.id === id ? { ...q, [field]: value } : q
      )
    );
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>إضافة امتحان جديد</h2>

      <label>عنوان الامتحان:</label>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{ display: "block", width: "100%", margin: "10px 0" }}
      />

      <button onClick={addQuestion} style={{ padding: "10px", margin: "10px 0" }}>
        + إضافة سؤال
      </button>

      {questions.map((q) => (
        <div
          key={q.id}
          style={{
            border: "1px solid #ccc",
            padding: "15px",
            borderRadius: "8px",
            marginBottom: "15px",
          }}
        >
          <label>السؤال:</label>
          <input
            type="text"
            value={q.question}
            onChange={(e) => updateQuestion(q.id, "question", e.target.value)}
            style={{ width: "100%", marginBottom: "10px" }}
          />

          <label>الإجابات (اختياري أ - ب - ج - د):</label>

          <input
            placeholder="أ"
            value={q.a}
            onChange={(e) => updateQuestion(q.id, "a", e.target.value)}
            style={{ width: "100%", margin: "5px 0" }}
          />
          <input
            placeholder="ب"
            value={q.b}
            onChange={(e) => updateQuestion(q.id, "b", e.target.value)}
            style={{ width: "100%", margin: "5px 0" }}
          />
          <input
            placeholder="ج"
            value={q.c}
            onChange={(e) => updateQuestion(q.id, "c", e.target.value)}
            style={{ width: "100%", margin: "5px 0" }}
          />
          <input
            placeholder="د"
            value={q.d}
            onChange={(e) => updateQuestion(q.id, "d", e.target.value)}
            style={{ width: "100%", margin: "5px 0" }}
          />

          <label>الإجابة الصحيحة:</label>
          <select
            value={q.correct}
            onChange={(e) => updateQuestion(q.id, "correct", e.target.value)}
            style={{ width: "100%", marginTop: "5px" }}
          >
            <option value="">اختر</option>
            <option value="a">أ</option>
            <option value="b">ب</option>
            <option value="c">ج</option>
            <option value="d">د</option>
          </select>
        </div>
      ))}

      <button style={{ padding: "12px 20px", background: "green", color: "white" }}>
        حفظ الامتحان
      </button>
    </div>
  );
};

export default AddExam;
