import { Outlet, useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";

const OWNER_EMAIL = "khalafmahrous2000@gmail.com";

function NavCard({ title, subtitle, icon, onClick, danger }) {
  return (
    <button
      onClick={onClick}
      className={`
        group w-full text-right p-4 rounded-2xl border transition-all duration-300
        ${
          danger
            ? "border-red-500/40 hover:border-red-500 hover:shadow-[0_0_20px_rgba(239,68,68,0.6)]"
            : "border-yellow-400/40 hover:border-yellow-400 hover:shadow-[0_0_20px_rgba(250,204,21,0.6)]"
        }
        hover:-translate-y-1
        bg-black
      `}
    >
      <div className="flex items-center justify-between">
        <div className="text-2xl">{icon}</div>
        <div className="text-left">
          <div
            className={`text-sm ${
              danger ? "text-red-400" : "text-yellow-400"
            } font-semibold`}
          >
            {title}
          </div>
          <div className="text-xs opacity-70 mt-1">{subtitle}</div>
        </div>
      </div>
    </button>
  );
}

export default function SuperAdminLayout() {
  const navigate = useNavigate();
  const auth = getAuth();
  const user = auth.currentUser;

  const isOwner =
    user &&
    user.email &&
    user.email.toLowerCase() === OWNER_EMAIL.toLowerCase();

  return (
    <div className="flex min-h-screen bg-black text-white" dir="rtl">
      {/* Sidebar */}
      <aside className="w-72 bg-[#0b0b0b] border-l border-gray-800 p-4 space-y-4">
        {/* Header */}
        <div className="mb-4">
          <h2 className="text-xl font-bold text-yellow-400 flex items-center gap-2">
            👑 Super Admin
          </h2>
        </div>

        {/* Navigation Cards */}
        <NavCard
          icon="🏠"
          title="الرئيسية"
          subtitle="لوحة التحكم العامة"
          onClick={() => navigate(".")}
        />

        <NavCard
          icon="👥"
          title="إدارة المستخدمين"
          subtitle="التحكم الكامل بالمستخدمين"
          onClick={() => navigate("users")}
        />

        <NavCard
          icon="🎓"
          title="إدارة المدرسين"
          subtitle="إضافة وتعديل المدرسين"
          onClick={() => navigate("manage-teachers")}
        />

        <NavCard
          icon="📝"
          title="الامتحانات"
          subtitle="إنشاء وإدارة الاختبارات"
          onClick={() => navigate("manage-exams")}
        />

        <NavCard
          icon="📊"
          title="الإحصائيات"
          subtitle="مؤشرات وتحليلات المنصة"
          onClick={() => navigate("statistics")}
        />

        {/* غرفة العمليات */}
        {isOwner && (
          <>
            <div className="border-t border-gray-800 my-2"></div>

            <NavCard
              icon="☠️"
              title="غرفة العمليات"
              subtitle="صلاحيات خطِرة للغاية"
              danger
              onClick={() => navigate("__critical")}
            />
          </>
        )}
      </aside>

      {/* Content */}
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}
