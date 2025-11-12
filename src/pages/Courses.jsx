import React from "react";
import { motion } from "framer-motion";

const courses = [
  {
    id: 1,
    title: "تاريخ - الوحدة الأولى",
    desc: "بداية التاريخ الحديث وتطور مصر الحديثة في عهد محمد علي.",
    img: "https://cdn.pixabay.com/photo/2015/09/05/21/51/egypt-925358_1280.jpg",
  },
  {
    id: 2,
    title: "جغرافيا - الوحدة الأولى",
    desc: "موقع مصر وأهميته والعوامل المؤثرة في مناخها.",
    img: "https://cdn.pixabay.com/photo/2017/03/27/14/56/map-2174381_1280.jpg",
  },
  {
    id: 3,
    title: "تاريخ - الثورة العرابية",
    desc: "الأسباب والنتائج ودور أحمد عرابي في مواجهة الخديوي توفيق.",
    img: "https://cdn.pixabay.com/photo/2016/11/18/12/52/pyramids-1833196_1280.jpg",
  },
];

export default function Courses() {
  return (
    <div className="py-10 text-center">
      <h2 className="text-3xl font-bold mb-8 text-[var(--gold)]">
        المقررات الدراسية
      </h2>
      <div className="grid md:grid-cols-3 gap-6 px-4">
        {courses.map((c) => (
          <motion.div
            key={c.id}
            className="card p-4 text-center"
            whileHover={{ scale: 1.03 }}
          >
            <img
              src={c.img}
              alt={c.title}
              className="rounded-xl mb-4 w-full h-48 object-cover"
            />
            <h3 className="text-xl font-semibold mb-2">{c.title}</h3>
            <p className="text-gray-300 mb-3">{c.desc}</p>
            <a href="/exam" className="btn-gold">
              ابدأ المراجعة
            </a>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
