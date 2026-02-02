import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { db } from "../../../firebase";

/* أسماء المسارات */
const TRACK_NAMES = {
  bacLifeMedicine: "الطب وعلوم الحياة",
  bacEngineering: "الهندسة وعلوم الحاسب",
  bacBusiness: "إدارة الأعمال",
  bacArtsHumanities: "الآداب والعلوم الإنسانية",
};

/* مواد ممنوعة حسب الصف */
const FORBIDDEN_BAC2 = ["geography"];
const FORBIDDEN_BAC3 = ["history", "geography"]; // الجغرافيا ممنوعة كعامة فقط

export default function BacAdvancedSubjectsView() {
  const { gradeId } = useParams(); // bac2 | bac3
  const navigate = useNavigate();

  const [generalSubjects, setGeneralSubjects] = useState([]);
  const [tracks, setTracks] = useState({});
  const [openTrack, setOpenTrack] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ربط البكالوريا بالثانوية العامة */
  const sourceGradeId =
    gradeId === "bac2"
      ? "sec2"
      : gradeId === "bac3"
      ? "sec3"
      : gradeId;

  useEffect(() => {
    loadAll();
  }, [gradeId]);

  async function loadAll() {
    setLoading(true);

    // ================= المواد العامة =================
    const generalQ = query(
      collection(db, "gradeSubjects"),
      where("gradeId", "==", sourceGradeId),
      where("active", "==", true),
      orderBy("order", "asc")
    );

    const generalSnap = await getDocs(generalQ);

    // ================= مواد المسارات =================
    const tracksQ = query(
      collection(db, "trackSubjects"),
      where("gradeId", "==", gradeId),
      where("active", "==", true),
      orderBy("order", "asc")
    );

    const tracksSnap = await getDocs(tracksQ);

    const trackSubjectIds = new Set();
    const groupedTracks = {};

    tracksSnap.docs.forEach((doc) => {
      const data = doc.data();
      trackSubjectIds.add(data.subjectId);

      if (!groupedTracks[data.trackId]) {
        groupedTracks[data.trackId] = [];
      }

      groupedTracks[data.trackId].push({
        id: doc.id,
        ...data,
      });
    });

    // ================= فلترة المواد العامة =================
    let filteredGeneralSubjects = generalSnap.docs
      .map((d) => ({ id: d.id, ...d.data() }))
      // ❌ لا نكرر مادة موجودة في المسارات
      .filter((s) => !trackSubjectIds.has(s.subjectId));

    // ❌ قواعد الصف الثاني
    if (gradeId === "bac2") {
      // تأكد من أن اللغة العربية ليست مستبعدة
      filteredGeneralSubjects = filteredGeneralSubjects.filter(
        (s) => !FORBIDDEN_BAC2.includes(s.subjectId) || s.subjectId === "arabic"
      );
    }

    // ❌ قواعد الصف الثالث
    if (gradeId === "bac3") {
      // تأكد من أن اللغة العربية ليست مستبعدة
      filteredGeneralSubjects = filteredGeneralSubjects.filter(
        (s) => !FORBIDDEN_BAC3.includes(s.subjectId) || s.subjectId === "arabic"
      );
    }

    setGeneralSubjects(filteredGeneralSubjects);
    setTracks(groupedTracks);
    setLoading(false);
  }

  if (loading) {
    return <div className="p-10 text-white">جاري التحميل...</div>;
  }

  return (
    <div className="p-10 text-white space-y-20">
      {/* ================= المواد العامة ================= */}
      <section>
        <h2 className="text-2xl mb-8">المواد العامة</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {generalSubjects.map((subject) => (
            <button
              key={subject.id}
              onClick={() =>
                navigate(
                  `/student/bac/units/${gradeId}/${subject.subjectId}`
                )
              }
              className="bg-zinc-900 border border-yellow-600/30 rounded-xl p-5 transition hover:bg-zinc-800"
            >
              {subject.title}
            </button>
          ))}
        </div>
      </section>

      {/* ================= المسارات ================= */}
      <section>
        <h2 className="text-2xl mb-10">المسارات</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {Object.entries(tracks).map(([trackId, subjects]) => (
            <div key={trackId} className="space-y-4">
              <div className="bg-zinc-950 border border-yellow-500/70 rounded-2xl p-8 text-center">
                <button
                  onClick={() =>
                    setOpenTrack(openTrack === trackId ? null : trackId)
                  }
                  className="w-full"
                >
                  <div className="text-xl text-yellow-400 font-semibold">
                    {TRACK_NAMES[trackId]}
                  </div>
                </button>
              </div>

              {openTrack === trackId && (
                <div className="grid grid-cols-2 gap-4 bg-black/60 border border-yellow-500/30 rounded-xl p-5">
                  {subjects.map((subject) => (
                    <button
                      key={subject.id}
                      onClick={() =>
                        navigate(
                          `/student/bac/units/${gradeId}/${subject.subjectId}`
                        )
                      }
                      className="bg-zinc-900 border border-yellow-600/40 rounded-lg p-4 text-sm transition hover:bg-zinc-800"
                    >
                      {subject.title}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
