import PropTypes from "prop-types";
import { useNavigate, useParams } from "react-router-dom";
import "./LessonCard.css";

export default function LessonCard({ lesson, index, onDelete }) {
  const navigate = useNavigate();
  const { gradeId, subjectId, unitId } = useParams();

  const goToLesson = () => {
    navigate(
      `/student/secondary/lesson/${gradeId}/${subjectId}/${unitId}/${lesson.id}`
    );
  };

  const handleDelete = (e) => {
    e.stopPropagation(); // مهم جدًا
    if (onDelete) {
      const confirmDelete = window.confirm(
        "هل أنت متأكد من حذف هذا الدرس؟"
      );
      if (confirmDelete) {
        onDelete(lesson.id);
      }
    }
  };

  return (
    <div className="lesson-card" onClick={goToLesson}>
      {/* رقم الدرس */}
      <div className="lesson-index">
        {index + 1}
      </div>

      {/* صندوق العنوان */}
      <div
        className="lesson-title-box"
        style={{ animationDelay: `${index * 6}s` }}
      >
        <span className="lesson-title">
          {lesson.title}
        </span>

        <button
          className="start-lesson-btn"
          onClick={(e) => {
            e.stopPropagation();
            goToLesson();
          }}
        >
          ▶ ابدأ
        </button>

        {/* زر الحذف — يظهر فقط للسوبر أدمن */}
        {onDelete && (
          <button
            className="delete-lesson-btn"
            onClick={handleDelete}
            title="حذف الدرس"
          >
            🗑️
          </button>
        )}

        <span className="lesson-shooting" />
      </div>
    </div>
  );
}

LessonCard.propTypes = {
  lesson: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  onDelete: PropTypes.func, // اختياري
};
