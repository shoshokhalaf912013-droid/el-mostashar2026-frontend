// src/pages/SuperAdmin/ManageExams.jsx
import React, { useEffect, useState } from "react";
import api from "../../utils/api";

export default function ManageExams() {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const res = await api.get("/api/exams");
      setExams(res.data?.exams || []);
    } catch (err) {
      console.error("خطأ أثناء جلب الامتحانات:", err);
      setExams([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  if (loading) return <p className="p-6 text-white">جاري التحميل...</p>;

  return (
    <div className="p-6 text-white">
      <h1 className="text-3xl mb-4">إدارة الامتحانات</h1>

      {exams.length === 0 ? (
        <p>لا توجد امتحانات حالياً</p>
      ) : (
        exams.map((exam) => (
          <div key={exam._id} className="bg-gray-800 p-4 my-3 rounded">
            <h2 className="text-xl">{exam.title}</h2>
            <p>عدد الأسئلة: {exam.questions?.length || 0}</p>
          </div>
        ))
      )}
    </div>
  );
}
