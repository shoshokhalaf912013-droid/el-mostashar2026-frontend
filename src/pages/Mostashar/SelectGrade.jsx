import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function SelectGrade() {

  const navigate = useNavigate();

  const [grades, setGrades] = useState([]);

  useEffect(() => {

    const stage = localStorage.getItem("mostasharStage");

    if (stage === "prep") {

      setGrades([
        { id: "prep1", title: "الصف الأول الإعدادي" },
        { id: "prep2", title: "الصف الثاني الإعدادي" },
        { id: "prep3", title: "الصف الثالث الإعدادي" },
      ]);

    }

    if (stage === "secondary") {

      setGrades([
        { id: "sec1", title: "الصف الأول الثانوي" },
        { id: "sec2", title: "الصف الثاني الثانوي" },
        { id: "sec3", title: "الصف الثالث الثانوي" },
      ]);

    }

  }, []);

  const handleSelect = (gradeId) => {

    localStorage.setItem("mostasharGrade", gradeId);

    navigate("/student/mostashar/selectsubject");

  };

  return (

    <div className="min-h-screen bg-black p-10">

      <h1 className="text-3xl font-bold text-yellow-400 text-center mb-12">
        اختر الصف
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-5xl mx-auto">

        {grades.map((grade) => (

          <div
            key={grade.id}
            onClick={() => handleSelect(grade.id)}
            className="cursor-pointer rounded-xl border border-yellow-500/40 bg-zinc-900 p-10 text-center hover:scale-105 transition"
          >

            <h2 className="text-xl text-yellow-300">
              {grade.title}
            </h2>

          </div>

        ))}

      </div>

    </div>

  );

}