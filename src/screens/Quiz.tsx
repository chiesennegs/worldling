import { collectionForPlace } from "../data/subdivision-collections";
import { Glyph } from "../components/LetterForms";
import { useState } from "react";
import {
  ArrowUpRight,
  ArrowRight,
  ChevronLeft,
  X,
  CheckCircle2,
  WifiOff,
  RotateCcw,
} from "lucide-react";
import { scripts, graphemes, quizzes } from "../data/knowledge";
import { entityById, ancestors, makeQuestion } from "../data/graph";
import type { Entity, Progress } from "../data/schema";
import { go, entityPath } from "../navigation";
import WorldMap from "../Map";

export default function Quiz({
  id,
  attempt,
}: {
  id: string;
  attempt: (id: string, correct: boolean) => void;
}) {
  const def = quizzes.find((q) => q.id === id);
  const [question, setQuestion] = useState(() =>
    def ? makeQuestion(id) : null,
  );
  const [answer, setAnswer] = useState<string>();
  const [count, setCount] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  if (!def || !question) return <p>Quiz not found.</p>;
  function choose(entity: Entity) {
    if (answer) return;
    const correct = entity.id === question!.answer.id;
    setAnswer(entity.id);
    attempt(`${id}:${question!.prompt.id}`, correct);
    if (correct) setScore((s) => s + 1);
  }
  function next() {
    if (count === 9) {
      setFinished(true);
      return;
    }
    setCount((c) => c + 1);
    setAnswer(undefined);
    setQuestion(makeQuestion(id));
  }
  if (finished)
    return (
      <div className="quiz-finished">
        <div className="finish-symbol">✳</div>
        <div className="eyebrow">TEN CONNECTIONS MADE</div>
        <h1>Curiosity looks good on you.</h1>
        <p>
          You found {score} of 10 connections. Every answer is a new place to
          start.
        </p>
        <div className="finish-score">
          {score}
          <span>/10</span>
        </div>
        <button
          className="primary"
          onClick={() => {
            setFinished(false);
            setCount(0);
            setScore(0);
            setAnswer(undefined);
            setQuestion(makeQuestion(id));
          }}
        >
          Try another round <RotateCcw size={16} />
        </button>
        <button className="text-button" onClick={() => go("/learn")}>
          Choose a different trail <ArrowRight size={16} />
        </button>
      </div>
    );
  const promptSubdivision = collectionForPlace(question.prompt.id).subdivision;
  const isGlyph =
    question.prompt.type === "grapheme" || question.prompt.type === "flag";
  return (
    <>
      <button className="back" onClick={() => go("/learn")}>
        <ChevronLeft size={16} />
        All practice trails
      </button>
      <div className="quiz-header">
        <div>
          <span className="eyebrow">PRACTICE / {def.name.toUpperCase()}</span>
          <h1>{def.name}</h1>
        </div>
        <span>
          {count + 1} / 10 <span className="muted">questions</span>
        </span>
      </div>
      <div className="progress-track">
        <div style={{ width: `${(count + 1) * 10}%` }} />
      </div>
      <div className="quiz-body">
        <p className="quiz-instruction">
          {def.map
            ? "Select the country represented by this flag."
            : def.subdivisionCountryCode && !def.reverse
              ? `What is the ${promptSubdivision?.capitalLabel?.toLowerCase() || "capital"} of this ${promptSubdivision?.kind || "subdivision"}?`
              : def.id === "capital-states"
                ? "Which U.S. state has this capital?"
                : def.id === "flags"
                  ? "Which country does this flag belong to?"
                  : def.id === "capitals"
                    ? "What is the capital of this country?"
                    : def.id === "letters"
                      ? "What is this letter called?"
                      : def.id === "scripts"
                        ? "Which script does this glyph belong to?"
                        : def.id === "ancestors"
                          ? "Which letter is its immediate historical ancestor in our graph?"
                          : def.id === "sounds"
                            ? "Which representative phonetic value or letter name matches?"
                            : def.id === "reverse-flags"
                              ? "Which flag belongs to this country?"
                              : "Which country has this capital?"}
        </p>
        <div className={`quiz-prompt ${isGlyph ? "glyph-prompt" : ""}`}>
          {question.prompt.type === "grapheme" ? (
            <Glyph
              text={question.prompt.symbol}
              scriptId={
                graphemes.find((g) => g.id === question.prompt.id)?.scriptId
              }
            />
          ) : isGlyph ? (
            question.prompt.symbol
          ) : (
            question.prompt.name
          )}
        </div>
        {def.id === "sounds" && (
          <p className="muted">
            {
              graphemes.find((g) => g.id === question.prompt.id)?.sounds[0]
                .context
            }
          </p>
        )}
        {def.map ? (
          <WorldMap
            quiz
            selected={answer?.replace("country-", "")}
            onCountry={(code) => {
              const e = entityById.get(`country-${code}`);
              if (e) choose(e);
            }}
          />
        ) : (
          <div className="quiz-options">
            {question.options.map((o, i) => (
              <button
                key={o.id}
                disabled={!!answer}
                className={`${answer && o.id === question.answer.id ? "correct" : ""} ${answer === o.id && o.id !== question.answer.id ? "incorrect" : ""}`}
                onClick={() => choose(o)}
              >
                <span className="option-key">
                  {String.fromCharCode(65 + i)}
                </span>
                <span className={o.type === "flag" ? "flag-option" : ""}>
                  {o.type === "flag" ? (
                    o.symbol
                  ) : o.type === "grapheme" ? (
                    <>
                      <Glyph
                        text={o.symbol}
                        scriptId={
                          graphemes.find((g) => g.id === o.id)?.scriptId
                        }
                      />{" "}
                      · {o.name}
                    </>
                  ) : (
                    o.name
                  )}
                </span>
                {answer && o.id === question.answer.id && (
                  <CheckCircle2 size={19} />
                )}
                {answer === o.id && o.id !== question.answer.id && (
                  <X size={19} />
                )}
              </button>
            ))}
          </div>
        )}
        {answer && (
          <div
            className={`answer-feedback ${answer === question.answer.id ? "right" : "wrong"}`}
            role="status"
          >
            <div>
              <strong>
                {answer === question.answer.id
                  ? "A connection made."
                  : "A new connection to remember."}
              </strong>
              <p>
                {question.prompt.name} → {question.answer.name}
              </p>
              {[
                "country",
                "script",
                "grapheme",
                "subdivision",
                "capital",
              ].includes(question.answer.type) && (
                <button
                  className="text-button"
                  onClick={() => go(entityPath(question.answer))}
                >
                  Explore {question.answer.name} <ArrowUpRight size={14} />
                </button>
              )}
            </div>
            <button className="primary" onClick={next}>
              {count === 9 ? "See your results" : "Next connection"}
              <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>
      <p className="quiz-note">
        <WifiOff size={14} />
        Progress is saved on this device. Take your time.
      </p>
    </>
  );
}
