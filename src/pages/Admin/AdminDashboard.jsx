import React from "react";
import { useNavigate } from "react-router-dom";
import PromoteButton from "../../components/admin/PromoteButton";
import UsersRolesViewer from "../../components/admin/UsersRolesViewer";

export default function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-2xl font-bold text-yellow-400 mb-6">
        لوحة تحكم الأدمن
      </h1>

      <button
        onClick={() => navigate("/lessons/manage")}
        className="bg-yellow-400 text-black px-4 py-2 rounded"
      >
        إدارة الدروس
      </button>
    </div>
  );
}
