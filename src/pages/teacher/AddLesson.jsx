import React, { useState } from "react";
import axios from "axios";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const inputStyle = {
  width: "100%",
  padding: "10px",
  marginBottom: "15px",
  backgroundColor: "#ffffff",
  color: "#000000",
  border: "1px solid #ccc",
  borderRadius: "6px",
};

const labelStyle = {
  display: "block",
  marginBottom: "6px",
  color: "#ffffff",
  fontSize: "14px",
};

export default function AddLesson() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("عنوان الدرس مطلوب");
      return;
    }

    if (!videoUrl.trim()) {
      setError("رابط الفيديو مطلوب");
      return;
    }

    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      setError("يجب تسجيل الدخول كمعلم");
      return;
    }

    setLoading(true);

    try {
      await axios.post("http://localhost:5000/api/lessons", {
        title,
        description: desc,
        teacherId: user.uid,
        videoUrl,
      });

      setSuccess(true);

      setTimeout(() => {
        navigate("/teacher/lessons");
      }, 1500);
    } catch (err) {
      setError("فشل حفظ الدرس");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "30px", maxWidth: "600px", color: "#fff" }}>
      <h2 style={{ marginBottom: "20px" }}>إضافة درس جديد</h2>

      {success && (
        <div
          style={{
            background: "#065f46",
            padding: "10px",
            marginBottom: "20px",
            borderRadius: "6px",
          }}
        >
          ✅ تم حفظ الدرس بنجاح
        </div>
      )}

      {error && (
        <div
          style={{
            background: "#7f1d1d",
            padding: "10px",
            marginBottom: "20px",
            borderRadius: "6px",
          }}
        >
          ❌ {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <label style={labelStyle}>عنوان الدرس *</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={inputStyle}
        />

        <label style={labelStyle}>وصف الدرس</label>
        <textarea
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          rows={4}
          style={inputStyle}
        />

        <label style={labelStyle}>رابط الفيديو *</label>
        <input
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          placeholder="https://www.youtube.com/..."
          style={inputStyle}
        />

        <button
          type="submit"
          disabled={loading}
          style={{
            background: "#FFD700",
            color: "#000",
            padding: "10px 22px",
            border: "none",
            borderRadius: "6px",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          {loading ? "جاري الحفظ..." : "حفظ الدرس"}
        </button>
      </form>
    </div>
  );
}
