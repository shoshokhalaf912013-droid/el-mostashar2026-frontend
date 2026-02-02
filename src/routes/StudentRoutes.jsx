import "../pages/Student/styles/accessibility.css";
import { Routes, Route, Navigate } from "react-router-dom";
import StudentLayout from "../layouts/StudentLayout";

import { SecondaryProvider } from "../contexts/SecondaryContext";
import RequireGrade from "./RequireGrade";

/* ===== Common ===== */
import StudentDashboard from "../pages/Student/StudentDashboard";
import SelectStage from "../pages/Student/SelectStage";
import StudentProfile from "../pages/Student/StudentProfile";

/* ===== Primary + Prep ===== */
import SelectGrade from "../pages/Student/SelectGrade";
import PrimaryPrepSubjectsView from "../pages/Student/PrimaryPrep/PrimaryPrepSubjectsView";
import UnitsView from "../pages/Student/UnitsView";
import UnitsViewGeneral from "../pages/Student/UnitsViewGeneral";
import LessonsView from "../pages/Student/LessonsView";
import LessonFlow from "../pages/Student/LessonFlow";

/* ===== Secondary ===== */
import SelectSecondarySystem from "../pages/Student/SelectSecondarySystem";
import SecondaryGradesView from "../pages/Student/Secondary/SecondaryGradesView";
import SecondarySubjectsView from "../pages/Student/Secondary/SecondarySubjectsView";
import SecondaryAdvancedSubjectsView from "../pages/Student/Secondary/SecondaryAdvancedSubjectsView";

/* ===== Bac ===== */
import BacGradesView from "../pages/Student/Bac/BacGradesView";
import BacUnitsView from "../pages/Student/Bac/BacUnitsView";

/* ===== Bac Router ===== */
import BacSubjectsRouter from "./BacSubjectsRouter";

export default function StudentRoutes() {
  return (
    <SecondaryProvider>
      <Routes>
        <Route element={<StudentLayout />}>

          {/* ================= ROOT ================= */}
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<StudentDashboard />} />
          <Route path="profile" element={<StudentProfile />} />
          <Route path="select-stage" element={<SelectStage />} />

          {/* ================= PRIMARY + PREP ================= */}
          <Route
            path="primary-prep/select-grade/:stageId"
            element={<SelectGrade />}
          />

          <Route
            path="primary-prep/subjects/:gradeId"
            element={
              <RequireGrade>
                <PrimaryPrepSubjectsView />
              </RequireGrade>
            }
          />

          {/* القديم */}
          <Route
            path="primary-prep/units-old/:gradeId/:subjectId"
            element={
              <RequireGrade>
                <UnitsView />
              </RequireGrade>
            }
          />

          {/* الجديد */}
          <Route
            path="primary-prep/units/:gradeId/:subjectId"
            element={
              <RequireGrade>
                <UnitsViewGeneral />
              </RequireGrade>
            }
          />

          <Route
            path="primary-prep/lessons/:gradeId/:subjectId/:unitId"
            element={
              <RequireGrade>
                <LessonsView />
              </RequireGrade>
            }
          />

          <Route
            path="primary-prep/lesson/:gradeId/:subjectId/:unitId/:lessonId"
            element={
              <RequireGrade>
                <LessonFlow />
              </RequireGrade>
            }
          />

          {/* ================= SECONDARY ================= */}
          <Route path="secondary" element={<SelectSecondarySystem />} />
          <Route path="secondary/grades" element={<SecondaryGradesView />} />

          <Route
            path="secondary/subjects/sec1"
            element={<SecondarySubjectsView />}
          />

          <Route
            path="secondary/advanced-subjects/:gradeId"
            element={<SecondaryAdvancedSubjectsView />}
          />

          <Route
            path="secondary/units/:gradeId/:subjectId"
            element={<UnitsView />}
          />

          <Route
            path="secondary/lessons/:gradeId/:subjectId/:unitId"
            element={<LessonsView />}
          />

          <Route
            path="secondary/lesson/:gradeId/:subjectId/:unitId/:lessonId"
            element={<LessonFlow />}
          />

          {/* ================= BAC ================= */}
          <Route path="bac/grades" element={<BacGradesView />} />

          <Route
            path="bac/subjects/bac1"
            element={
              <Navigate to="/student/secondary/subjects/sec1" replace />
            }
          />

          <Route
            path="bac/subjects/:gradeId"
            element={
              <RequireGrade>
                <BacSubjectsRouter />
              </RequireGrade>
            }
          />

          <Route
            path="bac/units/:gradeId/:subjectId"
            element={
              <RequireGrade>
                <BacUnitsView />
              </RequireGrade>
            }
          />

          {/* 🔥 الإضافة الحاسمة – بدون كسر أي شيء */}
          <Route
            path="bac/lessons/:gradeId/:subjectId/:unitId"
            element={
              <RequireGrade>
                <LessonsView />
              </RequireGrade>
            }
          />

        </Route>
      </Routes>
    </SecondaryProvider>
  );
}
