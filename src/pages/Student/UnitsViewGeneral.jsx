import "./UnitsViewGeneral.css";
import { addNextUnit } from "@/utils/addNextUnit";
import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/firebase";
import UnitCard from "./UnitCard";
import useUserRole from "@/hooks/useUserRole";

/* ================= Arabic Names ================= */

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

  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  /* ✅ جلب الدور */
  const { role } = useUserRole();

  /* ✅ صلاحيات الإدارة */
  const canManageUnits =
    role === "super-admin" || role === "teacher";

  const [units, setUnits] = useState([]);

  /* ===== PARAMS SAFE ===== */

  const stageIdFromUrl =
    params.stageId || location.pathname.split("/")[2];

  const gradeId = params.gradeId;
  const subjectId = params.subjectId;

  const stageMap = {
    "primary-prep": "primary",
    "prep": "prep",
    "secondary": "secondary",
  };

  const stageId = stageMap[stageIdFromUrl];

  /* ===== LOAD UNITS ===== */

  const loadUnits = async () => {

    if (!stageId || !gradeId || !subjectId) return;

    const q = query(
      collection(db, "units"),
      where("systemId", "==", "general"),
      where("stageId", "==", stageId),
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
  }, [stageId, gradeId, subjectId]);

  /* ================= UI ================= */

  return (
    <div className="units-container">

      {/* ✅ زر الإضافة يظهر فقط للإدارة */}
      {canManageUnits && (
        <button
          className="add-unit-btn"
          onClick={async () => {
            await addNextUnit(stageId, gradeId, subjectId);
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
          <UnitCard
            key={u.id}
            unit={{ ...u, title: displayTitle }}

            /* ✅ الإصلاح الحقيقي هنا */
            canManage={canManageUnits}

            onClick={() =>
              navigate(
                `/student/${stageIdFromUrl}/lessons/${gradeId}/${subjectId}/${u.unitId}`
              )
            }
          />
        );
      })}

    </div>
  );
}
