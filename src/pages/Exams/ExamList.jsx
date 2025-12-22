import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function ExamList() {
  const [exams, setExams] = useState([]);

  const loadExams = async () => {
    const res = await axios.get("/api/exams/all");
    setExams(res.data.exams);
  };

  useEffect(() => {
    loadExams();
  }, []);

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl text-yellow-400 font-bold mb-4">
        الامتحانات المتاحة 🎓
      </h1>

      <div className="space-y-4">
        {exams.map((exam) => (
          <div
            key={exam._id}
            className="bg-gray-900 p-4 rounded-lg flex justify-between"
          >
            <div>
              <h2 className="text-xl font-bold">{exam.title}</h2>
              <p className="text-gray-400">{exam.subject}</p>
              <p>مدة الامتحان: {exam.duration} دقيقة</p>
            </div>

            <Link
              to={`/exam/start/${exam._id}`}
              className="bg-green-600 px-4 py-2 rounded h-fit"
            >
              دخول
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
