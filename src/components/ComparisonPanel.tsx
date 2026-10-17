import { useEffect, useId, useRef, type ReactNode } from "react";
import { X } from "lucide-react";

/** Anchored desktop panel, bottom sheet on phones; native modal focus/Escape. */
export default function ComparisonPanel({
  title,
  anchor,
  onDismiss,
  children,
}: {
  title: string;
  anchor: HTMLElement | null;
  onDismiss: () => void;
  children: ReactNode;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const headingId = useId();
  const dismiss = useRef(onDismiss);
  dismiss.current = onDismiss;
  useEffect(() => {
    const element = dialog.current!;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    element.showModal();
    if (window.matchMedia("(min-width: 761px)").matches && anchor) {
      const rect = anchor.getBoundingClientRect();
      const panel = element.getBoundingClientRect();
      element.style.left = `${Math.max(16, Math.min(rect.left, window.innerWidth - panel.width - 16))}px`;
      element.style.top = `${Math.max(16, Math.min(rect.bottom + 8, window.innerHeight - panel.height - 16))}px`;
    }
    return () => {
      element.close();
      document.body.style.overflow = previousOverflow;
      if (anchor?.isConnected) anchor.focus();
    };
  }, [anchor]);
  return (
    <dialog
      ref={dialog}
      className="comparison-panel"
      aria-labelledby={headingId}
      onCancel={(event) => {
        event.preventDefault();
        dismiss.current();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) dismiss.current();
      }}
    >
      <div className="comparison-panel-content">
        <div className="comparison-panel-heading">
          <h2 id={headingId}>{title}</h2>
          <button
            className="comparison-icon-button"
            aria-label={`Close ${title}`}
            onClick={onDismiss}
          >
            <X size={20} />
          </button>
        </div>
        {children}
        <button className="primary comparison-panel-done" onClick={onDismiss}>
          Done
        </button>
      </div>
    </dialog>
  );
}
