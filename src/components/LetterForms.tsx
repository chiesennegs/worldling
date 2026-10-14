import { createContext, useContext, useState, type ReactNode } from "react";
import {
  defaultLetterDisplayMode,
  handwritingStyles,
  letterVariants,
  type LetterDisplayMode,
} from "../data/handwriting";
const LetterFormContext = createContext<{
  mode: LetterDisplayMode;
  setMode: (mode: LetterDisplayMode) => void;
}>({ mode: defaultLetterDisplayMode, setMode: () => {} });
export function LetterFormProvider({ children }: { children: ReactNode }) {
  const [mode, setState] = useState<LetterDisplayMode>(() => {
    try {
      const saved = localStorage.getItem("worldling-letter-forms");
      return saved === "print" || saved === "handwritten" || saved === "both"
        ? saved
        : defaultLetterDisplayMode;
    } catch {
      return defaultLetterDisplayMode;
    }
  });
  function setMode(next: LetterDisplayMode) {
    setState(next);
    try {
      localStorage.setItem("worldling-letter-forms", next);
    } catch {
      /* Selection still works when storage is unavailable. */
    }
  }
  return (
    <LetterFormContext.Provider value={{ mode, setMode }}>
      {children}
    </LetterFormContext.Provider>
  );
}
export const useLetterForms = () => useContext(LetterFormContext);
export function LetterFormToggle() {
  const { mode, setMode } = useLetterForms();
  return (
    <div className="letter-display-toolbar">
      <span>Letter forms</span>
      <div
        className="letter-form-toggle"
        role="group"
        aria-label="Letter forms"
      >
        {(["both", "print", "handwritten"] as const).map((value) => (
          <button
            key={value}
            aria-pressed={mode === value}
            onClick={() => setMode(value)}
          >
            {value === "both"
              ? "Both"
              : value === "print"
                ? "Print"
                : "Handwritten"}
          </button>
        ))}
      </div>
      <small>Where available</small>
    </div>
  );
}
/** Same Unicode text, two authentic script-specific font renderings. */
export function Glyph({
  text,
  scriptId,
  className = "",
  dir,
}: {
  text: string | undefined;
  scriptId?: string;
  className?: string;
  dir?: "rtl" | "ltr";
}) {
  const { mode } = useLetterForms();
  const style = scriptId ? handwritingStyles[scriptId] : undefined;
  const variants = letterVariants(scriptId, mode);
  return (
    <span
      className={`glyph-forms ${className}`}
      dir={dir}
      title={
        style?.note ||
        (scriptId
          ? "Handwritten forms for this historical script are not yet curated."
          : undefined)
      }
      data-script={scriptId}
      data-display-mode={mode}
    >
      {variants.map((variant) => (
        <span className={`glyph-variant glyph-${variant}`} key={variant}>
          <span
            className="glyph-ink"
            style={
              variant === "handwritten"
                ? { fontFamily: `"${style!.family}"`, fontWeight: 400 }
                : undefined
            }
          >
            {text}
          </span>
          {(variants.length > 1 ||
            (mode === "handwritten" && scriptId && !style)) && (
            <span className="glyph-form-caption">
              {variant === "print"
                ? mode === "handwritten" && !style
                  ? "Print · handwriting not curated"
                  : "Print"
                : style!.label}
            </span>
          )}
        </span>
      ))}
    </span>
  );
}
