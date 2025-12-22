import { Routes, Route, Navigate } from "react-router-dom";

/* 🔹 Layout */
import StudentLayout from "../layouts/StudentLayout";

/* 🔹 Pages */
import StudentDashboard from "../pages/Student/StudentDashboard.jsx";
import SelectStage from "../pages/Student/SelectStage.jsx";
import SelectGrade from "../pages/Student/SelectGrade.jsx";
import StudentProfile from "../pages/Student/StudentProfile.jsx";

/* 🔹 المواد */
import SubjectsView from "../pages/Student/SubjectsView.jsx";

/* 🔹 الوحدات */
import UnitsView from "../pages/Student/UnitsView.jsx";

/* 🔹 الدروس داخل الوحدة */
import LessonsView from "../pages/Student/LessonsView.jsx";

/* 🔹 الدرس */
import LessonFlow from "../pages/Student/LessonFlow.jsx";

/* 🔹 أخرى */
import Videos from "../pages/Student/Videos.jsx";
import ExamPage from "../pages/Student/ExamPage.jsx";
import ExamResult from "../pages/Student/ExamResult.jsx";
import Homework from "../pages/Student/Homework.jsx";
import HomeworkPage from "../pages/Student/HomeworkPage.jsx";
import TakeExam from "../pages/Student/TakeExam.jsx";
import ReportPage from "../pages/Student/ReportPage.jsx";
import PrivateCourseDetails from "../pages/Student/PrivateCourseDetails.jsx";

export default function StudentRoutes() {
  return (
    <Routes>
      <Route element={<StudentLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />

        {/* الأساس */}
        <Route path="dashboard" element={<StudentDashboard />} />
        <Route path="select-stage" element={<SelectStage />} />
        <Route path="select-grade" element={<SelectGrade />} />
        <Route path="profile" element={<StudentProfile />} />

        {/* صف → مواد */}
        <Route path="subjects/:gradeId" element={<SubjectsView />} />

        {/* مادة → وحدات */}
        <Route
          path="units/:gradeId/:subjectKey"
          element={<UnitsView />}
        />

        {/* وحدة → دروس */}
        <Route
          path="lessons/:gradeId/:subjectKey/:unitId"
          element={<LessonsView />}
        />

        {/* درس */}
        <Route
          path="lesson/:gradeId/:subjectKey/:unitId/:lessonId"
          element={<LessonFlow />}
        />

        {/* أخرى */}
        <Route
          path="private-courses/:courseId"
          element={<PrivateCourseDetails />}
        />
        <Route path="videos" element={<Videos />} />
        <Route path="exam" element={<ExamPage />} />
        <Route path="exam-result" element={<ExamResult />} />
        <Route path="homework" element={<Homework />} />
        <Route path="homework-page" element={<HomeworkPage />} />
        <Route path="take-exam" element={<TakeExam />} />
        <Route path="report" element={<ReportPage />} />
      </Route>
    </Routes>
  );
}
