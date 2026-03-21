import { useLocation, useNavigate } from "react-router-dom";

export default function ExamResult() {

  const location = useLocation();
  const navigate = useNavigate();

  const score = location.state?.score || 0;
  const total = location.state?.total || 0;

  const percent =
    total > 0
      ? Math.round((score / total) * 100)
      : 0;

  return (

    <div className="exam-result">

      <h1>نتيجة الامتحان</h1>

      <h2>
        درجتك {score} من {total}
      </h2>

      <h3>
        {percent} %
      </h3>

      <button
        onClick={() => navigate("/student/dashboard")}
      >
        العودة للوحة الطالب
      </button>

    </div>

  );
}