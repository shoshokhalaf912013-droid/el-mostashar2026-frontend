import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function SelectSubject() {

  const navigate = useNavigate();

  const [subjects, setSubjects] = useState([]);

  useEffect(() => {

    const grade = localStorage.getItem("mostasharGrade");

    /* الإعدادي */

    if (
      grade === "prep1" ||
      grade === "prep2" ||
      grade === "prep3"
    ) {

      setSubjects([
        { id: "social", title: "الدراسات الاجتماعية" }
      ]);

    }

    /* أول ثانوي */

    if (grade === "sec1") {

      setSubjects([
        { id: "history", title: "التاريخ" }
      ]);

    }

    /* ثاني ثانوي */

    if (grade === "sec2") {

      setSubjects([
        { id: "history", title: "التاريخ" },
        { id: "geography", title: "الجغرافيا" }
      ]);

    }

    /* ثالث ثانوي (البكالوريا) */

    if (grade === "sec3") {

      setSubjects([
        { id: "history", title: "التاريخ" },
        { id: "geography", title: "الجغرافيا" },
        { id: "economics", title: "الاقتصاد" }
      ]);

    }

  }, []);

  const handleSelect = (subjectId) => {

    const grade = localStorage.getItem("mostasharGrade");

    localStorage.setItem("mostasharSubject", subjectId);

    navigate(`/student/secondary/units/${grade}/${subjectId}`);

  };

  return (

    <div className="min-h-screen bg-black p-10">

      <h1 className="text-3xl font-bold text-yellow-400 text-center mb-12">
        اختر المادة
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-5xl mx-auto">

        {subjects.map((subject) => (

          <div
            key={subject.id}
            onClick={() => handleSelect(subject.id)}
            className="cursor-pointer rounded-xl border border-yellow-500/40 bg-zinc-900 p-10 text-center hover:scale-105 transition"
          >

            <h2 className="text-xl text-yellow-300">
              {subject.title}
            </h2>

          </div>

        ))}

      </div>

    </div>

  );

}