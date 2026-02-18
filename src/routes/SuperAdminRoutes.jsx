import { Routes, Route } from "react-router-dom";

import SuperAdminLayout from "../pages/superadmin/SuperAdminLayout";
import SuperAdminHome from "../pages/superadmin/SuperAdminHome";

import AddTeacher from "../pages/superadmin/AddTeacher";
import EditTeacher from "../pages/superadmin/EditTeacher";
import ManageTeachers from "../pages/superadmin/ManageTeachers";

import UsersManagement from "../pages/superadmin/UsersManagement";
import StudentsManagement from "../pages/superadmin/StudentsManagement";

import AddExam from "../pages/superadmin/AddExam";
import ManageExams from "../pages/superadmin/ManageExams";

import SuperStatistics from "../pages/superadmin/SuperStatistics";

import UnitsViewSuperAdmin from "../pages/superadmin/UnitsViewSuperAdmin";
import AddLesson from "../pages/superadmin/AddLesson";

import SecureRoleControl from "../pages/superadmin/SecureRoleControl";
import CriticalPermissions from "../pages/superadmin/CriticalPermissions";
import SuperAdminNotFound from "../pages/superadmin/SuperAdminNotFound";

/* 🔐 صفحة الاختبار */
import TestPermissions from "../pages/superadmin/TestPermissions";

import RequireRole from "../components/shared/RequireRole";

export default function SuperAdminRoutes() {
  return (
    <Routes>
      <Route
        element={
          <RequireRole allowedRoles={["super-admin"]}>
            <SuperAdminLayout />
          </RequireRole>
        }
      >
        <Route index element={<SuperAdminHome />} />
        <Route path="dashboard" element={<SuperAdminHome />} />

        {/* Teachers */}
        <Route path="add-teacher" element={<AddTeacher />} />
        <Route path="edit-teacher/:id" element={<EditTeacher />} />
        <Route path="manage-teachers" element={<ManageTeachers />} />

        {/* Users */}
        <Route path="users" element={<UsersManagement />} />
        <Route path="students" element={<StudentsManagement />} />

        {/* Exams */}
        <Route path="add-exam" element={<AddExam />} />
        <Route path="manage-exams" element={<ManageExams />} />

        {/* Statistics */}
        <Route path="statistics" element={<SuperStatistics />} />

        {/* Units */}
        <Route
          path="units/:systemId/:gradeId/:subjectId"
          element={<UnitsViewSuperAdmin />}
        />

        {/* 🔥 ADD LESSON (SHARED) */}
        <Route
          path="add-lesson/:systemId/:gradeId/:subjectId/:unitId"
          element={
            <RequireRole allowedRoles={["super-admin", "admin", "teacher"]}>
              <AddLesson />
            </RequireRole>
          }
        />

        {/* 🔍 TEST PERMISSIONS (SUPER ADMIN ONLY) */}
        <Route
          path="__test-permissions"
          element={<TestPermissions />}
        />

        {/* Secure */}
        <Route path="__secure-control" element={<SecureRoleControl />} />
        <Route path="__critical" element={<CriticalPermissions />} />

        <Route path="*" element={<SuperAdminNotFound />} />
      </Route>
    </Routes>
  );
}
