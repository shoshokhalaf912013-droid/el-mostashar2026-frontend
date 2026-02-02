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

export default function UnitsViewGeneral() {
  const navigate = useNavigate();
  const { gradeId, subjectId } = useParams();

  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!gradeId || !subjectId) {
      setUnits([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, "units"),
      where("gradeId", "==", gradeId),
      where("subjectId", "==", subjectId),
      where("systemId", "==", "general"),
      where("active", "==", true)
    );

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
  }, [gradeId, subjectId]);

  // =============================
  // إضافة وحدة واحدة فقط
  // =============================
  const handleGenerateUnits = async () => {
    try {
      await generateUnits({
        gradeId,
        stageId: units[0]?.stageId || "primary",
        subjectId,
        systemId: "general",
      });
    } catch (err) {
      console.error("❌ Add unit failed:", err);
    }
  };

  if (loading) {
    return (
      <div style={{ color: "#fff", padding: "40px" }}>
        جاري التحميل...
      </div>
    );
  }

  return (
    <div style={{ padding: "24px" }}>
      <h2 style={{ color: "#fff", marginBottom: "20px" }}>
        الوحدات
      </h2>

      {/* زر الإضافة */}
      <div style={{ marginBottom: "30px" }}>
        <button
          onClick={handleGenerateUnits}
          style={{
            padding: "10px 18px",
            background: "#0f9d58",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "14px",
          }}
        >
          + إضافة وحدة
        </button>
      </div>

      {units.length === 0 && (
        <div style={{ color: "#aaa" }}>
          لا توجد وحدات حالياً
        </div>
      )}

      {units.map((unit) => (
        <UnitCard
          key={unit.id}
          unit={unit}
          onClick={() =>
            navigate(
              `/student/primary-prep/lessons/${gradeId}/${subjectId}/${unit.unitId}`
            )
          }
        />
      ))}
    </div>
  );
}
