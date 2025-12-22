import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { PLATFORM_OWNER_EMAIL } from "../config/owner";

const AuthContext = createContext(null);

// 🔒 تطبيع صارم للأدوار (للعرض فقط)
const normalizeRole = (role) => {
  if (!role) return null;

  const r = String(role).toLowerCase().trim();

  if (["superadmin", "super-admin", "super_admin"].includes(r))
    return "super-admin";
  if (["admin"].includes(r)) return "admin";
  if (["teacher"].includes(r)) return "teacher";
  if (["student"].includes(r)) return "student";

  return null;
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (!currentUser) {
        setRole(null);
        setLoading(false);
        return;
      }

      const ref = doc(db, "users", currentUser.uid);

      // 👑 مالك المنصة = سوبر أدمن (بالإيميل فقط)
      const isOwner =
        currentUser.email &&
        currentUser.email.toLowerCase().trim() ===
          PLATFORM_OWNER_EMAIL.toLowerCase().trim();

      if (isOwner) {
        await setDoc(
          ref,
          {
            role: "super-admin", // للعرض فقط
            email: currentUser.email,
          },
          { merge: true }
        );
      }

      const unsubRole = onSnapshot(ref, async (snap) => {
        if (!snap.exists()) {
          setRole(null);
          setLoading(false);
          return;
        }

        const data = snap.data();
        const normalizedRole = normalizeRole(data.role);
        setRole(normalizedRole);

        // 🧯 تهيئة آمنة للطالب فقط
        if (normalizedRole === "student" && data.stageId === undefined) {
          await setDoc(
            ref,
            {
              stageId: null,
              gradeId: null,
              subjectId: null,
              teacherId: null,
            },
            { merge: true }
          );
        }

        setLoading(false);
      });

      return () => unsubRole();
    });

    return () => unsubAuth();
  }, []);

  const isSuperAdmin =
    user?.email &&
    user.email.toLowerCase().trim() ===
      PLATFORM_OWNER_EMAIL.toLowerCase().trim();

  const value = {
    user,
    role, // للعرض فقط
    loading,
    isSuperAdmin, // 👑 التحكم الحقيقي
    isAdmin: role === "admin",
    isTeacher: role === "teacher",
    isStudent: role === "student",
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// 🧠 Hook موحد
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
