import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../../firebase";

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

export default function SecondaryAdvancedSubjectsView() {
  const { gradeId } = useParams();
  const navigate = useNavigate();
  const isSec3 = gradeId === "sec3";

  const [subjects, setSubjects] = useState([]);

  const [openSciScience, setOpenSciScience] = useState(false);
  const [openSciMath, setOpenSciMath] = useState(false);
  const [openReligion, setOpenReligion] = useState(false);
  const [openSecondLang, setOpenSecondLang] = useState(false);

  useEffect(() => {
    async function load() {
      if (!gradeId) return;

      const q = query(
        collection(db, "gradeSubjects"),
        where("stageId", "==", "secondary"),
        where("gradeId", "==", gradeId),
        where("active", "==", true)
      );

      const snap = await getDocs(q);
      setSubjects(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    }

    load();
  }, [gradeId]);

  const goUnits = (s) =>
    navigate(`/student/secondary/units/${gradeId}/${s.subjectId}`);

  /* ======================= التقسيم النهائي (عرض فقط) ======================= */

  // المواد الأساسية
  const basic = subjects.filter(
    (s) =>
      s.inTotal === true &&
      s.category === "general" &&
      !s.subjectId?.toLowerCase().includes("religion")
  );

  // القسم الأدبي
  const literary = subjects.filter(
    (s) =>
      s.inTotal === true &&
      s.category === "literary"
  );

  // المواد العلمية المشتركة
  // الصف الثاني: كل المواد العلمية
  // الصف الثالث: فيزياء + كيمياء فقط
  const scientificShared = subjects.filter(
    (s) =>
      s.inTotal === true &&
      s.category === "scientific" &&
      (
        gradeId === "sec2" ||
        (
          gradeId === "sec3" &&
          s.subjectId !== "biology" &&
          s.subjectId !== "math"
        )
      )
  );

  // علمي علوم (ثالثة فقط)
  const sciScience = subjects.filter(
    (s) =>
      isSec3 &&
      s.sectionId === "scientificScience"
  );

  // علمي رياضة (ثالثة فقط)
  const sciMath = subjects.filter(
    (s) =>
      isSec3 &&
      s.sectionId === "scientificMath"
  );

  // التربية الدينية
  const religions = subjects.filter(
    (s) => s.subjectId?.toLowerCase().includes("religion")
  );

  // اللغة الأجنبية الثانية
  const secondLangs = subjects.filter(
    (s) =>
      s.subjectId?.toLowerCase().includes("second") &&
      s.inTotal === false
  );

  return (
    <div className="space-y-14">
      {/* المواد الأساسية */}
      {basic.length > 0 && (
        <section>
          <h2 className="text-yellow-400 mb-4">المواد الأساسية</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {basic.map((s) => (
              <Box key={s.id} title={s.title} onClick={() => goUnits(s)} />
            ))}
          </div>
        </section>
      )}

      {/* القسم الأدبي */}
      {literary.length > 0 && (
        <section>
          <h2 className="text-yellow-400 mb-4">القسم الأدبي</h2>
          <div className="grid grid-cols-2 gap-4">
            {literary.map((s) => (
              <Box key={s.id} title={s.title} onClick={() => goUnits(s)} />
            ))}
          </div>
        </section>
      )}

      {/* المواد العلمية المشتركة */}
      {scientificShared.length > 0 && (
        <section>
          <h2 className="text-yellow-400 mb-4">المواد العلمية المشتركة</h2>
          <div className="grid grid-cols-2 gap-4">
            {scientificShared.map((s) => (
              <Box key={s.id} title={s.title} onClick={() => goUnits(s)} />
            ))}
          </div>
        </section>
      )}

      {/* القسم العلمي – ثالثة فقط */}
      {isSec3 && (
        <section>
          <h2 className="text-yellow-400 mb-4">القسم العلمي</h2>

          <div className="grid grid-cols-2 gap-4">
            <Box
              title="علمي علوم"
              onClick={() => {
                setOpenSciScience(!openSciScience);
                setOpenSciMath(false);
              }}
            />
            <Box
              title="علمي رياضة"
              onClick={() => {
                setOpenSciMath(!openSciMath);
                setOpenSciScience(false);
              }}
            />
          </div>

          {openSciScience && (
            <div className="grid grid-cols-2 gap-4 mt-4">
              {sciScience.map((s) => (
                <Box key={s.id} title={s.title} onClick={() => goUnits(s)} />
              ))}
            </div>
          )}

          {openSciMath && (
            <div className="grid grid-cols-2 gap-4 mt-4">
              {sciMath.map((s) => (
                <Box key={s.id} title={s.title} onClick={() => goUnits(s)} />
              ))}
            </div>
          )}
        </section>
      )}

      {/* مواد غير مضافة للمجموع */}
      <section>
        <h2 className="text-yellow-400 mb-4">مواد غير مضافة للمجموع</h2>

        <Box
          title="التربية الدينية"
          onClick={() => setOpenReligion(!openReligion)}
        />
        {openReligion && (
          <div className="grid grid-cols-2 gap-4 mt-4">
            {religions.map((s) => (
              <Box key={s.id} title={s.title} onClick={() => goUnits(s)} />
            ))}
          </div>
        )}

        <div className="mt-6">
          <Box
            title="اللغة الأجنبية الثانية"
            onClick={() => setOpenSecondLang(!openSecondLang)}
          />
          {openSecondLang && (
            <div className="grid grid-cols-2 gap-4 mt-4">
              {secondLangs.map((s) => (
                <Box key={s.id} title={s.title} onClick={() => goUnits(s)} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
