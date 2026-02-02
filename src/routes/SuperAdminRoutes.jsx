import { Routes, Route } from "react-router-dom";

import SuperAdminLayout from "../pages/superadmin/SuperAdminLayout";
import SuperAdminHome from "../pages/superadmin/SuperAdminHome";

import AddExam from "../pages/superadmin/AddExam";
import AddTeacher from "../pages/superadmin/AddTeacher";
import EditTeacher from "../pages/superadmin/EditTeacher";
import ManageExams from "../pages/superadmin/ManageExams";
import ManageTeachers from "../pages/superadmin/ManageTeachers";
import SuperStatistics from "../pages/superadmin/SuperStatistics";
import UsersManagement from "../pages/superadmin/UsersManagement";
import StudentsManagement from "../pages/superadmin/StudentsManagement";

import SecureRoleControl from "../pages/superadmin/SecureRoleControl";
import CriticalPermissions from "../pages/superadmin/CriticalPermissions";
import SuperAdminNotFound from "../pages/superadmin/SuperAdminNotFound";

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
        {/* Dashboard */}
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

        {/* 🔐 Secure controls */}
        <Route path="__secure-control" element={<SecureRoleControl />} />

        {/* ☠️ Critical permissions */}
        <Route path="__critical" element={<CriticalPermissions />} />

        {/* ⛔ Super Admin 404 — داخلي وأنيق */}
        <Route path="*" element={<SuperAdminNotFound />} />
      </Route>
    </Routes>
  );
}
