import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";

export default function LessonVideo() {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const [lesson, setLesson] = React.useState(null);

  React.useEffect(() => {
    const loadLesson = async () => {
      const snap = await getDoc(doc(db, "lessons", lessonId));
      if (snap.exists()) setLesson(snap.data());
    };
    loadLesson();
  }, [lessonId]);

  if (!lesson) return <p className="text-white">جارِ التحميل...</p>;

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-3xl font-bold text-yellow-400">{lesson.title}</h1>

      <div className="my-6">
        <video
          src={lesson.videoUrl}
          controls
          className="w-full rounded-lg border border-yellow-600"
        ></video>
      </div>

      <p className="text-gray-300 mb-6">{lesson.description}</p>

      <button
        onClick={() => navigate(`/student/lesson/${lessonId}/homework`)}
        className="bg-yellow-500 hover:bg-yellow-600 text-black px-6 py-3 rounded-lg font-bold"
      >
        ابدأ الواجب
      </button>
    </div>
  );
}
