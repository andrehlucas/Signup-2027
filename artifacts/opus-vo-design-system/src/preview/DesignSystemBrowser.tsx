/**
 * Opus VO Design System — living style guide shell
 *
 * Persistent layout: sidebar navigation, search, deep-link hash routing,
 * theme toggle, and the active page canvas.
 */
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Moon, Sun } from "lucide-react";
import {
  ALL_ENTRIES,
  DESIGN_SYSTEM,
  NAV_GROUPS,
  OVERVIEW_ENTRY,
  type NavGroup,
} from "./registry";

// ─── Theme ────────────────────────────────────────────────────────────────

function useTheme(): [string, () => void] {
  const [theme, setTheme] = useState<string>(() => {
    if (typeof window === "undefined") return "light";
    return localStorage.getItem("ds-theme") ?? "light";
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("ds-theme", theme);
  }, [theme]);

  const toggle = () => setTheme((t) => (t === "light" ? "dark" : "light"));
  return [theme, toggle];
}

// ─── Hash routing ─────────────────────────────────────────────────────────

function readHashId(): string {
  const id = new URLSearchParams(window.location.hash.slice(1)).get("page");
  if (!id) return OVERVIEW_ENTRY.id;
  return ALL_ENTRIES.some((entry) => entry.id === id) ? id : OVERVIEW_ENTRY.id;
}

function useSelectedId(): [string, (id: string) => void] {
  const [selected, setSelected] = useState(readHashId);

  useEffect(() => {
    const onHashChange = () => setSelected(readHashId());
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const select = (id: string) => {
    setSelected(id);
    window.location.hash = new URLSearchParams({ page: id }).toString();
  };

  return [selected, select];
}

// ─── Navigation items ─────────────────────────────────────────────────────

function NavigationItems({
  showOverview,
  groups,
  activeId,
  query,
  select,
}: {
  showOverview: boolean;
  groups: NavGroup[];
  activeId: string;
  query: string;
  select: (id: string) => void;
}) {
  return (
    <nav aria-label="Design system navigation" className="space-y-5 py-2">
      {showOverview && (
        <button
          type="button"
          onClick={() => select(OVERVIEW_ENTRY.id)}
          aria-current={OVERVIEW_ENTRY.id === activeId ? "page" : undefined}
          className="block w-full rounded-md px-2 py-2 text-left text-sm font-medium transition-colors hover:bg-muted aria-[current=page]:bg-primary aria-[current=page]:text-primary-foreground"
        >
          {OVERVIEW_ENTRY.name}
        </button>
      )}

      {groups.map((group) => (
        <div key={group.name}>
          <p className="px-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {group.name}
          </p>
          <div className="mt-2 space-y-1 border-l pl-2">
            {group.entries.map((entry) => (
              <button
                key={entry.id}
                type="button"
                onClick={() => select(entry.id)}
                aria-current={entry.id === activeId ? "page" : undefined}
                className="block w-full rounded-md px-2 py-1.5 text-left text-sm transition-colors hover:bg-muted aria-[current=page]:bg-primary aria-[current=page]:text-primary-foreground"
              >
                {entry.name}
              </button>
            ))}
          </div>
        </div>
      ))}

      {!showOverview && groups.length === 0 && (
        <p className="px-2 py-4 text-sm text-muted-foreground">
          No sections match "{query}".
        </p>
      )}
    </nav>
  );
}

// ─── Search input ─────────────────────────────────────────────────────────

function SearchInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="relative">
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Search design system"
        placeholder="Search..."
        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
      />
    </div>
  );
}

// ─── Browser shell ────────────────────────────────────────────────────────

