import { Outlet, useNavigate } from "react-router-dom";
import "./StudentLayout.css";

export default function StudentLayout() {
  const navigate = useNavigate();

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/student");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* الشريط العلوي */}
      <header className="sticky top-0 z-20 bg-black/80 backdrop-blur border-b border-white/10 px-6 py-4 flex justify-start">
        <button
          onClick={handleBack}
          className="gold-back-btn"
        >
          ← رجوع
        </button>
      </header>

      <main className="relative z-10 p-6">
        <Outlet />
      </main>
    </div>
  );
}
