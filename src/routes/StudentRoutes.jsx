import BacSubjectsRouter from "./BacSubjectsRouter";
import { Routes, Route, Navigate } from "react-router-dom";

import StudentLayout from "../layouts/StudentLayout";
import LiveLayout from "../layouts/LiveLayout";

import { SecondaryProvider } from "../contexts/SecondaryContext";
import RequireGrade from "./RequireGrade";

/* ===== Common ===== */

import StudentDashboard from "../pages/Student/StudentDashboard";
import SelectStage from "../pages/Student/SelectStage";
import StudentProfile from "../pages/Student/StudentProfile";

/* ===== Exams ===== */

import ExamPage from "../pages/student/ExamPage";
import ExamResult from "../pages/student/ExamResult";

/* ===== Primary + Prep ===== */

import SelectGrade from "../pages/Student/SelectGrade";
import PrimaryPrepSubjectsView from "../pages/Student/PrimaryPrep/PrimaryPrepSubjectsView";
import UnitsView from "../pages/Student/UnitsView";
import UnitsViewGeneral from "../pages/Student/UnitsViewGeneral";
import LessonsView from "../pages/Student/LessonsView";

/* ===== Lesson Player ===== */

import LessonPlayer from "../pages/Student/LessonPlayer";

/* ===== Secondary ===== */

import SelectSecondarySystem from "../pages/Student/SelectSecondarySystem";
import SecondaryGradesView from "../pages/Student/Secondary/SecondaryGradesView";
import SecondarySubjectsView from "../pages/Student/Secondary/SecondarySubjectsView";
import SecondaryAdvancedSubjectsView from "../pages/Student/Secondary/SecondaryAdvancedSubjectsView";

/* ===== Bac ===== */

import BacGradesView from "../pages/Student/Bac/BacGradesView";
import BacUnitsView from "../pages/Student/Bac/BacUnitsView";

/* ===== LIVE CLASS ===== */

import StudentLiveRoomWrapper from "../features/liveClass/StudentLiveRoomWrapper";

/* ===== LIVE TEST ===== */

import TestLiveRoom from "../live/pages/TestLiveRoom";

export default function StudentRoutes() {
  return (
    <SecondaryProvider>

      <Routes>

        {/* ================= NORMAL STUDENT PAGES ================= */}

        <Route element={<StudentLayout />}>

          <Route index element={<Navigate to="dashboard" replace />} />

          <Route path="dashboard" element={<StudentDashboard />} />
          <Route path="profile" element={<StudentProfile />} />
          <Route path="select-stage" element={<SelectStage />} />

          {/* ================= EXAMS ================= */}

          <Route
            path="exam/:examId"
            element={
              <RequireGrade>
                <ExamPage />
              </RequireGrade>
            }
          />

          {/* ⭐ نتيجة الامتحان */}

          <Route
            path="exam-result"
            element={
              <RequireGrade>
                <ExamResult />
              </RequireGrade>
            }
          />

          {/* امتحان مرتبط بدرس */}

          <Route
            path="primary-prep/exam/:gradeId/:subjectId/:unitId/:lessonId"
            element={
              <RequireGrade>
                <ExamPage />
              </RequireGrade>
            }
          />

          <Route
            path="secondary/exam/:gradeId/:subjectId/:unitId/:lessonId"
            element={
              <RequireGrade>
                <ExamPage />
              </RequireGrade>
            }
          />

          <Route
            path="bac/exam/:gradeId/:subjectId/:unitId/:lessonId"
            element={
              <RequireGrade>
                <ExamPage />
              </RequireGrade>
            }
          />

          {/* PRIMARY + PREP */}

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
                <LessonPlayer />
              </RequireGrade>
            }
          />

          {/* SECONDARY */}

          <Route path="secondary" element={<SelectSecondarySystem />} />

          <Route
            path="secondary/grades"
            element={<SecondaryGradesView />}
          />

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
            element={<LessonPlayer />}
          />

          {/* BAC */}

          <Route path="bac/grades" element={<BacGradesView />} />

          <Route
            path="bac/subjects/bac1"
            element={<Navigate to="/student/secondary/subjects/sec1" replace />}
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

          <Route
            path="bac/lessons/:gradeId/:subjectId/:unitId"
            element={<LessonsView />}
          />

          <Route
            path="bac/lesson/:gradeId/:subjectId/:unitId/:lessonId"
            element={<LessonPlayer />}
          />

        </Route>

        {/* ================= LIVE CLASSROOM ================= */}

        <Route element={<LiveLayout />}>

          <Route
            path="live/:gradeId/:subjectId/:unitId/:lessonId"
            element={<StudentLiveRoomWrapper />}
          />

          <Route
            path="student/live/:gradeId/:subjectId/:unitId/:lessonId"
            element={<StudentLiveRoomWrapper />}
          />

          <Route
            path="primary-prep/live/:gradeId/:subjectId/:unitId/:lessonId"
            element={<StudentLiveRoomWrapper />}
          />

          <Route
            path="student-live/:lessonId"
            element={<StudentLiveRoomWrapper />}
          />

          <Route
            path="live-test"
            element={<TestLiveRoom />}
          />

        </Route>

      </Routes>

    </SecondaryProvider>
  );
}