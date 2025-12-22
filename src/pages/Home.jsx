// src/pages/Home.jsx

import React from "react";
import { motion } from "framer-motion";
import heroImage from "../assets/main-image.jpg";

export default function Home() {
  return (
    <div
      className="home-wrapper flex flex-col gap-16"
      dir="rtl"
    >
      {/* ================== القسم العلوي ================== */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-12">
        {/* النصوص */}
        <div className="w-full md:w-1/2 text-right">
          <motion.h1
            className="text-4xl md:text-6xl font-bold text-gold mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            مرحبًا بك في منصة المستشار التعليمية 🎓
          </motion.h1>

          <motion.p
            className="text-gray-300 text-lg md:text-xl mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            المنصة المتكاملة لدراسة التاريخ والجغرافيا — دروس تفاعلية،
            اختبارات ذكية، مواد مرئية وملفات PDF تحت إشراف مستر{" "}
            <strong className="text-gold">خلف محروس</strong>.
          </motion.p>

          {/* الأزرار */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <a
              href="/student/select-stage"
              className="btn-gold text-black px-6 py-3 text-lg font-bold rounded-xl text-center"
            >
              ابدأ المسار التعليمي
            </a>

            <a
              href="/login"
              className="border border-gold text-gold px-6 py-3 text-lg rounded-xl hover:bg-gold hover:text-black duration-200 text-center"
            >
              تسجيل الدخول
            </a>
          </motion.div>

          {/* المميزات */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.8 }}
          >
            <h2 className="text-2xl font-bold text-gold mt-6 mb-3">
              ⭐ مميزات المنصة
            </h2>
            <ul className="text-gray-300 text-lg space-y-2 list-disc list-inside">
              <li>📘 دروس تفاعلية</li>
              <li>📝 اختبارات ذكية تقيس فهمك بدقة</li>
              <li>🎥 فيديوهات شرح عالية الجودة</li>
              <li>📄 ملفات PDF شاملة لكل المنهج</li>
              <li>🏆 متابعة تقدمك في كل درس</li>
            </ul>
          </motion.div>
        </div>

        {/* الصورة */}
        <motion.div
          className="w-full md:w-1/2 flex justify-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          <img
            src={heroImage}
            alt="صورة المستشار"
            className="rounded-2xl shadow-xl border border-gold w-full max-w-md"
          />
        </motion.div>
      </div>

      {/* ================== عرض المواد (مؤجل بأمان) ================== */}
      <div className="max-w-4xl mx-auto w-full bg-black/40 rounded-2xl p-6 border border-gold">
        <h2 className="text-3xl font-bold text-gold mb-6 text-center">
          المواد الدراسية
        </h2>

        {/*
          SubjectsView غير مُعرّف حاليًا
          سيتم تفعيله لاحقًا بعد صفحة:
          اختيار المرحلة → الصف → المواد
        */}
        {/* <SubjectsView gradeKey="bac2" /> */}
      </div>
    </div>
  );
}
