import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../firebase";
import { useAuth } from "../../contexts/AuthContext";

export default function UnitsView() {
  const { gradeId, subjectKey } = useParams();
  const navigate = useNavigate();
  const { isSuperAdmin, isStudent } = useAuth();

  const [units, setUnits] = useState([]);
  const [newUnitTitle, setNewUnitTitle] = useState("");
  const [loading, setLoading] = useState(true);

  /* ================= تحميل الوحدات ================= */
  useEffect(() => {
    if (!gradeId || !subjectKey) return;

    const loadUnits = async () => {
      try {
        setLoading(true);

        const snap = await getDocs(
          query(
            collection(db, "units"),
            where("gradeId", "==", gradeId),
            where("subjectKey", "==", subjectKey),
            orderBy("unitNumber")
          )
        );

        setUnits(
          snap.docs.map((d) => ({
            id: d.id,
            ...d.data(),
          }))
        );
      } catch (err) {
        console.error("❌ خطأ تحميل الوحدات:", err);
      } finally {
        setLoading(false);
      }
    };

    loadUnits();
  }, [gradeId, subjectKey]);

  /* ================= إضافة وحدة ================= */
  const addUnit = async () => {
    if (!newUnitTitle.trim()) return;

    try {
      await addDoc(collection(db, "units"), {
        title: newUnitTitle,
        gradeId,
        subjectKey,
        unitNumber: units.length + 1,
        createdAt: serverTimestamp(),
      });

      setNewUnitTitle("");
      window.location.reload();
    } catch (err) {
      console.error("❌ خطأ إضافة وحدة:", err);
    }
  };

  /* ================= حذف وحدة (سوبر أدمن فقط) ================= */
  const deleteUnit = async (unitId) => {
    if (!isSuperAdmin) return;

    const confirmDelete = window.confirm(
      "⚠️ هل أنت متأكد من حذف الوحدة؟ سيتم حذف كل الدروس التابعة لها."
    );

    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, "units", unitId));
      setUnits(units.filter((u) => u.id !== unitId));
    } catch (err) {
      console.error("❌ خطأ حذف الوحدة:", err);
    }
  };

  /* ================= حالات العرض ================= */
  if (loading) {
    return (
      <div className="text-yellow-400 text-center mt-20">
        جاري تحميل الوحدات...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white px-6 py-10" dir="rtl">
      <h1 className="text-2xl font-bold text-yellow-400 text-center mb-10">
        الوحدات
      </h1>

      {/* ================= إضافة وحدة ================= */}
      {!isStudent && (
        <div className="mb-10 bg-gray-900 p-6 rounded-xl border border-gray-700">
          <div className="flex gap-4">
            <input
              value={newUnitTitle}
              onChange={(e) => setNewUnitTitle(e.target.value)}
              placeholder="اسم الوحدة"
              className="flex-1 px-4 py-3 rounded bg-black border border-gray-600 text-white"
            />
            <button
              onClick={addUnit}
              className="bg-green-500 text-black px-6 py-3 rounded font-bold"
            >
              + إضافة وحدة
            </button>
          </div>
        </div>
      )}

      {/* ================= كروت الوحدات ================= */}
      {units.length === 0 ? (
        <div className="text-red-400 text-center">
          لا توجد وحدات مضافة
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {units.map((unit) => (
            <div
              key={unit.id}
              className="bg-gray-900 p-6 rounded-xl border border-yellow-700"
            >
              <div
                onClick={() =>
                  navigate(
                    `/student/lessons/${gradeId}/${subjectKey}/${unit.id}`
                  )
                }
                className="cursor-pointer"
              >
                <h2 className="text-lg font-extrabold text-yellow-300 mb-4">
                  {unit.title}
                </h2>
              </div>

              {/* ===== أزرار الإدارة ===== */}
              {isSuperAdmin && (
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => deleteUnit(unit.id)}
                    className="bg-red-600 px-4 py-2 rounded font-bold"
                  >
                    حذف
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="text-center mt-16">
        <button
          onClick={() => navigate(-1)}
          className="bg-yellow-500 text-black px-8 py-3 rounded font-bold"
        >
          رجوع
        </button>
      </div>
    </div>
  );
}