export function DesignSystemBrowser() {
  const [selectedId, select] = useSelectedId();
  const [query, setQuery] = useState("");
  const [theme, toggleTheme] = useTheme();
  const mobileNav = useRef<HTMLDetailsElement>(null);
  const mobileNavSummary = useRef<HTMLElement>(null);
  const normalizedQuery = query.trim().toLowerCase();

  const filteredGroups = useMemo(
    () =>
      NAV_GROUPS.map((group) => ({
        ...group,
        entries: group.name.toLowerCase().includes(normalizedQuery)
          ? group.entries
          : group.entries.filter((entry) =>
              `${entry.name} ${entry.description}`
                .toLowerCase()
                .includes(normalizedQuery),
            ),
      })).filter((group) => group.entries.length > 0),
    [normalizedQuery],
  );

  const active =
    ALL_ENTRIES.find((entry) => entry.id === selectedId) ?? OVERVIEW_ENTRY;
  const activeGroup = NAV_GROUPS.find((group) =>
    group.entries.some((entry) => entry.id === active.id),
  );
  const ActivePage = active.Page;

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [active.id]);

  const showOverview = `${OVERVIEW_ENTRY.name} ${OVERVIEW_ENTRY.description}`
    .toLowerCase()
    .includes(normalizedQuery);

  const selectPage = (id: string) => {
    select(id);
    if (mobileNav.current?.open) {
      mobileNav.current.removeAttribute("open");
      mobileNavSummary.current?.focus();
    }
  };

  return (
    <div className="min-h-[100dvh] bg-background text-foreground md:grid md:grid-cols-[260px_minmax(0,1fr)]">
      {/* ── Sidebar ────────────────────────────────────────────── */}
      <aside className="border-b bg-muted/20 md:sticky md:top-0 md:flex md:h-screen md:flex-col md:border-b-0 md:border-r">
        {/* Brand header */}
        <div className="border-b px-5 py-4">
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-primary">
                {DESIGN_SYSTEM.title}
              </p>
              <p className="mt-0.5 truncate text-xs text-muted-foreground">
                Design system preview
              </p>
            </div>
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              className="flex-shrink-0 rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="p-4 pb-2">
          <SearchInput value={query} onChange={setQuery} />
        </div>

        {/* Nav — desktop scroll area */}
        <div className="hidden min-h-0 flex-1 overflow-y-auto px-4 pb-4 md:block">
          <NavigationItems
            showOverview={showOverview}
            groups={filteredGroups}
            activeId={active.id}
            query={query}
            select={selectPage}
          />
        </div>

        {/* Nav — mobile accordion */}
        <details ref={mobileNav} className="border-t px-4 py-3 md:hidden">
          <summary
            ref={mobileNavSummary}
            className="cursor-pointer text-sm font-medium"
          >
            Browse sections:{" "}
            <span className="text-muted-foreground">{active.name}</span>
          </summary>
          <div className="mt-3 max-h-64 overflow-y-auto pb-2">
            <NavigationItems
              showOverview={showOverview}
              groups={filteredGroups}
              activeId={active.id}
              query={query}
              select={selectPage}
            />
          </div>
        </details>
      </aside>

      {/* ── Main content ─────────────────────────────────────────── */}
      <main className="min-w-0 px-6 py-10 sm:px-10 lg:px-14">
        <div className="mx-auto max-w-5xl">
          <header className="border-b pb-8">
            {active.id === OVERVIEW_ENTRY.id ? (
              <>
                <h1 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">
                  {DESIGN_SYSTEM.title}
                </h1>
                <p className="mt-3 max-w-2xl text-muted-foreground">
                  {DESIGN_SYSTEM.description}
                </p>
              </>
            ) : (
              <>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {activeGroup?.name}
                </p>
                <h1 className="mt-2 text-2xl font-semibold">{active.name}</h1>
                <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                  {active.description}
                </p>
              </>
            )}
          </header>

          <div className="pt-8">
            <Suspense
              fallback={
                <div
                  role="status"
                  className="rounded-xl border bg-card p-6 text-sm text-muted-foreground"
                >
                  Loading preview...
                </div>
              }
            >
              <ActivePage />
            </Suspense>
          </div>
        </div>
      </main>
    </div>
  );
}
