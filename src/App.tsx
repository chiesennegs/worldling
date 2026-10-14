import { LetterFormToggle } from "./components/LetterForms";
import { audioProvider } from "./audio";
import { useEffect, useState, useRef } from "react";
import {
  Globe2,
  Compass,
  Columns3,
  BookOpen,
  Network,
  GraduationCap,
  Search,
  ArrowRight,
  ChevronRight,
  Type,
  X,
  Flame,
  Bookmark,
  Menu,
  Download,
} from "lucide-react";
import { scripts, languages } from "./data/knowledge";
import {
  entityById,
  search,
  loadProgress,
  saveProgress,
  recordAttempt,
} from "./data/graph";
import type { Script, Progress } from "./data/schema";
import { go, entityPath } from "./navigation";
import { EntityLink, PageTitle, Save } from "./components/ui";
import {
  Home,
  World,
  CountryDetail,
  Writing,
  ScriptDetail,
  LetterDetail,
  LanguageDetail,
  Genealogy,
  WordLab,
  Learn,
  Quiz,
  ProgressView,
  AlphabetComparison,
  PlaceDetail,
} from "./screens";

interface InstallPromptEvent extends Event {
  prompt(): Promise<void>;
}

export default function App() {
  const [route, setRoute] = useState(location.hash.slice(1) || "/");
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobile, setMobile] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const sidebar = useRef<HTMLElement>(null);
  const mainContent = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState<Progress>(loadProgress);
  const [saved, setSaved] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("worldling-saved") || "[]");
    } catch {
      return [];
    }
  });
  const [toast, setToast] = useState("");
  const [install, setInstall] = useState<InstallPromptEvent>();
  useEffect(() => {
    const h = () => {
      setRoute(location.hash.slice(1) || "/");
      setMobile(false);
      setSearchOpen(false);
      setQuery("");
    };
    window.addEventListener("hashchange", h);
    const i = (e: Event) => {
      e.preventDefault();
      setInstall(e as InstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", i);
    return () => {
      window.removeEventListener("hashchange", h);
      window.removeEventListener("beforeinstallprompt", i);
    };
  }, []);
  useEffect(() => {
    if (!mobile) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const panel = sidebar.current;
    const controls = () =>
      Array.from(
        panel?.querySelectorAll<HTMLButtonElement>("button:not(:disabled)") ||
          [],
      ).filter((button) => button.getClientRects().length);
    controls()[0]?.focus();
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setMobile(false);
      }
      if (e.key === "Tab") {
        const buttons = controls(),
          first = buttons[0],
          last = buttons[buttons.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };
    const resize = () => {
      if (window.innerWidth > 760) setMobile(false);
    };
    window.addEventListener("keydown", key);
    window.addEventListener("resize", resize);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", key);
      window.removeEventListener("resize", resize);
      menuButton.current?.focus();
    };
  }, [mobile]);
  function navigateMenu(path: string, selected = false) {
    setMobile(false);
    setSearchOpen(false);
    if (mobile && selected) return;
    go(path);
  }
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(""), 3500);
    return () => clearTimeout(timer);
  }, [toast]);
  function bookmark(id: string) {
    const next = saved.includes(id)
      ? saved.filter((x) => x !== id)
      : [...saved, id];
    setSaved(next);
    try {
      localStorage.setItem("worldling-saved", JSON.stringify(next));
    } catch {
      setToast("Your browser could not save this collection.");
    }
  }
  function attempt(id: string, correct: boolean) {
    const next = recordAttempt(progress, id, correct);
    setProgress(next);
    if (!saveProgress(next))
      setToast(
        "Progress is available for this session. Browser storage is unavailable.",
      );
  }
  async function speak(text: string, language = "en", rate = 1) {
    const notice = await audioProvider.play({ text, language, rate });
    if (notice) setToast(notice);
  }
  const [section, id] = route.slice(1).split("/");
  const active = section || "home";
  const results = search(query);
  const navActive = (key: string) =>
    active === key ||
    (key === "world" &&
      ["country", "language", "states", "place"].includes(active)) ||
    (key === "writing" && ["script", "letter"].includes(active));
  const nav = [
    ["home", "Your atlas", Compass, "/"],
    ["world", "World & places", Globe2, "/world"],
    ["writing", "Writing systems", Type, "/writing"],
    ["compare", "Compare alphabets", Columns3, "/compare"],
    ["genealogy", "Script genealogy", Network, "/genealogy"],
    ["word", "Word explorer", BookOpen, "/word"],
  ];
  return (
    <div className="app">
      {mobile && (
        <button
          className="nav-backdrop"
          aria-label="Dismiss navigation"
          tabIndex={-1}
          onClick={() => setMobile(false)}
        />
      )}
      <aside
        ref={sidebar}
        id="navigation-panel"
        className={`sidebar ${mobile ? "open" : ""}`}
        role={mobile ? "dialog" : undefined}
        aria-modal={mobile || undefined}
        aria-label="Navigation"
      >
        <button
          className="sidebar-close"
          aria-label="Close navigation"
          onClick={() => setMobile(false)}
        >
          <X size={22} />
        </button>
        <button
          className="brand"
          onClick={() => navigateMenu("/", active === "home")}
        >
          <span className="brand-icon">
            <Globe2 size={27} />
          </span>
          worldling<span className="brand-dot">.</span>
        </button>
        <div className="sidebar-label">A WORLD OF CONNECTIONS</div>
        <nav>
          <p>EXPLORE</p>
          {nav.map(([key, label, Icon, path]) => {
            const I = Icon as typeof Compass;
            return (
              <button
                key={key as string}
                className={navActive(key as string) ? "active" : ""}
                onClick={() =>
                  navigateMenu(path as string, navActive(key as string))
                }
              >
                <I size={19} />
                {label as string}
                {key === "home" && <span className="nav-dot" />}
              </button>
            );
          })}
          <p className="learn-label">LEARN</p>
          <button
            className={active === "learn" || active === "quiz" ? "active" : ""}
            onClick={() =>
              navigateMenu("/learn", active === "learn" || active === "quiz")
            }
          >
            <GraduationCap size={20} />
            Practice & play<span className="new-pill">NEW</span>
          </button>
          <button
            className={active === "progress" ? "active" : ""}
            onClick={() => navigateMenu("/progress", active === "progress")}
          >
            <Flame size={19} />
            Your progress
          </button>
          <p className="learn-label">YOUR COLLECTION</p>
          <button
            className={active === "saved" ? "active" : ""}
            onClick={() => navigateMenu("/saved", active === "saved")}
          >
            <Bookmark size={18} />
            Saved discoveries<span className="nav-count">{saved.length}</span>
          </button>
        </nav>
        <div className="sidebar-bottom">
          <div className="little-globe">
            <Globe2 size={34} />
          </div>
          <strong>Curiosity has no borders.</strong>
          <p>A little exploring goes a long way.</p>
          <div className="offline">
            <span /> LOCAL-FIRST · NO ACCOUNT NEEDED
          </div>
          {install && (
            <button
              className="install"
              onClick={async () => {
                await install.prompt();
                setInstall(undefined);
              }}
            >
              <Download size={14} />
              Install Worldling
            </button>
          )}
        </div>
      </aside>
      <div className="main-wrap" inert={mobile || undefined}>
        <header>
          <button
            ref={menuButton}
            className="mobile-menu"
            aria-controls="navigation-panel"
            aria-label="Open navigation"
            aria-expanded={mobile}
            onClick={() => setMobile(!mobile)}
          >
            <Menu />
          </button>
          <div className="breadcrumb">
            Your atlas <ChevronRight size={14} />
            <span>
              {
                (
                  {
                    home: "Overview",
                    compare: "Compare alphabets",
                    states: "World & places",
                    place: "Place explorer",
                    world: "World & places",
                    writing: "Writing systems",
                    genealogy: "Script genealogy",
                    word: "Word explorer",
                    learn: "Practice & play",
                    progress: "Your progress",
                    saved: "Saved discoveries",
                    country: "Place explorer",
                    script: "Script explorer",
                    letter: "Letter explorer",
                    language: "Language explorer",
                    quiz: "Practice session",
                  } as Record<string, string>
                )[active]
              }
            </span>
          </div>
          <div className="header-actions">
            <div className="search-box">
              <Search size={17} />
              <input
                aria-label="Search places, languages and letters"
                placeholder="Find a place, language, letter…"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSearchOpen(true);
                }}
                onFocus={() => setSearchOpen(true)}
                onKeyDown={(e) => {
                  if (e.key === "Escape") setSearchOpen(false);
                  if (e.key === "Enter" && results[0])
                    go(entityPath(results[0]));
                }}
              />
              <kbd>⌕</kbd>
              {searchOpen && query && (
                <div className="search-results">
                  <div className="search-title">
                    CONNECTED DISCOVERIES
                    <button
                      aria-label="Close search"
                      onClick={() => setSearchOpen(false)}
                    >
                      <X size={15} />
                    </button>
                  </div>
                  {results.length ? (
                    results.map((e) => (
                      <EntityLink key={e.id} entity={e} small />
                    ))
                  ) : (
                    <p>
                      No discoveries yet. Try “Arabic”, “Alpha”, or “Portugal”.
                    </p>
                  )}
                </div>
              )}
            </div>
            <button
              className="streak"
              onClick={() => navigateMenu("/progress", active === "progress")}
            >
              <Flame size={18} />
              <b>{progress.streak}</b>
              <span>answer streak</span>
            </button>
            <button
              className="avatar"
              aria-label="Your local progress"
              onClick={() => navigateMenu("/progress", active === "progress")}
            >
              W
            </button>
          </div>
        </header>
        <main ref={mainContent}>
          <LetterFormToggle scope={mainContent} />
          {active === "home" && <Home progress={progress} />}
          {(active === "world" || active === "states") && (
            <World
              initialTab={
                active === "states" || id === "states"
                  ? "States"
                  : id === "countries"
                    ? "Countries"
                    : id === "flags"
                      ? "Flags"
                      : "Map"
              }
            />
          )}
          {active === "country" && (
            <CountryDetail id={id} saved={saved} bookmark={bookmark} />
          )}
          {active === "writing" && <Writing />}
          {active === "compare" && <AlphabetComparison />}
          {active === "place" && (
            <PlaceDetail id={id} saved={saved} bookmark={bookmark} />
          )}
          {active === "script" && (
            <ScriptDetail id={id} saved={saved} bookmark={bookmark} />
          )}
          {active === "letter" && (
            <LetterDetail
              id={id}
              saved={saved}
              bookmark={bookmark}
              speak={speak}
            />
          )}
          {active === "language" && <LanguageDetail id={id} />}
          {active === "genealogy" && <Genealogy />}
          {active === "word" && <WordLab speak={speak} />}
          {active === "learn" && <Learn progress={progress} />}
          {active === "quiz" && <Quiz key={id} id={id} attempt={attempt} />}
          {active === "progress" && <ProgressView progress={progress} />}
          {active === "saved" && (
            <>
              <PageTitle
                eyebrow="YOUR COLLECTION"
                title="Keep your curiosity close."
                description="A personal atlas of places, scripts, and letters you want to return to."
              />
              <div className="entity-grid">
                {saved.length ? (
                  saved
                    .map((id) => entityById.get(id))
                    .filter(Boolean)
                    .map((e) => <EntityLink key={e!.id} entity={e!} />)
                ) : (
                  <div className="empty-state">
                    <Bookmark size={35} />
                    <h2>Your next discovery belongs here.</h2>
                    <p>
                      Use Save on a country, script, or letter to start your
                      collection.
                    </p>
                    <button className="primary" onClick={() => go("/world")}>
                      Explore the world <ArrowRight size={16} />
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
          {![
            "home",
            "compare",
            "states",
            "place",
            "world",
            "country",
            "writing",
            "script",
            "letter",
            "language",
            "genealogy",
            "word",
            "learn",
            "quiz",
            "progress",
            "saved",
          ].includes(active) && (
            <>
              <h1>This trail hasn’t been mapped.</h1>
              <button onClick={() => go("/")}>Return to your atlas</button>
            </>
          )}
          <footer>
            <span>
              <Globe2 size={14} /> Worldling · An atlas of connections
            </span>
            <span>
              Made for the endlessly curious{" "}
              <span className="footer-star">✳</span>
            </span>
          </footer>
        </main>
      </div>
      {toast && (
        <div className="toast" role="status">
          {toast}
        </div>
      )}
    </div>
  );
}
