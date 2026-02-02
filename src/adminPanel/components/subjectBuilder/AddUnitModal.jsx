import { useState } from "react";
import PropTypes from "prop-types";
import {
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../../firebase";
import "./AddUnitModal.css";

export default function AddUnitModal({
  open,
  onClose,
  gradeId,
  subjectId,
  trackId = null,
}) {
  const [title, setTitle] = useState("");
  const [order, setOrder] = useState("");
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleSubmit = async () => {
    if (!title || !order) return;

    setLoading(true);

    try {
      const data = {
        title: title.trim(),
        order: Number(order),
        gradeId,
        subjectId,
        active: true,
        createdAt: serverTimestamp(),
      };

      // trackId اختياري (للبكالوريا فقط)
      if (trackId) data.trackId = trackId;

      await addDoc(collection(db, "units"), data);

      setTitle("");
      setOrder("");
      onClose();
    } catch (err) {
      console.error("Add unit error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-unit-overlay">
      <div className="add-unit-modal">
        <h3>إضافة وحدة جديدة</h3>

        <input
          type="text"
          placeholder="عنوان الوحدة"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          type="number"
          placeholder="ترتيب الوحدة"
          value={order}
          onChange={(e) => setOrder(e.target.value)}
        />

        <div className="add-unit-actions">
          <button
            className="btn-gold"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "جارٍ الحفظ..." : "إضافة"}
          </button>

          <button
            className="btn-cancel"
            onClick={onClose}
          >
            إلغاء
          </button>
        </div>
      </div>
    </div>
  );
}

AddUnitModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  gradeId: PropTypes.string.isRequired,
  subjectId: PropTypes.string.isRequired,
  trackId: PropTypes.string,
};
