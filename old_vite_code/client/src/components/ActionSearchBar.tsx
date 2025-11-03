import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Search, Send, Star, Flag } from "lucide-react";

function useDebounce<T>(value: T, delay: number = 400): T {
  const [debounced, setDebounced] = useState<T>(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

export type LocationType = "city" | "state";

export interface LocationItem {
  id: string;
  city: string;
  state?: string;
  type: LocationType;
  premium?: boolean;
  href?: string;
  addressLine1?: string;
  addressLine2?: string;
}

interface LocationSearchBarProps {
  initialResults?: LocationItem[];
  fetchResults?: (query: string) => Promise<LocationItem[]>;
  onSelect?: (item: LocationItem) => void;
  placeholder?: string;
  label?: string;
}

function TypeBadge({ type }: { type: LocationType }) {
  return (
    <span className="inline-flex items-center rounded-full bg-gray-100 text-gray-700 px-2 py-0.5 text-[10px] font-semibold uppercase">
      {type}
    </span>
  );
}

function PremiumBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-green-100 text-green-700 px-2 py-0.5 text-[10px] font-semibold">
      <Star className="h-3 w-3" />
      Premium
    </span>
  );
}

export function ActionSearchBar({
  initialResults = [],
  fetchResults,
  onSelect,
  placeholder = "Search for Zip, State, or City",
  label,
}: LocationSearchBarProps) {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<LocationItem[]>(initialResults);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);

  const debouncedQuery = useDebounce(query, 250);

  const isZipCode = (value: string): boolean => {
    return /^\d{5}$/.test(value);
  };

  const localFilter = (q: string, all: LocationItem[]) => {
    const n = q.toLowerCase().trim();
    if (!n) return all;
    return all.filter((r) => {
      const text = `${r.city} ${r.state ?? ""} ${r.type}`.toLowerCase();
      return text.includes(n);
    });
  };

  useEffect(() => {
    let ignore = false;

    async function run() {
      if (!isFocused) return;

      if (fetchResults) {
        setIsLoading(true);
        try {
          const data = await fetchResults(debouncedQuery);
          if (!ignore) setResults(data);
        } finally {
          if (!ignore) setIsLoading(false);
        }
      } else {
        const filtered = localFilter(debouncedQuery, initialResults);
        if (!ignore) setResults(filtered);
      }
      setSelectedIndex(-1);
    }

    run();
    return () => {
      ignore = true;
    };
  }, [debouncedQuery, isFocused, fetchResults, initialResults]);

  const container = {
    hidden: { opacity: 0, height: 0 },
    show: {
      opacity: 1,
      height: "auto",
      transition: { height: { duration: 0.35 }, staggerChildren: 0.06 },
    },
    exit: {
      opacity: 0,
      height: 0,
      transition: { height: { duration: 0.25 }, opacity: { duration: 0.2 } },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { duration: 0.22 } },
    exit: { opacity: 0, y: -8, transition: { duration: 0.15 } },
  };

  const handleSelect = (loc: LocationItem) => {
    if (onSelect) onSelect(loc);
    if (loc.href) window.location.assign(loc.href);
    setIsFocused(false);
  };

  const onKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (!isFocused) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      if (selectedIndex >= 0 && selectedIndex < results.length) {
        e.preventDefault();
        handleSelect(results[selectedIndex]);
      }
    } else if (e.key === "Escape") {
      setIsFocused(false);
    }
  };

  return (
    <div className="w-full">
      <div className="relative flex flex-col justify-start items-center">
        <div className="w-full">
          {label && (
            <label
              className="text-xs font-medium text-gray-600 mb-1 block"
              htmlFor="location-search"
            >
              {label}
            </label>
          )}
          <div className="relative">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 pointer-events-none">
              <AnimatePresence mode="popLayout">
                {query.length > 0 ? (
                  <motion.div
                    key="send"
                    initial={{ y: -16, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 16, opacity: 0 }}
                    transition={{ duration: 0.18 }}
                  >
                    <Send className="w-5 h-5 text-gray-500" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="search"
                    initial={{ y: -16, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 16, opacity: 0 }}
                    transition={{ duration: 0.18 }}
                  >
                    <MapPin className="w-5 h-5 text-gray-500" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <Input
              id="location-search"
              type="text"
              placeholder={placeholder}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={onKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setTimeout(() => setIsFocused(false), 150)}
              className="pl-10 pr-3.5 py-3 h-[50px] text-base bg-white rounded-lg border border-[#cfd4dc] shadow-shadows-shadow-xs focus-visible:ring-offset-0 [font-family:'Inter',Helvetica] font-normal text-gray-500"
              autoComplete="off"
              data-testid="input-location-search"
            />
          </div>
        </div>

        <div className="w-full relative">
          <AnimatePresence>
            {isFocused && (
              <motion.div
                className="w-full border rounded-md shadow-sm overflow-hidden bg-white border-neutral-200 mt-1 absolute top-0 left-0 z-50"
                variants={container}
                initial="hidden"
                animate="show"
                exit="exit"
              >
                <motion.ul>
                  {isLoading && (
                    <motion.li
                      variants={item}
                      className="px-3 py-3 text-xs text-gray-600"
                    >
                      Searching…
                    </motion.li>
                  )}

                  {!isLoading && results.length === 0 && !isZipCode(query) && (
                    <motion.li
                      variants={item}
                      className="px-3 py-3 text-xs text-gray-600"
                    >
                      No results. Try a different city, state, or ZIP.
                    </motion.li>
                  )}

                  {!isLoading && isZipCode(query) && (
                    <motion.li
                      variants={item}
                      layout
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => {
                        console.log(`Search office locations in ${query}`);
                        setIsFocused(false);
                      }}
                      className="px-3 py-3 flex items-center gap-2 cursor-pointer hover:bg-blue-50 border-b border-neutral-100"
                      data-testid="zipcode-search-action"
                    >
                      <span className="text-blue-600">
                        <Search className="h-5 w-5" />
                      </span>
                      <span className="text-sm font-semibold text-blue-700">
                        Search office locations in {query}
                      </span>
                    </motion.li>
                  )}

                  {!isLoading &&
                    results.map((loc, idx) => (
                      <motion.li
                        key={loc.id}
                        variants={item}
                        layout
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => handleSelect(loc)}
                        className={[
                          "px-3 py-2 flex items-center justify-between cursor-pointer",
                          "hover:bg-neutral-100",
                          idx === selectedIndex ? "bg-neutral-100" : "",
                        ].join(" ")}
                        data-testid={`location-item-${loc.id}`}
                      >
                        <div className="flex items-center gap-2 flex-1">
                          <span className="text-neutral-500">
                            {loc.type === 'state' ? (
                              <Flag className="h-4 w-4" />
                            ) : (
                              <MapPin className="h-4 w-4" />
                            )}
                          </span>
                          <div className="flex flex-col gap-0.5 flex-1">
                            <div className="flex items-center gap-1.5">
                              <span className={`text-sm font-medium ${loc.type === 'city' ? 'text-blue-700' : 'text-gray-500'}`}>
                                {loc.city}
                              </span>
                              <TypeBadge type={loc.type} />
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {loc.state && (
                            <span className="text-xs font-semibold text-gray-700 bg-gray-100 px-2 py-0.5 rounded">
                              {loc.state}
                            </span>
                          )}
                        </div>
                      </motion.li>
                    ))}
                </motion.ul>

                <div className="px-3 py-2 border-t border-neutral-100 hidden sm:block">
                  <div className="flex items-center justify-between text-[11px] text-gray-600">
                    <span>Tip: Use ↑ ↓ to navigate</span>
                    <span>ESC to close</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
