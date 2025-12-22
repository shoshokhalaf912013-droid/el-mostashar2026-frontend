import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SubjectsByGrade from "../../data/SubjectsByGrade";

/* =====================================================
   🔑 مفاتيح المواد (المصدر الوحيد للحقيقة)
   ===================================================== */
const SUBJECT_KEYS = {
  "اللغة العربية": "arabic",
  "اللغة الإنجليزية": "english",
  "الرياضيات": "math",
  "الفيزياء": "physics",
  "الكيمياء": "chemistry",
  "الأحياء": "biology",
  "التاريخ": "history",
  "الجغرافيا": "geography",
  "التربية الدينية الإسلامية": "islamic_religion",
  "التربية الدينية المسيحية": "christian_religion",
};

export default function SubjectsView() {
  const navigate = useNavigate();
  const { gradeId } = useParams();

  if (!gradeId || !SubjectsByGrade[gradeId]) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500 text-xl font-bold">
        الصف الدراسي غير موجود
      </div>
    );
  }

  const gradeData = SubjectsByGrade[gradeId];
  const commonAdded = gradeData.commonAdded || [];
  const commonNotAddedRaw = gradeData.commonNotAdded || [];
  const tracks = gradeData.tracks || {};

  /* ================= معالجة المواد غير المضافة ================= */
  const commonNotAdded = [];

  commonNotAddedRaw.forEach((subject) => {
    if (subject === "التربية الدينية") {
      commonNotAdded.push("التربية الدينية الإسلامية");
      commonNotAdded.push("التربية الدينية المسيحية");
    } else if (subject === "اللغة الأجنبية الثانية") {
      commonNotAdded.push("اللغة الأجنبية الثانية – ألماني");
      commonNotAdded.push("اللغة الأجنبية الثانية – فرنسي");
    } else {
      commonNotAdded.push(subject);
    }
  });

  const hasTracks = Object.keys(tracks).length > 0;
  const [selectedTrack, setSelectedTrack] = useState(null);

  /* =====================================================
     🚦 الانتقال الصحيح: مادة → وحدات
     ===================================================== */
  const goToSubject = (subjectName) => {
    const subjectKey = SUBJECT_KEYS[subjectName];

    if (!subjectKey) {
      console.warn("❌ subjectKey غير معرف للمادة:", subjectName);
      return;
    }

    // ✅ الانتقال إلى صفحة الوحدات (وليس الدروس)
    navigate(`/student/units/${gradeId}/${subjectKey}`);
  };

  return (
    <div className="min-h-screen bg-black text-white px-6 py-10" dir="rtl">
      <h1 className="text-3xl font-extrabold text-center mb-14 text-yellow-400">
        المواد الدراسية
      </h1>

      {/* ================= المواد المضافة ================= */}
      {commonAdded.length > 0 && (
        <section className="mb-14">
          <h2 className="text-2xl font-bold mb-6 text-green-400">
            المواد المضافة للمجموع
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {commonAdded.map((subject, index) => (
              <button
                key={index}
                onClick={() => goToSubject(subject)}
                className="
                  bg-gray-900
                  p-6
                  rounded-xl
                  border border-green-700
                  text-lg font-extrabold text-right
                  transition-all duration-300
                  hover:bg-green-900/30
                  hover:border-green-400
                  hover:scale-[1.02]
                  hover:shadow-lg hover:shadow-green-500/10
                "
              >
                {subject}
              </button>
            ))}
          </div>
        </section>
      )}

      {/* ================= مواد لا تضاف للمجموع ================= */}
      {commonNotAdded.length > 0 && (
        <section className="mb-14">
          <h2 className="text-2xl font-bold mb-6 text-yellow-300">
            مواد لا تضاف للمجموع
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {commonNotAdded.map((subject, index) => (
              <button
                key={index}
                onClick={() => goToSubject(subject)}
                className="
                  bg-gray-800
                  p-6
                  rounded-xl
                  border border-yellow-700
                  text-lg font-bold text-right
                  transition-all duration-300
                  hover:bg-yellow-900/20
                  hover:border-yellow-400
                  hover:scale-[1.02]
                  hover:shadow-lg hover:shadow-yellow-500/10
                "
              >
                {subject}
              </button>
            ))}
          </div>
        </section>
      )}

      {/* ================= المسارات ================= */}
      {hasTracks && (
        <section className="mb-14">
          <h2 className="text-2xl font-bold mb-8 text-blue-400 text-center">
            اختر المسار
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {Object.keys(tracks).map((trackName) => (
              <button
                key={trackName}
                onClick={() => setSelectedTrack(trackName)}
                className={`
                  p-6 rounded-2xl text-xl font-extrabold
                  transition-all duration-300
                  ${
                    selectedTrack === trackName
                      ? "bg-blue-600 text-white scale-105 shadow-xl shadow-blue-500/30"
                      : "bg-gray-900 border border-blue-700 hover:bg-blue-500 hover:text-white hover:scale-105"
                  }
                `}
              >
                {trackName}
              </button>
            ))}
          </div>
        </section>
      )}

      {/* ================= مواد المسار ================= */}
      {selectedTrack && tracks[selectedTrack] && (
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6 text-purple-400 text-center">
            مواد مسار: {selectedTrack}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tracks[selectedTrack].map((subject, index) => (
              <button
                key={index}
                onClick={() => goToSubject(subject)}
                className="
                  bg-gray-900
                  p-6
                  rounded-xl
                  border border-purple-700
                  text-lg font-extrabold text-right
                  transition-all duration-300
                  hover:bg-purple-900/30
                  hover:border-purple-400
                  hover:scale-[1.02]
                  hover:shadow-lg hover:shadow-purple-500/10
                "
              >
                {subject}
              </button>
            ))}
          </div>
        </section>
      )}

      {/* ================= رجوع ================= */}
      <div className="text-center mt-20">
        <button
          onClick={() => navigate(-1)}
          className="
            px-10 py-4
            bg-yellow-500 text-black
            rounded-xl
            text-lg font-extrabold
            transition-all
            hover:bg-yellow-400
            hover:scale-105
            hover:shadow-lg hover:shadow-yellow-500/30
          "
        >
          رجوع
        </button>
      </div>
    </div>
  );
}
