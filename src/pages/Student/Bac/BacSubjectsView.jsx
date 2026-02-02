import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { db } from "../../../firebase";

/* ===== Box موحّد (نفس الثانوية) ===== */
function Box({ title, onClick }) {
  return (
    <div
      onClick={onClick}
      className="
        cursor-pointer rounded-xl px-6 py-4 text-center
        border border-yellow-500 text-yellow-400
        transition-all duration-200
        hover:bg-yellow-400 hover:text-black hover:scale-[1.02]
      "
    >
      {title}
    </div>
  );
}

export default function BacSubjectsView() {
  const { gradeId } = useParams();

  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const [openReligion, setOpenReligion] = useState(false);
  const [openSecondLang, setOpenSecondLang] = useState(false);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const q = query(
          collection(db, "subjects"),
          where("gradeId", "==", gradeId),
          orderBy("order", "asc")
        );

        const snapshot = await getDocs(q);
        setSubjects(
          snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }))
        );
      } catch (err) {
        console.error("Firestore Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, [gradeId]);

  if (loading) {
    return <div className="text-center text-white">تحميل...</div>;
  }

  /* ================== التقسيم ================== */

  const religionSubjects = subjects.filter(
    s => s.subjectId?.toLowerCase().includes("religion")
  );

  const secondLangSubjects = subjects.filter(
    s => s.subjectId?.toLowerCase().includes("second")
  );

  const generalSubjects = subjects.filter(
    s =>
      s.type === "general" &&
      !s.subjectId?.toLowerCase().includes("religion") &&
      !s.subjectId?.toLowerCase().includes("second")
  );

  const trackSubjects = subjects.filter(
    s => s.type === "track"
  );

  const tracks = {
    bacLifeMedicine: "مسار الطب وعلوم الحياة",
    bacEngineering: "مسار الهندسة وعلوم الحاسب",
    bacBusiness: "مسار الأعمال",
    bacArtsHumanities: "مسار الفنون والآداب",
  };

  /* ================== العرض ================== */

  return (
    <div className="min-h-screen bg-black px-6 py-10 space-y-14">

      {/* 🟦 المواد العامة */}
      {generalSubjects.length > 0 && (
        <section>
          <h2 className="text-yellow-400 text-xl mb-4 text-center">
            المواد العامة
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {generalSubjects.map(subject => (
              <Link
                key={subject.id}
                to={`/student/bac/units/${gradeId}/${subject.id}`}
              >
                <Box title={subject.nameAr} />
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 🟩 مواد غير مضافة للمجموع (نفس الثانوية) */}
      {(religionSubjects.length > 0 || secondLangSubjects.length > 0) && (
        <section>
          <h2 className="text-yellow-400 text-xl mb-4 text-center">
            مواد غير مضافة للمجموع
          </h2>

          {/* الدين */}
          {religionSubjects.length > 0 && (
            <>
              <Box
                title="التربية الدينية"
                onClick={() => setOpenReligion(!openReligion)}
              />

              {openReligion && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  {religionSubjects.map(subject => (
                    <Link
                      key={subject.id}
                      to={`/student/bac/units/${gradeId}/${subject.id}`}
                    >
                      <Box title={subject.nameAr} />
                    </Link>
                  ))}
                </div>
              )}
            </>
          )}

          {/* اللغة الأجنبية الثانية */}
          {secondLangSubjects.length > 0 && (
            <div className="mt-6">
              <Box
                title="اللغة الأجنبية الثانية"
                onClick={() => setOpenSecondLang(!openSecondLang)}
              />

              {openSecondLang && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  {secondLangSubjects.map(subject => (
                    <Link
                      key={subject.id}
                      to={`/student/bac/units/${gradeId}/${subject.id}`}
                    >
                      <Box title={subject.nameAr} />
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </section>
      )}

      {/* 🟨 المسارات (كما هي) */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {Object.entries(tracks).map(([trackKey, trackName]) => {
          const subjectsOfTrack = trackSubjects.filter(
            s => s.track === trackKey
          );

          if (subjectsOfTrack.length === 0) return null;

          return (
            <div
              key={trackKey}
              className="border border-yellow-500 rounded-2xl p-6 bg-black"
            >
              <div className="text-center text-yellow-400 text-lg mb-6">
                {trackName}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {subjectsOfTrack.map(subject => (
                  <Link
                    key={subject.id}
                    to={`/student/bac/units/${gradeId}/${subject.id}`}
                  >
                    <Box title={subject.nameAr} />
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </section>

    </div>
  );
}
