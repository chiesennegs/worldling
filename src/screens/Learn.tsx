import {
  Globe2,
  GraduationCap,
  ArrowUpRight,
  ArrowRight,
  Flag,
  Type,
  History,
} from "lucide-react";
import { quizzes } from "../data/knowledge";
import type { Progress } from "../data/schema";
import { go } from "../navigation";
import { PageTitle } from "../components/ui";

const icons = { globe: Globe2, flag: Flag, type: Type, history: History };
export default function Learn({ progress }: { progress: Progress }) {
  return (
    <>
      <PageTitle
        eyebrow="LEARN / PRACTICE & PLAY"
        title="A little curiosity. A little practice."
        description="The same connected atlas, with a playful twist. Choose a trail and test what you know."
      />
      <div className="learning-banner">
        <div>
          <GraduationCap size={30} />
          <h2>Learn by making connections.</h2>
          <p>
            Every question follows a real relationship in the atlas. Explore the
            answer after each round.
          </p>
        </div>
        <div className="learning-stat">
          <strong>
            {progress.attempts
              ? Math.round((progress.correct / progress.attempts) * 100)
              : 0}
            %
          </strong>
          <small>OVERALL ACCURACY</small>
        </div>
      </div>
      <div className="quiz-grid">
        {quizzes.map((q, i) => {
          const Icon = icons[q.icon as keyof typeof icons];
          return (
            <button
              className={`quiz-card quiz-tone-${i % 3}`}
              key={q.id}
              onClick={() => go(`/quiz/${q.id}`)}
            >
              <div className="card-top">
                <span className="entry-icon">
                  <Icon size={22} />
                </span>
                <ArrowUpRight size={19} />
              </div>
              <h3>{q.name}</h3>
              <p>{q.description}</p>
              <span className="entry-bottom">
                10 QUESTIONS · AT YOUR PACE <ArrowRight size={15} />
              </span>
            </button>
          );
        })}
      </div>
    </>
  );
}
