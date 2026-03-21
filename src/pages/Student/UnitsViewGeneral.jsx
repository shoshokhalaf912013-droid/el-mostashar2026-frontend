import "./UnitsViewGeneral.css";
import { addNextUnit } from "@/utils/addNextUnit";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/firebase";
import UnitCard from "./UnitCard";
import useUserRole from "@/hooks/useUserRole";

const getUnitArabicName = (num) => {
  const map = {
    1: "الأولى",
    2: "الثانية",
    3: "الثالثة",
    4: "الرابعة",
    5: "الخامسة",
    6: "السادسة",
    7: "السابعة",
    8: "الثامنة",
    9: "التاسعة",
    10: "العاشرة",
    11: "الحادية عشرة",
    12: "الثانية عشرة",
  };

  return map[num] || num;
};

export default function UnitsViewGeneral() {

  const { gradeId, subjectId } = useParams();
  const navigate = useNavigate();

  const { role } = useUserRole();

  const canManageUnits =
    role === "super-admin" || role === "teacher";

  const [units, setUnits] = useState([]);

  /* ===== تحديد المرحلة ===== */

  const getStageFromGrade = (gradeId) => {

    if (!gradeId) return "secondary";

    if (gradeId.startsWith("primary")) return "primary-prep";

    if (gradeId.startsWith("prep")) return "primary-prep";

    if (gradeId.startsWith("sec")) return "secondary";

    if (gradeId.startsWith("bac")) return "bac";

    return "secondary";
  };

  const stageId = getStageFromGrade(gradeId);

  const stageMap = {
    "primary-prep": "primary",
    "secondary": "secondary",
    "bac": "secondary",
  };

  const stageIdForDB = stageMap[stageId];

  /* ===== LOAD UNITS ===== */

  const loadUnits = async () => {

    if (!stageIdForDB || !gradeId || !subjectId) return;

    const q = query(
      collection(db, "units"),
      where("systemId", "==", "general"),
      where("stageId", "==", stageIdForDB),
      where("gradeId", "==", gradeId),
      where("subjectId", "==", subjectId)
    );

    const snap = await getDocs(q);

    const data = snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));

    data.sort((a, b) => (a.order || 0) - (b.order || 0));

    setUnits(data);
  };

  useEffect(() => {
    loadUnits();
  }, [stageIdForDB, gradeId, subjectId]);

  return (
    <div className="units-container">

      {canManageUnits && (
        <button
          className="add-unit-btn"
          onClick={async () => {
            await addNextUnit(stageIdForDB, gradeId, subjectId);
            await loadUnits();
          }}
        >
          ➕ إضافة وحدة جديدة
        </button>
      )}

      {units.map((u, index) => {

        const order = u.order || index + 1;

        const displayTitle =
          u.title || `الوحدة ${getUnitArabicName(order)}`;

        return (
          <div
            key={u.id}
            onClick={() =>
              navigate(
                `/student/${stageId}/lessons/${gradeId}/${subjectId}/${u.unitId}`
              )
            }
          >
            <UnitCard
              unit={{ ...u, title: displayTitle }}
              canManage={canManageUnits}
            />
          </div>
        );
      })}

    </div>
  );
}