"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { Check, ChevronRight } from "lucide-react";
import { cn } from "@/app/lib/utils";
import { Bundle, featureIndividualPrices, ESSENTIALS_PLAN } from "@/app/add-location/types";

const CARD_HEIGHT = 200;

function needsDarkText(hex: string): boolean {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.55;
}

function cardTextColor(bg: string): string {
  return needsDarkText(bg) ? "#1a1a1a" : "#ffffff";
}

function cardSubTextColor(bg: string): string {
  return needsDarkText(bg) ? "rgba(26,26,26,0.7)" : "rgba(255,255,255,0.7)";
}

const bundleDescriptions: Record<string, string> = {
  plus: "Everything in Essentials, plus call log, toll-free number, and callout to boost your reach.",
  pro: "Essentials and Plus features combined with supervised call transfer for seamless client handling.",
  prestige: "Everything in Essentials, plus callout, supervised transfer, and appointment making for full-service support.",
  premium: "Everything in Pro, plus message taking so your clients always reach you.",
};

const bundleBackgrounds: Record<string, string> = {
  plus: "#13678A",
  pro: "#45C4B0",
  premium: "#9AEBA3",
  prestige: "#DAFDBA",
};

const bundleAccentColors: Record<string, string> = {
  plus: "#13678A",
  pro: "#2A9E8B",
  premium: "#4A8F6A",
  prestige: "#6B8F3A",
};

const comparisonFeatures: { key: keyof Bundle["features"]; label: string }[] = [
  { key: "businessAddress", label: "Prestigious Business Address" },
  { key: "liveCallAnswering", label: "Professional Live Call Answering" },
  { key: "callLog", label: "Call Log" },
  { key: "tollFreeNumber", label: "Toll-Free Number" },
  { key: "calloutFeature", label: "Callout Feature" },
  { key: "supervisedCallTransfer", label: "Supervised Call Transfer" },
  { key: "appointmentMaking", label: "Appointment Making" },
  { key: "messageTaking", label: "Message Taking" },
];

function calculateSavings(bundle: Bundle): number {
  let alaCarteTotal = ESSENTIALS_PLAN.price;
  for (const [key, included] of Object.entries(bundle.features)) {
    if (included && featureIndividualPrices[key as keyof Bundle["features"]] > 0) {
      alaCarteTotal += featureIndividualPrices[key as keyof Bundle["features"]];
    }
  }
  return alaCarteTotal - bundle.price;
}

interface BundleInlineSelectorProps {
  bundles: Bundle[];
  selectedBundleId?: string;
  onSelect: (bundle: Bundle) => void;
  essentialsBundle: Bundle;
  className?: string;
}

function wrap(min: number, max: number, v: number) {
  const rangeSize = max - min;
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
}

