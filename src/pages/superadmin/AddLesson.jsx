import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "../../firebase";

export default function AddLesson() {
  console.log("✅ ADD LESSON (SHARED) FILE LOADED");

  const navigate = useNavigate();
  const { systemId, gradeId, subjectId, unitId } = useParams();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    e.stopPropagation();

    if (loading) return;

    const user = auth.currentUser;
    if (!user) {
      setError("غير مسجل دخول");
      return;
    }

    if (!title.trim()) {
      setError("عنوان الدرس مطلوب");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await addDoc(collection(db, "lessons"), {
        title: title.trim(),
        description: description.trim(),
        videoUrl: videoUrl.trim() || null,

        systemId: systemId || null,
        gradeId,
        subjectId,
        unitId,

        createdBy: user.uid,
        active: true,
        createdAt: serverTimestamp(),
      });

      navigate(-1);
    } catch (err) {
      console.error("❌ SAVE LESSON ERROR:", err);
      setError("فشل حفظ الدرس");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "60px 20px",
        background: "radial-gradient(circle at top, #111, #000)",
        color: "#FFD700",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: "30px" }}>
        إضافة درس جديد
      </h2>

      <form
        onSubmit={handleSubmit}
        style={{
          maxWidth: "600px",
          margin: "0 auto",
          background: "#000",
          padding: "30px",
          borderRadius: "18px",
          border: "2px solid rgba(212,175,55,.6)",
        }}
      >
        {error && (
          <div
            style={{
              background: "#7f1d1d",
              padding: "12px",
              borderRadius: "10px",
              marginBottom: "20px",
              color: "#fff",
              textAlign: "center",
            }}
          >
            {error}
          </div>
        )}

        <label>عنوان الدرس</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={inputStyle}
        />

        <label>وصف الدرس</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          style={inputStyle}
        />

        <label>رابط الفيديو</label>
        <input
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          style={inputStyle}
        />

        <button
          type="submit"
          disabled={loading}
          style={buttonStyle}
        >
          {loading ? "جاري الحفظ..." : "حفظ الدرس"}
        </button>
      </form>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "12px",
  margin: "10px 0 22px",
  background: "#000",
  color: "#FFD700",
  border: "1px solid rgba(212,175,55,0.6)",
  borderRadius: "10px",
};

const buttonStyle = {
  width: "100%",
  padding: "14px",
  marginTop: "20px",
  background: "linear-gradient(180deg,#ffe9a3,#d4af37)",
  color: "#000",
  border: "none",
  borderRadius: "14px",
  fontSize: "18px",
  fontWeight: "900",
  cursor: "pointer",
};
