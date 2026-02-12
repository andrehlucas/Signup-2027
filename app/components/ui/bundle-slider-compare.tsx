"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/app/lib/utils";
import { Bundle, featureLabels, bundles as allBundles } from "@/app/add-location/types";

const essentialsBundle = allBundles.find((b) => b.id === "essentials");

const bundleGradients: Record<string, string> = {
  plus: "linear-gradient(135deg, #1a2a3a 0%, #2d8a7e 50%, #7ec8b8 100%)",
  pro: "linear-gradient(135deg, #1a2a3a 0%, #3a7a6a 50%, #6abfaa 100%)",
  premium: "linear-gradient(135deg, #1a2a3a 0%, #2a7a6a 50%, #5abfa5 100%)",
};

const comparisonFeatures = [
  "businessAddress",
  "liveCallAnswering",
  "callLog",
  "tollFreeNumber",
  "calloutFeature",
  "supervisedCallTransfer",
  "messageTaking",
] as const;

interface BundleSliderCompareProps {
  bundles: Bundle[];
  selectedBundleId?: string;
  onSelect: (bundle: Bundle) => void;
  onClose: () => void;
  onRevert?: () => void;
  essentialsPrice?: number;
  className?: string;
}

export function BundleSliderCompare({
  bundles,
  selectedBundleId,
  onSelect,
  onClose,
  onRevert,
  className,
}: BundleSliderCompareProps) {
  const getSelectedIdx = React.useCallback(() => {
    if (!selectedBundleId) return 0;
    const idx = bundles.findIndex((b) => b.id === selectedBundleId);
    return idx >= 0 ? idx : 0;
  }, [bundles, selectedBundleId]);

  const [activeIndex, setActiveIndex] = React.useState(getSelectedIdx);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const touchStartX = React.useRef<number>(0);

  React.useEffect(() => {
    setActiveIndex(getSelectedIdx());
  }, [selectedBundleId, getSelectedIdx]);

  React.useEffect(() => {
    containerRef.current?.focus();
  }, []);

  const count = bundles.length;
  if (count === 0) return null;

  const safeIndex = Math.max(0, Math.min(activeIndex, count - 1));
  const activeBundle = bundles[safeIndex];
  const isSelected = selectedBundleId === activeBundle.id;

  const handlePrev = () => setActiveIndex((p) => Math.max(0, p - 1));
  const handleNext = () => setActiveIndex((p) => Math.min(count - 1, p + 1));

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") handlePrev();
    if (e.key === "ArrowRight") handleNext();
    if (e.key === "Escape") onClose();
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) handleNext();
      else handlePrev();
    }
  };

  const bundleDescription = (bundle: Bundle) => {
    const extras: string[] = [];
    if (bundle.features.callLog) extras.push("call log");
    if (bundle.features.tollFreeNumber) extras.push("toll-free number");
    if (bundle.features.calloutFeature) extras.push("callout");
    if (bundle.features.supervisedCallTransfer) extras.push("supervised transfer");
    if (bundle.features.messageTaking) extras.push("message taking");

    if (extras.length === 0) return "The ultimate office solution";
    return `All features from the ultimate office solution plus ${extras.join(", ")}`;
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative flex h-full w-full flex-col overflow-hidden outline-none select-none",
        className
      )}
      tabIndex={0}
      onKeyDown={onKeyDown}
      data-testid="bundle-slider-compare"
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-30 rounded-full bg-black/20 p-2 text-gray-600 hover:bg-black/30 hover:text-gray-900 transition"
        aria-label="Close"
        data-testid="slider-close-button"
      >
        <X className="h-5 w-5" />
      </button>

      <div className="flex-1 flex flex-col items-center justify-start pt-4 px-4 overflow-y-auto">
        <div
          className="relative w-full max-w-sm mx-auto"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <button
            onClick={handlePrev}
            disabled={safeIndex === 0}
            className={cn(
              "absolute left-[-48px] top-1/3 -translate-y-1/2 z-30 rounded-full p-2 transition",
              safeIndex === 0
                ? "opacity-30 cursor-not-allowed text-gray-400"
                : "text-gray-600 hover:bg-gray-200 active:scale-90"
            )}
            aria-label="Previous bundle"
            data-testid="slider-arrow-prev"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          <button
            onClick={handleNext}
            disabled={safeIndex === count - 1}
            className={cn(
              "absolute right-[-48px] top-1/3 -translate-y-1/2 z-30 rounded-full p-2 transition",
              safeIndex === count - 1
                ? "opacity-30 cursor-not-allowed text-gray-400"
                : "text-gray-600 hover:bg-gray-200 active:scale-90"
            )}
            aria-label="Next bundle"
            data-testid="slider-arrow-next"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeBundle.id}
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -60 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
            >
              <div
                className="rounded-2xl overflow-hidden shadow-xl"
                style={{ background: bundleGradients[activeBundle.id] || bundleGradients.plus }}
                data-testid={`slider-card-${activeBundle.id}`}
              >
                <div className="p-6 text-center">
                  <h3 className="text-3xl font-extrabold text-white tracking-tight mb-3">
                    {activeBundle.tier}
                  </h3>
                  <p className="text-white/80 text-sm leading-relaxed mb-5 px-2">
                    {bundleDescription(activeBundle)}
                  </p>
                  <button
                    onClick={() => onSelect(activeBundle)}
                    className={cn(
                      "w-full py-3 rounded-full text-sm font-semibold transition-all",
                      isSelected
                        ? "bg-white text-gray-900 shadow-md"
                        : "bg-white/20 backdrop-blur-sm text-white border border-white/30 hover:bg-white/30"
                    )}
                    data-testid={`slider-button-select-${activeBundle.id}`}
                  >
                    {isSelected ? (
                      <span className="flex items-center justify-center gap-2">
                        <Check className="h-4 w-4" />
                        Selected
                      </span>
                    ) : (
                      `Select ${activeBundle.tier} Bundle`
                    )}
                  </button>
                </div>
              </div>

              <div className="mt-4 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-5 py-3 border-b border-gray-100">
                  <div className="grid grid-cols-[1fr_auto_auto] gap-2 items-center">
                    <span className="text-sm font-medium text-gray-500">What you get:</span>
                    <span className="text-xs font-semibold text-gray-400 text-center w-20">Essentials</span>
                    <span className="text-xs font-semibold text-[#36bff9] text-center w-20">{activeBundle.tier}</span>
                  </div>
                </div>

                <div className="divide-y divide-gray-50">
                  {comparisonFeatures.map((featureKey) => {
                    const essentialsHas = essentialsBundle
                      ? essentialsBundle.features[featureKey as keyof Bundle["features"]]
                      : false;
                    const bundleHas = activeBundle.features[featureKey as keyof Bundle["features"]];

                    return (
                      <div
                        key={featureKey}
                        className="grid grid-cols-[1fr_auto_auto] gap-2 items-center px-5 py-3"
                        data-testid={`compare-row-${featureKey}`}
                      >
                        <span className="text-sm text-gray-700">{featureLabels[featureKey]}</span>
                        <div className="w-20 flex justify-center">
                          {essentialsHas ? (
                            <Check className="h-4 w-4 text-gray-400" />
                          ) : (
                            <span className="text-gray-300">—</span>
                          )}
                        </div>
                        <div className="w-20 flex justify-center">
                          {bundleHas ? (
                            <Check className="h-4 w-4 text-[#36bff9]" />
                          ) : (
                            <span className="text-gray-300">—</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center justify-center gap-2 mt-5 mb-4">
            {bundles.map((b, i) => (
              <button
                key={b.id}
                onClick={() => setActiveIndex(i)}
                className={cn(
                  "h-2 rounded-full transition-all",
                  i === safeIndex ? "w-6 bg-[#36bff9]" : "w-2 bg-gray-300 hover:bg-gray-400"
                )}
                aria-label={`Go to ${b.tier}`}
                data-testid={`slider-dot-${b.id}`}
              />
            ))}
          </div>

          {onRevert && selectedBundleId !== "essentials" && (
            <div className="text-center mb-4">
              <button
                onClick={onRevert}
                className="text-xs text-gray-400 hover:text-gray-600 underline"
                data-testid="slider-button-revert"
              >
                Revert to Essentials
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
