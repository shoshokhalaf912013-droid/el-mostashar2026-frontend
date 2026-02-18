import { createContext, useContext, useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

const AuthContext = createContext();

export function AuthProvider({ children }) {

  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);

  // ✅ مهم جدا
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {

      console.log("🔥 AUTH CHANGED:", firebaseUser?.email);

      // =========================
      // 🚪 المستخدم خرج
      // =========================
      if (!firebaseUser) {
        setUser(null);
        setRole(null);
        setLoading(false);
        return;
      }

      try {

        // ✅ انتظر تثبيت auth session بالكامل
        await firebaseUser.getIdToken(true);

        // حفظ المستخدم
        setUser(firebaseUser);

        // =========================
        // 🔎 تحميل الدور من Firestore
        // =========================
        const ref = doc(db, "users", firebaseUser.uid);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          const data = snap.data();

          console.log("✅ FIRESTORE ROLE:", data.role);

          setRole(data.role || "student");
        } else {
          setRole("student");
        }

      } catch (err) {

        console.error("❌ ROLE LOAD ERROR:", err);
        setRole("student");

      } finally {
        // ✅ لا نسمح للتطبيق بالعمل قبل هذه اللحظة
        setLoading(false);
      }

    });

    return () => unsubscribe();

  }, []);

  return (
    <AuthContext.Provider value={{ user, role, loading }}>
      {/* ✅ لا نعرض التطبيق قبل انتهاء auth */}
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
