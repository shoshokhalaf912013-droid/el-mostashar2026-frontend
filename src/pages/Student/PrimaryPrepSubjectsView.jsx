// src/pages/Student/PrimaryPrepSubjectsView.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { db } from "../../firebase";

export default function PrimaryPrepSubjectsView() {
  const { gradeId } = useParams();
  const navigate = useNavigate();

  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!gradeId) {
      navigate("/student/select-stage", { replace: true });
      return;
    }

    const fetchSubjects = async () => {
      try {
        const q = query(
          collection(db, "gradeSubjects"),
          where("gradeId", "==", gradeId),
          where("active", "==", true),
          orderBy("order", "asc")
        );

        const snap = await getDocs(q);

        const data = snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setSubjects(data);
      } catch (e) {
        console.error("PRIMARY_PREP_SUBJECTS_ERROR:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, [gradeId, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        تحميل...
      </div>
    );
  }

  if (!subjects.length) {
    return (
      <div className="min-h-screen bg-black text-red-500 flex items-center justify-center">
        ❌ لا توجد مواد
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black p-10">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {subjects.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() =>
              navigate(`/student/units/${gradeId}/${s.subjectId}`)
            }
            className="
              group
              relative
              p-6
              rounded-xl
              border
              border-yellow-500/40
              bg-black
              text-white
              font-bold
              text-center
              transition-all
              duration-300
              hover:-translate-y-1
              hover:scale-[1.03]
              hover:border-yellow-400
              hover:shadow-[0_0_20px_rgba(255,215,0,0.25)]
              focus:outline-none
            "
          >
            <span
              className="
                relative
                z-10
                transition-all
                duration-300
                group-hover:text-yellow-300
              "
            >
              {s.title}
            </span>

            <span
              className="
                absolute
                bottom-3
                left-1/2
                -translate-x-1/2
                h-[2px]
                w-8
                bg-yellow-500/60
                transition-all
                duration-300
                group-hover:w-16
                group-hover:bg-yellow-400
              "
            />
          </button>
        ))}
      </div>
    </div>
  );
}
