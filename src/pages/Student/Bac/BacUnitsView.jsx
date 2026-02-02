import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  collection,
  getDocs,
  query,
  where,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../../firebase";
import UnitCard from "../UnitCard";

/* مواد بكالوريا خاصة فقط */
const BAC_ONLY_SUBJECTS = [
  "economics",
  "accounting",
  "businessAdministration",
  "programming",
];

/* تحويل الصف */
const BAC_TO_SECONDARY = {
  bac2: "sec2",
  bac3: "sec3",
};

export default function BacUnitsView() {
  const { gradeId, subjectId } = useParams();
  const navigate = useNavigate();

  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showAdd, setShowAdd] = useState(false);
  const [newTitle, setNewTitle] = useState("");

  useEffect(() => {
    loadUnits();
    // eslint-disable-next-line
  }, [gradeId, subjectId]);

  async function loadUnits() {
    setLoading(true);

    try {
      const isBacOnly = BAC_ONLY_SUBJECTS.includes(subjectId);

      let generalUnits = [];
      let bacUnits = [];

      /* ================= GENERAL ================= */
      if (!isBacOnly) {
        const sourceGrade = BAC_TO_SECONDARY[gradeId];

        const generalQ = query(
          collection(db, "units"),
          where("active", "==", true),
          where("systemId", "==", "general"),
          where("subjectId", "==", subjectId),
          where("unitsSourceGrade", "==", sourceGrade)
        );

        const snap = await getDocs(generalQ);
        generalUnits = snap.docs.map(d => ({
          id: d.id,
          ...d.data(),
        }));
      }

      /* ================= BAC ================= */
      const bacQ = query(
        collection(db, "units"),
        where("active", "==", true),
        where("systemId", "==", "bac"),
        where("gradeId", "==", gradeId),
        where("subjectId", "==", subjectId)
      );

      const bacSnap = await getDocs(bacQ);
      bacUnits = bacSnap.docs.map(d => ({
        id: d.id,
        ...d.data(),
      }));

      const finalUnits = [...generalUnits, ...bacUnits].sort(
        (a, b) => (a.order || 0) - (b.order || 0)
      );

      setUnits(finalUnits);
    } catch (err) {
      console.error("❌ Load units error:", err);
      setUnits([]);
    } finally {
      setLoading(false);
    }
  }

  /* ================= ADD ONE UNIT ONLY ================= */
  async function handleAddUnit() {
    if (!newTitle.trim()) return;

    try {
      const maxOrder =
        units.length > 0
          ? Math.max(...units.map(u => Number(u.order || 0)))
          : 0;

      const nextOrder = maxOrder + 1;

      await addDoc(collection(db, "units"), {
        unitId: `unit-${nextOrder}`,
        order: nextOrder,
        title: newTitle.trim(),
        active: true,

        gradeId,
        subjectId,
        stageId: "bac",
        systemId: "bac",
        trackId: null,

        source: "real",
        createdAt: serverTimestamp(),
      });

      setNewTitle("");
      setShowAdd(false);
      loadUnits();
    } catch (err) {
      console.error("❌ Add unit failed:", err);
    }
  }

  /* ================= RENDER ================= */
  if (loading) {
    return <div className="p-10 text-white">جاري تحميل الوحدات…</div>;
  }

  return (
    <div className="p-10 space-y-6 text-white">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">الوحدات</h2>

        <button
          onClick={() => setShowAdd(true)}
          className="px-4 py-2 rounded-lg bg-yellow-400 text-black font-bold hover:bg-yellow-300 transition"
        >
          + إضافة وحدة
        </button>
      </div>

      {showAdd && (
        <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-4 space-y-4">
          <input
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            placeholder="عنوان الوحدة (عربي / English)"
            className="w-full px-4 py-2 rounded bg-black border border-zinc-700 text-white"
          />

          <div className="flex gap-3">
            <button
              onClick={handleAddUnit}
              className="px-4 py-2 bg-green-600 rounded hover:bg-green-500"
            >
              حفظ
            </button>
            <button
              onClick={() => setShowAdd(false)}
              className="px-4 py-2 bg-zinc-700 rounded"
            >
              إلغاء
            </button>
          </div>
        </div>
      )}

      {!units.length ? (
        <div className="text-zinc-400">لا توجد وحدات حالياً</div>
      ) : (
        <div className="space-y-4">
          {units.map(unit => (
            <UnitCard
              key={unit.id}
              unit={unit}
              onClick={() =>
                navigate(
                  `/student/bac/lessons/${gradeId}/${subjectId}/${unit.unitId}`
                )
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
