import { useNavigate } from "react-router-dom";

export default function SelectStage() {

  const navigate = useNavigate();

  const stages = [
    {
      id: "prep",
      title: "المرحلة الإعدادية",
    },
    {
      id: "secondary",
      title: "المرحلة الثانوية",
    },
  ];

  const handleSelect = (stageId) => {

    localStorage.setItem("mostasharStage", stageId);

    navigate("/student/elmostashar/select-grade");

  };

  return (

    <div className="min-h-screen bg-black p-10">

      <h1 className="text-3xl font-bold text-yellow-400 text-center mb-12">
        اختر المرحلة
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-4xl mx-auto">

        {stages.map((stage) => (

          <div
            key={stage.id}
            onClick={() => handleSelect(stage.id)}
            className="cursor-pointer rounded-xl border border-yellow-500/40 bg-zinc-900 p-12 text-center hover:scale-105 transition"
          >

            <h2 className="text-2xl text-yellow-300">
              {stage.title}
            </h2>

          </div>

        ))}

      </div>

    </div>

  );

}