export function BundleInlineSelector({
  bundles,
  selectedBundleId,
  onSelect,
  essentialsBundle,
  className,
}: BundleInlineSelectorProps) {
  const getInitialIndex = useCallback(() => {
    if (!selectedBundleId) return 0;
    const idx = bundles.findIndex((b) => b.id === selectedBundleId);
    return idx >= 0 ? idx : 0;
  }, [bundles, selectedBundleId]);

  const [activeIndex, setActiveIndex] = useState(getInitialIndex);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(400);
  const count = bundles.length;

  useEffect(() => {
    setActiveIndex(getInitialIndex());
  }, [selectedBundleId, getInitialIndex]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerWidth(entry.contentRect.width);
      }
    });
    observer.observe(el);
    setContainerWidth(el.offsetWidth);
    return () => observer.disconnect();
  }, []);

  if (count === 0) return null;

  const currentIndex = wrap(0, count, activeIndex);
  const activeBundle = bundles[currentIndex];
  const accentColor = bundleAccentColors[activeBundle.id] || "#36bff9";
  const savings = calculateSavings(activeBundle);

  const cardPadding = 8;
  const centerCardWidth = containerWidth * 0.8;

  const goTo = (newIndex: number) => {
    setActiveIndex(newIndex);
  };

  const handlePrev = () => goTo(activeIndex - 1);
  const handleNext = () => goTo(activeIndex + 1);

  const swipeConfidenceThreshold = 3000;
  const swipePower = (offset: number, velocity: number) =>
    Math.abs(offset) * velocity;

  const onDragEnd = (
    _e: MouseEvent | TouchEvent | PointerEvent,
    { offset, velocity }: PanInfo
  ) => {
    const swipe = swipePower(offset.x, velocity.x);
    if (swipe < -swipeConfidenceThreshold) handleNext();
    else if (swipe > swipeConfidenceThreshold) handlePrev();
  };

  const prevLeft = -(centerCardWidth * 0.6);
  const centerLeft = cardPadding;
  const nextLeft = cardPadding + centerCardWidth + cardPadding;

  return (
    <div
      className={cn("w-full", className)}
      data-testid="bundle-inline-selector"
    >
      {/* Mobile slider - hidden on md+ */}
      <div
        ref={containerRef}
        className="relative py-4 overflow-hidden md:hidden"
      >
        <motion.div
          className="relative w-full cursor-grab active:cursor-grabbing"
          style={{ height: CARD_HEIGHT }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.12}
          onDragEnd={onDragEnd}
        >
          {[-1, 0, 1].map((offset) => {
            const absIndex = activeIndex + offset;
            const index = wrap(0, count, absIndex);
            const bundle = bundles[index];
            const isCenter = offset === 0;
            const isPrev = offset === -1;
            const isSelected = selectedBundleId === bundle.id;
            const bg = bundleBackgrounds[bundle.id] || bundleBackgrounds.plus;

            let left = centerLeft;
            let cardOpacity = 1;
            let cardScale = 1;
            if (isPrev) {
              left = prevLeft;
              cardOpacity = 0.15;
              cardScale = 0.92;
            } else if (!isCenter) {
              left = nextLeft;
              cardOpacity = 0.45;
              cardScale = 0.97;
            }

            return (
              <motion.div
                key={`${bundle.id}-${absIndex}`}
                className={cn(
                  "absolute top-0 rounded-2xl overflow-hidden",
                  isCenter ? "z-20 shadow-lg" : "z-10 pointer-events-none shadow-md",
                  isSelected && isCenter
                    ? "ring-2 ring-[#36bff9]"
                    : ""
                )}
                style={{
                  width: centerCardWidth,
                  height: CARD_HEIGHT,
                  background: bg,
                }}
                initial={false}
                animate={{
                  left,
                  scale: cardScale,
                  opacity: cardOpacity,
                }}
                transition={{ type: "tween", ease: [0.25, 0.1, 0.25, 1], duration: 0.4 }}
                onClick={() => {
                  if (offset !== 0) goTo(activeIndex + offset);
                }}
                data-testid={`inline-bundle-card-${bundle.id}`}
              >
                <div className="p-5 flex flex-col justify-between h-full">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span
                        className="text-xl font-bold tracking-tight"
                        style={{ fontFamily: "'Inter', sans-serif", color: cardTextColor(bg) }}
                        data-testid={`inline-badge-${bundle.id}`}
                      >
                        {bundle.tier}
                      </span>
                      <span className="text-lg font-bold" style={{ color: cardTextColor(bg) }} data-testid={`inline-price-${bundle.id}`}>
                        ${bundle.price}<span className="text-xs font-normal" style={{ color: cardSubTextColor(bg) }}>/mo</span>
                      </span>
                    </div>

                    <p className="text-sm leading-relaxed" style={{ color: cardTextColor(bg) }} data-testid={`inline-description-${bundle.id}`}>
                      {bundleDescriptions[bundle.id] || bundle.name}
                    </p>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (isCenter) onSelect(bundle);
                    }}
                    className={cn(
                      "w-full py-2.5 rounded-xl text-sm font-semibold transition-all",
                      isSelected && isCenter
                        ? needsDarkText(bg) ? "bg-black text-white hover:bg-black/90" : "bg-white text-black hover:bg-white/90"
                        : needsDarkText(bg) ? "bg-black/80 text-white hover:bg-black" : "bg-black/80 text-white hover:bg-black"
                    )}
                    tabIndex={isCenter ? 0 : -1}
                    data-testid={`inline-select-bundle-${bundle.id}`}
                  >
                    {isSelected && isCenter ? (
                      <span className="flex items-center justify-center gap-2">
                        <Check className="h-4 w-4" />
                        Selected
                      </span>
                    ) : (
                      `Select ${bundle.tier} Bundle`
                    )}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        <button
          onClick={handleNext}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-30 p-1.5 rounded-full bg-white/90 hover:bg-white shadow-md transition-colors"
          aria-label="Next bundle"
          data-testid="inline-bundle-next"
        >
          <ChevronRight className="h-4 w-4 text-gray-600" />
        </button>
      </div>

      {/* Desktop grid - hidden on mobile, shown on md+ */}
      <div className="hidden md:grid md:grid-cols-4 gap-4 py-4">
        {bundles.map((bundle) => {
          const isSelected = selectedBundleId === bundle.id;
          const bg = bundleBackgrounds[bundle.id] || bundleBackgrounds.plus;
          const bundleSavings = calculateSavings(bundle);

          return (
            <div
              key={bundle.id}
              className={cn(
                "rounded-2xl overflow-hidden shadow-lg transition-all",
                isSelected ? "ring-2 ring-[#36bff9] scale-[1.02]" : "hover:scale-[1.01]"
              )}
              style={{
                background: bg,
                minHeight: CARD_HEIGHT,
              }}
              data-testid={`inline-bundle-card-${bundle.id}`}
            >
              <div className="p-5 flex flex-col justify-between h-full">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span
                      className="text-xl font-bold tracking-tight"
                      style={{ fontFamily: "'Inter', sans-serif", color: cardTextColor(bg) }}
                      data-testid={`inline-badge-${bundle.id}`}
                    >
                      {bundle.tier}
                    </span>
                    <span className="text-lg font-bold" style={{ color: cardTextColor(bg) }} data-testid={`inline-price-${bundle.id}`}>
                      ${bundle.price}<span className="text-xs font-normal" style={{ color: cardSubTextColor(bg) }}>/mo</span>
                    </span>
                  </div>

                  <p className="text-sm leading-relaxed" style={{ color: cardTextColor(bg) }} data-testid={`inline-description-${bundle.id}`}>
                    {bundleDescriptions[bundle.id] || bundle.name}
                  </p>

                  {bundleSavings > 0 && (
                    <span
                      className="text-xs font-semibold rounded-full px-2.5 py-0.5 self-start"
                      style={{
                        color: cardTextColor(bg),
                        backgroundColor: needsDarkText(bg) ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.2)",
                      }}
                    >
                      Save ${bundleSavings}/mo
                    </span>
                  )}
                </div>

                <button
                  onClick={() => onSelect(bundle)}
                  className={cn(
                    "w-full py-2.5 rounded-xl text-sm font-semibold transition-all mt-3",
                    isSelected
                      ? needsDarkText(bg) ? "bg-black text-white hover:bg-black/90" : "bg-white text-black hover:bg-white/90"
                      : "bg-black/80 text-white hover:bg-black"
                  )}
                  data-testid={`inline-select-bundle-${bundle.id}`}
                >
                  {isSelected ? (
                    <span className="flex items-center justify-center gap-2">
                      <Check className="h-4 w-4" />
                      Selected
                    </span>
                  ) : (
                    `Select ${bundle.tier} Bundle`
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Mobile comparison table */}
      <div className="mt-2 px-2 md:hidden" data-testid="inline-comparison-table">
        <div className="flex items-center gap-2 mb-3" data-testid="comparison-header">
          <span className="flex-1 min-w-0 text-xs font-medium text-gray-900" data-testid="text-what-you-get">What you get:</span>
          <div className="flex items-center flex-shrink-0" style={{ width: "140px" }}>
            <span className="text-center text-xs font-medium text-gray-500" style={{ width: "70px" }} data-testid="text-essentials-col">Essentials</span>
            <div className="relative overflow-hidden" style={{ width: "70px", height: "16px" }}>
              <AnimatePresence mode="wait">
                <motion.span
                  key={activeBundle.id}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                  className="absolute inset-0 flex items-center justify-center text-xs font-bold"
                  style={{ color: accentColor }}
                  data-testid={`text-bundle-col-${activeBundle.id}`}
                >
                  {activeBundle.tier}
                </motion.span>
              </AnimatePresence>
            </div>
          </div>
        </div>

        <div className="space-y-0">
          {comparisonFeatures.map((feature, idx) => {
            const essentialsHas = essentialsBundle.features[feature.key];
            const activeBundleHas = activeBundle.features[feature.key];

            return (
              <div
                key={feature.key}
                className={cn(
                  "flex items-center gap-2 py-2",
                  idx < comparisonFeatures.length - 1 ? "border-b border-gray-100" : ""
                )}
                data-testid={`comparison-row-${feature.key}`}
              >
                <span className="flex-1 min-w-0 text-xs text-gray-700" data-testid={`comparison-label-${feature.key}`}>{feature.label}</span>
                <div className="flex items-center flex-shrink-0" style={{ width: "140px" }}>
                  <div className="flex justify-center" style={{ width: "70px" }} data-testid={`comparison-essentials-${feature.key}`}>
                    {essentialsHas ? (
                      <Check className="h-3.5 w-3.5 text-gray-400" />
                    ) : (
                      <span className="text-gray-300 text-xs">—</span>
                    )}
                  </div>
                  <div className="relative overflow-hidden" style={{ width: "70px", height: "16px" }} data-testid={`comparison-bundle-${feature.key}`}>
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={`${activeBundle.id}-${feature.key}`}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        className="absolute inset-0 flex items-center justify-center"
                      >
                        {activeBundleHas ? (
                          <Check className="h-3.5 w-3.5" style={{ color: accentColor }} />
                        ) : (
                          <span className="text-gray-300 text-xs">—</span>
                        )}
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {savings > 0 && (
          <div className="border-t border-gray-200 mt-1 pt-3 pb-1">
            <AnimatePresence mode="wait">
              <motion.p
                key={activeBundle.id}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="text-center text-sm font-semibold"
                style={{ color: accentColor }}
                data-testid={`savings-line-${activeBundle.id}`}
              >
                You save ${savings}/mo with {activeBundle.tier}
              </motion.p>
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Desktop comparison table - all bundles shown as columns */}
      <div className="hidden md:block mt-4 px-2" data-testid="inline-comparison-table-desktop">
        <div className="flex items-center gap-2 mb-3" data-testid="comparison-header-desktop">
          <span className="flex-1 min-w-0 text-xs font-medium text-gray-900">What you get:</span>
          <div className="flex items-center flex-shrink-0" style={{ width: `${(bundles.length + 1) * 80}px` }}>
            <span className="text-center text-xs font-medium text-gray-500" style={{ width: "80px" }}>Essentials</span>
            {bundles.map((bundle) => (
              <span
                key={bundle.id}
                className="text-center text-xs font-bold"
                style={{ width: "80px", color: bundleAccentColors[bundle.id] || "#36bff9" }}
              >
                {bundle.tier}
              </span>
            ))}
          </div>
        </div>

        <div className="space-y-0">
          {comparisonFeatures.map((feature, idx) => {
            const essentialsHas = essentialsBundle.features[feature.key];

            return (
              <div
                key={feature.key}
                className={cn(
                  "flex items-center gap-2 py-2",
                  idx < comparisonFeatures.length - 1 ? "border-b border-gray-100" : ""
                )}
                data-testid={`comparison-row-desktop-${feature.key}`}
              >
                <span className="flex-1 min-w-0 text-xs text-gray-700">{feature.label}</span>
                <div className="flex items-center flex-shrink-0" style={{ width: `${(bundles.length + 1) * 80}px` }}>
                  <div className="flex justify-center" style={{ width: "80px" }}>
                    {essentialsHas ? (
                      <Check className="h-3.5 w-3.5 text-gray-400" />
                    ) : (
                      <span className="text-gray-300 text-xs">—</span>
                    )}
                  </div>
                  {bundles.map((bundle) => {
                    const bundleHas = bundle.features[feature.key];
                    return (
                      <div key={bundle.id} className="flex justify-center" style={{ width: "80px" }}>
                        {bundleHas ? (
                          <Check className="h-3.5 w-3.5" style={{ color: bundleAccentColors[bundle.id] || "#36bff9" }} />
                        ) : (
                          <span className="text-gray-300 text-xs">—</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
