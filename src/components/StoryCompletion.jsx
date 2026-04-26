"use client";

import { useMemo, useState } from "react";

const completionQuestions = {
  "mateo-dragon-dorado": [
    {
      question: "¿Quién ayudó al enanito?",
      decoration: "🍄",
      options: [
        { label: "Mateo", icon: "👦", correct: true },
        { label: "El perrito azul", icon: "🐶" },
        { label: "El dragoncito", icon: "🐉" },
      ],
    },
    {
      question: "¿Cómo se sentía el enanito?",
      decoration: "🌸",
      options: [
        { label: "Contento", icon: "🙂" },
        { label: "Triste", icon: "🥺", correct: true },
        { label: "Enojado", icon: "😠" },
      ],
    },
    {
      question: "¿Qué aprendimos hoy?",
      decoration: "🌿",
      options: [
        { label: "Ayudar a los amigos", icon: "❤️", correct: true },
        { label: "Correr muy rápido", icon: "👟" },
        { label: "Juntar honguitos", icon: "🍄" },
      ],
    },
  ],
  "mateo-magic-forest": [
    {
      question: "¿A quién siguió Mateo?",
      decoration: "🌙",
      options: [
        { label: "Al conejito", icon: "🐰", correct: true },
        { label: "A una nube", icon: "☁️" },
        { label: "A una piedra", icon: "🪨" },
      ],
    },
    {
      question: "¿Quién bajó del cielo?",
      decoration: "✨",
      options: [
        { label: "Una estrellita", icon: "⭐", correct: true },
        { label: "Un barco", icon: "⛵" },
        { label: "Un sombrero", icon: "🎩" },
      ],
    },
    {
      question: "¿Cómo volvió Mateo a casa?",
      decoration: "🌿",
      options: [
        { label: "Feliz", icon: "😊", correct: true },
        { label: "Enojado", icon: "😠" },
        { label: "Con sueño", icon: "😴" },
      ],
    },
  ],
  "mateo-volcano": [
    {
      question: "¿A dónde viajó Mateo?",
      decoration: "🔥",
      options: [
        { label: "Al volcán mágico", icon: "🌋", correct: true },
        { label: "A la playa", icon: "🏖️" },
        { label: "A la luna", icon: "🌙" },
      ],
    },
    {
      question: "¿Qué había en la cueva?",
      decoration: "💎",
      options: [
        { label: "Cristales", icon: "💎", correct: true },
        { label: "Helados", icon: "🍦" },
        { label: "Globos", icon: "🎈" },
      ],
    },
    {
      question: "¿Quiénes fueron sus amigos?",
      decoration: "🍄",
      options: [
        { label: "Los enanitos", icon: "🧙", correct: true },
        { label: "Unos piratas", icon: "🏴‍☠️" },
        { label: "Un robot", icon: "🤖" },
      ],
    },
  ],
};

const fallbackQuestions = [
  {
    question: "¿Quién vivió esta aventura?",
    decoration: "⭐",
    options: [
      { label: "Mateo", icon: "👦", correct: true },
      { label: "La luna", icon: "🌙" },
      { label: "Un tren", icon: "🚂" },
    ],
  },
  {
    question: "¿Qué fue importante?",
    decoration: "✨",
    options: [
      { label: "La amistad", icon: "❤️", correct: true },
      { label: "Gritar fuerte", icon: "📣" },
      { label: "Correr solo", icon: "👟" },
    ],
  },
  {
    question: "¿Cómo terminó el cuento?",
    decoration: "🌙",
    options: [
      { label: "Con alegría", icon: "😊", correct: true },
      { label: "Con enojo", icon: "😠" },
      { label: "Con susto", icon: "😲" },
    ],
  },
];

export default function StoryCompletion({ story, onBack, onRestart }) {
  const questions = completionQuestions[story.id] ?? fallbackQuestions;
  const [answers, setAnswers] = useState({});
  const completedCount = useMemo(
    () => Object.keys(answers).length,
    [answers]
  );
  const allAnswered = completedCount === questions.length;
  const heroImage = story.scenes.at(-1)?.imageUrl ?? story.coverImageUrl;

  function handleAnswer(questionIndex, optionIndex) {
    setAnswers((currentAnswers) => ({
      ...currentAnswers,
      [questionIndex]: optionIndex,
    }));
  }

  return (
    <main className="completionPage">
      <section className="completionCard" aria-label="Final del cuento">
        <button className="completionBack" type="button" onClick={onBack}>
          ←
        </button>

        <div className="completionStars" aria-hidden="true">
          <span>✦</span>
          <span>★</span>
          <span>☾</span>
        </div>

        <div className="completionHero">
          <img src={heroImage} alt="" />
          <div className="completionIntro">
            <h1>¡Fin del cuento!</h1>
            <p>Ahora charlemos un poquito, Mateo.</p>
            <span>⭐ Historia completada</span>
          </div>
        </div>

        <div className="questionStack">
          {questions.map((question, questionIndex) => (
            <article className="questionCard" key={question.question}>
              <div className="questionHeading">
                <span className="questionNumber">{questionIndex + 1}</span>
                <h2>{question.question}</h2>
                <span className="questionDecoration" aria-hidden="true">
                  {question.decoration}
                </span>
              </div>

              <div className="answerGrid">
                {question.options.map((option, optionIndex) => {
                  const selected = answers[questionIndex] === optionIndex;
                  const answered = answers[questionIndex] !== undefined;
                  const className = [
                    "answerButton",
                    selected ? "isSelected" : "",
                    answered && option.correct ? "isCorrect" : "",
                  ]
                    .filter(Boolean)
                    .join(" ");

                  return (
                    <button
                      className={className}
                      key={option.label}
                      type="button"
                      onClick={() => handleAnswer(questionIndex, optionIndex)}
                    >
                      <span aria-hidden="true">{option.icon}</span>
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </article>
          ))}
        </div>

        <div className="completionPraise">
          <span aria-hidden="true">🐉</span>
          <div>
            <h2>{allAnswered ? "¡Muy bien, Mateo!" : "¡Nueva aventura completa!"}</h2>
            <p>Responder también es parte de la aventura.</p>
          </div>
          <span aria-hidden="true">🐶</span>
        </div>

        <div className="completionActions">
          <button className="completionReplay" type="button" onClick={onRestart}>
            🔊 Escuchar otra vez
          </button>
          <button className="completionContinue" type="button" onClick={onBack}>
            🎮 Seguir jugando
          </button>
        </div>
      </section>
    </main>
  );
}
