import {
  doc,
  getDoc,
  addDoc,
  collection
} from "firebase/firestore";

import { db } from "../firebase";

/* =========================
   تحميل الامتحان
========================= */

export async function loadExam(pathArray) {

  const ref = doc(db, ...pathArray);

  const snap = await getDoc(ref);

  if (!snap.exists()) {
    return null;
  }

  return snap.data();
}

/* =========================
   حفظ نتيجة الطالب
========================= */

export async function saveResult(data) {

  await addDoc(
    collection(db, "examResults"),
    data
  );

}