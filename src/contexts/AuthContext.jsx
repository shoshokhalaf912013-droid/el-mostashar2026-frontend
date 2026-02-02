import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { PLATFORM_OWNER_EMAIL } from "../config/owner";

const AuthContext = createContext(null);

// ===== تطبيع الدور (عرض فقط) =====
const normalizeRole = (role) => {
  if (!role) return null;

  const r = String(role).toLowerCase().trim();

  if (["superadmin", "super-admin", "super_admin"].includes(r))
    return "super-admin";
  if (r === "admin") return "admin";
  if (r === "teacher") return "teacher";
  if (r === "student") return "student";

  return null;
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);

      if (!currentUser) {
        setRole(null);
        setLoading(false);
        return;
      }

      const isOwner =
        currentUser.email &&
        currentUser.email.toLowerCase().trim() ===
          PLATFORM_OWNER_EMAIL.toLowerCase().trim();

      // 👑 السوبر أدمن لا يدخل Firestore رول ولا طالب
      if (isOwner) {
        setRole("super-admin");
        setLoading(false);
        return;
      }

      // ===== باقي المستخدمين =====
      const ref = doc(db, "users", currentUser.uid);

      const unsubUser = onSnapshot(ref, (snap) => {
        if (!snap.exists()) {
          setRole(null);
          setLoading(false);
          return;
        }

        const data = snap.data();
        setRole(normalizeRole(data.role));
        setLoading(false);
      });

      return () => unsubUser();
    });

    return () => unsubAuth();
  }, []);

  const isSuperAdmin =
    user?.email &&
    user.email.toLowerCase().trim() ===
      PLATFORM_OWNER_EMAIL.toLowerCase().trim();

  const value = {
    user,
    role, // عرض فقط
    loading,

    // ===== تحكم حقيقي =====
    isSuperAdmin,
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

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
