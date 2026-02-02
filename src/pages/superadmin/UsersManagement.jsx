import React, { useEffect, useState } from "react";
import { PLATFORM_OWNER_EMAIL } from "../../config/owner";
import { db } from "../../firebase";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  query,
  where,
} from "firebase/firestore";
import toast, { Toaster } from "react-hot-toast";

export default function UsersManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    try {
      const q = query(
        collection(db, "users"),
        where("role", "in", ["student", "teacher", "admin", "super-admin"])
      );

      const snap = await getDocs(q);

      const usersData = snap.docs
        .map((d) => ({
          id: d.id,
          ...d.data(),
        }))
        // 🔥 إخفاء السوبر أدمن نهائيًا
        .filter(
          (u) =>
            u.email?.toLowerCase().trim() !==
            PLATFORM_OWNER_EMAIL.toLowerCase().trim()
        );

      setUsers(usersData);
    } catch (e) {
      toast.error("❌ خطأ أثناء تحميل المستخدمين");
    } finally {
      setLoading(false);
    }
  }

  async function changeRole(userId, newRole) {
    try {
      await updateDoc(doc(db, "users", userId), { role: newRole });
      toast.success("✔ تم تحديث الصلاحية");

      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId ? { ...u, role: newRole } : u
        )
      );
    } catch (e) {
      toast.error("❌ خطأ أثناء التحديث");
    }
  }

  return (
    <div className="p-6 text-white bg-gray-900 min-h-[70vh] rounded-lg border border-yellow-600">
      <Toaster />

      <div className="mb-6 p-4 rounded bg-green-600 text-black font-bold text-center">
        ✅ إدارة المستخدمين تعمل بنجاح
      </div>

      <h1 className="text-2xl font-bold text-yellow-400 mb-5">
        👥 إدارة المستخدمين
      </h1>

      {loading ? (
        <p className="text-gray-400 text-center">
          جاري تحميل المستخدمين...
        </p>
      ) : users.length === 0 ? (
        <p className="text-red-400 text-center">
          لا يوجد مستخدمون
        </p>
      ) : (
        <div className="space-y-3">
          {users.map((u) => (
            <div
              key={u.id}
              className="border border-yellow-600 p-4 rounded-lg flex justify-between items-center bg-black"
            >
              <div>
                <p className="font-semibold">
                  {u.email || "بدون إيميل"}
                </p>
                <p className="text-sm text-gray-400">
                  الدور:{" "}
                  <span className="text-yellow-300">
                    {u.role}
                  </span>
                </p>
              </div>

              <select
                value={u.role}
                className="bg-black border border-yellow-500 p-2 rounded-lg"
                onChange={(e) =>
                  changeRole(u.id, e.target.value)
                }
              >
                <option value="student">🎓 طالب</option>
                <option value="teacher">📘 مدرس</option>
                <option value="admin">🛡 أدمن</option>
              </select>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
