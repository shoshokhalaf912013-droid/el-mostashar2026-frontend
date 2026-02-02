import { useNavigate } from "react-router-dom";

export default function SelectStage() {
  const navigate = useNavigate();

  const stages = [
    { id: "primary", title: "المرحلة الابتدائية" },
    { id: "preparatory", title: "المرحلة الإعدادية" },
    { id: "secondary", title: "المرحلة الثانوية" },
  ];

  return (
    <div className="min-h-screen bg-black p-10">
      <h1 className="text-3xl text-yellow-400 text-center mb-10">
        اختر المرحلة
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {stages.map((stage) => (
          <div
            key={stage.id}
            onClick={() => {
              if (stage.id === "secondary") {
                navigate("/student/secondary");
              } else {
                navigate(`/student/primary-prep/select-grade/${stage.id}`);
              }
            }}
            className="cursor-pointer rounded-xl border border-yellow-500/40 bg-zinc-900 p-8 text-center hover:scale-105 transition"
          >
            <h2 className="text-2xl text-yellow-400 font-bold">
              {stage.title}
            </h2>
          </div>
        ))}
      </div>
    </div>
  );
}
