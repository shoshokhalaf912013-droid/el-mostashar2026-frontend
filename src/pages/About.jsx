import React from "react";
import yourPhoto from "../assets/mr-khalaf.jpg"; // ضع صورتك هنا (مثلاً باسم mr-khalaf.jpg في مجلد assets)
import logo from "../assets/logo.png"; // شعار المنصة إن وجد

export default function About() {
  return (
    <div className="card p-6">
      <div className="flex flex-col md:flex-row items-center gap-6">
        <img
          src={yourPhoto}
          alt="المستشار خلف محروس"
          className="w-40 h-40 rounded-full border-4 border-[var(--gold)] shadow-lg"
        />
        <div>
          <h2 className="text-3xl font-bold text-[var(--gold)] mb-2">
            المستشار خلف محروس
          </h2>
          <p className="text-[rgba(255,255,255,0.8)] leading-relaxed mb-3">
            معلم خبير بوزارة التربية والتعليم المصرية، متخصص في تدريس التاريخ
            والجغرافيا للمرحلة الثانوية العامة.  
            مؤسس <span className="text-[var(--gold)]">منصة المستشار 2026</span> 
            لتطوير التعليم باستخدام التقنيات الحديثة والذكاء الاصطناعي.
          </p>
          <p className="text-[rgba(255,255,255,0.7)] mb-4">
            يقدم دروس فيديو تفاعلية لطلبة الثانوية العامة، ويشرح المناهج بأسلوب
            مبسط وجذاب عبر قناته التعليمية على يوتيوب.
          </p>

          <div className="flex gap-4">
            <a
              href="https://www.youtube.com/c/mrkhalafmahrous/videos"
              target="_blank"
              className="btn-gold"
            >
              🔗 قناة يوتيوب
            </a>
            <a
              href="https://www.facebook.com"
              target="_blank"
              className="border border-[rgba(212,175,55,0.3)] rounded-lg px-4 py-2 hover:bg-[rgba(212,175,55,0.1)]"
            >
              📘 فيسبوك
            </a>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-2 text-[var(--gold)]">
          رسالة المنصة:
        </h3>
        <p className="text-[rgba(255,255,255,0.8)]">
          تقديم تجربة تعليمية متكاملة تجمع بين الفهم والتطبيق، 
          باستخدام الوسائط الحديثة والاختبارات الذكية لحماية حقوق المعلمين والطلاب.
        </p>
      </div>
    </div>
  );
}
