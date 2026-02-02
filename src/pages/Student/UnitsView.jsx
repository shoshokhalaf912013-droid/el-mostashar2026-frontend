import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  collection,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";

import { db } from "../../firebase";
import UnitCard from "./UnitCard";
import { generateUnits } from "../../utils/generateUnits";

export default function UnitsView() {
  const navigate = useNavigate();
  const { gradeId, subjectId, trackId } = useParams();

  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);

  // =============================
  // تحميل الوحدات (ثابت لا يُمس)
  // =============================
  useEffect(() => {
    if (!gradeId || !subjectId) {
      setUnits([]);
      setLoading(false);
      return;
    }

    const conditions = [
      where("gradeId", "==", gradeId),
      where("subjectId", "==", subjectId),
      where("active", "==", true),
    ];

    if (trackId) {
      conditions.push(where("trackId", "==", trackId));
    }

    const q = query(collection(db, "units"), ...conditions);

    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        .sort((a, b) => (a.order || 0) - (b.order || 0));

      setUnits(data);
      setLoading(false);
    });

    return () => unsub();
  }, [gradeId, subjectId, trackId]);

  // =============================
  // إضافة وحدة واحدة فقط
  // =============================
  const handleGenerateUnits = async () => {
    try {
      await generateUnits({
        gradeId,
        stageId: units[0]?.stageId || "secondary",
        subjectId,
        systemId: units[0]?.systemId || "general",
        trackId: trackId || null,
      });
    } catch (err) {
      console.error("❌ Add unit failed:", err);
    }
  };

  if (loading) {
    return (
      <div className="units-page">
        <div style={{ color: "#fff", textAlign: "center" }}>
          جاري التحميل...
        </div>
      </div>
    );
  }

  return (
    <div className="units-page">
      <h2 className="units-title">الوحدات</h2>

      {/* زر الإضافة */}
      <div style={{ textAlign: "center", marginBottom: "40px" }}>
        <button
          onClick={handleGenerateUnits}
          style={{
            padding: "12px 22px",
            background: "#0f9d58",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            fontSize: "15px",
            cursor: "pointer",
          }}
        >
          + إضافة وحدة
        </button>
      </div>

      {/* شبكة الوحدات */}
      <div className="units-grid">
        {units.map((unit) => (
          <UnitCard
            key={unit.id}
            unit={unit}
            onClick={() =>
              navigate(
                `/student/secondary/lessons/${gradeId}/${subjectId}/${unit.unitId}`
              )
            }
          />
        ))}
      </div>
    </div>
  );
}
