import { useEffect, useState } from "react";
import "./WelcomeOverlay.css";

export default function WelcomeOverlay({ name }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // ⛔ لا تعمل أي شيء قبل وصول الاسم
    if (!name) return;

    const today = new Date().toISOString().split("T")[0];
    const lastShown = localStorage.getItem("welcomeShownDate");

    if (lastShown !== today) {
      setShow(true);

      localStorage.setItem("welcomeShownDate", today);

      setTimeout(() => {
        setShow(false);
      }, 3000);
    }
  }, [name]); // ⭐ أهم تعديل

  if (!show) return null;

  return (
    <div className="welcome-overlay">
      <div className="welcome-box">
        <h2>✨ أهلاً بعودتك يا {name}</h2>
        <p>سعيدون بعودتك… لنُكمل رحلة النجاح معًا 🤝</p>
      </div>
    </div>
  );
}
