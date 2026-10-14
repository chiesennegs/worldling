import { GraduationCap, ArrowRight } from "lucide-react";
import { quizzes } from "../data/knowledge";
import { entityById } from "../data/graph";
import type { Progress } from "../data/schema";
import { go } from "../navigation";
import { PageTitle, Fact, Section } from "../components/ui";

export default function ProgressView({ progress: p }: { progress: Progress }) {
  const topics = Object.entries(p.topics).sort(
    (a, b) => b[1].lastSeen - a[1].lastSeen,
  );
  return (
    <>
      <PageTitle
        eyebrow="LEARN / YOUR PROGRESS"
        title="Every connection counts."
        description="Your learning stays here, on this device. No account. Just your own path through the atlas."
      />
      <div className="progress-stats">
        <Fact label="CONNECTIONS ATTEMPTED" value={String(p.attempts)} />
        <Fact label="CORRECT ANSWERS" value={String(p.correct)} />
        <Fact
          label="ACCURACY"
          value={`${p.attempts ? Math.round((p.correct / p.attempts) * 100) : 0}%`}
        />
        <Fact label="BEST ANSWER STREAK" value={String(p.bestStreak)} />
      </div>
      <Section
        title="Your recent trails"
        subtitle="See which connections are sticking, and which could use another visit."
      >
        {topics.length ? (
          <div className="mastery-list">
            {topics.map(([id, t]) => {
              const [quiz, ...rest] = id.split(":");
              const entity = entityById.get(rest.join(":"));
              return (
                <div key={id}>
                  <div>
                    <strong>{entity?.name || id}</strong>
                    <small>
                      {quizzes.find((q) => q.id === quiz)?.name} · {t.attempts}{" "}
                      attempts
                    </small>
                  </div>
                  <div className="mastery-track">
                    <div
                      style={{ width: `${(t.correct / t.attempts) * 100}%` }}
                    />
                  </div>
                  <b>{Math.round((t.correct / t.attempts) * 100)}%</b>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="empty-state">
            <GraduationCap size={38} />
            <h2>A new trail is waiting.</h2>
            <p>Your progress begins with your first question.</p>
            <button className="primary" onClick={() => go("/learn")}>
              Find a practice trail <ArrowRight size={16} />
            </button>
          </div>
        )}
      </Section>
    </>
  );
}
