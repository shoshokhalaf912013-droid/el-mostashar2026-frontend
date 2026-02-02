import { Navigate, useParams } from "react-router-dom";

export default function RequireGrade({ children }) {
  const { gradeId } = useParams();

  if (!gradeId) {
    return <Navigate to="/student/select-stage" replace />;
  }

  return children;
}
