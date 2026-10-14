import mapCodes from "./map-codes.json";
import { entities, relationships, quizzes, countries } from "./knowledge";
import type { Entity, Progress, QuizDefinition, RelationType } from "./schema";
export const entityById = new Map(entities.map((e) => [e.id, e]));
export function related(id: string, type?: RelationType, inverse = false) {
  return relationships
    .filter(
      (r) => (inverse ? r.to : r.from) === id && (!type || r.type === type),
    )
    .map((r) => ({
      entity: entityById.get(inverse ? r.from : r.to)!,
      relationship: r,
    }))
    .filter((r) => r.entity);
}
export function ancestors(id: string, type: RelationType): Entity[] {
  const seen = new Set<string>([id]);
  const result: Entity[] = [];
  function visit(key: string) {
    for (const { entity } of related(key, type)) {
      if (!seen.has(entity.id)) {
        seen.add(entity.id);
        result.push(entity);
        visit(entity.id);
      }
    }
  }
  visit(id);
  return result;
}
export function search(query: string) {
  const q = query.trim().toLocaleLowerCase();
  if (!q) return [];
  const direct = entities.filter(
    (e) =>
      !["name", "sound", "flag", "writing-system"].includes(e.type) &&
      (e.name.toLocaleLowerCase().includes(q) ||
        e.symbol?.toLocaleLowerCase() === q),
  );
  const connected = direct
    .filter((e) => e.type === "script" || e.type === "language")
    .flatMap((e) => related(e.id).map((r) => r.entity));
  return [
    ...new Map([...direct, ...connected].map((e) => [e.id, e])).values(),
  ].slice(0, 25);
}
export function quizPairs(def: QuizDefinition) {
  return relationships
    .filter((r) => r.type === def.relation)
    .map((r) => ({
      prompt: entityById.get(def.reverse ? r.to : r.from)!,
      answer: entityById.get(def.reverse ? r.from : r.to)!,
    }))
    .filter(
      (p) =>
        p.prompt?.type === def.promptType &&
        p.answer &&
        (!def.answerType || p.answer.type === def.answerType) &&
        (!def.map ||
          (countries.find((c) => `country-${c.cca3}` === p.answer.id)
            ?.independent &&
            mapCodes.includes(p.answer.id.replace("country-", "")))),
    );
}
export function makeQuestion(quizId: string, random = Math.random) {
  const def = quizzes.find((q) => q.id === quizId)!;
  const pairs = quizPairs(def);
  const pair = pairs[Math.floor(random() * pairs.length)];
  const labels = new Set([pair.answer.name]);
  const distractors = pairs
    .filter(
      (p) => p.prompt.id !== pair.prompt.id && p.answer.id !== pair.answer.id,
    )
    .sort(() => random() - 0.5)
    .map((p) => p.answer)
    .filter((a) => {
      if (labels.has(a.name)) return false;
      labels.add(a.name);
      return true;
    })
    .slice(0, 3);
  return {
    ...pair,
    options: [pair.answer, ...distractors].sort(() => random() - 0.5),
  };
}
export const emptyProgress: Progress = {
  attempts: 0,
  correct: 0,
  streak: 0,
  bestStreak: 0,
  topics: {},
};
export function recordAttempt(
  progress: Progress,
  id: string,
  correct: boolean,
): Progress {
  const prev = progress.topics[id] || { attempts: 0, correct: 0, lastSeen: 0 };
  const streak = correct ? progress.streak + 1 : 0;
  return {
    ...progress,
    attempts: progress.attempts + 1,
    correct: progress.correct + Number(correct),
    streak,
    bestStreak: Math.max(progress.bestStreak, streak),
    topics: {
      ...progress.topics,
      [id]: {
        attempts: prev.attempts + 1,
        correct: prev.correct + Number(correct),
        lastSeen: Date.now(),
      },
    },
  };
}
export function loadProgress(): Progress {
  try {
    const p = JSON.parse(localStorage.getItem("worldling-progress") || "null");
    return p &&
      typeof p.attempts === "number" &&
      typeof p.correct === "number" &&
      p.topics
      ? p
      : emptyProgress;
  } catch {
    return emptyProgress;
  }
}
export function saveProgress(p: Progress) {
  try {
    localStorage.setItem("worldling-progress", JSON.stringify(p));
    return true;
  } catch {
    return false;
  }
}
