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

// 🔐 الصفحة الصامتة (الزر المخفي)
import SecureRoleControl from "../pages/superadmin/SecureRoleControl";

// ✅ الحارس
import RequireRole from "../components/shared/RequireRole";

export default function SuperAdminRoutes() {
  return (
    <Routes>
      {/* 👑 كل مسارات السوبر أدمن محمية هنا */}
      <Route
        element={
          <RequireRole allowedRoles={["super-admin"]}>
            <SuperAdminLayout />
          </RequireRole>
        }
      >
        {/* 🏠 Dashboard */}
        <Route index element={<SuperAdminHome />} />
        <Route path="dashboard" element={<SuperAdminHome />} />

        {/* 👨‍🏫 المدرسين */}
        <Route path="add-teacher" element={<AddTeacher />} />
        <Route path="edit-teacher/:id" element={<EditTeacher />} />
        <Route path="manage-teachers" element={<ManageTeachers />} />

        {/* 👥 المستخدمين والطلاب */}
        <Route path="users" element={<UsersManagement />} />
        <Route path="students" element={<StudentsManagement />} />

        {/* 📝 الامتحانات */}
        <Route path="add-exam" element={<AddExam />} />
        <Route path="manage-exams" element={<ManageExams />} />

        {/* 📊 إحصائيات */}
        <Route path="statistics" element={<SuperStatistics />} />

        {/* 🔐 Route صامت – لا يظهر في أي Sidebar */}
        <Route path="__secure-control" element={<SecureRoleControl />} />
      </Route>
    </Routes>
  );
}
