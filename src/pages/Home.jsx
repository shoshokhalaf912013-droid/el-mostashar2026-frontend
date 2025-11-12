import React from "react";
import { motion } from "framer-motion";
import userImage from "../assets/user.jpg";

export default function Home() {
  return (
    <div className="text-center py-12">
      <motion.h1
        className="text-4xl md:text-5xl font-bold text-[var(--gold)] mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        مرحبًا بك في منصة المستشار التعليمية 🎓
      </motion.h1>

      <motion.p
        className="text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 1 }}
      >
        المنصة المتكاملة لدراسة التاريخ والجغرافيا 2026 —  
        دروس تفاعلية، اختبارات ذكية، ومواد مرئية وملفات PDF تحت إشراف  
        <strong> مستر خلف محروس </strong>.
      </motion.p>

      <motion.div
        className="mt-10 flex justify-center gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <a href="/courses" className="btn-gold">ابدأ التعلّم الآن</a>
        <a href="/login" className="btn-gold">تسجيل الدخول</a>
      </motion.div>

      <motion.img
        src={userImage}
        alt="التعليم الذهبي"
        className="mx-auto mt-12 rounded-2xl shadow-lg w-3/4 md:w-1/2"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
      />
    </div>
  );
}
