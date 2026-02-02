import { useState } from "react";
import "./AddLessonModal.css";

export default function AddLessonModal({ onClose, onSave }) {
  const [title, setTitle] = useState("");
  const [order, setOrder] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [description, setDescription] = useState("");
  const [pdfFile, setPdfFile] = useState(null);

  const handleSave = () => {
    const lessonData = {
      title,
      order: Number(order),
      videoUrl,
      description,
      pdfFile,
    };

    onSave?.(lessonData);
  };

  return (
    <div className="add-lesson-modal">
      <div className="add-lesson-card">

        <h2 className="add-lesson-title">إضافة درس جديد</h2>

        <input
          type="text"
          className="add-lesson-field"
          placeholder="عنوان الدرس"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          type="number"
          className="add-lesson-field"
          placeholder="ترتيب الدرس"
          value={order}
          onChange={(e) => setOrder(e.target.value)}
        />

        <input
          type="text"
          className="add-lesson-field"
          placeholder="رابط الفيديو (اختياري)"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
        />

        <div className="add-lesson-helper">
          يُفضّل استخدام رابط YouTube بصيغة
          <br />
          <span className="add-lesson-embed">
            https://www.youtube.com/embed/VIDEO_ID
          </span>
        </div>

        <textarea
          className="add-lesson-field add-lesson-textarea"
          placeholder="مقدمة أو شرح نصي (اختياري)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <label className="add-lesson-pdf">
          📄 إضافة ملف PDF (اختياري)
          <input
            type="file"
            accept="application/pdf"
            hidden
            onChange={(e) => setPdfFile(e.target.files[0])}
          />
        </label>

        <div className="add-lesson-actions">
          <button className="add-lesson-save" onClick={handleSave}>
            حفظ
          </button>
          <button className="add-lesson-cancel" onClick={onClose}>
            إلغاء
          </button>
        </div>

      </div>
    </div>
  );
}
