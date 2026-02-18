import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { useAuth } from "../../contexts/AuthContext";
import "./UnitCard.css";

export default function UnitCard({ unit }) {

  const navigate = useNavigate();
  const { role } = useAuth();

  const [showActions, setShowActions] = useState(false);
  const [editing, setEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(unit.title);

  /* ===================================================
     ✅ الصلاحيات الحقيقية
     لا تظهر قبل تحميل الدور
  =================================================== */

  const canManage =
    role &&
    (role === "super-admin" || role === "admin");

  /* ================= OPEN UNIT ================= */

  const openUnit = () => {
    navigate(
      `/student/secondary/lessons/${unit.gradeId}/${unit.subjectId}/${unit.unitId}`
    );
  };

  /* ================= EDIT TITLE ================= */

  const saveTitle = async () => {
    try {
      await updateDoc(doc(db, "units", unit.id), {
        title: newTitle,
      });

      setEditing(false);
      setShowActions(false);

    } catch (err) {
      console.error("Edit error:", err);
    }
  };

  /* ================= DISABLE ================= */

  const disableUnit = async () => {
    try {
      await updateDoc(doc(db, "units", unit.id), {
        active: false,
      });
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= DELETE ================= */

  const deleteUnit = async () => {
    const ok = window.confirm("هل تريد حذف الوحدة نهائياً؟");
    if (!ok) return;

    try {
      await deleteDoc(doc(db, "units", unit.id));
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= DEBUG (احذفه لاحقاً) ================= */

  console.log("ROLE =", role);
  console.log("CAN MANAGE =", canManage);

  /* ================= UI ================= */

  return (
    <div className="unit-card">

      {/* ===== HEADER ===== */}
      <div className="unit-header">

        {!editing ? (
          <h3 className="unit-title" onClick={openUnit}>
            {unit.title}
          </h3>
        ) : (
          <input
            className="unit-edit-input"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
        )}

        {/* ⚙ يظهر فقط للإدارة */}
        {canManage && (
          <div
            className="gear-btn"
            onClick={() => setShowActions(!showActions)}
          >
            ⚙
          </div>
        )}

      </div>

      {/* ===== ACTION BUTTONS ===== */}
      {canManage && showActions && (
        <div className="unit-actions">

          {!editing ? (
            <button
              className="gold-btn"
              onClick={() => setEditing(true)}
            >
              ✏️ تعديل
            </button>
          ) : (
            <button
              className="gold-btn"
              onClick={saveTitle}
            >
              💾 حفظ
            </button>
          )}

          <button
            className="gold-btn"
            onClick={disableUnit}
          >
            ⛔ تعطيل
          </button>

          <button
            className="gold-btn danger"
            onClick={deleteUnit}
          >
            🗑 حذف
          </button>

        </div>
      )}

    </div>
  );
}
