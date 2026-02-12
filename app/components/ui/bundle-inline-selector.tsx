"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/app/lib/utils";
import { Bundle } from "@/app/add-location/types";

const bundleBadges: Record<string, string> = {
  plus: "/images/plus-badge.svg",
  pro: "/images/pro-badge.svg",
  premium: "/images/premium-badge.svg",
};

const bundleBackgrounds: Record<string, string> = {
  plus: "/images/bg-bundle-01.webp",
  pro: "/images/bg-bundle-02.webp",
  premium: "/images/bg-bundle-03.webp",
};

const bundleDescriptions: Record<string, string> = {
  plus: "All features from the ultimate office solution plus call log, toll-free number, and callout",
  pro: "All features from the ultimate office solution plus call log, toll-free number, and callout",
  premium: "All features from the ultimate office solution plus call log, toll-free number, and callout",
};

const comparisonFeatures: { key: keyof Bundle["features"]; label: string }[] = [
  { key: "businessAddress", label: "Prestigious Business Address" },
  { key: "liveCallAnswering", label: "Professional Live Call Answering" },
  { key: "callLog", label: "Call Log" },
  { key: "tollFreeNumber", label: "Toll-Free Number" },
  { key: "calloutFeature", label: "Callout" },
  { key: "supervisedCallTransfer", label: "Supervised Transfer" },
  { key: "messageTaking", label: "Message Taking" },
];

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
  const count = bundles.length;

  useEffect(() => {
    setActiveIndex(getInitialIndex());
  }, [selectedBundleId, getInitialIndex]);

  if (count === 0) return null;

  const currentIndex = wrap(0, count, activeIndex);
  const activeBundle = bundles[currentIndex];

  const goTo = (newIndex: number) => {
    setActiveIndex(newIndex);
  };

  const handlePrev = () => goTo(activeIndex - 1);
  const handleNext = () => goTo(activeIndex + 1);

  const swipeConfidenceThreshold = 5000;
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

  const visibleIndices = [-1, 0, 1];

  return (
    <div
      className={cn("w-full", className)}
      data-testid="bundle-inline-selector"
    >
      <div className="relative flex items-center justify-center py-4 overflow-hidden">
        <button
          onClick={handlePrev}
          className="absolute left-0 z-30 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          aria-label="Previous bundle"
          data-testid="inline-bundle-prev"
        >
          <ChevronLeft className="h-5 w-5 text-gray-600" />
        </button>

        <div className="relative w-full flex items-center justify-center" style={{ height: "180px" }}>
          <motion.div
            className="relative w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.15}
            onDragEnd={onDragEnd}
          >
            {visibleIndices.map((offset) => {
              const absIndex = activeIndex + offset;
              const index = wrap(0, count, absIndex);
              const bundle = bundles[index];
              const isCenter = offset === 0;
              const isSelected = selectedBundleId === bundle.id;
              const badgeSrc = bundleBadges[bundle.id];
              const bgSrc = bundleBackgrounds[bundle.id];

              return (
                <motion.div
                  key={`${bundle.id}-${absIndex}`}
                  className={cn(
                    "absolute rounded-xl overflow-hidden shadow-md transition-shadow",
                    "w-[200px] h-[160px]",
                    isCenter ? "z-20" : "z-10 pointer-events-none",
                    isSelected && isCenter
                      ? "ring-2 ring-[#36bff9]"
                      : ""
                  )}
                  initial={false}
                  animate={{
                    x: offset * 170,
                    scale: isCenter ? 1 : 0.85,
                    opacity: isCenter ? 1 : 0.4,
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  onClick={() => {
                    if (offset !== 0) goTo(activeIndex + offset);
                  }}
                  data-testid={`inline-bundle-card-${bundle.id}`}
                >
                  {bgSrc && (
                    <div
                      className="absolute inset-0 bg-cover bg-center"
                      style={{ backgroundImage: `url(${bgSrc})` }}
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/50" />

                  <div className="relative p-3 flex flex-col h-full justify-between">
                    {badgeSrc && (
                      <img
                        src={badgeSrc}
                        alt={bundle.tier}
                        className="h-5 w-auto object-contain self-start"
                        data-testid={`inline-badge-${bundle.id}`}
                      />
                    )}

                    <p className="text-[10px] leading-tight text-white/90 mt-1.5 line-clamp-3" data-testid={`inline-description-${bundle.id}`}>
                      {bundleDescriptions[bundle.id] || bundle.name}
                    </p>

                    {isCenter && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelect(bundle);
                        }}
                        className={cn(
                          "mt-2 w-full py-1.5 rounded-lg text-xs font-semibold transition-all text-center",
                          isSelected
                            ? "bg-[#36bff9] text-white"
                            : "bg-[#36bff9] hover:bg-[#2aa8e0] text-white"
                        )}
                        data-testid={`inline-select-bundle-${bundle.id}`}
                      >
                        {isSelected ? (
                          <span className="flex items-center justify-center gap-1">
                            <Check className="h-3 w-3" />
                            Selected
                          </span>
                        ) : (
                          `Select ${bundle.tier} Bundle`
                        )}
                      </button>
                    )}
                  </div>

                  <div className="absolute inset-0 pointer-events-none rounded-xl shadow-[inset_0px_0px_0px_1px_rgba(10,13,18,0.18),inset_0px_-2px_0px_0px_rgba(10,13,18,0.05)]" />
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        <button
          onClick={handleNext}
          className="absolute right-0 z-30 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          aria-label="Next bundle"
          data-testid="inline-bundle-next"
        >
          <ChevronRight className="h-5 w-5 text-gray-600" />
        </button>
      </div>

      <div className="mt-2 px-2" data-testid="inline-comparison-table">
        <div className="flex items-center gap-2 mb-3" data-testid="comparison-header">
          <span className="flex-1 text-xs font-medium text-gray-900" data-testid="text-what-you-get">What you get:</span>
          <div className="flex items-center w-[140px]">
            <span className="w-[70px] text-center text-xs font-medium text-gray-500" data-testid="text-essentials-col">Essentials</span>
            <AnimatePresence mode="wait">
              <motion.span
                key={activeBundle.id}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.15 }}
                className="w-[70px] text-center text-xs font-black"
                data-testid={`text-bundle-col-${activeBundle.id}`}
                style={{
                  backgroundImage: `url(${bundleBadges[activeBundle.id]})`,
                  backgroundSize: "contain",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {activeBundle.tier}
              </motion.span>
            </AnimatePresence>
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
                <span className="flex-1 text-xs text-gray-700" data-testid={`comparison-label-${feature.key}`}>{feature.label}</span>
                <div className="flex items-center w-[140px]">
                  <div className="w-[70px] flex justify-center" data-testid={`comparison-essentials-${feature.key}`}>
                    {essentialsHas ? (
                      <Check className="h-3.5 w-3.5 text-gray-400" />
                    ) : (
                      <span className="text-gray-300 text-xs">—</span>
                    )}
                  </div>
                  <div className="w-[70px] flex justify-center" data-testid={`comparison-bundle-${feature.key}`}>
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={`${activeBundle.id}-${feature.key}`}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.15 }}
                      >
                        {activeBundleHas ? (
                          <Check className="h-3.5 w-3.5 text-[#36bff9]" />
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
      </div>
    </div>
  );
}
