import React, { createContext, useContext, useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [permissions, setPermissions] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {

      if (!firebaseUser) {
        setUser(null);
        setRole(null);
        setPermissions(null);
        setLoading(false);
        return;
      }

      try {
        setUser(firebaseUser);

        const userRef = doc(db, "users", firebaseUser.uid);
        const snap = await getDoc(userRef);

        if (!snap.exists()) {
          console.warn("User document not found");
          setLoading(false);
          return;
        }

        const userData = snap.data();
        const firestoreRole = userData.role || null;

        if (!firestoreRole) {
          console.warn("Role not found in Firestore");
          setLoading(false);
          return;
        }

        const perms = {
          role: firestoreRole,
          isSuperAdmin: firestoreRole === "super-admin",
          isAdmin: firestoreRole === "admin",
          isTeacher: firestoreRole === "teacher",
          isStudent: firestoreRole === "student",
        };

        setRole(firestoreRole);
        setPermissions(perms);

      } catch (error) {
        console.error("Auth error:", error);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        permissions,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  return useContext(AuthContext);
};