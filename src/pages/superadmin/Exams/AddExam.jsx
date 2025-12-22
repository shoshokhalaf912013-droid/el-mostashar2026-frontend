import React, { useState } from "react";
import { PlusCircle, XCircle } from "lucide-react";

export default function AddExam() {
  const [examData, setExamData] = useState({
    title: "",
    grade: "",
    questions: "",
    duration: "",
    date: "",
  });

  const handleChange = (e) => {
    setExamData({ ...examData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    console.log("Exam Data:", examData);
    alert("تم إضافة الامتحان بنجاح (محاكاة) ✔️");
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">إضافة امتحان جديد</h1>

      <div className="bg-white rounded-2xl shadow p-6">

        {/* عنوان الامتحان */}
        <div className="mb-5">
          <label className="block mb-2 font-semibold">عنوان الامتحان</label>
          <input
            name="title"
            type="text"
            placeholder="مثال: امتحان الرياضيات - الوحدة الأولى"
            value={examData.title}
            onChange={handleChange}
            className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* الصف الدراسي */}
        <div className="mb-5">
          <label className="block mb-2 font-semibold">الصف الدراسي</label>
          <select
            name="grade"
            value={examData.grade}
            onChange={handleChange}
            className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500"
          >
            <option value="">اختر الصف</option>
            <option>الصف الأول الثانوي</option>
            <option>الصف الثاني الثانوي</option>
            <option>الصف الثالث الثانوي</option>
          </select>
        </div>

        {/* عدد الأسئلة */}
        <div className="mb-5">
          <label className="block mb-2 font-semibold">عدد الأسئلة</label>
          <input
            name="questions"
            type="number"
            placeholder="عدد الأسئلة"
            value={examData.questions}
            onChange={handleChange}
            className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* مدة الامتحان بالـ دقائق */}
        <div className="mb-5">
          <label className="block mb-2 font-semibold">مدة الامتحان (بالدقائق)</label>
          <input
            name="duration"
            type="number"
            placeholder="مثال: 60"
            value={examData.duration}
            onChange={handleChange}
            className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* تاريخ الامتحان */}
        <div className="mb-5">
          <label className="block mb-2 font-semibold">تاريخ الامتحان</label>
          <input
            name="date"
            type="date"
            value={examData.date}
            onChange={handleChange}
            className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* أزرار التحكم */}
        <div className="flex items-center gap-4 mt-6">

          {/* إضافة امتحان */}
          <button
            onClick={handleSubmit}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl shadow transition"
          >
            <PlusCircle size={20} />
            إضافة الامتحان
          </button>

          {/* إلغاء */}
          <button
            className="flex items-center gap-2 bg-gray-300 hover:bg-gray-400 text-black px-6 py-3 rounded-xl transition"
          >
            <XCircle size={20} />
            إلغاء
          </button>

        </div>

      </div>
    </div>
  );
}
