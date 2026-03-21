import { useEffect, useState } from "react";

export default function ExamTimer({ minutes = 60, onFinish }) {

  const [time, setTime] = useState(minutes * 60);

  useEffect(() => {

    const timer = setInterval(() => {

      setTime((prev) => {

        if (prev <= 1) {

          clearInterval(timer);

          if (onFinish) {
            onFinish();
          }

          return 0;
        }

        return prev - 1;

      });

    }, 1000);

    return () => clearInterval(timer);

  }, []);

  const m = Math.floor(time / 60);
  const s = time % 60;

  return (

    <div className="exam-timer">

      ⏳ الوقت المتبقي:

      <strong>
        {m}:{s < 10 ? "0" + s : s}
      </strong>

    </div>

  );
}