import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { getAuth } from "firebase/auth";

export default function TeacherLessons() {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) return;

        const res = await axios.get(
          `http://localhost:5000/api/lessons?teacherId=${user.uid}`
        );

        // ✅ التصحيح النهائي: الباك إند يرجّع Array مباشرة
        setLessons(res.data || []);
      } catch (err) {
        console.error("خطأ في جلب الدروس", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLessons();
  }, []);

  return (
    <div style={{ padding: "30px" }}>
      <h2>دروسي</h2>

      {/* زر إضافة درس */}
      <Link to="/teacher/lessons/add">
        <button
          style={{
            marginBottom: "20px",
            padding: "12px 18px",
            background: "#FFD700",
            color: "#000",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "700",
            fontSize: "15px",
          }}
        >
          ➕ إضافة درس جديد
        </button>
      </Link>

      {loading ? (
        <p>⏳ جاري تحميل الدروس...</p>
      ) : lessons.length === 0 ? (
        <p>لا يوجد دروس مضافة حتى الآن</p>
      ) : (
        <ul>
          {lessons.map((lesson) => (
            <li key={lesson.id} style={{ marginBottom: "10px" }}>
              <strong>{lesson.title}</strong>
              <br />
              <small>{lesson.description}</small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
