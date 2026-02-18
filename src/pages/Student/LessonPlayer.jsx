import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL
} from "firebase/storage";
import {
  doc,
  updateDoc,
  getDoc
} from "firebase/firestore";

import {
  getAuth,
  onAuthStateChanged
} from "firebase/auth";

import { db, storage } from "../../firebase";
import "./lesson.css";

export default function LessonPlayer() {

  const { lessonId } = useParams();
  const navigate = useNavigate();

  const [videoUrl, setVideoUrl] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);

  const [videoProgress, setVideoProgress] = useState(0);
  const [pdfProgress, setPdfProgress] = useState(0);

  const [role, setRole] = useState(null);

  /* =========================
     CHECK USER ROLE
  ========================= */
  useEffect(() => {

    const auth = getAuth();

    const unsub = onAuthStateChanged(auth, async (user) => {

      if (!user) {
        setRole("student");
        return;
      }

      const userRef = doc(db, "users", user.uid);
      const snap = await getDoc(userRef);

      if (snap.exists()) {
        setRole(snap.data().role || "student");
      } else {
        setRole("student");
      }

    });

    return () => unsub();

  }, []);

  const isAdmin =
    role === "admin" || role === "super-admin";

  /* =========================
     LOAD LESSON
  ========================= */
  useEffect(() => {

    const loadLesson = async () => {
      const lessonRef = doc(db, "lessons", lessonId);
      const snap = await getDoc(lessonRef);

      if (snap.exists()) {
        const data = snap.data();
        setVideoUrl(data.videoUrl || null);
        setPdfUrl(data.pdfUrl || null);
      }
    };

    loadLesson();

  }, [lessonId]);

  /* =========================
     VIDEO UPLOAD (ADMIN ONLY)
  ========================= */
  const handleVideoUpload = (file) => {

    if (!isAdmin || !file) return;

    const storageRef = ref(
      storage,
      `lessons/${lessonId}/video_${Date.now()}`
    );

    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

        setVideoProgress(Math.round(progress));
      },
      console.error,
      async () => {
        const url = await getDownloadURL(uploadTask.snapshot.ref);

        await updateDoc(doc(db, "lessons", lessonId), {
          videoUrl: url
        });

        setVideoUrl(url);
      }
    );
  };

  /* =========================
     PDF UPLOAD (ADMIN ONLY)
  ========================= */
  const handlePdfUpload = (file) => {

    if (!isAdmin || !file) return;

    const storageRef = ref(
      storage,
      `lessons/${lessonId}/pdf_${Date.now()}`
    );

    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

        setPdfProgress(Math.round(progress));
      },
      console.error,
      async () => {
        const url = await getDownloadURL(uploadTask.snapshot.ref);

        await updateDoc(doc(db, "lessons", lessonId), {
          pdfUrl: url
        });

        setPdfUrl(url);
      }
    );
  };

  /* =========================
     UI
  ========================= */
  return (
    <div className="lesson-page">

      <button className="back-btn" onClick={() => navigate(-1)}>
        ← رجوع
      </button>

      <h2 className="lesson-title">الدرس الحالي</h2>

      {/* ================= VIDEO ================= */}
      <div className="lesson-card">

        <h3>🎬 فيديو الدرس</h3>

        {videoUrl ? (
          <video controls width="100%" src={videoUrl} />
        ) : (
          <p>لا يوجد فيديو بعد</p>
        )}

        {/* ===== ADMIN ===== */}
        {isAdmin ? (
          <>
            <label className="upload-btn">
              اختيار فيديو
              <input
                type="file"
                accept="video/*"
                hidden
                onChange={(e) =>
                  handleVideoUpload(e.target.files[0])
                }
              />
            </label>

            <div className="gold-progress">
              <div
                className="gold-progress-bar"
                style={{ width: `${videoProgress}%` }}
              />
            </div>

            <p>{videoProgress}%</p>
          </>
        ) : (
          videoUrl && (
            <button
              className="upload-btn"
              onClick={() => window.open(videoUrl)}
            >
              ▶ ابدأ الفيديو
            </button>
          )
        )}

      </div>

      {/* ================= PDF ================= */}
      <div className="lesson-card">

        <h3>📄 ملف PDF</h3>

        {pdfUrl ? (
          <a
            href={pdfUrl}
            target="_blank"
            rel="noreferrer"
            className="open-pdf"
          >
            فتح الملف
          </a>
        ) : (
          <p>لا يوجد PDF بعد</p>
        )}

        {/* ===== ADMIN ===== */}
        {isAdmin ? (
          <>
            <label className="upload-btn">
              اختيار PDF
              <input
                type="file"
                accept="application/pdf"
                hidden
                onChange={(e) =>
                  handlePdfUpload(e.target.files[0])
                }
              />
            </label>

            <div className="gold-progress">
              <div
                className="gold-progress-bar"
                style={{ width: `${pdfProgress}%` }}
              />
            </div>

            <p>{pdfProgress}%</p>
          </>
        ) : (
          pdfUrl && (
            <button
              className="upload-btn"
              onClick={() => window.open(pdfUrl)}
            >
              📄 تصفح PDF
            </button>
          )
        )}

      </div>

    </div>
  );
}
