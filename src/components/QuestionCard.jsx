export default function QuestionCard({
  question,
  index,
  selected,
  onSelect
}) {

  return (

    <div className="question-card">

      <h3>

        {index + 1} - {question.title}

      </h3>

      <div className="options">

        {question.options.map((opt, i) => (

          <label key={i}>

            <input
              type="radio"
              name={"q" + index}
              checked={selected === i}
              onChange={() => onSelect(index, i)}
            />

            {opt}

          </label>

        ))}

      </div>

    </div>

  );
}